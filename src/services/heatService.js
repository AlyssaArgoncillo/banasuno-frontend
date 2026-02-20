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

import { getApiBase } from './apiConfig.js';

/** Normalize temperatures to object keyed by barangay id. Handles object or array (e.g. batches). */
function normalizeTemperaturesFromResponse(temperatures) {
  if (temperatures == null || typeof temperatures !== 'object') return {};
  if (Array.isArray(temperatures)) {
    const out = {};
    for (const item of temperatures) {
      if (item == null || typeof item !== 'object') continue;
      const id = item.adm4_psgc ?? item.ADM4_PSGC ?? item.id ?? item.barangay_id;
      const temp = item.temperature_c ?? item.temp ?? item.temperature;
      if (id != null && temp != null && Number.isFinite(temp)) out[String(id)] = temp;
    }
    return out;
  }
  return Object.fromEntries(
    Object.entries(temperatures)
      .filter(([, v]) => v != null && Number.isFinite(v))
      .map(([k, v]) => [String(k), v])
  );
}

/**
 * GET /api/heat/:cityId/barangay-temperatures – Barangay heat temps. Optional ?limit=N.
 * Response: { temperatures: { [adm4_psgc]: number }, min, max, averageTemp?, updatedAt? } or batches.
 */
export async function fetchBarangayTemperatures(cityId = 'davao') {
  const base = getApiBase();
  const url = base ? `${base}/api/heat/${cityId}/barangay-temperatures` : `/api/heat/${cityId}/barangay-temperatures`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    let raw = data.temperatures;
    if (data.batches && Array.isArray(data.batches)) {
      const merged = {};
      for (const b of data.batches) {
        Object.assign(merged, normalizeTemperaturesFromResponse(b.temperatures ?? b));
      }
      raw = merged;
    }
    const temperatures = normalizeTemperaturesFromResponse(raw);
    return {
      temperatures,
      min: data.min ?? DEFAULT_TEMP_MIN,
      max: data.max ?? DEFAULT_TEMP_MAX,
      averageTemp: data.averageTemp != null && Number.isFinite(data.averageTemp) ? data.averageTemp : undefined,
      updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
      count: Object.keys(temperatures).length
    };
  } catch {
    return null;
  }
}

/**
 * GET /api/heat/:cityId/average – City average heat only (Davao center).
 * Response: { cityId, temp_c, source, updatedAt }.
 * @returns {Promise<number|null>} temp_c or null
 */
export async function fetchCityAverage(cityId = 'davao') {
  const base = getApiBase();
  const url = base ? `${base}/api/heat/${cityId}/average` : `/api/heat/${cityId}/average`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const t = data.temp_c;
    return t != null && Number.isFinite(t) ? t : null;
  } catch {
    return null;
  }
}

/**
 * GET /api/heat/:cityId/forecast – 7- or 14-day forecast. ?days=7 (default) or ?days=14.
 * Response: { forecastDay: [ { date, avgtemp_c, mintemp_c, maxtemp_c } ], ... }.
 */
export async function fetchCityForecast(cityId = 'davao', days = 7) {
  const base = getApiBase();
  const safeDays = days === 14 ? 14 : 7;
  const url = base ? `${base}/api/heat/${cityId}/forecast?days=${safeDays}` : `/api/heat/${cityId}/forecast?days=${safeDays}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const list = data.forecastDay ?? data.forecast?.forecastday ?? data.forecastDays ?? [];
    const forecastDays = list.map((d) => {
      const day = d.day ?? d;
      const avgtemp = day.avgtemp_c ?? day.avgtemp ?? d.avgtemp_c ?? d.avgtemp ?? day.temp_c;
      return {
        date: d.date ?? '',
        avgtemp_c: Number.isFinite(avgtemp) ? avgtemp : null
      };
    }).filter((d) => d.date && d.avgtemp_c != null);
    return { forecastDays, currentTemp: data.current?.temp_c };
  } catch {
    return null;
  }
}

/**
 * Get heat layer data for Davao City barangays.
 * Uses GET /api/heat/davao/barangay-temperatures when API_BASE set; else simulated.
 * Fills missing barangays with city average when backend provides averageTemp.
 *
 * @param {import('geojson').Feature[]} barangayFeatures
 * @returns {Promise<{ intensityPoints, points, tempMin, tempMax, tempByBarangayId, averageTemp?, updatedAt?, apiTempCount? }>}
 */
export async function getBarangayHeatData(barangayFeatures) {
  const backend = await fetchBarangayTemperatures('davao');
  const tempRange = {
    min: backend?.min ?? DEFAULT_TEMP_MIN,
    max: backend?.max ?? DEFAULT_TEMP_MAX
  };
  let tempByBarangayId = backend?.temperatures ?? null;
  if (tempByBarangayId == null) {
    tempByBarangayId = simulateBarangayTemperatures(barangayFeatures, {
      centerLng: 125.4553,
      centerLat: 7.1907,
      ...tempRange
    });
  } else {
    const averageTemp = backend.averageTemp != null && Number.isFinite(backend.averageTemp) ? backend.averageTemp : null;
    if (averageTemp != null && barangayFeatures?.length) {
      const filled = { ...tempByBarangayId };
      for (const feature of barangayFeatures) {
        const id = feature.id ?? feature.properties?.adm4_psgc ?? feature.properties?.ADM4_PSGC;
        if (id != null && !(String(id) in filled)) filled[String(id)] = averageTemp;
      }
      tempByBarangayId = filled;
    }
  }
  const { points, intensityPoints } = buildHeatPointsFromBarangays(barangayFeatures, tempByBarangayId, tempRange);
  return {
    intensityPoints,
    points,
    tempMin: tempRange.min,
    tempMax: tempRange.max,
    tempByBarangayId,
    averageTemp: backend?.averageTemp,
    updatedAt: backend?.updatedAt,
    apiTempCount: backend?.count
  };
}
