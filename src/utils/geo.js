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

/**
 * Ray-casting test: is [lng, lat] inside a closed ring ([lng, lat][])?
 * @param {number} lng
 * @param {number} lat
 * @param {[number, number][]} ring
 * @returns {boolean}
 */
function pointInRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Is [lng, lat] inside a GeoJSON Polygon or MultiPolygon (holes respected)?
 * @param {number} lng
 * @param {number} lat
 * @param {import('geojson').Geometry} geometry
 * @returns {boolean}
 */
export function pointInGeometry(lng, lat, geometry) {
  if (geometry == null || typeof geometry !== 'object') return false;
  const polygons =
    geometry.type === 'Polygon' ? [geometry.coordinates]
      : geometry.type === 'MultiPolygon' ? geometry.coordinates
        : [];
  return polygons.some(
    (rings) =>
      rings?.length &&
      pointInRing(lng, lat, rings[0]) &&
      !rings.slice(1).some((hole) => pointInRing(lng, lat, hole))
  );
}

/**
 * Great-circle distance in meters between two lat/lng points.
 * @returns {number}
 */
export function haversineMeters(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Find the barangay feature containing a point. When the point falls outside every
 * polygon (low-res boundaries miss some edges), returns the nearest barangay by centroid
 * within `nearMeters`, flagged with `inside: false`.
 *
 * @param {import('geojson').Feature[]} features - Barangay features
 * @param {number} lat
 * @param {number} lng
 * @param {{ nearMeters?: number }} [options]
 * @returns {{ feature: import('geojson').Feature, inside: boolean, distanceMeters: number } | null}
 */
export function findBarangayAt(features, lat, lng, { nearMeters = 2000 } = {}) {
  if (!Array.isArray(features) || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const containing = features.find((f) => pointInGeometry(lng, lat, f.geometry));
  if (containing) return { feature: containing, inside: true, distanceMeters: 0 };

  let nearest = null;
  for (const f of features) {
    const ring = getPolygonRing(f.geometry);
    if (!ring) continue;
    const [cLng, cLat] = ringCentroid(ring);
    const d = haversineMeters(lat, lng, cLat, cLng);
    if (!nearest || d < nearest.distanceMeters) nearest = { feature: f, inside: false, distanceMeters: d };
  }
  return nearest && nearest.distanceMeters <= nearMeters ? nearest : null;
}
