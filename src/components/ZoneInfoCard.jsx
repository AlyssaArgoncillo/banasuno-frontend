import React from 'react';
import '../styles/ZoneInfoCard.css';

/** Parse "X.X km" or numeric to km; return null if not parseable. */
function parseDistanceKm(fac) {
  if (fac == null) return null;
  if (Number.isFinite(fac.distance_km)) return fac.distance_km;
  const s = fac.distance;
  if (typeof s !== 'string') return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

const MAP_ROUTE_CUTOFF_KM = 6;

/**
 * Popup card shown when a barangay boundary is clicked.
 * - Tag at top: heat index level (color + label).
 * - Risk score (1–6).
 * - Current temperature (°C).
 * - Scrollable list of health facilities in or near the area.
 * - If nearest facility is > 6 km, shows note: "Nearest facility is X km away — too far for map routing."
 * - "Full Report" button to navigate to dashboard.
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
  onFacilityClick,
  onGoToDashboard
}) {
  const nearestKm = facilities.length > 0 ? parseDistanceKm(facilities[0]) : null;
  const beyondCutoff = nearestKm != null && nearestKm > MAP_ROUTE_CUTOFF_KM;

  const normalizedRiskScore = Number.isFinite(Number(riskScore))
    ? Number(riskScore).toFixed(2)
    : null;
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
            {normalizedRiskScore ?? '—'}
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
          {beyondCutoff && (
            <p className="zone-info-card-cutoff-note" role="status">
              Nearest facility is {nearestKm.toFixed(1)} km away — too far for map routing.
            </p>
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
      <button
        type="button"
        className="zone-info-card-full-report-btn"
        style={tagStyle}
        onClick={() => onGoToDashboard?.()}
      >
        Full Report →
      </button>
    </div>
  );
}
