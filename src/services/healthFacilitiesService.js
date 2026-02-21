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

/**
 * Fetch a single facility by ID.
 * GET /api/facilities/:id
 * Response: { id, name, facility_type, lat, lng, barangay_id, source, ownership, address? }
 *
 * @param {string|number} facilityId
 * @returns {Promise<{ id: string, name: string, facility_type?: string, lat?: number, lng?: number, barangay_id?: string, source?: string, ownership?: string, address?: string } | null>}
 */
export async function getFacilityById(facilityId) {
  if (facilityId == null) return null;
  try {
    const id = String(facilityId);
    const res = await fetch(apiUrl(`/api/facilities/${encodeURIComponent(id)}`), { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data !== 'object') return null;
    
    return {
      id: String(data.id ?? ''),
      name: data.name ?? '',
      facility_type: data.facility_type,
      lat: data.lat ?? data.latitude,
      lng: data.lng ?? data.longitude,
      barangay_id: data.barangay_id,
      source: data.source,
      ownership: data.ownership,
      address: data.address
    };
  } catch {
    return null;
  }
}

/**
 * Fetch multiple facilities with optional filters.
 * GET /api/facilities?type=...&source=...&ownership=...&name=...&limit=...&offset=...
 * Response: { facilities: [...], total: number }
 *
 * @param {{ type?: string, source?: string, ownership?: string, name?: string, limit?: number, offset?: number }} [options]
 * @returns {Promise<{ facilities: Array<{ id: string, name: string, facility_type?: string, lat?: number, lng?: number, address?: string }>, total: number } | null>}
 */
export async function listFacilities(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.type) params.append('type', options.type);
    if (options.source) params.append('source', options.source);
    if (options.ownership) params.append('ownership', options.ownership);
    if (options.name) params.append('name', options.name);
    if (options.limit != null) params.append('limit', String(options.limit));
    if (options.offset != null) params.append('offset', String(options.offset));
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(apiUrl(`/api/facilities${queryString}`), { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    
    const facilities = Array.isArray(data.facilities) ? data.facilities.map(f => ({
      id: String(f.id ?? ''),
      name: f.name ?? '',
      facility_type: f.facility_type,
      lat: f.lat ?? f.latitude,
      lng: f.lng ?? f.longitude,
      address: f.address
    })) : [];
    
    return {
      facilities,
      total: data.total ?? facilities.length
    };
  } catch {
    return null;
  }
}

/**
 * Fetch facility type summary.
 * GET /api/types
 * Response: { types: [ { type_name, count, ... } ] }
 *
 * @returns {Promise<Array<{ type_name: string, count: number }> | null>}
 */
export async function getFacilityTypes() {
  try {
    const res = await fetch(apiUrl('/api/types'), { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data.types) ? data.types : null;
  } catch {
    return null;
  }
}

/**
 * Fetch facility counts for multiple barangays (batch operation, for AI pipeline).
 * POST /api/facilities/counts-by-barangays
 * Body: { barangayIds: [ ... ] }
 * Response: { counts: { [barangayId]: number } }
 *
 * @param {string[]|number[]} barangayIds
 * @returns {Promise<Record<string, number> | null>}
 */
export async function getFacilityCountsByBarangays(barangayIds = []) {
  if (!Array.isArray(barangayIds) || barangayIds.length === 0) return null;
  try {
    const res = await fetch(apiUrl('/api/facilities/counts-by-barangays'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barangayIds: barangayIds.map(id => String(id)) }),
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.counts && typeof data.counts === 'object') ? data.counts : null;
  } catch {
    return null;
  }
}
