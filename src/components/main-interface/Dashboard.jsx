import { useState, useEffect } from 'react';
import { fetchDavaoBoundaries } from '../../services/boundariesService.js';
import { getBarangayHeatData } from '../../services/heatService.js';
import { getBarangayId, normalizeTempToIntensity, intensityToHeatRiskLevel, HEAT_RISK_LEVELS } from '../../utils/heatMap.js';
import '../../styles/Dashboard.css';

function Dashboard() {
  const [dateTime, setDateTime] = useState({ date: '', time: '' });
  const [trendPeriod, setTrendPeriod] = useState('7');
  const [countsByLevel, setCountsByLevel] = useState(() => HEAT_RISK_LEVELS.map(() => 0));

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
        const { tempByBarangayId, tempMin, tempMax } = heatData;
        features.forEach((feature) => {
          const id = getBarangayId(feature);
          const temp = id != null ? tempByBarangayId[id] : null;
          if (temp == null || !Number.isFinite(temp)) return;
          const intensity = normalizeTempToIntensity(temp, tempMin, tempMax);
          const { level } = intensityToHeatRiskLevel(intensity);
          const idx = level - 1;
          if (idx >= 0 && idx < counts.length) counts[idx] += 1;
        });
        if (!cancelled) setCountsByLevel(counts);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <section className="dashboard-current">
          <div className="dashboard-card dashboard-card-date">
            <span className="dashboard-card-label">Today&apos;s Date</span>
            <span className="dashboard-card-value dashboard-date-text">{dateTime.date || '—'}</span>
            <span className="dashboard-card-sublabel">Time</span>
            <span className="dashboard-card-value dashboard-time-text">{dateTime.time || '—'}</span>
          </div>
          <div className="dashboard-card dashboard-card-temp">
            <span className="dashboard-card-label">The Day&apos;s Average Temperature</span>
            <span className="dashboard-card-value dashboard-temp-value">— °C</span>
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
          <span className="dashboard-graph-placeholder-text">Temperature Graph</span>
        </div>
        <div className="dashboard-trends-actions">
          <button type="button" className="dashboard-download-csv" aria-label="Download CSV">
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
