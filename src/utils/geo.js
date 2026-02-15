/**
 * GeoJSON / geometry helpers (pure functions, no I/O).
 * Used for map boundaries and heat point placement.
 */

/**
 * Get exterior ring from GeoJSON Polygon or MultiPolygon.
 * @param {import('geojson').Geometry} geometry
 * @returns {[number, number][] | null} Ring as [lng, lat][] or null
 */
export function getPolygonRing(geometry) {
  if (geometry == null || typeof geometry !== 'object') return null;
  if (geometry.type === 'Polygon' && geometry.coordinates?.[0]) {
    return geometry.coordinates[0];
  }
  if (geometry.type === 'MultiPolygon' && geometry.coordinates?.length) {
    return geometry.coordinates[0][0];
  }
  return null;
}

/**
 * Centroid of a ring (simple average of vertices). GeoJSON ring is [lng, lat][].
 * @param {[number, number][]} ring
 * @returns {[number, number]} [lng, lat]
 */
export function ringCentroid(ring) {
  let sumLng = 0;
  let sumLat = 0;
  let n = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [lng, lat] = ring[i];
    sumLng += lng;
    sumLat += lat;
    n += 1;
  }
  return n ? [sumLng / n, sumLat / n] : [0, 0];
}
