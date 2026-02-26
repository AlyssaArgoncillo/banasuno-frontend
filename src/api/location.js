/**
 * User location: high-accuracy geolocation, IP fallback, and manual correction.
 * Manual correction: caller can pass a selected barangay centroid (from map click or dropdown)
 * via setManualLocation / useManualLocation so the app uses that instead of device position.
 */

const IP_GEOLOCATION_URL = 'https://ipapi.co/json/';

/**
 * Get user location via browser geolocation (high accuracy).
 * @returns {Promise<{ lat: number, lon: number, accuracy: number, source: 'geolocation' }>}
 */
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          source: 'geolocation',
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

/**
 * Fallback: approximate location from IP (less accurate, no accuracy radius).
 * @returns {Promise<{ lat: number, lon: number, source: 'ip' }>}
 */
export async function getLocationByIP() {
  const res = await fetch(IP_GEOLOCATION_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('IP location unavailable');
  const data = await res.json();
  const lat = data.latitude;
  const lon = data.longitude;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error('Invalid IP location response');
  }
  return { lat, lon, source: 'ip' };
}

/**
 * Get user location with fallback: try geolocation first, then IP-based.
 * @returns {Promise<{ lat: number, lon: number, accuracy?: number, source: 'geolocation' | 'ip' }>}
 */
export async function getUserLocationWithFallback() {
  try {
    return await getUserLocation();
  } catch {
    return getLocationByIP();
  }
}

/**
 * Manual location state: when the user selects a barangay on the map or via dropdown,
 * set this so the app uses that centroid instead of device position.
 * Usage: call setManualLocation({ lat, lon, barangayId }) when user picks a barangay;
 * call clearManualLocation() when switching back to "use my location".
 */
let manualLocation = null;

export function setManualLocation(coords) {
  manualLocation = coords && Number.isFinite(coords.lat) && Number.isFinite(coords.lon)
    ? { lat: coords.lat, lon: coords.lon, barangayId: coords.barangayId }
    : null;
}

export function clearManualLocation() {
  manualLocation = null;
}

export function getManualLocation() {
  return manualLocation;
}

/**
 * Resolve effective location: manual selection if set, otherwise use the provided
 * device/fallback coords (e.g. from getUserLocationWithFallback).
 * @param {{ lat: number, lon: number } | null} deviceCoords
 * @returns {{ lat: number, lon: number, source: 'manual' | 'device', barangayId?: string } | null}
 */
export function getEffectiveLocation(deviceCoords) {
  if (manualLocation) {
    return {
      lat: manualLocation.lat,
      lon: manualLocation.lon,
      source: 'manual',
      barangayId: manualLocation.barangayId,
    };
  }
  if (deviceCoords && Number.isFinite(deviceCoords.lat) && Number.isFinite(deviceCoords.lon)) {
    return {
      lat: deviceCoords.lat,
      lon: deviceCoords.lon,
      source: 'device',
    };
  }
  return null;
}
