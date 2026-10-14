/**
 * Main interface / home page.
 * Entry point after landing: sidebar (Dashboard, Heat Map, About Us) + main content.
 * Before the map appears, users are asked for location permission. Once granted (or a barangay
 * is picked, or the user skips), the main interface opens and the live position is pinned on the map.
 */

import { useEffect, useMemo, useState } from 'react';
import MainInterface from '../components/main-interface/MainInterface';
import {
  LocationProblem,
  LocationShell,
  PermissionPrompt,
  Requesting,
} from '../components/location/LocationScreens.jsx';
import useLocationTracking from '../hooks/useLocationTracking.js';
import { fetchBarangayBoundaries } from '../services/boundariesService.js';
import { getPolygonRing, ringCentroid } from '../utils/geo.js';

/** Remember "Not now" for this browser tab so the gate doesn't reappear on every visit to /home. */
const SKIP_KEY = 'banasuno.locationGateSkipped';

function readSkipped() {
  try {
    return sessionStorage.getItem(SKIP_KEY) === '1';
  } catch {
    return false;
  }
}

function HomePage() {
  const { status, position, errorMessage, start, stop } = useLocationTracking();
  const [skipped, setSkipped] = useState(readSkipped);
  const [manualFeature, setManualFeature] = useState(null);
  const [features, setFeatures] = useState(null);
  const [entered, setEntered] = useState(false);

  // Barangay list is only needed for the manual picker when device location fails.
  const needsPicker = status === 'denied' || status === 'unavailable' || status === 'unsupported';
  useEffect(() => {
    if (!needsPicker || features) return undefined;
    let cancelled = false;
    fetchBarangayBoundaries()
      .then((geo) => { if (!cancelled) setFeatures(geo?.features ?? []); })
      .catch(() => { if (!cancelled) setFeatures([]); });
    return () => { cancelled = true; };
  }, [needsPicker, features]);

  const manualLocation = useMemo(() => {
    const ring = getPolygonRing(manualFeature?.geometry);
    if (!ring) return null;
    const [lng, lat] = ringCentroid(ring);
    return { lat, lng, accuracy: null, source: 'manual' };
  }, [manualFeature]);

  const userLocation =
    manualLocation ?? (status === 'tracking' && position ? { ...position, source: 'device' } : null);

  // Once the user is through the gate, keep them on the map even if location later drops.
  if (!entered && (skipped || userLocation)) setEntered(true);

  const skip = () => {
    try {
      sessionStorage.setItem(SKIP_KEY, '1');
    } catch {
      // Storage blocked (private mode): skipping still works for this page view.
    }
    setSkipped(true);
  };

  const pickBarangay = (feature) => {
    stop();
    setManualFeature(feature);
  };

  if (entered) return <MainInterface userLocation={userLocation} />;

  let body;
  if (status === 'checking') {
    body = <section className="alert-card alert-center"><div className="alert-spinner" aria-label="Loading" /></section>;
  } else if (status === 'prompt') {
    body = <PermissionPrompt onAllow={start} onSkip={skip} />;
  } else if (status === 'requesting' || status === 'tracking') {
    body = <Requesting onSkip={skip} />;
  } else {
    body = (
      <LocationProblem
        status={status}
        errorMessage={errorMessage}
        onRetry={start}
        features={features}
        onPick={pickBarangay}
        onSkip={skip}
      />
    );
  }
  return <LocationShell>{body}</LocationShell>;
}

export default HomePage;
