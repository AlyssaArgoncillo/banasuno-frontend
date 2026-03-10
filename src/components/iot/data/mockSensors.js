/**
 * Mock IoT sensor data and pin positions for the heat map.
 * SENSOR_LATLNG: [lat, lng] for each sensor (Davao City barangay locations).
 */

export const SENSORS = [
  { id: 'B042', barangay: 'Talomo', landmark: 'Talomo Health Center', status: 'active', temp: 36.2, heatIdx: 42, humidity: 68, battery: 82, risk: 'DANGER', ago: '2 min', spark: [28, 30, 33, 35, 38, 40, 38, 36, 35, 36] },
  { id: 'B038', barangay: 'Matina', landmark: 'Matina Crossing', status: 'active', temp: 34.1, heatIdx: 38, humidity: 71, battery: 91, risk: 'EXTREME CAUTION', ago: '4 min', spark: [26, 28, 30, 32, 34, 35, 36, 35, 34, 34] },
  { id: 'B015', barangay: 'Buhangin', landmark: 'Buhangin Market', status: 'alerting', temp: 42.5, heatIdx: 48, humidity: 60, battery: 45, risk: 'DANGER', ago: '1 min', spark: [30, 34, 38, 41, 43, 44, 43, 43, 42, 42] },
  { id: 'B022', barangay: 'Toril', landmark: 'Toril Church', status: 'alerting', temp: 41.8, heatIdx: 46, humidity: 62, battery: 33, risk: 'DANGER', ago: '3 min', spark: [29, 32, 37, 40, 42, 42, 41, 41, 42, 42] },
  { id: 'B061', barangay: 'Calinan', landmark: 'Calinan Plaza', status: 'recent', temp: 31.2, heatIdx: 34, humidity: 78, battery: 78, risk: 'EXTREME CAUTION', ago: '18 min', spark: [24, 25, 27, 30, 31, 32, 33, 32, 31, 31] },
  { id: 'B007', barangay: 'Agdao', landmark: 'Agdao Market', status: 'inactive', temp: 27.4, heatIdx: 28, humidity: 80, battery: 12, risk: 'CAUTION', ago: '52 min', spark: [22, 23, 24, 25, 26, 27, 27, 27, 27, 27] },
];

/** Geographic coordinates [lat, lng] for each sensor (Davao City barangays). */
export const SENSOR_LATLNG = {
  B042: [7.0593566, 125.5743967], // Talomo Central Health Center
  B038: [7.0587, 125.5690], // Matina Crossing (barangay center)
  B015: [7.1094, 125.6154], // Buhangin Public Market
  B022: [7.0185, 125.5005], // Toril (barangay center)
  B061: [7.1876, 125.4532], // Calinan (barangay center)
  B007: [7.0821489, 125.6229777], // Agdao Public Market
};

/** Generate 24h chart data from base temp (for history modal). */
export function gen24h(base) {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const curve = Math.sin(((hour - 6) * Math.PI) / 12) * 5;
    const noise = (Math.random() - 0.5) * 1.5;
    return Math.max(22, Math.min(48, base - 4 + curve + noise));
  });
}
