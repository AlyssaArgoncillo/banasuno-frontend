/**
 * Health facilities (medical centers, clinics) near a barangay or location.
 * - In production: call backend API (e.g. by barangay PSGC or lat/lng).
 * - For demo: use simulated list; replace with fetch when API exists.
 */

const API_BASE = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : '';

/** Mock facility names for demo when no API. BACKEND: remove when API returns real data. */
const MOCK_NAMES = [
  'Davao City Health Office',
  'Southern Philippines Medical Center',
  'Barangay Health Center 1',
  'Barangay Health Center 2',
  'Davao Doctors Hospital',
  'Medical Center 3',
  'Community Clinic',
  'Rural Health Unit'
];

/**
 * Fetch health facilities for a barangay or location.
 * Expected API response: { facilities: Array<{ id, name, address?, distance?, lat?, lng? }> }
 *
 * @param {string|number} [barangayId] - Barangay PSGC or feature id
 * @param {{ lat: number, lng: number }} [center] - Optional center for distance ordering
 * @returns {Promise<Array<{ id: string, name: string, address?: string, distance?: string }>>}
 */
export async function getHealthFacilitiesNearBarangay(barangayId, center = {}) {
  if (API_BASE) {
    try {
      const params = new URLSearchParams();
      if (barangayId != null) params.set('barangay', String(barangayId));
      if (center.lat != null && center.lng != null) {
        params.set('lat', String(center.lat));
        params.set('lng', String(center.lng));
      }
      const res = await fetch(`${API_BASE}/api/health-facilities?${params}`);
      if (!res.ok) return mockFacilitiesForBarangay(barangayId);
      const data = await res.json();
      return Array.isArray(data.facilities) ? data.facilities : mockFacilitiesForBarangay(barangayId);
    } catch {
      return mockFacilitiesForBarangay(barangayId);
    }
  }
  return mockFacilitiesForBarangay(barangayId);
}

/**
 * Demo: deterministic mock list based on barangay id so it’s stable per zone.
 * Replace with real API in production.
 */
function mockFacilitiesForBarangay(barangayId) {
  const seed = typeof barangayId === 'string' ? parseInt(barangayId.slice(-4), 10) || 0 : (barangayId ?? 0);
  const count = 3 + (seed % 4);
  const facilities = [];
  for (let i = 0; i < count; i++) {
    const nameIndex = (seed + i) % MOCK_NAMES.length;
    facilities.push({
      id: `fac-${barangayId}-${i}`,
      name: MOCK_NAMES[nameIndex],
      address: i === 0 ? 'Near this area' : undefined,
      distance: i === 0 ? 'Closest' : `${1 + (i % 3)} km`
    });
  }
  return facilities;
}
