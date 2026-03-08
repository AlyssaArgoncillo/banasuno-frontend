/**
 * Shared API base URL for backend (heat, facilities).
 * When VITE_USE_PROXY=true (e.g. in .env for local dev): return '' so fetch('/api/...') hits
 * same origin and Vite proxies to VITE_API_URL (e.g. http://localhost:3000) — no CORS.
 * Otherwise: return VITE_API_URL or LIVE_BACKEND_URL so requests go directly to the backend.
 * Production: set VITE_API_URL=https://banasuno-backend.vercel.app (and do not set VITE_USE_PROXY).
 */

const LIVE_BACKEND_URL = 'https://banasuno-backend.vercel.app';

export function getApiBase() {
  // Debug: log env values (production and dev)
  const env = typeof import.meta !== 'undefined' ? import.meta.env : {};
  console.log('[apiConfig] import.meta.env:', {
    VITE_USE_PROXY: env.VITE_USE_PROXY,
    VITE_API_URL: env.VITE_API_URL,
    MODE: env.MODE,
    DEV: env.DEV,
    PROD: env.PROD,
  });

  const useProxy = typeof import.meta !== 'undefined' && (import.meta.env?.VITE_USE_PROXY === 'true' || import.meta.env?.VITE_USE_PROXY === '1');
  if (useProxy) {
    console.log('[apiConfig] getApiBase: using proxy (returning "")');
    return '';
  }
  const raw = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL;
  const url = typeof raw === 'string' ? raw.trim().replace(/\/+$/, '') : '';
  const invalid = !url || url === 'undefined' || url === 'null';
  if (!invalid && (url.startsWith('http://') || url.startsWith('https://'))) {
    console.log('[apiConfig] getApiBase: resolved to VITE_API_URL:', url);
    return url;
  }
  console.log('[apiConfig] getApiBase: falling back to LIVE_BACKEND_URL:', LIVE_BACKEND_URL);
  return LIVE_BACKEND_URL;
}

const API_BASE = getApiBase();

/**
 * Ping backend root to verify connectivity (for UI status).
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function pingBackend() {
  const base = getApiBase();
  
  // Try new endpoint first
  const newUrl = base ? `${base}/api/heat/davao/current` : '/api/heat/davao/current';
  try {
    const res = await fetch(newUrl, { cache: 'no-store' });
    if (res.ok) return { ok: true };
    console.warn(`[apiConfig] New ping endpoint failed (${res.status}), trying fallback...`);
  } catch (err) {
    console.warn(`[apiConfig] New ping endpoint error, trying fallback...`);
  }
  
  // Fallback to old endpoint
  const fallbackUrl = base ? `${base}/api/heat/davao/average` : '/api/heat/davao/average';
  try {
    const res = await fetch(fallbackUrl, { cache: 'no-store' });
    if (res.ok) return { ok: true };
    return { ok: false, error: `HTTP ${res.status}` };
  } catch (err) {
    const msg = err?.message || String(err);
    return { ok: false, error: msg.includes('CORS') || msg.includes('Failed to fetch') ? 'Unreachable (check CORS for localhost)' : msg };
  }
}

export { API_BASE };
