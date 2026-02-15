/**
 * Heat map helpers: normalize temperature to intensity, build heat points from barangays.
 * Pure logic; temperature data itself should come from backend (see services/heatService).
 */

import { getPolygonRing, ringCentroid } from './geo.js';

/** Default display range for temperature legend (°C). BACKEND: can be overridden by API response min/max. */
export const DEFAULT_TEMP_MIN = 26;
export const DEFAULT_TEMP_MAX = 39;

/**
 * Normalize temperature to 0–1 for Leaflet heat layer intensity.
 * @param {number} temp - Temperature (°C)
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function normalizeTempToIntensity(temp, min = DEFAULT_TEMP_MIN, max = DEFAULT_TEMP_MAX) {
  const range = max - min;
  if (range <= 0 || !Number.isFinite(range)) return 0.5;
  return Math.max(0, Math.min(1, (temp - min) / range));
}

/**
 * Build heat layer points from barangay GeoJSON features and temperature per barangay.
 * One point per barangay at its centroid. Use when backend provides temps keyed by barangay id/psgc.
 *
 * @param {import('geojson').Feature[]} barangayFeatures
 * @param {Record<string|number, number>} tempByBarangayId - e.g. { [adm4_psgc]: temp °C }
 * @param {{ min: number, max: number }} tempRange - for normalization
 * @returns {{ points: [number, number, number][], intensityPoints: [number, number, number][] }}
 *   points: [lat, lng, temp °C]; intensityPoints: [lat, lng, 0–1] for L.heatLayer
 */
export function buildHeatPointsFromBarangays(barangayFeatures, tempByBarangayId, tempRange = { min: DEFAULT_TEMP_MIN, max: DEFAULT_TEMP_MAX }) {
  const { min: tempMin, max: tempMax } = tempRange;
  const points = [];
  const intensityPoints = [];

  if (!barangayFeatures?.length) return { points, intensityPoints };

  for (const feature of barangayFeatures) {
    const ring = getPolygonRing(feature.geometry);
    if (!ring || ring.length < 3) continue;

    const [lng, lat] = ringCentroid(ring);
    const id = feature.id ?? feature.properties?.adm4_psgc;
    const temp = tempByBarangayId != null && id != null && Number.isFinite(tempByBarangayId[id])
      ? tempByBarangayId[id]
      : null;

    if (temp == null) continue;

    const clamped = Math.max(tempMin, Math.min(tempMax, temp));
    const intensity = normalizeTempToIntensity(clamped, tempMin, tempMax);
    points.push([lat, lng, clamped]);
    intensityPoints.push([lat, lng, intensity]);
  }

  return { points, intensityPoints };
}

/**
 * DUMMY: Simulate temperature per barangay when backend is not available.
 * BACKEND: Real data from heatService.fetchBarangayTemperatures(); remove or keep as dev fallback.
 *
 * @param {import('geojson').Feature[]} barangayFeatures
 * @param {{ centerLng: number, centerLat: number, min: number, max: number }} options
 * @returns {Record<string|number, number>} tempByBarangayId
 */
export function simulateBarangayTemperatures(barangayFeatures, options = {}) {
  const centerLng = options.centerLng ?? 125.4553; // Dummy; backend sends temps by barangay id.
  const centerLat = options.centerLat ?? 7.1907;
  const tempMin = options.min ?? DEFAULT_TEMP_MIN;
  const tempMax = options.max ?? DEFAULT_TEMP_MAX;
  const out = {};

  if (!barangayFeatures?.length) return out;

  barangayFeatures.forEach((feature, index) => {
    const ring = getPolygonRing(feature.geometry);
    if (!ring || ring.length < 3) return;

    const [lng, lat] = ringCentroid(ring);
    const dx = (lng - centerLng) / 0.2;
    const dy = (lat - centerLat) / 0.15;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Dummy formula; backend will provide real temperature per barangay.
    const noise = 0.88 + Math.sin(index * 1.3) * 0.06 + Math.cos(lat * 8) * 0.04;
    const temp =
      Math.round(
        (tempMin + (1 - Math.min(dist * 0.4, 1)) * (tempMax - tempMin) * noise) * 10
      ) / 10;
    const clamped = Math.max(tempMin, Math.min(tempMax, temp));
    const id = feature.id ?? feature.properties?.adm4_psgc;
    if (id != null) out[id] = clamped;
  });

  return out;
}
