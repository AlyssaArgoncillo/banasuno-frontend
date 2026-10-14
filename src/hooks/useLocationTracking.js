/**
 * Live device location tracking with permission handling.
 *
 * Status flow:
 *   checking    → reading current permission state (Permissions API)
 *   prompt      → permission not yet decided; show our own explainer + "Allow location" button
 *   requesting  → browser permission prompt is open / waiting for the first fix
 *   tracking    → receiving positions via watchPosition()
 *   denied      → user blocked location for this site
 *   unavailable → permission OK but no fix (GPS off, timeout, no signal)
 *   unsupported → browser has no geolocation, or page is not a secure context (HTTPS)
 *
 * If permission was already granted on a previous visit, tracking starts automatically.
 * Location stays on the device; nothing here sends it to a server.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

const WATCH_OPTIONS = { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 };

/** Why location can't work at all here, or null if it can. */
function unsupportedReason() {
  if (typeof window === 'undefined' || !window.isSecureContext) {
    return 'Location only works on a secure (HTTPS) connection.';
  }
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return 'This browser does not support location.';
  }
  return null;
}

/**
 * @returns {{
 *   status: 'checking'|'prompt'|'requesting'|'tracking'|'denied'|'unavailable'|'unsupported',
 *   position: { lat: number, lng: number, accuracy: number, timestamp: number } | null,
 *   errorMessage: string | null,
 *   start: () => void,
 *   stop: () => void,
 * }}
 */
export default function useLocationTracking() {
  const [status, setStatus] = useState(() => (unsupportedReason() ? 'unsupported' : 'checking'));
  const [position, setPosition] = useState(null);
  const [errorMessage, setErrorMessage] = useState(unsupportedReason);
  const watchIdRef = useRef(null);
  const hasFixRef = useRef(false);

  const stop = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (unsupportedReason()) return;
    stop();
    hasFixRef.current = false;
    setErrorMessage(null);
    setStatus('requesting');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
        hasFixRef.current = true;
        setPosition({ lat, lng, accuracy: Number.isFinite(accuracy) ? accuracy : null, timestamp: pos.timestamp });
        setStatus('tracking');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          stop();
          setStatus('denied');
          setErrorMessage('Location permission was blocked for this site.');
          return;
        }
        // Timeouts / signal loss after we already have a fix: keep showing the last position.
        if (hasFixRef.current) return;
        setStatus('unavailable');
        setErrorMessage(
          err.code === err.TIMEOUT
            ? 'Finding your location is taking too long. Check that Location/GPS is on.'
            : 'Your location could not be determined. Turn on Location/GPS and try again.'
        );
      },
      WATCH_OPTIONS
    );
  }, [stop]);

  // Read the current permission state once; auto-start if already granted.
  useEffect(() => {
    if (unsupportedReason()) return undefined;
    let permission = null;
    let cancelled = false;

    const apply = (state) => {
      if (cancelled) return;
      if (state === 'granted') {
        if (watchIdRef.current == null) start();
      } else if (state === 'denied') {
        stop();
        setStatus('denied');
        setErrorMessage('Location permission was blocked for this site.');
      } else {
        setStatus((s) => (s === 'checking' ? 'prompt' : s));
      }
    };
    const onChange = () => apply(permission?.state);

    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((p) => {
          permission = p;
          apply(p.state);
          p.addEventListener?.('change', onChange);
        })
        .catch(() => apply('prompt'));
    } else {
      // Older Safari: no Permissions API, so we can't know until we ask.
      Promise.resolve().then(() => apply('prompt'));
    }

    return () => {
      cancelled = true;
      permission?.removeEventListener?.('change', onChange);
      stop();
    };
  }, [start, stop]);

  return { status, position, errorMessage, start, stop };
}
