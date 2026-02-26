/**
 * Area view: "Health Facilities in the Area" with facility name (left) and distance in km (right).
 * Supports progressive search messages when no facilities within 5 / 10 / 15 km.
 */

import '../../styles/AccessibilityPanel.css';

const RADIUS_MESSAGES = {
  5: 'No facilities within 5 km. Showing nearest facilities beyond 5 km…',
  10: 'No facilities within 10 km. Showing nearest facilities beyond 10 km…',
  15: 'No facilities found within 15 km.',
};

/**
 * @param {{ data?: { facilities?: Array<{ id: string, name: string, distance_km?: number, distance?: string }>, radiusUsed?: 5|10|15, message?: string }, labels?: { facilityNames?: Record<string, string> } }} props
 */
function AccessibilityPanel({ data, labels = {} }) {
  const facilities = data?.facilities ?? [];
  const radiusUsed = data?.radiusUsed;
  const customMessage = data?.message;
  const facilityNames = labels.facilityNames ?? {};

  const message =
    customMessage ??
    (radiusUsed != null && RADIUS_MESSAGES[radiusUsed] ? RADIUS_MESSAGES[radiusUsed] : null);

  return (
    <section className="accessibility-panel" aria-labelledby="accessibility-panel-title">
      <h2 id="accessibility-panel-title" className="accessibility-panel__title">
        Health Facilities in the Area
      </h2>

      {message && (
        <p className="accessibility-panel__message" role="status">
          {message}
        </p>
      )}

      {facilities.length === 0 ? (
        <p className="accessibility-panel__empty">No facilities listed.</p>
      ) : (
        <ul className="accessibility-panel__list">
          {facilities.map((fac) => (
            <li key={fac.id} className="accessibility-panel__item">
              <span className="accessibility-panel__name">
                {facilityNames[String(fac.id)] ?? fac.name ?? `Facility ${fac.id}`}
              </span>
              <span className="accessibility-panel__distance">
                {fac.distance ?? (fac.distance_km != null ? `${Number(fac.distance_km).toFixed(1)} km` : '—')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AccessibilityPanel;
