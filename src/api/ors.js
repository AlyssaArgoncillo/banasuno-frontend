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

/**
 * Fetch road-based directions (backend proxies OpenRouteService).
 * POST /api/ors/directions
 * Body: { start: [lng, lat] | { lng, lat }, end: [lng, lat] | { lng, lat }, profile?: "driving-car" | "foot-walking" | "cycling-regular" }
 * Response (200): ORS GeoJSON FeatureCollection; features[0].geometry.coordinates (LineString [lng,lat][]), features[0].properties.summary { distance (m), duration (s) }
 */
export async function fetchDirections(start, end, profile = 'driving-car') {
  const base = getApiBase();
  const url = base ? `${base}/api/ors/directions` : '/api/ors/directions';
  const norm = (p) => Array.isArray(p) ? { lng: p[0], lat: p[1] } : { lng: p.lng ?? p.lon, lat: p.lat };
  const body = {
    start: Array.isArray(start) ? start : [norm(start).lng, norm(start).lat],
    end: Array.isArray(end) ? end : [norm(end).lng, norm(end).lat],
    profile: ['foot-walking', 'driving-car', 'cycling-regular'].includes(profile) ? profile : 'driving-car',
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const e = new Error(errData?.error ?? res.statusText);
    e.status = res.status;
    e.body = errData;
    throw e;
  }
  return res.json();
}
