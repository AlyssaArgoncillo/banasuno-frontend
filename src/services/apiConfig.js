/**
 * Shared API base URL for backend (heat, facilities).
 * Default: live Vercel backend (banasuno-backend.vercel.app).
 * Override in .env with VITE_API_URL (e.g. http://localhost:3000 for local backend).
 * Restart dev server after changing .env.
 */

const LIVE_BACKEND_URL = 'https://banasuno-backend.vercel.app';

export function getApiBase() {
  // In dev, use relative URL so Vite proxy forwards /api to backend (avoids CORS).
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) return '';
  const raw = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL;
  const url = typeof raw === 'string' ? raw.trim().replace(/\/+$/, '') : '';
  const invalid = !url || url === 'undefined' || url === 'null';
  if (!invalid && (url.startsWith('http://') || url.startsWith('https://'))) return url;
  return LIVE_BACKEND_URL;
}

const API_BASE = getApiBase();

/**
 * Ping backend root to verify connectivity (for UI status).
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function pingBackend() {
  const base = getApiBase();
  const url = base ? `${base}/api/heat/davao/average` : '/api/heat/davao/average';
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) return { ok: true };
    return { ok: false, error: `HTTP ${res.status}` };
  } catch (err) {
    const msg = err?.message || String(err);
    return { ok: false, error: msg.includes('CORS') || msg.includes('Failed to fetch') ? 'Unreachable (check CORS for localhost)' : msg };
  }
}

export { API_BASE };
