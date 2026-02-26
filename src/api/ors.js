/**
 * OpenRouteService (ORS) API – batch travel times from barangays to facilities.
 * Calls backend POST /api/ors/batch-travel-times.
 */

import { getApiBase } from '../services/apiConfig.js';

/**
 * Fetch accessibility (travel times) from barangay centroids to facilities.
 * Backend resolves barangay centroids from Davao GeoJSON; facilities must include id, lon, lat.
 *
 * @param {string[] | number[]} barangayIds - Barangay IDs (e.g. PSGC from heat map)
 * @param {Array<{ id: string|number, lon: number, lat: number }>} facilities - Facilities with id, lon, lat
 * @param {{ profile?: string, saveToSupabase?: boolean }} [options] - Optional: profile (default "driving-car"), saveToSupabase (default true)
 * @returns {Promise<{
 *   results: Array<{ barangay_id: string, facility_id: string, travel_time_seconds: number, distance_metres: number }>,
 *   summary: { total_pairs: number, errors: number, nearest_per_barangay: Array, nearest_facility?: object | null, message?: string },
 *   saved_to_supabase?: boolean,
 *   errors?: Array<{ barangay_id: string, facility_id: string, error: string }>
 * }>}
 */
export async function fetchAccessibility(barangayIds, facilities, options = {}) {
  const base = getApiBase();
  const path = '/api/ors/batch-travel-times';
  const url = base ? `${base}${path}` : path;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ barangayIds, facilities, ...options }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const err = new Error('Failed to fetch accessibility');
    err.status = response.status;
    err.body = data;
    throw err;
  }

  const data = await response.json();
  return data;
}
