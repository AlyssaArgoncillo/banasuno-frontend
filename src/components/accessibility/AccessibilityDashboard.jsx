/**
 * Dashboard view: list of nearby facilities with name + type (color-coded) and distance.
 * Flags facilities beyond 6 km (warning style) to match map cutoff rule.
 */

import '../../styles/AccessibilityDashboard.css';

const FACILITY_TYPE_STYLES = {
  hospital: { color: '#C62828', bg: '#FFCDD2', label: 'Hospital' },
  clinic: { color: '#1565C0', bg: '#BBDEFB', label: 'Clinic' },
  health_center: { color: '#1565C0', bg: '#BBDEFB', label: 'Health Center' },
  pharmacy: { color: '#2D5F2E', bg: '#C8E6C9', label: 'Pharmacy' },
  doctors: { color: '#2D5F2E', bg: '#C8E6C9', label: "Doctor's" },
  default: { color: '#424242', bg: '#EEEEEE', label: 'Facility' },
};

const CUTOFF_KM = 6;

function getTypeStyle(facilityType) {
  if (!facilityType) return FACILITY_TYPE_STYLES.default;
  const key = String(facilityType).toLowerCase().replace(/\s+/g, '_');
  return FACILITY_TYPE_STYLES[key] ?? FACILITY_TYPE_STYLES.default;
}

/**
 * @param {{ data?: { facilities?: Array<{ id: string, name: string, facility_type?: string, distance_km?: number, distance?: string }> }, labels?: { facilityNames?: Record<string, string> } }} props
 */
function AccessibilityDashboard({ data, labels = {} }) {
  const facilities = data?.facilities ?? [];
  const facilityNames = labels.facilityNames ?? {};

  return (
    <div className="accessibility-dashboard" role="region" aria-labelledby="accessibility-dashboard-title">
      <h3 id="accessibility-dashboard-title" className="accessibility-dashboard__title">
        Nearby Facilities
      </h3>
      {facilities.length === 0 ? (
        <p className="accessibility-dashboard__empty">No facilities to show.</p>
      ) : (
        <ul className="accessibility-dashboard__list">
          {facilities.map((fac) => {
            const style = getTypeStyle(fac.facility_type);
            const distanceKm = fac.distance_km ?? (typeof fac.distance === 'string' ? parseFloat(fac.distance) : null);
            const beyondCutoff = distanceKm != null && distanceKm > CUTOFF_KM;
            const displayDistance = fac.distance ?? (distanceKm != null ? `${distanceKm.toFixed(1)} km` : '—');

            return (
              <li
                key={fac.id}
                className={`accessibility-dashboard__item ${beyondCutoff ? 'accessibility-dashboard__item--beyond' : ''}`}
              >
                <div className="accessibility-dashboard__left">
                  <span className="accessibility-dashboard__name">
                    {facilityNames[String(fac.id)] ?? fac.name ?? `Facility ${fac.id}`}
                  </span>
                  <span
                    className="accessibility-dashboard__type"
                    style={{ backgroundColor: style.bg, color: style.color }}
                  >
                    {style.label}
                  </span>
                </div>
                <div className="accessibility-dashboard__right">
                  {beyondCutoff && (
                    <span className="accessibility-dashboard__flag" title="Beyond 6 km — too far for map routing">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </span>
                  )}
                  <span className="accessibility-dashboard__distance">{displayDistance}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AccessibilityDashboard;
export { CUTOFF_KM };
