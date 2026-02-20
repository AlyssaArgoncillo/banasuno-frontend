import { useState, useEffect } from 'react';
import { fetchDavaoBoundaries } from '../../services/boundariesService.js';
import { getBarangayHeatData, fetchCityForecast, fetchCityAverage } from '../../services/heatService.js';
import { pingBackend, getApiBase } from '../../services/apiConfig.js';
import { getBarangayId, tempToHeatRiskLevel, HEAT_RISK_LEVELS } from '../../utils/heatMap.js';
import '../../styles/Dashboard.css';

const CITY_ID = 'davao';

function escapeCsvCell(value) {
  const s = value == null ? '' : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function Dashboard() {
  const [dateTime, setDateTime] = useState({ date: '', time: '' });
  const [cityTemp, setCityTemp] = useState(null);
  const [forecastDays, setForecastDays] = useState([]);
  const [trendPeriod, setTrendPeriod] = useState('7');
  const [countsByLevel, setCountsByLevel] = useState(() => HEAT_RISK_LEVELS.map(() => 0));
  const [tempAvg, setTempAvg] = useState(null);
  const [exportSnapshot, setExportSnapshot] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [backendError, setBackendError] = useState(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateTime({
        date: now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchDavaoBoundaries()
      .then(({ barangayGeojson }) => {
        const features = barangayGeojson?.features ?? [];
        if (!features.length || cancelled) return { features: [], heatData: null };
        return getBarangayHeatData(features).then((heatData) => ({ features, heatData }));
      })
      .then(({ features, heatData }) => {
        if (cancelled || !heatData?.tempByBarangayId) return;
        const counts = HEAT_RISK_LEVELS.map(() => 0);
        const { tempByBarangayId, tempMin, tempMax, averageTemp: backendCityTemp } = heatData;
        const rows = [];
        let sumTemp = 0;
        let nTemp = 0;
        features.forEach((feature) => {
          const id = getBarangayId(feature);
          const temp = id != null ? tempByBarangayId[id] ?? tempByBarangayId[String(id)] : null;
          const name = feature.properties?.adm4_en ?? feature.properties?.name ?? '';
          if (temp != null && Number.isFinite(temp)) {
            const { level, label } = tempToHeatRiskLevel(temp);
            const idx = level - 1;
            if (idx >= 0 && idx < counts.length) counts[idx] += 1;
            rows.push({ barangay_id: String(id), barangay_name: name, temperature_c: temp, heat_index_level: level, heat_index_label: label });
            sumTemp += temp;
            nTemp += 1;
          }
        });
        const recordedAt = new Date().toISOString();
        const avg = nTemp > 0 ? Math.round((sumTemp / nTemp) * 10) / 10 : null;
        if (!cancelled) {
          setCountsByLevel(counts);
          setTempAvg(avg);
          setCityTemp(backendCityTemp != null && Number.isFinite(backendCityTemp) ? backendCityTemp : avg);
          setExportSnapshot({ recordedAt, rows, summary: { tempMin, tempMax, tempAvg: avg, counts } });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchCityAverage(CITY_ID)
      .then((temp) => {
        if (!cancelled && temp != null && Number.isFinite(temp)) setCityTemp(temp);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchCityForecast(CITY_ID, parseInt(trendPeriod, 10) || 7)
      .then((result) => {
        if (cancelled || !result?.forecastDays) return;
        setForecastDays(result.forecastDays);
      })
      .catch(() => setForecastDays([]));
    return () => { cancelled = true; };
  }, [trendPeriod]);

  useEffect(() => {
    let cancelled = false;
    pingBackend()
      .then(({ ok, error }) => {
        if (!cancelled) {
          setBackendStatus(ok ? 'ok' : 'unavailable');
          setBackendError(error ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBackendStatus('unavailable');
          setBackendError('Request failed');
        }
      });
    return () => { cancelled = true; };
  }, []);

  const handleDownloadCsv = () => {
    if (!exportSnapshot?.rows?.length) return;
    const headers = ['recorded_at', 'city_id', 'barangay_id', 'barangay_name', 'temperature_c', 'heat_index_level', 'heat_index_label'];
    const lines = [headers.join(',')];
    exportSnapshot.rows.forEach((r) => {
      lines.push([
        escapeCsvCell(exportSnapshot.recordedAt),
        escapeCsvCell(CITY_ID),
        escapeCsvCell(r.barangay_id),
        escapeCsvCell(r.barangay_name),
        escapeCsvCell(r.temperature_c),
        escapeCsvCell(r.heat_index_level),
        escapeCsvCell(r.heat_index_label)
      ].join(','));
    });
    const csv = lines.join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heat-snapshot-barangays-${CITY_ID}-${exportSnapshot.recordedAt.slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-backend-status" role="status" aria-live="polite">
        {backendStatus === 'checking' && <span className="dashboard-backend-checking">Checking backend…</span>}
        {backendStatus === 'ok' && (
          <span className="dashboard-backend-ok">
            Backend: connected ({getApiBase() ? getApiBase().replace(/^https?:\/\//, '') : 'via dev proxy'})
          </span>
        )}
        {backendStatus === 'unavailable' && (
          <span className="dashboard-backend-unavailable">
            Backend: unreachable{backendError ? ` — ${backendError}` : ''}. Ensure you are on the app (e.g. localhost:5173 or your frontend URL), not the API URL.
          </span>
        )}
      </div>
      <div className="dashboard-top">
        <section className="dashboard-current">
          <div className="dashboard-card dashboard-card-date">
            <span className="dashboard-card-label">Today&apos;s Date</span>
            <span className="dashboard-card-value dashboard-date-text">{dateTime.date || '—'}</span>
            <span className="dashboard-card-sublabel">Time</span>
            <span className="dashboard-card-value dashboard-time-text">{dateTime.time || '—'}</span>
          </div>
          <div className="dashboard-card dashboard-card-temp">
            <span className="dashboard-card-label">City / Region Temperature</span>
            <span className="dashboard-card-value dashboard-temp-value">{cityTemp != null ? `${cityTemp} °C` : tempAvg != null ? `${tempAvg} °C` : '— °C'}</span>
            <span className="dashboard-card-sublabel">From API when available</span>
          </div>
        </section>

        <section className="dashboard-card dashboard-high-risk">
          <h2 className="dashboard-high-risk-title">High-Risk Zone Count</h2>
          <div className="dashboard-high-risk-grid">
            {HEAT_RISK_LEVELS.map((risk, i) => (
              <div
                key={risk.level}
                className="dashboard-risk-cell"
                style={{ '--risk-color': risk.color }}
              >
                <span className="dashboard-risk-cell-header">{risk.label}</span>
                <span className="dashboard-risk-cell-body">{countsByLevel[i] ?? 0}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="dashboard-card dashboard-trends">
        <h2 className="dashboard-trends-title">Historical Trends</h2>
        <div className="dashboard-trends-tabs">
          <button
            type="button"
            className={`dashboard-tab ${trendPeriod === '7' ? 'active' : ''}`}
            onClick={() => setTrendPeriod('7')}
          >
            7 Days
          </button>
          <button
            type="button"
            className={`dashboard-tab ${trendPeriod === '14' ? 'active' : ''}`}
            onClick={() => setTrendPeriod('14')}
          >
            14 Days
          </button>
        </div>
        <div className="dashboard-graph-placeholder">
          {forecastDays.length > 0 ? (
            <div className="dashboard-forecast-chart">
              <ul className="dashboard-forecast-list" aria-label="Temperature forecast">
                {forecastDays.map((d) => (
                  <li key={d.date} className="dashboard-forecast-item">
                    <span className="dashboard-forecast-date">{new Date(d.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <span className="dashboard-forecast-temp">{d.avgtemp_c != null ? `${d.avgtemp_c} °C` : '—'}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <span className="dashboard-graph-placeholder-text">Temperature forecast (set VITE_API_URL for data)</span>
          )}
        </div>
        <div className="dashboard-trends-actions">
          <button type="button" className="dashboard-download-csv" aria-label="Download CSV" onClick={handleDownloadCsv} disabled={!exportSnapshot?.rows?.length}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download CSV</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
