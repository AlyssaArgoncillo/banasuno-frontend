/**
 * Health facilities near a barangay.
 * Backend: GET /api/facilities/by-barangay/:barangayId (banasuno-backend).
 * Response: { barangayId, total, facilities: [ { id, name, facility_type, lat, lng, barangay_id, source, ownership } ] }.
 */

import { getApiBase } from './apiConfig.js';

/** Haversine approx distance in km (for ordering when center provided). */
function distanceKm(lat1, lng1, lat2, lng2) {
  if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Map raw API facility to UI shape and attach distance from center. */
function mapFacilitiesWithDistance(list, center) {
  return list.map((f) => {
    const lat = f.lat ?? f.latitude;
    const lng = f.lng ?? f.longitude;
    const km = (center.lat != null && center.lng != null && lat != null && lng != null)
      ? distanceKm(center.lat, center.lng, lat, lng)
      : null;
    return {
      id: String(f.id ?? ''),
      name: f.name ?? '',
      address: f.address ?? (lat != null && lng != null ? `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}` : undefined),
      facility_type: f.facility_type,
      distance: km != null ? `${km.toFixed(1)} km` : undefined,
      _distanceKm: km
    };
  });
}

/** Sort by distance and strip internal _distanceKm. */
function sortByDistanceAndClean(list) {
  list.sort((a, b) => (a._distanceKm ?? Infinity) - (b._distanceKm ?? Infinity));
  return list.map(({ _distanceKm, ...rest }) => rest);
}

const NEARBY_FALLBACK_LIMIT = 15;
const NEARBY_FETCH_LIMIT = 300;

/**
 * Fetch health facilities for a barangay.
 * Uses GET /api/facilities/by-barangay/:barangayId when API_BASE set.
 * If the barangay has no facilities but center (lat/lng) is provided, returns the nearest facilities in the area from GET /api/facilities.
 *
 * @param {string|number} [barangayId] - Barangay PSGC (e.g. 1130700001)
 * @param {{ lat: number, lng: number }} [center] - Optional; used to sort by distance and add distance label; required for nearby fallback
 * @returns {Promise<{ facilities: Array<{ id: string, name: string, address?: string, distance?: string, facility_type?: string }>, isNearbyFallback: boolean }>}
 */
function apiUrl(path) {
  const base = getApiBase();
  return base ? `${base}${path}` : path;
}

export async function getHealthFacilitiesNearBarangay(barangayId, center = {}) {
  const empty = { facilities: [], isNearbyFallback: false };

  if (barangayId != null) {
    try {
      const id = String(barangayId);
      const res = await fetch(apiUrl(`/api/facilities/by-barangay/${encodeURIComponent(id)}`), { cache: 'no-store' });
      if (!res.ok) {
        if (center.lat != null && center.lng != null) return fetchNearestInArea(center);
        return empty;
      }
      const data = await res.json();
      let list = Array.isArray(data.facilities) ? data.facilities : [];
      if (list.length > 0) {
        list = mapFacilitiesWithDistance(list, center);
        return { facilities: sortByDistanceAndClean(list), isNearbyFallback: false };
      }
      if (center.lat != null && center.lng != null) return fetchNearestInArea(center);
      return empty;
    } catch {
      if (center.lat != null && center.lng != null) return fetchNearestInArea(center);
      return empty;
    }
  }
  return empty;
}

/**
 * Fetch nearest facilities in the area by lat/lng (used when barangay has none).
 * GET /api/facilities?limit=N then sort by distance from center.
 */
async function fetchNearestInArea(center) {
  try {
    const res = await fetch(apiUrl(`/api/facilities?limit=${NEARBY_FETCH_LIMIT}`), { cache: 'no-store' });
    if (!res.ok) return { facilities: [], isNearbyFallback: false };
    const data = await res.json();
    let list = Array.isArray(data.facilities) ? data.facilities : [];
    list = mapFacilitiesWithDistance(list, center);
    list = sortByDistanceAndClean(list).slice(0, NEARBY_FALLBACK_LIMIT);
    return { facilities: list, isNearbyFallback: list.length > 0 };
  } catch {
    return { facilities: [], isNearbyFallback: false };
  }
}
