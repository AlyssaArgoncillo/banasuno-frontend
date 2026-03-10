/**
 * User location handling: browser geolocation → manual barangay (PSGC) → IP fallback.
 * Returns a unified object { source, lat, lng, accuracy, riskZone? } for frontend and backend.
 *
 * Usage:
 *   import { getUserLocation } from './api/userLocation.js';
 *   const loc = await getUserLocation({ barangayPsgc: '1130700014' });
 *   console.log(loc.source, loc.lat, loc.lng);
 */

const LOG_PREFIX = '[userLocation]';

/** IP geolocation provider (no API key required). */
const IP_GEOLOCATION_URL = 'https://ipapi.co/json/';

/**
 * Davao City only: barangay PSGC → approximate centroid [lat, lng].
 * Used when backend centroid API is unavailable. Add more Davao barangays as needed.
 * Source: GeoJSON boundaries / PSA; refine with real centroids.
 */
const BARANGAY_CENTROIDS = {
  '1130700014': [7.082, 125.458],   // Bato, Davao City
  '1130700001': [7.224, 125.492],   // Calinan, Davao City
  '1130700002': [7.073, 125.612],   // Poblacion, Davao City
};

/**
 * Resolve barangay PSGC to centroid (lat, lng).
 * Tries backend first (GET /api/boundaries/barangay/:psgc/centroid), then static map.
 *
 * @param {string|number} psgc - Barangay PSGC (e.g. 1130700014 for Bato).
 * @param {{ apiBase?: string }} [options] - Optional API base URL for centroid lookup.
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
export async function getBarangayCentroid(psgc, options = {}) {
  const id = String(psgc).trim();
  if (!id) {
    console.warn(LOG_PREFIX, 'getBarangayCentroid: empty psgc');
    return null;
  }

  const apiBase = (options.apiBase ?? '').replace(/\/+$/, '');

  if (apiBase) {
    try {
      const url = `${apiBase}/api/boundaries/barangay/${encodeURIComponent(id)}/centroid`;
      console.log(LOG_PREFIX, 'Fetching centroid:', url);
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const lat = data.lat ?? data.latitude;
        const lng = data.lng ?? data.longitude ?? data.lon;
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          console.log(LOG_PREFIX, 'Barangay centroid from API:', { psgc: id, lat, lng });
          return { lat, lng };
        }
      }
      console.warn(LOG_PREFIX, 'Barangay centroid API failed or invalid:', res.status);
    } catch (err) {
      console.warn(LOG_PREFIX, 'Barangay centroid API error:', err?.message);
    }
  }

  const coords = BARANGAY_CENTROIDS[id];
  if (coords && coords.length >= 2) {
    const [lat, lng] = coords;
    console.log(LOG_PREFIX, 'Barangay centroid from static map:', { psgc: id, lat, lng });
    return { lat, lng };
  }

  console.warn(LOG_PREFIX, 'No centroid for barangay:', id);
  return null;
}

/** Accuracy threshold in meters; we stop watching when we get a fix at least this good. */
const GOOD_ACCURACY_METERS = 30;

/** Max time to keep watching for a better fix (ms). */
const WATCH_TIMEOUT_MS = 20000;

/**
 * Get precise location via browser geolocation (GPS/Wi‑Fi).
 * Uses watchPosition() so accuracy can improve over the first few seconds;
 * resolves when accuracy < 30m or after 20s (returns best fix so far).
 * Always cleans up with clearWatch().
 *
 * @returns {Promise<{ lat: number, lng: number, accuracy: number }>}
 */
function getLocationByGeolocation() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      const err = new Error('Geolocation not supported');
      console.warn(LOG_PREFIX, err.message);
      reject(err);
      return;
    }

    let watchId = null;
    let best = null; // { lat, lng, accuracy }
    let settled = false;

    const clearAndResolve = (result) => {
      if (settled) return;
      settled = true;
      if (watchId != null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      resolve(result);
    };

    const clearAndReject = (err) => {
      if (settled) return;
      settled = true;
      if (watchId != null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      reject(err);
    };

    console.log(LOG_PREFIX, 'Watching for high-accuracy geolocation (target <', GOOD_ACCURACY_METERS, 'm)...');

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : Infinity;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        const isBetter = best == null || accuracy < best.accuracy;
        if (isBetter) {
          best = { lat, lng, accuracy };
          console.log(LOG_PREFIX, 'Geolocation update:', { lat, lng, accuracy: accuracy.toFixed(0) + 'm' });
        }

        if (accuracy <= GOOD_ACCURACY_METERS) {
          console.log(LOG_PREFIX, 'Good fix reached (<', GOOD_ACCURACY_METERS, 'm), stopping watch.');
          clearAndResolve({
            lat: best.lat,
            lng: best.lng,
            accuracy: best.accuracy,
          });
        }
      },
      (err) => {
        const code = err?.code ?? -1;
        const msg = err?.message ?? 'Unknown error';
        console.warn(LOG_PREFIX, 'Geolocation error:', { code, message: msg });
        if (best != null) {
          console.log(LOG_PREFIX, 'Returning best fix so far after error.');
          clearAndResolve({
            lat: best.lat,
            lng: best.lng,
            accuracy: best.accuracy,
          });
        } else {
          clearAndReject(err);
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );

    setTimeout(() => {
      if (settled) return;
      if (best != null) {
        console.log(LOG_PREFIX, 'Watch timeout: returning best fix after', WATCH_TIMEOUT_MS / 1000, 's.');
        clearAndResolve({
          lat: best.lat,
          lng: best.lng,
          accuracy: best.accuracy,
        });
      } else {
        console.warn(LOG_PREFIX, 'Watch timeout: no fix received.');
        clearAndReject(new Error('Location request timed out; no position received.'));
      }
    }, WATCH_TIMEOUT_MS);
  });
}

/**
 * Fallback: approximate location from IP (last resort; no accuracy radius).
 *
 * @returns {Promise<{ lat: number, lng: number }>}
 */
async function getLocationByIP() {
  console.log(LOG_PREFIX, 'Trying IP-based location...');
  const res = await fetch(IP_GEOLOCATION_URL, { cache: 'no-store' });
  if (!res.ok) {
    const err = new Error(`IP location unavailable: HTTP ${res.status}`);
    console.warn(LOG_PREFIX, err.message);
    throw err;
  }
  const data = await res.json();
  const lat = data.latitude;
  const lng = data.longitude;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    const err = new Error('Invalid IP location response');
    console.warn(LOG_PREFIX, err.message);
    throw err;
  }
  console.log(LOG_PREFIX, 'IP location success:', { lat, lng });
  return { lat, lng };
}

/**
 * Unified location result shape.
 * @typedef {{
 *   source: 'geolocation' | 'manual_barangay' | 'ip',
 *   lat: number,
 *   lng: number,
 *   accuracy: number | null,
 *   riskZone?: string,
 *   barangayPsgc?: string
 * }} UserLocationResult
 */

/**
 * Get user location with priority: geolocation → manual barangay (PSGC) → IP.
 * Returns a unified object suitable for frontend and backend.
 *
 * @param {{
 *   barangayPsgc?: string | number,
 *   apiBase?: string
 * }} [options] - If provided, barangayPsgc is used when geolocation is denied.
 * @returns {Promise<UserLocationResult>}
 * @throws Never throws; on total failure returns a best-effort result or throws only if IP and barangay both fail.
 */
export async function getUserLocation(options = {}) {
  const { barangayPsgc, apiBase } = options;

  // 1. Try browser geolocation first (GPS/Wi‑Fi)
  try {
    const geo = await getLocationByGeolocation();
    return {
      source: 'geolocation',
      lat: geo.lat,
      lng: geo.lng,
      accuracy: geo.accuracy,
      riskZone: undefined,
    };
  } catch (geoErr) {
    console.log(LOG_PREFIX, 'Geolocation denied or failed, trying fallbacks...');
  }

  // 2. Fallback: manual barangay (PSGC) if provided
  if (barangayPsgc != null && String(barangayPsgc).trim() !== '') {
    const centroid = await getBarangayCentroid(barangayPsgc, { apiBase });
    if (centroid) {
      return {
        source: 'manual_barangay',
        lat: centroid.lat,
        lng: centroid.lng,
        accuracy: null,
        riskZone: undefined,
        barangayPsgc: String(barangayPsgc).trim(),
      };
    }
    console.warn(LOG_PREFIX, 'Barangay centroid not found, falling back to IP');
  }

  // 3. Last resort: IP-based location
  try {
    const ip = await getLocationByIP();
    return {
      source: 'ip',
      lat: ip.lat,
      lng: ip.lng,
      accuracy: null,
      riskZone: undefined,
    };
  } catch (ipErr) {
    console.error(LOG_PREFIX, 'IP location failed:', ipErr?.message);
    throw new Error(
      'Unable to get location: geolocation denied or unavailable, and IP lookup failed. ' +
      'Allow browser location or choose a barangay.'
    );
  }
}

/**
 * Check if the environment supports browser geolocation (for UI hints).
 * @returns {boolean}
 */
export function isGeolocationSupported() {
  return typeof navigator !== 'undefined' && !!navigator?.geolocation;
}

/**
 * Check if we're in a secure context (HTTPS or localhost) so geolocation is allowed.
 * @returns {boolean}
 */
export function isSecureContext() {
  return typeof window !== 'undefined' && window.isSecureContext === true;
}

// ---------------------------------------------------------------------------
// Example usage (for reference; not executed when imported)
// ---------------------------------------------------------------------------
/*
  // Frontend (React/Vite):
  import { getUserLocation, getBarangayCentroid, isGeolocationSupported } from './api/userLocation.js';

  async function handleLocate() {
    try {
      const loc = await getUserLocation({
        barangayPsgc: '1130700014',  // Bato, Davao City
        apiBase: import.meta.env?.VITE_API_URL || '',
      });
      console.log('Location:', loc);
      // { source: 'geolocation'|'manual_barangay'|'ip', lat, lng, accuracy, riskZone? }
      setMapCenter([loc.lat, loc.lng]);
    } catch (e) {
      console.error(e.message);
    }
  }

  // Backend (Node) – only IP and manual barangay apply; no navigator:
  const loc = await getUserLocation({ barangayPsgc: '1130700014', apiBase: process.env.API_BASE });

  // Browser console one-liner (no barangay fallback):
  import('/src/api/userLocation.js').then(m => m.getUserLocation().then(console.log));
*/
