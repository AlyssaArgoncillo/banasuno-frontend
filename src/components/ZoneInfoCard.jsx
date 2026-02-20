import React from 'react';
import '../styles/ZoneInfoCard.css';

/**
 * Popup card shown when a barangay boundary is clicked.
 * - Tag at top: heat index level (color + label).
 * - Risk score (1–6).
 * - Current temperature (°C).
 * - Scrollable list of health facilities in or near the area.
 */
export default function ZoneInfoCard({
  zoneName,
  temperature,
  riskLevel,
  riskScore,
  facilities = [],
  isNearbyFallback = false,
  facilitiesLoading = false,
  onClose,
  onFacilityClick
}) {
  const tagStyle = riskLevel?.color
    ? { backgroundColor: riskLevel.color, color: '#fff' }
    : { backgroundColor: 'var(--primary-500)', color: '#fff' };

  return (
    <div className="zone-info-card" role="dialog" aria-labelledby="zone-info-title" aria-modal="true">
      <div className="zone-info-card-tag" style={tagStyle}>
        <span className="zone-info-card-tag-label">
          {riskLevel?.label ?? 'Heat index'}
        </span>
        <button
          type="button"
          className="zone-info-card-close"
          onClick={onClose}
          aria-label="Close zone info"
        >
          ×
        </button>
      </div>
      <h2 id="zone-info-title" className="zone-info-card-title">{zoneName || 'Zone Info'}</h2>
      <div className="zone-info-card-grid">
        <div className="zone-info-card-block">
          <span className="zone-info-card-label">Risk Score</span>
          <div className="zone-info-card-value zone-info-card-risk">
            {riskScore != null ? `Heat-${riskScore}` : '—'}
          </div>
        </div>
        <div className="zone-info-card-block">
          <span className="zone-info-card-label">Temperature</span>
          <div className="zone-info-card-value zone-info-card-temp">
            {temperature != null ? `${Number(temperature).toFixed(1)}°C` : '—'}
          </div>
        </div>
        <div className="zone-info-card-block zone-info-card-facilities-block">
          <span className="zone-info-card-label">
            {isNearbyFallback ? 'Nearest facilities in the area' : 'Health Facilities in the Area'}
          </span>
          {isNearbyFallback && (
            <span className="zone-info-card-sublabel">No facilities in this barangay; showing closest nearby</span>
          )}
          <div className="zone-info-card-facilities-list">
            {facilitiesLoading ? (
              <p className="zone-info-card-facilities-loading">Loading facilities…</p>
            ) : facilities.length === 0 ? (
              <p className="zone-info-card-facilities-empty">No facilities listed.</p>
            ) : (
              facilities.map((fac) => (
                <button
                  key={fac.id}
                  type="button"
                  className="zone-info-card-facility-item"
                  onClick={() => onFacilityClick?.(fac)}
                >
                  <span className="zone-info-card-facility-name">{fac.name}</span>
                  {fac.distance && <span className="zone-info-card-facility-distance">{fac.distance}</span>}
                  <span className="zone-info-card-facility-arrow" aria-hidden>→</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
