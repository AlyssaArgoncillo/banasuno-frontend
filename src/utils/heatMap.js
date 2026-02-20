/**
 * Heat map helpers: normalize temperature to intensity, build heat points from barangays.
 * Pure logic; temperature data itself should come from backend (see services/heatService).
 */

import { getPolygonRing, ringCentroid } from './geo.js';

/**
 * Get a stable barangay id from a GeoJSON feature (for temperature lookup and polygon styling).
 * @param {import('geojson').Feature} feature
 * @returns {string|number|null}
 */
export function getBarangayId(feature) {
  if (feature == null) return null;
  const id = feature.id ?? feature.properties?.adm4_psgc ?? feature.properties?.ADM4_PSGC;
  return id != null ? id : null;
}

/** Default display range for temperature legend (°C). BACKEND: can be overridden by API response min/max. */
export const DEFAULT_TEMP_MIN = 26;
export const DEFAULT_TEMP_MAX = 39;

/** Gradient stops [t, hex] for temperature intensity 0–1 (same as heat layer). */
const HEAT_GRADIENT = [
  [0, '#206bcb'],
  [0.2, '#4299e1'],
  [0.4, '#48bb78'],
  [0.55, '#ecc94b'],
  [0.7, '#ed8936'],
  [0.85, '#e53e3e'],
  [1, '#9b2c2c']
];

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
 * PAGASA heat index categories (temperature °C). Used for map fill and zone card.
 * See: https://www.pagasa.dost.gov.ph/weather/heat-index
 */
export const HEAT_RISK_LEVELS = [
  { level: 1, label: 'Not Hazardous', color: '#48bb78', rangeLabel: '< 27°C' },
  { level: 2, label: 'Caution', color: '#ecc94b', rangeLabel: '27–32°C' },
  { level: 3, label: 'Extreme Caution', color: '#ed8936', rangeLabel: '33–41°C' },
  { level: 4, label: 'Danger', color: '#f97316', rangeLabel: '42–51°C' },
  { level: 5, label: 'Extreme Danger', color: '#dc2626', rangeLabel: '≥ 52°C' }
];

/** PAGASA temp boundaries: level 1 < 27, 2: 27–32, 3: 33–41, 4: 42–51, 5: ≥ 52 */
const PAGASA_TEMP_BOUNDS = [
  { min: -Infinity, max: 27 },
  { min: 27, max: 33 },
  { min: 33, max: 42 },
  { min: 42, max: 52 },
  { min: 52, max: Infinity }
];

/**
 * Map temperature (°C) to PAGASA heat risk level (for zone card and counts).
 * @param {number} temp - Temperature in °C
 * @returns {{ level: number, label: string, color: string, rangeLabel: string }}
 */
export function tempToHeatRiskLevel(temp) {
  if (temp == null || !Number.isFinite(temp)) {
    return HEAT_RISK_LEVELS[0];
  }
  for (let i = 0; i < PAGASA_TEMP_BOUNDS.length; i++) {
    const { min, max } = PAGASA_TEMP_BOUNDS[i];
    if (temp >= min && temp < max) return HEAT_RISK_LEVELS[i];
  }
  return HEAT_RISK_LEVELS[HEAT_RISK_LEVELS.length - 1];
}

/**
 * Get fill color for temperature (°C) – PAGASA heat index (polygon fill).
 * @param {number} temp - Temperature in °C
 * @returns {string} hex color
 */
export function getColorForTemp(temp) {
  return tempToHeatRiskLevel(temp).color;
}

/** @deprecated Use tempToHeatRiskLevel(temp) and getColorForTemp(temp) with PAGASA ranges. */
export function intensityToHeatRiskLevel(intensity) {
  const t = 0.5;
  return tempToHeatRiskLevel(DEFAULT_TEMP_MIN + (DEFAULT_TEMP_MAX - DEFAULT_TEMP_MIN) * Math.max(0, Math.min(1, intensity)));
}

/** @deprecated Use getColorForTemp(temp) for PAGASA-based coloring. */
export function getColorForIntensity(t) {
  const temp = DEFAULT_TEMP_MIN + (DEFAULT_TEMP_MAX - DEFAULT_TEMP_MIN) * Math.max(0, Math.min(1, t));
  return getColorForTemp(temp);
}

function parseHex(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}
function lerpHex(hex0, hex1, f) {
  const a = parseHex(hex0);
  const b = parseHex(hex1);
  const r = Math.round(a[0] + (b[0] - a[0]) * f);
  const g = Math.round(a[1] + (b[1] - a[1]) * f);
  const bl = Math.round(a[2] + (b[2] - a[2]) * f);
  return '#' + [r, g, bl].map((x) => x.toString(16).padStart(2, '0')).join('');
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
    const id = getBarangayId(feature);
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
    const id = getBarangayId(feature);
    if (id != null) out[id] = clamped;
  });

  return out;
}
