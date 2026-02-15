/**
 * Fetches boundary GeoJSON (city, barangays) from external or backend sources.
 * BACKEND: Can later fetch from your API (e.g. GET /api/boundaries/city/davao, /api/boundaries/barangays/davao) instead of GitHub.
 */

// DUMMY: External GitHub URLs; replace with backend URLs when you serve boundaries from your API.
const BASE = 'https://raw.githubusercontent.com/faeldon/philippines-json-maps/master/2023/geojson';

/** Davao City (City of Davao) – provdist code 1102400000, municity 1130700000 */
export const DAVAO_PROVDIST_URL = `${BASE}/provdists/lowres/municities-provdist-1102400000.0.001.json`;
export const DAVAO_BARANGAYS_URL = `${BASE}/municities/lowres/bgysubmuns-municity-1130700000.0.001.json`;

/**
 * Fetch GeoJSON for a province/district (contains city boundaries).
 * @param {string} [url] - Default: Davao del Sur provdist
 * @returns {Promise<import('geojson').FeatureCollection>}
 */
export async function fetchProvdistBoundaries(url = DAVAO_PROVDIST_URL) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load city boundaries');
  return res.json();
}

/**
 * Fetch barangay-level GeoJSON for a city/municipality.
 * @param {string} [url] - Default: Davao City barangays
 * @returns {Promise<import('geojson').FeatureCollection>}
 */
export async function fetchBarangayBoundaries(url = DAVAO_BARANGAYS_URL) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load barangay districts');
  return res.json();
}

/**
 * Fetch both city boundary and barangays for Davao City.
 * @returns {Promise<{ cityGeojson: import('geojson').FeatureCollection, barangayGeojson: import('geojson').FeatureCollection }>}
 */
export async function fetchDavaoBoundaries() {
  const [cityGeojson, barangayGeojson] = await Promise.all([
    fetchProvdistBoundaries(),
    fetchBarangayBoundaries()
  ]);
  return { cityGeojson, barangayGeojson };
}

/**
 * Extract Davao City feature from provdist FeatureCollection.
 * @param {import('geojson').FeatureCollection} cityGeojson
 * @returns {import('geojson').Feature | null}
 */
export function getDavaoCityFeature(cityGeojson) {
  return cityGeojson.features?.find(
    (f) => f.properties?.adm3_en === 'City of Davao' || f.id === 1130700000
  ) ?? null;
}
