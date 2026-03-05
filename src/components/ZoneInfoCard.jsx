import React, { useState, useRef, useEffect } from 'react';
import '../styles/ZoneInfoCard.css';

const ROUTE_PROFILES = [
  { value: 'foot-walking', label: 'Walking' },
  { value: 'driving-car', label: 'Driving' },
  { value: 'cycling-regular', label: 'Cycling' },
];

/** Straight-line km from facility (distance_meters or distance_km). Display as ~X.X km. */
function straightLineDisplay(fac) {
  if (fac == null) return null;
  const meters = fac.distance_meters != null && Number.isFinite(fac.distance_meters) ? fac.distance_meters : null;
  const km = meters != null ? meters / 1000 : (Number.isFinite(fac.distance_km) ? fac.distance_km : null);
  return km != null ? `~${Number(km).toFixed(1)} km` : null;
}

/** Route summary display: "X.X km · Y min" from ORS directions (distance m, duration s). */
function routeSummaryDisplay(summary) {
  if (summary == null) return null;
  const km = summary.distance != null ? (summary.distance / 1000).toFixed(1) : null;
  const min = summary.duration != null ? Math.round(summary.duration / 60) : null;
  if (km != null && min != null) return `${km} km · ${min} min`;
  if (km != null) return `${km} km`;
  if (min != null) return `${min} min`;
  return null;
}

function WarnIcon() {
  return (
    <svg className="zone-info-card-warn-icon" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 1.5L12.5 11.5H1.5L7 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <line x1="7" y1="5.5" x2="7" y2="8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="10.2" r="0.7" fill="currentColor" />
    </svg>
  );
}

/**
 * Popup card shown when a barangay boundary is clicked.
 * Layout follows HazardPanel: header (status + close), name + chips, body (facilities + profile + Full Report).
 * When no road route is available, facility row uses FacilityList-style no-route row (amber stripe + warning).
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
  onGoToDashboard,
  highlightedFacilityId = null,
  onShowRoute = null,
  onExitRoute = null,
  routeProfile = 'driving-car',
  onRouteProfileChange = null,
  routeSummary = null,
  routeLoading = false,
  facilitiesTotalLabel = null,
  routeSummaryByFacilityId = {},
  routeErrorByFacilityId = {},
  routeOrigin = 'barangay',
  onRouteOriginChange = null,
  routeFromLabel = null,
  locationStatusForRoute = null,
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  useEffect(() => {
    if (!profileDropdownOpen) return;
    const close = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) setProfileDropdownOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [profileDropdownOpen]);

  const currentProfileLabel = ROUTE_PROFILES.find((p) => p.value === routeProfile)?.label ?? 'Driving';

  const tagStyle = riskLevel?.color
    ? { backgroundColor: riskLevel.color, color: '#fff' }
    : { backgroundColor: 'var(--primary-500)', color: '#fff' };
  const showRouteBtnStyle = !riskLevel?.color ? undefined : {
    backgroundColor: riskLevel.color,
    borderColor: riskLevel.color,
    color: '#fff'
  };

  const statusLabel = riskLevel?.label ?? 'Heat index';
  const tempDisplay = temperature != null ? `${Number(temperature).toFixed(1)}` : '—';
  const sectionTitle = isNearbyFallback ? 'Nearest Facilities' : 'Health Facilities in the Area';
  // Risk chip shows the calculated risk score (not the level); format as integer or 1 decimal
  const riskScoreNum = riskScore != null && Number.isFinite(Number(riskScore)) ? Number(riskScore) : null;
  const riskScoreDisplay = riskScoreNum != null
    ? (Number.isInteger(riskScoreNum) ? riskScoreNum : Number(riskScoreNum).toFixed(1))
    : '—';

  return (
    <div className="zone-info-card zone-info-card--hp" role="dialog" aria-labelledby="zone-info-title" aria-modal="true">
      {/* Header: status + close (HazardPanel style) */}
      <div className="zone-info-card-header" style={tagStyle}>
        <div className="zone-info-card-status">
          <span className="zone-info-card-dot" aria-hidden />
          {statusLabel}
        </div>
        <button
          type="button"
          className="zone-info-card-close"
          onClick={onClose}
          aria-label="Close zone info"
        >
          ×
        </button>
      </div>

      {/* Name row + chips */}
      <div className="zone-info-card-name-row">
        <h2 id="zone-info-title" className="zone-info-card-name">{zoneName || 'Zone Info'}</h2>
        <div className="zone-info-card-chips">
          <div className="zone-info-card-chip">
            <div className="zone-info-card-chip-label">Risk</div>
            <div className="zone-info-card-chip-val zone-info-card-chip-val--risk" style={riskLevel?.color ? { color: riskLevel.color } : undefined}>
              {riskScoreDisplay}
            </div>
          </div>
          <div className="zone-info-card-chip">
            <div className="zone-info-card-chip-label">Temp</div>
            <div className="zone-info-card-chip-val">
              {tempDisplay}<span className="zone-info-card-chip-unit">°C</span>
            </div>
          </div>
        </div>
      </div>
      <div className="zone-info-card-sub">Barangay · Davao Region</div>

      <div className="zone-info-card-divider" />

      {/* Body */}
      <div className="zone-info-card-body">
        <div className="zone-info-card-section-hd">
          <span className="zone-info-card-section-title">{sectionTitle}</span>
          {facilitiesTotalLabel != null && facilitiesTotalLabel !== '' && (
            <span className="zone-info-card-fcount">{facilitiesTotalLabel}</span>
          )}
        </div>

        {isNearbyFallback && (
          <div className="zone-info-card-notice">
            No facilities in barangay — showing closest nearby.
          </div>
        )}

        {routeFromLabel && (
          <div className="zone-info-card-route-from" role="status">
            {routeFromLabel}
          </div>
        )}

        {locationStatusForRoute && (
          <div className={`zone-info-card-location-status zone-info-card-location-status--${locationStatusForRoute}`} role="status" aria-live="polite">
            {locationStatusForRoute === 'on' && <span>Location on — routing from your position</span>}
            {locationStatusForRoute === 'unavailable' && <span>Location unavailable — using barangay center</span>}
            {locationStatusForRoute === 'using_barangay' && <span>Using barangay center as start</span>}
          </div>
        )}

        {onShowRoute && onRouteProfileChange && (
          <div className="zone-info-card-profile-row" ref={profileDropdownRef}>
            <span className="zone-info-card-profile-label">Profile</span>
            <div className="zone-info-card-profile-trigger-wrap">
              <button
                type="button"
                className="zone-info-card-profile-trigger"
                onClick={(e) => { e.stopPropagation(); setProfileDropdownOpen((o) => !o); }}
                aria-haspopup="listbox"
                aria-expanded={profileDropdownOpen}
                aria-label="Route profile"
              >
                <span>{currentProfileLabel}</span>
                <span className="zone-info-card-profile-chevron" aria-hidden>{profileDropdownOpen ? '▲' : '▼'}</span>
              </button>
              <div className="zone-info-card-profile-menu" role="listbox" hidden={!profileDropdownOpen}>
                {ROUTE_PROFILES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    role="option"
                    aria-selected={routeProfile === p.value}
                    className="zone-info-card-profile-option"
                    onClick={(e) => { e.stopPropagation(); onRouteProfileChange(p.value); setProfileDropdownOpen(false); }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {onShowRoute && onRouteOriginChange && (
          <div className="zone-info-card-origin-row">
            <span className="zone-info-card-origin-label">Start from</span>
            <div className="zone-info-card-origin-options">
              <button
                type="button"
                className={`zone-info-card-origin-btn ${routeOrigin === 'user' ? 'zone-info-card-origin-btn--active' : ''}`}
                onClick={() => onRouteOriginChange('user')}
                aria-pressed={routeOrigin === 'user'}
                aria-label="Route from my location"
              >
                My location
              </button>
              <button
                type="button"
                className={`zone-info-card-origin-btn ${routeOrigin === 'barangay' ? 'zone-info-card-origin-btn--active' : ''}`}
                onClick={() => onRouteOriginChange('barangay')}
                aria-pressed={routeOrigin === 'barangay'}
                aria-label={`Route from ${zoneName ?? 'Barangay'}`}
              >
                {zoneName ?? 'Barangay'}
              </button>
            </div>
          </div>
        )}

        <div className="zone-info-card-flist">
          {facilitiesLoading ? (
            <p className="zone-info-card-flist-loading">Loading facilities…</p>
          ) : facilities.length === 0 ? (
            <p className="zone-info-card-flist-empty">No facilities listed.</p>
          ) : (
            facilities.map((fac) => {
              const isHighlighted = highlightedFacilityId != null && String(fac.id) === String(highlightedFacilityId);
              const routeSummaryForFacility = routeSummaryByFacilityId[String(fac.id)];
              const displayRoute = routeSummaryForFacility ? routeSummaryDisplay(routeSummaryForFacility) : null;
              const displayStraight = straightLineDisplay(fac);
              const distanceLabel = displayRoute ?? displayStraight;
              const routeErrorForFacility = routeErrorByFacilityId[String(fac.id)];
              const isStraightLineOnly = Boolean(routeErrorForFacility) || (isHighlighted && !routeSummaryForFacility && !routeLoading);
              const isNoRoute = isStraightLineOnly;

              if (isNoRoute) {
                return (
                  <div key={fac.id} className="zone-info-card-fitem-noroute">
                    <div className="zone-info-card-nr-stripe" />
                    <div className="zone-info-card-nr-content">
                      <div className="zone-info-card-nr-text">
                        <div className="zone-info-card-fname">{fac.name}</div>
                        <div className="zone-info-card-fmeta">{displayStraight ?? '—'}</div>
                        <div className="zone-info-card-nr-warning">
                          <WarnIcon />
                          No route found — straight-line only
                        </div>
                      </div>
                      <div className="zone-info-card-nr-btn-wrap">
                        {isHighlighted ? (
                          <button
                            type="button"
                            className="zone-info-card-xbtn"
                            onClick={(e) => { e.stopPropagation(); onExitRoute?.(); }}
                            aria-label={`Exit route to ${fac.name ?? 'facility'}`}
                          >
                            ✕ Exit
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="zone-info-card-rbtn-amber"
                            onClick={(e) => { e.stopPropagation(); onShowRoute?.(fac); }}
                            disabled={routeLoading}
                            aria-label={`Show route to ${fac.name ?? 'facility'}`}
                          >
                            Route →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={fac.id}
                  className={`zone-info-card-fitem${isHighlighted ? ' zone-info-card-fitem--active' : ''}`}
                >
                  {isHighlighted && <span className="zone-info-card-active-bar" style={riskLevel?.color ? { background: riskLevel.color } : undefined} />}
                  <div className="zone-info-card-finfo">
                    <div className="zone-info-card-fname">{fac.name}</div>
                    <div className="zone-info-card-fmeta">
                      {distanceLabel ?? '—'}
                    </div>
                  </div>
                  {(onShowRoute || onExitRoute) && (
                    isHighlighted ? (
                      <button
                        type="button"
                        className="zone-info-card-xbtn"
                        onClick={(e) => { e.stopPropagation(); onExitRoute?.(); }}
                        disabled={routeLoading}
                        aria-label={`Exit route to ${fac.name ?? 'facility'}`}
                      >
                        ✕ Exit
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="zone-info-card-rbtn"
                        style={showRouteBtnStyle}
                        onClick={(e) => { e.stopPropagation(); onShowRoute?.(fac); }}
                        disabled={routeLoading}
                        aria-label={`Show route to ${fac.name ?? 'facility'}`}
                      >
                        Route →
                      </button>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>

        <button
          type="button"
          className="zone-info-card-full-btn"
          style={tagStyle}
          onClick={() => onGoToDashboard?.()}
        >
          Full Report →
        </button>
      </div>
    </div>
  );
}
