/**
 * Heat / temperature data for the map.
 * - In production: call backend API for real barangay temperatures.
 * - For demo: use simulated temps from utils/heatMap (see BACKEND.md for API contract).
 */

import {
  buildHeatPointsFromBarangays,
  simulateBarangayTemperatures,
  DEFAULT_TEMP_MIN,
  DEFAULT_TEMP_MAX
} from '../utils/heatMap.js';

// BACKEND: Set VITE_API_URL in .env; when set, fetchBarangayTemperatures will use real API instead of dummy.
/** Backend base URL – set via env (e.g. import.meta.env.VITE_API_URL) when API exists */
const API_BASE = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : '';

/**
 * Fetch temperature per barangay from backend (when implemented).
 * Expected response: { temperatures: { [adm4_psgc]: number }, min?: number, max?: number }
 *
 * @param {string} cityId - e.g. 'davao' or PSGC code
 * @returns {Promise<{ temperatures: Record<string, number>, min: number, max: number } | null>}
 */
export async function fetchBarangayTemperatures(cityId = 'davao') {
  // DUMMY: when no API_BASE, caller uses simulateBarangayTemperatures; BACKEND: set VITE_API_URL to use real API.
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/api/heat/${cityId}/barangay-temperatures`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      temperatures: data.temperatures ?? {},
      min: data.min ?? DEFAULT_TEMP_MIN,
      max: data.max ?? DEFAULT_TEMP_MAX
    };
  } catch {
    return null;
  }
}

/**
 * Get heat layer data for Davao City barangays.
 * Uses backend if available, otherwise simulated temperatures (demo).
 *
 * @param {import('geojson').Feature[]} barangayFeatures
 * @returns {Promise<{ intensityPoints: [number, number, number][], points: [number, number, number][], tempMin: number, tempMax: number }>}
 */
export async function getBarangayHeatData(barangayFeatures) {
  const backend = await fetchBarangayTemperatures('davao');
  const tempRange = {
    min: backend?.min ?? DEFAULT_TEMP_MIN,
    max: backend?.max ?? DEFAULT_TEMP_MAX
  };
  // BACKEND: When fetchBarangayTemperatures returns data, backend?.temperatures is used; otherwise dummy simulation below.
  const tempByBarangayId = backend?.temperatures ?? simulateBarangayTemperatures(barangayFeatures, {
    centerLng: 125.4553,
    centerLat: 7.1907,
    ...tempRange
  });
  const { points, intensityPoints } = buildHeatPointsFromBarangays(
    barangayFeatures,
    tempByBarangayId,
    tempRange
  );
  return {
    intensityPoints,
    points,
    tempMin: tempRange.min,
    tempMax: tempRange.max
  };
}
