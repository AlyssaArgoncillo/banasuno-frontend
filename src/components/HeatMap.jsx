import React, { useEffect, useRef, useState } from 'react';
import '../styles/HeatMap.css';
import { fetchDavaoBoundaries } from '../services/boundariesService.js';
import { getBarangayHeatData } from '../services/heatService.js';
import { normalizeTempToIntensity, getColorForIntensity } from '../utils/heatMap.js';

/* global L */

const HeatMap = ({ compact = false }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const barangayLayerRef = useRef(null);
  const cancelledRef = useRef(false);
  const [zoomPercentage, setZoomPercentage] = useState(100);
  const [error, setError] = useState(null);
  const [tempRange, setTempRange] = useState({ min: 26, max: 39 });
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('any');
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
  const budgetDropdownRef = useRef(null);
  const resizeCleanupRef = useRef(null);
  const showDeviceLocation = searchQuery.trim().length > 0;
  const errorDismissTimeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (budgetDropdownRef.current && !budgetDropdownRef.current.contains(e.target)) {
        setBudgetDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const BUDGET_OPTIONS = [
    { value: 'any', label: 'Any budget' },
    { value: 'under500', label: 'Under ₱500' },
    { value: '500-1000', label: '₱500 – ₱1,000' },
    { value: '1000-2500', label: '₱1,000 – ₱2,500' },
    { value: '2500plus', label: '₱2,500+' }
  ];

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

  const handleUseDeviceLocation = () => {
    const message = 'Use your current location to find nearby areas on the map?';
    if (!window.confirm(message)) return;
    if (!navigator.geolocation) {
      setLocationError('Location is not supported by your browser.');
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapInstanceRef.current;
        if (map) {
          map.setView([latitude, longitude], 14);
        }
      },
      () => {
        setLocationError('Location unavailable. Check permissions or try again.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    const container = mapRef.current;
    if (!container || !container.parentElement || mapInstanceRef.current) return;

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
        const overlayPane = map.getPane('overlayPane');
        if (overlayPane) overlayPane.style.pointerEvents = 'none';
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

        const mapInstance = mapInstanceRef.current;
        if (!mapInstance.getContainer()?.parentElement) return;

        const { tempMin, tempMax, tempByBarangayId } = await getBarangayHeatData(barangayFeatures);
        if (cancelledRef.current || !mapInstanceRef.current) return;

        if (!cancelledRef.current) setTempRange({ min: tempMin, max: tempMax });

        const barangayLayer = L.geoJSON(barangayGeojson, {
          style: (feature) => {
            const id = feature.id ?? feature.properties?.adm4_psgc;
            const temp = tempByBarangayId != null && id != null ? tempByBarangayId[id] : null;
            if (temp == null || !Number.isFinite(temp)) {
              return {
                color: 'rgba(26, 54, 93, 0.3)',
                weight: 1,
                fillColor: '#e2e8f0',
                fillOpacity: 0.3
              };
            }
            const intensity = normalizeTempToIntensity(temp, tempMin, tempMax);
            const fillColor = getColorForIntensity(intensity);
            return {
              fillColor,
              fillOpacity: 0.38,
              color: 'rgba(26, 54, 93, 0.4)',
              weight: 1
            };
          }
        }).addTo(mapInstance);
        barangayLayerRef.current = barangayLayer;

        const bounds = barangayLayer.getBounds();
        if (bounds.isValid()) mapInstance.fitBounds(bounds, { padding: [24, 24], maxZoom: 12 });
      })
      .catch((err) => {
        if (!cancelledRef.current) setError(err.message || 'Failed to load boundaries');
      })
      .finally(() => {});

    const BASE_ZOOM = 12;
    const updateHeatLayerRadius = () => {
      if (!mapInstanceRef.current) return;
      const currentZoom = mapInstanceRef.current.getZoom();
      const minZoom = 1;
      const percentage = Math.round(((currentZoom - minZoom) / (BASE_ZOOM - minZoom)) * 100);
      setZoomPercentage(Math.max(0, Math.min(100, percentage)));
    };
      map.on('zoomend', updateHeatLayerRadius);
    });

    return () => {
      cancelledRef.current = true;
      cancelAnimationFrame(id);
      resizeCleanupRef.current?.();
      resizeCleanupRef.current = null;
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
      <div className="heatmap-container">
        <div id="heatmap" ref={mapRef} />
        {error && (
          <div className="heatmap-error">
            {error}
          </div>
        )}
        <div className="heatmap-overlay-bar">
          {!compact && (
            <>
              <div className="heatmap-search-block">
                <div className="heatmap-search-row">
                  <button type="button" className="heatmap-search-btn" aria-label="Search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                  </button>
                  <input
                    type="text"
                    className="heatmap-search-input"
                    placeholder="Search for a location..."
                    aria-label="Search for a location"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {showDeviceLocation && (
                  <>
                    <div className="heatmap-search-divider" />
                    <button type="button" className="heatmap-device-location" onClick={handleUseDeviceLocation}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      <span>Use device location</span>
                    </button>
                  </>
                )}
              </div>
              <div className="heatmap-panel heatmap-panel-feature" ref={budgetDropdownRef}>
                <div className="heatmap-panel-corner" aria-hidden />
                <label className="heatmap-feature-label">
                  Filter by budget
                </label>
                <div className={`heatmap-budget-dropdown ${budgetDropdownOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="heatmap-budget-trigger"
                    onClick={() => setBudgetDropdownOpen((o) => !o)}
                    aria-expanded={budgetDropdownOpen}
                    aria-haspopup="listbox"
                    aria-label="Filter by budget"
                  >
                    <span className="heatmap-budget-trigger-label">
                      {BUDGET_OPTIONS.find((o) => o.value === budgetFilter)?.label ?? 'Any budget'}
                    </span>
                    <svg className="heatmap-budget-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {budgetDropdownOpen && (
                    <ul className="heatmap-budget-options" role="listbox">
                      {BUDGET_OPTIONS.map((opt) => (
                        <li
                          key={opt.value}
                          role="option"
                          aria-selected={budgetFilter === opt.value}
                          className={`heatmap-budget-option ${budgetFilter === opt.value ? 'heatmap-budget-option-selected' : ''}`}
                          onClick={() => {
                            setBudgetFilter(opt.value);
                            setBudgetDropdownOpen(false);
                          }}
                        >
                          {opt.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
          <div className="heatmap-panel heatmap-panel-legend">
            <div className="heatmap-panel-corner" aria-hidden />
            <h3 className="heatmap-index-legend-title">HEAT INDEX LEGEND</h3>
            <ul className="heatmap-index-legend-list">
              <li className="heatmap-index-legend-item"><span className="heatmap-index-dot" style={{ background: '#48bb78' }} /> Heat-1: Safe</li>
              <li className="heatmap-index-legend-item"><span className="heatmap-index-dot" style={{ background: '#ecc94b' }} /> Heat-2: Moderate</li>
              <li className="heatmap-index-legend-item"><span className="heatmap-index-dot" style={{ background: '#ed8936' }} /> Heat-3: Elevated</li>
              <li className="heatmap-index-legend-item"><span className="heatmap-index-dot" style={{ background: '#f97316' }} /> Heat-4: High</li>
              <li className="heatmap-index-legend-item"><span className="heatmap-index-dot" style={{ background: '#ea580c' }} /> Heat-5: Very High</li>
              <li className="heatmap-index-legend-item"><span className="heatmap-index-dot" style={{ background: '#dc2626' }} /> Heat-6: Critical</li>
            </ul>
          </div>
        </div>
        <div className="heatmap-legend">
          <span className="heatmap-legend-title">Temperature (°C)</span>
          <div className="heatmap-legend-gradient" />
          <div className="heatmap-legend-labels">
            <span>{tempRange.min}°</span>
            <span>{tempRange.max}°</span>
          </div>
          <span className="heatmap-legend-area">One dot per barangay · PSGC boundaries</span>
        </div>
        <div className="zoom-indicator">{zoomPercentage}%</div>
        <div className="heatmap-zoom-controls">
          <button
            type="button"
            className="heatmap-zoom-btn"
            onClick={() => {
              const el = mapRef.current?.closest('.heatmap-container');
              if (el && !document.fullscreenElement) el.requestFullscreen?.();
              else if (document.fullscreenElement) document.exitFullscreen?.();
            }}
            aria-label="Fullscreen"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
          </button>
          <button
            type="button"
            className="heatmap-zoom-btn"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            aria-label="Zoom out"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
          <button
            type="button"
            className="heatmap-zoom-btn"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            aria-label="Zoom in"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
