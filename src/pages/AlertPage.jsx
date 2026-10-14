/**
 * SMS landing page (/alert).
 * Users open this from the link in a BanasUno heat SMS. It asks for location permission,
 * tracks the device live, and resolves which Davao barangay the user is in.
 * Next phase: show temperature, nearby clinics + routes, risks and remedies for that spot.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useLocationTracking from '../hooks/useLocationTracking.js';
import { fetchBarangayBoundaries } from '../services/boundariesService.js';
import { findBarangayAt, getPolygonRing, ringCentroid } from '../utils/geo.js';
import { getBarangayName } from '../utils/heatMap.js';
import {
  LocationProblem,
  LocationShell,
  PermissionPrompt,
  PinIcon,
  Requesting,
} from '../components/location/LocationScreens.jsx';

const UPCOMING = [
  { title: 'Temperature & heat level', body: 'Current heat index where you are.' },
  { title: 'Nearby clinics & routes', body: 'Closest health facilities and how to get there.' },
  { title: 'Health risks', body: 'What this heat level can do to your body.' },
  { title: 'Remedies', body: 'What to do right now to stay safe.' },
];


function formatAgo(timestamp, now) {
  const s = Math.max(0, Math.round((now - timestamp) / 1000));
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  return `${m} min ago`;
}

/** Small Leaflet map that follows the user's position with an accuracy circle. */
function LiveMap({ lat, lng, accuracy }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    const L = window.L;
    if (!L || !containerRef.current) return undefined;
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
      dragging: true,
      scrollWheelZoom: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = window.L;
    const map = mapRef.current;
    if (!L || !map) return;
    const latlng = [lat, lng];
    if (!markerRef.current) {
      markerRef.current = L.marker(latlng, {
        icon: L.divIcon({ className: 'alert-map-dot', html: '<span></span>', iconSize: [20, 20] }),
        keyboard: false,
      }).addTo(map);
      circleRef.current = L.circle(latlng, {
        radius: accuracy ?? 0,
        color: '#FF6B1A',
        weight: 1,
        fillOpacity: 0.12,
      }).addTo(map);
      map.setView(latlng, 16);
    } else {
      markerRef.current.setLatLng(latlng);
      circleRef.current.setLatLng(latlng).setRadius(accuracy ?? 0);
      map.panTo(latlng, { animate: true });
    }
  }, [lat, lng, accuracy]);

  if (typeof window !== 'undefined' && !window.L) return null;
  return <div ref={containerRef} className="alert-map" role="img" aria-label="Map showing your current location" />;
}

/** Fallback when device location isn't available: pick a barangay instead. */

function LocationSummary({ location, match, barangaysLoading, live, now, onUseDevice }) {
  let place;
  if (barangaysLoading) place = 'Identifying your barangay…';
  else if (!match) place = 'Outside Davao City';
  else place = `${match.inside ? '' : 'Near '}${getBarangayName(match.feature)}`;

  return (
    <section className="alert-card alert-located">
      <div className="alert-located-head">
        <span className={`alert-live ${live ? 'is-live' : ''}`}>
          <span className="alert-live-dot" aria-hidden />
          {live ? 'Live location' : 'Chosen barangay'}
        </span>
        {live && location.timestamp && (
          <span className="alert-updated">Updated {formatAgo(location.timestamp, now)}</span>
        )}
      </div>
      <p className="alert-kicker">You are in</p>
      <h1 className="alert-place">{place}</h1>
      {!barangaysLoading && !match && (
        <p className="alert-note">BanasUno currently covers Davao City barangays only.</p>
      )}

      <LiveMap lat={location.lat} lng={location.lng} accuracy={live ? location.accuracy : null} />

      <dl className="alert-meta">
        <div>
          <dt>Coordinates</dt>
          <dd>{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</dd>
        </div>
        {live && Number.isFinite(location.accuracy) && (
          <div>
            <dt>Accuracy</dt>
            <dd>±{Math.round(location.accuracy)} m</dd>
          </div>
        )}
      </dl>
      {!live && onUseDevice && (
        <button type="button" className="alert-btn alert-btn-ghost" onClick={onUseDevice}>
          <PinIcon width={16} height={16} /> Use my device location instead
        </button>
      )}
    </section>
  );
}

function UpcomingReport() {
  return (
    <section className="alert-card alert-upcoming" aria-label="Your heat report">
      <h2 className="alert-subtitle">Your heat report</h2>
      <ul>
        {UPCOMING.map((item) => (
          <li key={item.title}>
            <div>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </div>
            <span className="alert-tag">Coming soon</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AlertPage() {
  const { status, position, errorMessage, start, stop } = useLocationTracking();
  const [features, setFeatures] = useState(null);
  const [manualFeature, setManualFeature] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    fetchBarangayBoundaries()
      .then((geo) => { if (!cancelled) setFeatures(geo?.features ?? []); })
      .catch(() => { if (!cancelled) setFeatures([]); });
    return () => { cancelled = true; };
  }, []);

  // Re-render periodically so "Updated Xs ago" stays fresh.
  useEffect(() => {
    if (status !== 'tracking') return undefined;
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, [status]);

  const manualLocation = useMemo(() => {
    const ring = getPolygonRing(manualFeature?.geometry);
    if (!ring) return null;
    const [lng, lat] = ringCentroid(ring);
    return { lat, lng, accuracy: null, timestamp: null };
  }, [manualFeature]);

  const live = !manualLocation && status === 'tracking' && position != null;
  const location = manualLocation ?? (live ? position : null);

  const match = useMemo(() => {
    if (manualFeature) return { feature: manualFeature, inside: true, distanceMeters: 0 };
    if (!location || !features) return null;
    return findBarangayAt(features, location.lat, location.lng);
  }, [manualFeature, features, location]);

  const pickBarangay = (feature) => {
    stop();
    setManualFeature(feature);
  };
  const switchToDevice = () => {
    setManualFeature(null);
    start();
  };

  let body;
  if (location) {
    body = (
      <>
        <LocationSummary
          location={location}
          match={match}
          barangaysLoading={!manualFeature && features == null}
          live={live}
          now={now}
          onUseDevice={status === 'unsupported' ? null : switchToDevice}
        />
        <UpcomingReport />
      </>
    );
  } else if (status === 'checking') {
    body = <section className="alert-card alert-center"><div className="alert-spinner" aria-label="Loading" /></section>;
  } else if (status === 'prompt') {
    body = <PermissionPrompt onAllow={start} />;
  } else if (status === 'requesting' || status === 'tracking') {
    body = <Requesting />;
  } else {
    body = (
      <LocationProblem
        status={status}
        errorMessage={errorMessage}
        onRetry={start}
        features={features}
        onPick={pickBarangay}
      />
    );
  }

  return (
    <LocationShell footer={<Link to="/home">Open the full Davao heat map →</Link>}>
      {body}
    </LocationShell>
  );
}
