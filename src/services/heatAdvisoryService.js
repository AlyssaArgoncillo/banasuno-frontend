/**
 * Heat Advisory API – single source of truth: POST /api/heat-advisory
 * Contract: docs/GEMINI_HEAT_ADVISORY_UI_AND_BACKEND_SETUP.md and Frontend/Backend API Contract.
 *
 * Request: Always send the selected zone's risk_level (1–5) and risk_label (e.g. "Caution", "Extreme Caution"),
 * not a fixed default. Do not send risk_level: 1 when the user has selected a barangay with a different level.
 * Call only once per user action; reuse cached response when selection unchanged. Do not retry immediately on 429.
 */

import { getApiBase } from './apiConfig.js';

/**
 * Fetch AI-generated heat advisory from backend (Gemini).
 * POST /api/heat-advisory with JSON body. Backend also supports GET with same query params (risk_level, risk_label, barangay_id, barangay_name, temperature_c).
 * Use the same values as the gauge/header: selectedZone.riskLevel.level, selectedZone.riskLevel.label.
 *
 * Request body (snake_case or camelCase): barangay_id, barangay_name (optional), risk_level (1–5), risk_label, temperature_c (optional).
 * Response: tagline, advices (array of { title, body }), risk_level, risk_label, barangay_name, generated_at.
 * Caller must validate response.risk_level and response.risk_label match the selection before rendering.
 *
 * @param {{
 *   barangay_id?: string;
 *   barangayId?: string;
 *   barangay_name?: string;
 *   barangayName?: string;
 *   risk_level?: number;
 *   riskLevel?: number;
 *   risk_label?: string;
 *   riskLabel?: string;
 *   temperature_c?: number;
 *   temperatureC?: number;
 * }} params - risk_level and risk_label from current selection (e.g. selectedZone.riskLevel); do not send a constant default.
 * @returns {Promise<{ tagline: string; advices: Array<{ title: string; body: string }>; risk_level?: number; risk_label?: string; barangay_name?: string | null; generated_at?: string } | null>}
 */
export async function fetchHeatAdvisory(params = {}) {
  const base = getApiBase();
  const url = base ? `${base}/api/heat-advisory` : '/api/heat-advisory';

  const body = {};
  const barangayId = params.barangay_id ?? params.barangayId;
  const barangayName = params.barangay_name ?? params.barangayName;
  const riskLevel = params.risk_level ?? params.riskLevel;
  const riskLabel = params.risk_label ?? params.riskLabel;
  const temperatureC = params.temperature_c ?? params.temperatureC;
  if (barangayId != null && barangayId !== '') body.barangay_id = String(barangayId);
  if (barangayName != null && barangayName !== '') body.barangay_name = String(barangayName);
  if (riskLevel != null && Number.isFinite(riskLevel)) body.risk_level = Number(riskLevel);
  if (riskLabel != null && riskLabel !== '') body.risk_label = String(riskLabel);
  if (temperatureC != null && Number.isFinite(temperatureC)) body.temperature_c = Number(temperatureC);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      if (process.env.NODE_ENV === 'development') {
        console.warn('[heatAdvisoryService]', res.status, errBody?.error ?? res.statusText, errBody?.details ?? '');
      }
      // Do not retry in a loop on 429 or other errors; caller shows fallback. If retry is ever added, wait at least 1–2 minutes.
      return null;
    }

    const data = await res.json();
    if (!data || typeof data.tagline !== 'string' || !Array.isArray(data.advices)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[heatAdvisoryService] Invalid response shape: missing tagline or advices');
      }
      return null;
    }

    return {
      tagline: data.tagline,
      advices: data.advices.map((a) => ({
        title: a?.title ?? '',
        body: a?.body ?? '',
      })),
      risk_level: data.risk_level ?? data.riskLevel,
      risk_label: data.risk_label ?? data.riskLabel ?? null,
      barangay_name: data.barangay_name ?? data.barangayName ?? null,
      generated_at: data.generated_at ?? data.generatedAt,
    };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[heatAdvisoryService] Request failed:', err?.message ?? err);
    }
    return null;
  }
}
