/**
 * Geocoding: convert a place name or address to coordinates.
 * Uses OpenStreetMap Nominatim (1 req/s, valid User-Agent required).
 * For barangays in Davao, prefer matching against loaded boundaries first.
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'BanasUnoHeatMap/1.0 (https://github.com/banasuno-frontend; heat map location search)';

/**
 * Geocode a query to [lat, lng] or null.
 * Biases results to Davao City, Philippines when viewbox is used.
 *
 * @param {string} query - Place name or address
 * @returns {Promise<{ lat: number, lng: number, displayName?: string } | null>}
 */
export async function geocodeQuery(query) {
  const q = query?.trim();
  if (!q) return null;
  const params = new URLSearchParams({
    q: q.includes(',') ? q : `${q}, Davao City, Philippines`,
    format: 'json',
    limit: '1',
    addressdetails: '0'
  });
  try {
    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { 'Accept': 'application/json', 'User-Agent': USER_AGENT }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : null;
    if (!first || first.lat == null || first.lon == null) return null;
    return {
      lat: Number(first.lat),
      lng: Number(first.lon),
      displayName: first.display_name
    };
  } catch {
    return null;
  }
}
