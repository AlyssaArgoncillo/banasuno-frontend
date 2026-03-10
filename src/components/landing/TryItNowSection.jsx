import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/TryItNowSection.css';
import HeatMap from '../HeatMap';
import { HEAT_RISK_LEVELS } from '../../utils/heatMap.js';

function TryItNowSection() {
  const [heatIndexOpen, setHeatIndexOpen] = useState(true);

  return (
    <section className="try-it-now-section">
      <h1 className="try-it-now-heading">TRY IT NOW</h1>

      <div className="smp-container">
        <div className="monitor-frame">
          <div className="screw screw-top-left"></div>
          <div className="screw screw-top-right"></div>
          <div className="screw screw-bottom-left"></div>
          <div className="screw screw-bottom-right"></div>

          <div className="monitor-screen">
            <div className="display-area">
              <HeatMap compact />
              {/* Desktop only: heat index as static panel on map, bottom left */}
              <div className="try-it-now-heat-index-on-map" aria-label="Heat index (PAGASA)">
                <h3 className="try-it-now-heat-index-on-map-title">HEAT INDEX (PAGASA)</h3>
                <ul className="try-it-now-heat-index-on-map-list">
                  {HEAT_RISK_LEVELS.map((r) => (
                    <li key={r.level} className="try-it-now-heat-index-on-map-item">
                      <span
                        className="try-it-now-heat-index-on-map-range"
                        style={{ background: r.color }}
                      >
                        {r.rangeLabel}
                      </span>
                      <span className="try-it-now-heat-index-on-map-label">{r.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="monitor-controls">
            <span className="control-btn" aria-hidden></span>
            <span className="control-btn" aria-hidden></span>
            <span className="control-btn" aria-hidden></span>
          </div>
        </div>
      </div>

      <div className="map-bar-wrapper">
        <div className="map-bar">
          <Link to="/home" className="launch-btn"><span>Launch Full Map →</span></Link>
        </div>
      </div>

      {/* Heat index panel – below launch bar; mobile only (desktop uses on-map panel) */}
      <div className={`try-it-now-heat-index-dropdown try-it-now-heat-index-mobile${heatIndexOpen ? ' open' : ''}`}>
        <button
          type="button"
          className="try-it-now-heat-index-toggle"
          onClick={() => setHeatIndexOpen((o) => !o)}
          aria-expanded={heatIndexOpen}
          aria-controls="try-it-now-heat-index-list"
        >
          <span>Heat Index (PAGASA)</span>
          <span className="try-it-now-heat-index-chevron" aria-hidden>
            {heatIndexOpen ? '▼' : '▶'}
          </span>
        </button>
        <div
          id="try-it-now-heat-index-list"
          className="try-it-now-heat-index-list"
          hidden={!heatIndexOpen}
          role="region"
          aria-label="Heat index levels"
        >
          <ul className="try-it-now-heat-index-ul">
            {HEAT_RISK_LEVELS.map((r) => (
              <li key={r.level} className="try-it-now-heat-index-item">
                <span
                  className="try-it-now-heat-index-range"
                  style={{ background: r.color }}
                >
                  {r.rangeLabel}
                </span>
                <span className="try-it-now-heat-index-label">{r.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default TryItNowSection;
