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
      const temp = item.temperature_c ?? item.temp_c ?? item.temp ?? item.temperature;
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
 * GET /api/heat/:cityId/barangays – Per-barangay temp + risk + lat/lng + area. Optional ?limit=N.
 * Response: { barangays: [ { barangay_id, temperature_c, risk_level?, lat, lng, area? } ], min, max, updatedAt? }.
 * Falls back to old /barangay-temperatures endpoint if new one fails.
 */
export async function fetchBarangayTemperatures(cityId = 'davao') {
  const base = getApiBase();
  
  // Try new endpoint first
  const newUrl = base ? `${base}/api/heat/${cityId}/barangays` : `/api/heat/${cityId}/barangays`;
  try {
    const res = await fetch(newUrl, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      
      // Map array of barangay objects to temperature dictionary
      const temperatures = {};
      let avgSum = 0;
      let avgCount = 0;
      let minTemp = Infinity;
      let maxTemp = -Infinity;
      
      if (Array.isArray(data.barangays)) {
        for (const b of data.barangays) {
          const id = b.barangay_id ?? b.id ?? b.adm4_psgc;
          const temp = b.temperature_c ?? b.temp_c ?? b.temp;
          if (id != null && temp != null && Number.isFinite(temp)) {
            temperatures[String(id)] = temp;
            avgSum += temp;
            avgCount += 1;
            if (temp < minTemp) minTemp = temp;
            if (temp > maxTemp) maxTemp = temp;
          }
        }
      }
      
      console.log('[fetchBarangayTemperatures] First barangay sample:', data.barangays?.[0]);
      
      const avgTemp = avgCount > 0 ? avgSum / avgCount : undefined;
      
      // Use backend min/max if provided, otherwise calculate from data, fallback to defaults
      const finalMin = data.min ?? (minTemp !== Infinity ? minTemp : DEFAULT_TEMP_MIN);
      const finalMax = data.max ?? (maxTemp !== -Infinity ? maxTemp : DEFAULT_TEMP_MAX);
      
      console.log('[fetchBarangayTemperatures] Calculated from data: min=', minTemp, 'max=', maxTemp);
      console.log('[fetchBarangayTemperatures] Backend provided: min=', data.min, 'max=', data.max);
      console.log('[fetchBarangayTemperatures] Final range: min=', finalMin, 'max=', finalMax);
      console.log('[fetchBarangayTemperatures] Sample temps:', Object.values(temperatures).slice(0, 10));
      
      return {
        temperatures,
        min: finalMin,
        max: finalMax,
        averageTemp: avgTemp != null && Number.isFinite(avgTemp) ? avgTemp : undefined,
        updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
        count: Object.keys(temperatures).length
      };
    }
    
    // If new endpoint fails, log response body and try old endpoint
    const errorText = await res.text().catch(() => 'Could not read error');
    console.warn(`[heatService] New endpoint ${newUrl} failed (${res.status}):`, errorText, '- trying fallback...');
  } catch (err) {
    console.warn(`[heatService] New endpoint ${newUrl} error:`, err?.message, '- trying fallback...');
  }
  
  // Fallback to old endpoint
  const fallbackUrl = base ? `${base}/api/heat/${cityId}/barangay-temperatures` : `/api/heat/${cityId}/barangay-temperatures`;
  try {
    const res = await fetch(fallbackUrl, { cache: 'no-store' });
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
 * GET /api/heat/:cityId/current – City center current weather (temp, feels-like, humidity, condition). WeatherAPI.
 * Response: { temp, feels_like, humidity, condition, lastUpdated? }.
 * Falls back to old /average endpoint if new one fails.
 * @returns {Promise<number|null>} temp or null
 */
export async function fetchCityAverage(cityId = 'davao') {
  const base = getApiBase();
  
  // Try new endpoint first
  const newUrl = base ? `${base}/api/heat/${cityId}/current` : `/api/heat/${cityId}/current`;
  try {
    const res = await fetch(newUrl, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const t = data.temp ?? data.temp_c;
      return t != null && Number.isFinite(t) ? t : null;
    }
    console.warn(`[heatService] New endpoint ${newUrl} failed (${res.status}), trying fallback...`);
  } catch (err) {
    console.warn(`[heatService] New endpoint ${newUrl} error:`, err?.message, '- trying fallback...');
  }
  
  // Fallback to old endpoint
  const fallbackUrl = base ? `${base}/api/heat/${cityId}/average` : `/api/heat/${cityId}/average`;
  try {
    const res = await fetch(fallbackUrl, { cache: 'no-store' });
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
 * Uses GET /api/heat/davao/barangays when API_BASE set; else simulated.
 * Fills missing barangays with city average when backend provides averageTemp.
 *
 * @param {import('geojson').Feature[]} barangayFeatures
 * @returns {Promise<{ intensityPoints, points, tempMin, tempMax, tempByBarangayId, averageTemp?, updatedAt?, apiTempCount? }>}
 */
export async function getBarangayHeatData(barangayFeatures) {
  console.log('[getBarangayHeatData] Starting with', barangayFeatures?.length, 'barangay features');
  
  const backend = await fetchBarangayTemperatures('davao');
  console.log('[getBarangayHeatData] Backend response:', backend ? 
    `${backend.count} temps, min=${backend.min}, max=${backend.max}` : 
    'null (using simulation)');
  
  const tempRange = {
    min: backend?.min ?? DEFAULT_TEMP_MIN,
    max: backend?.max ?? DEFAULT_TEMP_MAX
  };
  
  let tempByBarangayId = backend?.temperatures ?? null;
  if (tempByBarangayId == null) {
    console.log('[getBarangayHeatData] No backend temps, using simulation');
    tempByBarangayId = simulateBarangayTemperatures(barangayFeatures, {
      centerLng: 125.4553,
      centerLat: 7.1907,
      ...tempRange
    });
    console.log('[getBarangayHeatData] Simulated', Object.keys(tempByBarangayId).length, 'temperatures');
  } else {
    console.log('[getBarangayHeatData] Using backend temps:', Object.keys(tempByBarangayId).length, 'barangays');
    console.log('[getBarangayHeatData] Sample backend IDs:', Object.keys(tempByBarangayId).slice(0, 5));
    console.log('[getBarangayHeatData] Sample backend temps:', Object.keys(tempByBarangayId).slice(0, 5).map(id => `${id}: ${tempByBarangayId[id]}°C`));
    
    // Check if GeoJSON IDs match backend IDs
    if (barangayFeatures?.length > 0) {
      const sampleFeature = barangayFeatures[0];
      const sampleId = sampleFeature.id ?? sampleFeature.properties?.adm4_psgc ?? sampleFeature.properties?.ADM4_PSGC;
      console.log('[getBarangayHeatData] Sample GeoJSON feature ID:', sampleId, 'Type:', typeof sampleId);
      console.log('[getBarangayHeatData] Backend has this ID?', String(sampleId) in tempByBarangayId);
    }
    
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
  console.log('[getBarangayHeatData] Generated', intensityPoints.length, 'intensity points');
  
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

/**
 * GET /api/heat/:cityId/barangay-population – Population and density per barangay (PSA + GeoJSON). Pipeline only.
 * Response: { populations: [ { barangay_id, population, density?, area? } ] }
 *
 * @param {string} [cityId]
 * @returns {Promise<Record<string, { population: number, density?: number, area?: number }> | null>}
 */
export async function fetchBarangayPopulation(cityId = 'davao') {
  const base = getApiBase();
  const url = base ? `${base}/api/heat/${cityId}/barangay-population` : `/api/heat/${cityId}/barangay-population`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    
    const populations = {};
    if (Array.isArray(data.populations)) {
      for (const p of data.populations) {
        const id = p.barangay_id ?? p.id;
        if (id != null && p.population != null) {
          populations[String(id)] = {
            population: p.population,
            density: p.density,
            area: p.area
          };
        }
      }
    }
    
    return populations;
  } catch {
    return null;
  }
}

/**
 * GET /api/heat/:cityId/pipeline-report/meta – Pipeline report metadata (updatedAt, disclaimer).
 * Response: { updatedAt, disclaimer?, generatedAt? }
 *
 * @param {string} [cityId]
 * @returns {Promise<{ updatedAt?: string, disclaimer?: string, generatedAt?: string } | null>}
 */
export async function getPipelineReportMeta(cityId = 'davao') {
  const base = getApiBase();
  const url = base ? `${base}/api/heat/${cityId}/pipeline-report/meta` : `/api/heat/${cityId}/pipeline-report/meta`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * GET /api/heat/:cityId/pipeline-report – Download pipeline report CSV. 404 if none.
 * Returns CSV content as text.
 *
 * @param {string} [cityId]
 * @returns {Promise<string | null>}
 */
export async function getPipelineReport(cityId = 'davao') {
  const base = getApiBase();
  const url = base ? `${base}/api/heat/${cityId}/pipeline-report` : `/api/heat/${cityId}/pipeline-report`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * POST /api/heat/:cityId/pipeline-report/generate – Generate pipeline report (heat + facilities, K-Means).
 * Response: { success: boolean, message?: string, reportId?: string }
 *
 * @param {string} [cityId]
 * @returns {Promise<{ success: boolean, message?: string, reportId?: string } | null>}
 */
export async function generatePipelineReport(cityId = 'davao') {
  const base = getApiBase();
  const url = base ? `${base}/api/heat/${cityId}/pipeline-report/generate` : `/api/heat/${cityId}/pipeline-report/generate`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    if (!res.ok) return { success: false, message: `HTTP ${res.status}` };
    return await res.json();
  } catch (err) {
    return { success: false, message: err?.message || String(err) };
  }
}

/**
 * POST /api/heat/:cityId/pipeline-report – Upload pipeline report CSV.
 * Body: text/csv; optional x-pipeline-report-key header if set.
 * Response: { success: boolean, message?: string }
 *
 * @param {string} csvContent
 * @param {{ cityId?: string, pipelineReportKey?: string }} [options]
 * @returns {Promise<{ success: boolean, message?: string } | null>}
 */
export async function uploadPipelineReport(csvContent, options = {}) {
  const { cityId = 'davao', pipelineReportKey = null } = options;
  
  if (typeof csvContent !== 'string' || csvContent.length === 0) {
    return { success: false, message: 'CSV content is required' };
  }
  
  const base = getApiBase();
  const url = base ? `${base}/api/heat/${cityId}/pipeline-report` : `/api/heat/${cityId}/pipeline-report`;
  
  try {
    const headers = new Headers({ 'Content-Type': 'text/csv' });
    if (pipelineReportKey != null) {
      headers.append('x-pipeline-report-key', String(pipelineReportKey));
    }
    
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: csvContent,
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return { success: false, message: `HTTP ${res.status}` };
    }
    
    try {
      return await res.json();
    } catch {
      return { success: true, message: 'Report uploaded successfully' };
    }
  } catch (err) {
    return { success: false, message: err?.message || String(err) };
  }
}
