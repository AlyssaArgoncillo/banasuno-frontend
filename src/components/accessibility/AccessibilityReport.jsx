/**
 * Displays batch ORS accessibility results: nearest facility travel time per barangay.
 * Use with fetchAccessibility() from api/ors.js.
 * Example: "Barangay 1130700001 → nearest facility: 8 min drive"
 */

import '../../styles/AccessibilityReport.css';

/**
 * @param {{ summary?: { nearest_per_barangay?: Array<{ barangay_id: string, facility_id: string, travel_time_seconds: number, travel_time_minutes: number }> }, results?: Array }} data - Response from fetchAccessibility()
 * @param {{ barangayNames?: Record<string, string>, facilityNames?: Record<string, string> }} [labels] - Optional names for barangay_id and facility_id
 */
function AccessibilityReport({ data, labels = {} }) {
  if (!data?.summary?.nearest_per_barangay?.length) {
    return (
      <div className="accessibility-report accessibility-report--empty">
        No accessibility data. Run batch travel times with barangay IDs and facilities.
      </div>
    );
  }

  const nearest = data.summary.nearest_per_barangay;
  const barangayNames = labels.barangayNames || {};
  const facilityNames = labels.facilityNames || {};

  return (
    <div className="accessibility-report">
      <h3 className="accessibility-report__title">Nearest facility by barangay</h3>
      <ul className="accessibility-report__list">
        {nearest.map((row) => (
          <li key={row.barangay_id} className="accessibility-report__item">
            <span className="accessibility-report__barangay">
              {barangayNames[row.barangay_id] || 'Barangay ' + row.barangay_id}
            </span>
            <span className="accessibility-report__arrow">→</span>
            <span className="accessibility-report__facility">
              nearest: {facilityNames[row.facility_id] || 'Facility ' + row.facility_id}
            </span>
            <span className="accessibility-report__time">
              {row.travel_time_minutes} min drive
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AccessibilityReport;
