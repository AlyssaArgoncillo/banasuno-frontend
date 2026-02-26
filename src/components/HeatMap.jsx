import React, { startTransition, useEffect, useRef, useState } from 'react';
import '../styles/HeatMap.css';
import { fetchDavaoBoundaries } from '../services/boundariesService.js';
import { getBarangayHeatData } from '../services/heatService.js';
import { getHealthFacilitiesNearBarangay } from '../services/healthFacilitiesService.js';
import { geocodeQuery } from '../services/geocodeService.js';
import { getPolygonRing, ringCentroid } from '../utils/geo.js';
import { getBarangayId, getColorForTemp, tempToHeatRiskLevel, HEAT_RISK_LEVELS } from '../utils/heatMap.js';
import { getUserLocationWithFallback, setManualLocation } from '../api/location.js';
import { fetchAccessibility } from '../api/ors.js';
import ZoneInfoCard from './ZoneInfoCard.jsx';

/* global L */

const HeatMap = ({ compact = false, selectedZone: propSelectedZone, onZoneSelected, onGoToDashboard }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const barangayLayerRef = useRef(null);
  const heatDataRef = useRef({ tempByBarangayId: null, tempMin: 26, tempMax: 39 });
  const barangayFeaturesRef = useRef([]);
  const locationMarkerRef = useRef(null);
  const facilitiesRequestSeqRef = useRef(0);
  const lastPolygonClickTimeRef = useRef(0);
  const cancelledRef = useRef(false);
  const [zoomPercentage, setZoomPercentage] = useState(100);
  const [mapLoading, setMapLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tempRange, setTempRange] = useState({ min: 26, max: 39 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);
  const [accessibilityData, setAccessibilityData] = useState(null);
  const zoneInfoCardRef = useRef(null);
  const resizeCleanupRef = useRef(null);
  const compactRef = useRef(compact);
  compactRef.current = compact;
  const showDeviceLocation = searchQuery.trim().length > 0;
  const errorDismissTimeoutRef = useRef(null);



  const setLocationError = (message) => {
    if (errorDismissTimeoutRef.current) clearTimeout(errorDismissTimeoutRef.current);
    setError(message);
    errorDismissTimeoutRef.current = setTimeout(() => {
      setError(null);
      errorDismissTimeoutRef.current = null;
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (errorDismissTimeoutRef.current) clearTimeout(errorDismissTimeoutRef.current);
    };
  }, []);

  const setLocationIndicator = (lat, lng) => {
    const map = mapInstanceRef.current;
    if (locationMarkerRef.current && map) {
      map.removeLayer(locationMarkerRef.current);
      locationMarkerRef.current = null;
    }
    if (lat != null && lng != null && map) {
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'heatmap-location-indicator',
          html: '<span class="heatmap-location-pin" aria-hidden="true"></span>',
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        })
      }).addTo(map);
      locationMarkerRef.current = marker;
    }
  };

  const handleSearchLocation = () => {
    const q = searchQuery.trim();
    if (!q) return;
    const map = mapInstanceRef.current;
    if (!map) return;
    const features = barangayFeaturesRef.current || [];
    const normalized = q.toLowerCase();
    const match = features.find((f) => {
      const name = (f.properties?.adm4_en ?? f.properties?.name ?? '').toLowerCase();
      return name && (name === normalized || name.includes(normalized) || normalized.includes(name));
    });
    if (match) {
      const ring = getPolygonRing(match.geometry);
      if (ring && ring.length >= 3) {
        const [lng, lat] = ringCentroid(ring);
        setLocationIndicator(lat, lng);
        map.flyTo([lat, lng], 14, { duration: 0.6 });
        setError(null);
        return;
      }
    }
    setError(null);
    geocodeQuery(q).then((result) => {
      if (!mapInstanceRef.current || !result) {
        setLocationError('Location not found. Try a barangay name or address in Davao City.');
        return;
      }
      setLocationIndicator(result.lat, result.lng);
      mapInstanceRef.current.flyTo([result.lat, result.lng], 15, { duration: 0.6 });
    });
  };

  /** Device location: high-accuracy first, then IP fallback. Used only to center the map and show a pin. Not stored or sent to any server. */
  const handleUseDeviceLocation = async () => {
    if (!window.isSecureContext) {
      setLocationError('Location is only available on secure connections (HTTPS or localhost).');
      return;
    }
    const message = 'Allow this site to use your location to show it on the map? Your location is not stored or sent to any server.';
    if (!window.confirm(message)) return;
    setError(null);

    try {
      const loc = await getUserLocationWithFallback();
      const lat = loc.lat;
      const lng = loc.lon;
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        setLocationError('Invalid location result. Please try again.');
        return;
      }
      const map = mapInstanceRef.current;
      if (map) {
        setLocationIndicator(lat, lng);
        map.flyTo([lat, lng], 17, { duration: 0.5 });
        if (loc.source === 'ip') {
          setLocationError('Using approximate location (from IP). For better accuracy, allow browser location or search for your barangay.');
        }
      }
    } catch (err) {
      const code = err?.code;
      if (code === 1) {
        setLocationError('Location denied. Enable location permission for this site and try again.');
      } else if (code === 2) {
        setLocationError('Location unavailable. Turn on Location Services, or use the search bar to find a place.');
      } else if (code === 3) {
        setLocationError('Location request timed out. Try again or use the search bar.');
      } else {
        setLocationError('Location unavailable. Try the search bar to find a place on the map.');
      }
    }
  };

  useEffect(() => {
    const container = mapRef.current;
    if (!container || !container.parentElement || mapInstanceRef.current) return;

    if (typeof window.L === 'undefined') {
      setError(new Error('Map library is still loading. Please refresh the page.'));
      return;
    }
    const L = window.L;

    cancelledRef.current = false;
    setError(null);

    // Defer map init until after layout so the container has final dimensions (fixes missing tile chunks)
    const id = requestAnimationFrame(() => {
      if (cancelledRef.current || !mapRef.current) return;
      const c = mapRef.current;
      const map = L.map(c, {
        zoomControl: false,
        attributionControl: false
      }).setView([7.1907, 125.4553], 11);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        maxNativeZoom: 19
      }).addTo(map);

      const refreshTiles = () => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      };
      map.whenReady(() => {
        if (cancelledRef.current) return;
        const tilePane = map.getPane('tilePane');
        if (tilePane) tilePane.style.zIndex = '0';
        refreshTiles();
        setTimeout(refreshTiles, 150);
      });
      window.addEventListener('resize', refreshTiles);
      resizeCleanupRef.current = () => {
        window.removeEventListener('resize', refreshTiles);
      };

      fetchDavaoBoundaries()
      .then(async ({ barangayGeojson }) => {
        if (cancelledRef.current || !mapInstanceRef.current) return;

        const barangayFeatures = barangayGeojson.features || [];
        if (!barangayFeatures.length) throw new Error('No barangay districts found');
        barangayFeaturesRef.current = barangayFeatures;

        const mapInstance = mapInstanceRef.current;
        if (!mapInstance.getContainer()?.parentElement) return;

        const { tempMin, tempMax, tempByBarangayId } = await getBarangayHeatData(barangayFeatures);
        if (cancelledRef.current || !mapInstanceRef.current) return;

        heatDataRef.current = { tempByBarangayId, tempMin, tempMax };
        if (!cancelledRef.current) setTempRange({ min: tempMin, max: tempMax });

        const barangayLayer = L.geoJSON(barangayGeojson, {
          style: (feature) => {
            const id = getBarangayId(feature);
            const temp = tempByBarangayId != null && id != null ? tempByBarangayId[id] : null;
            if (temp == null || !Number.isFinite(temp)) {
              return {
                color: 'rgba(26, 54, 93, 0.3)',
                weight: 1,
                fillColor: '#e2e8f0',
                fillOpacity: 0.3
              };
            }
            const fillColor = getColorForTemp(temp);
            return {
              fillColor,
              fillOpacity: 0.38,
              color: 'rgba(26, 54, 93, 0.4)',
              weight: 1
            };
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              const now = Date.now();
              if (now - lastPolygonClickTimeRef.current < 120) return;
              lastPolygonClickTimeRef.current = now;

              const id = getBarangayId(feature);
              const name = feature.properties?.adm4_en ?? feature.properties?.name ?? 'Barangay';
              const { tempByBarangayId: temps } = heatDataRef.current;
              const temp = temps != null && id != null ? (temps[id] ?? temps[String(id)]) : null;
              const riskLevel = temp != null && Number.isFinite(temp)
                ? tempToHeatRiskLevel(temp)
                : tempToHeatRiskLevel(null);
              const riskScore = riskLevel.level;
              const ring = getPolygonRing(feature.geometry);
              const [lng, lat] = ring ? ringCentroid(ring) : [125.4553, 7.1907];
              const requestSeq = ++facilitiesRequestSeqRef.current;

              if (!compactRef.current) {
                requestAnimationFrame(() => {
                  if (cancelledRef.current) return;
                  setSelectedZone({
                    name,
                    temperature: temp,
                    riskLevel,
                    riskScore,
                    facilities: [],
                    isNearbyFallback: false,
                    facilitiesLoading: true
                  });
                });
              }

              if (compactRef.current) return;
              setManualLocation({ lat, lon: lng, barangayId: id });
              getHealthFacilitiesNearBarangay(id, { lat, lng })
                .then(async (result) => {
                  if (cancelledRef.current) return;
                  if (requestSeq !== facilitiesRequestSeqRef.current) return;
                  const facilities = result.facilities ?? [];
                  const zoneData = {
                    barangayId: id,
                    name: name,
                    temperature: temp,
                    riskLevel,
                    riskScore,
                    facilities,
                    isNearbyFallback: result.isNearbyFallback ?? false,
                    facilitiesLoading: false
                  };
                  setSelectedZone(zoneData);
                  onZoneSelected?.(zoneData);
                  setAccessibilityData(null);
                  const withCoords = facilities.filter((f) => f.lat != null && f.lng != null);
                  if (withCoords.length > 0) {
                    try {
                      const orsBody = withCoords.map((f) => ({ id: f.id, lon: f.lng, lat: f.lat }));
                      const response = await fetchAccessibility([id], orsBody);
                      if (requestSeq !== facilitiesRequestSeqRef.current) return;
                      console.log('[HeatMap] fetchAccessibility response:', response);
                      setAccessibilityData(response);
                    } catch (err) {
                      console.warn('[HeatMap] fetchAccessibility failed:', err?.message);
                    }
                  }
                })
                .catch(() => {
                  if (cancelledRef.current) return;
                  if (requestSeq !== facilitiesRequestSeqRef.current) return;
                  const zoneData = {
                    name: name,
                    temperature: temp,
                    riskLevel,
                    riskScore,
                    facilities: []
                  };
                  setSelectedZone(zoneData);
                  onZoneSelected?.(zoneData);
                  setAccessibilityData(null);
                });
            });
          }
        }).addTo(mapInstance);
        barangayLayerRef.current = barangayLayer;

        const bounds = barangayLayer.getBounds();
        if (bounds.isValid()) mapInstance.fitBounds(bounds, { padding: [24, 24], maxZoom: 12 });
        if (!cancelledRef.current) setMapLoading(false);
      })
      .catch((err) => {
        if (!cancelledRef.current) {
          setError(err.message || 'Failed to load boundaries');
          setMapLoading(false);
        }
      });

    const updateHeatLayerRadius = () => {
      if (!mapInstanceRef.current) return;
      const map = mapInstanceRef.current;
      const currentZoom = map.getZoom();
      const minZoom = Number.isFinite(map.getMinZoom()) ? map.getMinZoom() : 0;
      const maxZoom = Number.isFinite(map.getMaxZoom()) ? map.getMaxZoom() : 18;
      const range = Math.max(1, maxZoom - minZoom);
      const percentage = Math.round(((currentZoom - minZoom) / range) * 100);
      setZoomPercentage(Math.max(0, Math.min(100, percentage)));
    };
      map.on('zoomend', updateHeatLayerRadius);
    });

    return () => {
      cancelledRef.current = true;
      cancelAnimationFrame(id);
      resizeCleanupRef.current?.();
      resizeCleanupRef.current = null;
      barangayFeaturesRef.current = [];
      facilitiesRequestSeqRef.current += 1;
      if (locationMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(locationMarkerRef.current);
        locationMarkerRef.current = null;
      }
      if (barangayLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(barangayLayerRef.current);
        barangayLayerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="heatmap-wrapper">
      <div className={`heatmap-container ${compact ? 'heatmap-compact heatmap-compact-hide-mobile-legend' : ''}`}>
        <div id="heatmap" ref={mapRef} />
        {mapLoading && (
          <div className="heatmap-loading" aria-live="polite" aria-busy="true">
            <div className="heatmap-loading-spinner" aria-hidden />
            <span className="heatmap-loading-text">Loading map and temperatures…</span>
          </div>
        )}
        {error && (
          <div className="heatmap-error">
            {error?.message ?? String(error)}
          </div>
        )}

        {!compact && selectedZone && (
          <div className="zone-info-card-wrapper" ref={zoneInfoCardRef}>
            <ZoneInfoCard
              zoneName={selectedZone.name}
              temperature={selectedZone.temperature}
              riskLevel={selectedZone.riskLevel}
              riskScore={selectedZone.riskScore}
              facilities={selectedZone.facilities}
              isNearbyFallback={selectedZone.isNearbyFallback}
              facilitiesLoading={selectedZone.facilitiesLoading}
              onClose={() => { setSelectedZone(null); setAccessibilityData(null); }}
              onFacilityClick={() => {}}
              onGoToDashboard={onGoToDashboard}
            />
          </div>
        )}

        {/* Desktop layout: top-left overlay (heat index legend then search + budget), gradient temp, horizontal zoom + crosshair */}
        <div className="heatmap-desktop-ui">
          <div className="heatmap-overlay-bar heatmap-overlay-bar-desktop">
            <div className="heatmap-panel heatmap-panel-legend heatmap-desktop-legend">
              <div className="heatmap-panel-corner" aria-hidden />
              <h3 className="heatmap-index-legend-title">HEAT INDEX (PAGASA)</h3>
              <ul className="heatmap-index-legend-list">
                {HEAT_RISK_LEVELS.map((r) => (
                  <li key={r.level} className="heatmap-index-legend-item" style={{ '--risk-color': r.color }}>
                    <span className="heatmap-index-dot" style={{ background: r.color }} />
                    <span className="heatmap-index-range">{r.rangeLabel}</span>
                    <span className="heatmap-index-label">{r.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="heatmap-search-block heatmap-search-block-desktop">
              <div className="heatmap-search-row">
                <button type="button" className="heatmap-search-btn" aria-label="Search location" onClick={handleSearchLocation}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                </button>
                <input
                  type="text"
                  className="heatmap-search-input"
                  placeholder="Search for a location..."
                  aria-label="Search for a location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLocation())}
                />
              </div>

              {showDeviceLocation && (
                <>
                  <div className="heatmap-search-divider" />
                  <button type="button" className="heatmap-device-location" onClick={handleUseDeviceLocation}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span>Use device location</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="heatmap-legend">
            <span className="heatmap-legend-title">Temperature (°C)</span>
            <div className="heatmap-legend-gradient" />
            <div className="heatmap-legend-labels">
              <span>{tempRange.min}°</span>
              <span>{tempRange.max}°</span>
            </div>
            <span className="heatmap-legend-area">Average index per barangay · PSGC boundaries</span>
          </div>
          <div className="zoom-indicator">{zoomPercentage}%</div>
          <div className="heatmap-zoom-controls heatmap-zoom-controls-desktop">
            <button type="button" className="heatmap-zoom-btn" onClick={() => mapInstanceRef.current?.zoomIn()} aria-label="Zoom in">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
            <button type="button" className="heatmap-zoom-btn" onClick={() => mapInstanceRef.current?.zoomOut()} aria-label="Zoom out">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
            <button type="button" className="heatmap-zoom-btn" onClick={handleUseDeviceLocation} aria-label="Locate me">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>
            </button>
            <button type="button" className="heatmap-zoom-btn" onClick={() => { const el = mapRef.current?.closest('.heatmap-container'); if (el && !document.fullscreenElement) el.requestFullscreen?.(); else if (document.fullscreenElement) document.exitFullscreen?.(); }} aria-label="Fullscreen">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
            </button>
          </div>
        </div>

        {/* Mobile layout: temp panel top left, search+filter panel top right, heat index bottom, map controls bottom right */}
        <div className="heatmap-mobile-ui">
          <div className="heatmap-temp-simple heatmap-temp-top-left">
            <span className="heatmap-temp-label">Temperature</span>
            <span className="heatmap-temp-range">{tempRange.min}°–{tempRange.max}°C</span>
          </div>
          <div className="heatmap-overlay-bar heatmap-overlay-bar-mobile">
            <div className="heatmap-search-block heatmap-search-block-mobile">
              <div className="heatmap-search-row">
                <button type="button" className="heatmap-search-btn" aria-label="Search location" onClick={handleSearchLocation}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                </button>
                <input
                  type="text"
                  className="heatmap-search-input"
                  placeholder="Search location..."
                  aria-label="Search for a location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLocation())}
                />
              </div>

              {showDeviceLocation && (
                <>
                  <div className="heatmap-search-divider" />
                  <button type="button" className="heatmap-device-location" onClick={handleUseDeviceLocation}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span>Use device location</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="heatmap-bottom-legend">
            <h3 className="heatmap-bottom-legend-title">Heat Index (PAGASA)</h3>
            <ul className="heatmap-bottom-legend-list">
              {HEAT_RISK_LEVELS.map((r) => (
                <li key={r.level} className="heatmap-bottom-legend-item" style={{ '--risk-color': r.color }}>
                  <span className="heatmap-index-dot" style={{ background: r.color }} />
                  <span className="heatmap-index-range">{r.rangeLabel}</span>
                  <span className="heatmap-index-label">{r.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="heatmap-zoom-controls heatmap-zoom-controls-mobile">
            <button type="button" className="heatmap-zoom-btn" onClick={() => mapInstanceRef.current?.zoomIn()} aria-label="Zoom in">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
            <button type="button" className="heatmap-zoom-btn" onClick={() => mapInstanceRef.current?.zoomOut()} aria-label="Zoom out">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
            <button type="button" className="heatmap-zoom-btn" onClick={handleUseDeviceLocation} aria-label="Locate me">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>
            </button>
            <button type="button" className="heatmap-zoom-btn" onClick={() => { const el = mapRef.current?.closest('.heatmap-container'); if (el && !document.fullscreenElement) el.requestFullscreen?.(); else if (document.fullscreenElement) document.exitFullscreen?.(); }} aria-label="Fullscreen">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;