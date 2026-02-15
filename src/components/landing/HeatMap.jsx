import React, { useEffect, useRef, useState } from 'react';
import '../../styles/HeatMap.css';
import { fetchDavaoBoundaries, getDavaoCityFeature } from '../../services/boundariesService.js';
import { getBarangayHeatData } from '../../services/heatService.js';

/* global L */

const HeatMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const boundaryLayerRef = useRef(null);
  const barangayLayerRef = useRef(null);
  const cancelledRef = useRef(false);
  const [zoomPercentage, setZoomPercentage] = useState(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tempRange, setTempRange] = useState({ min: 26, max: 39 });

  useEffect(() => {
    const container = mapRef.current;
    if (!container || !container.parentElement || mapInstanceRef.current) return;

    cancelledRef.current = false;
    const map = L.map(container).setView([7.1907, 125.4553], 11);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    setError(null);
    setLoading(true);

    fetchDavaoBoundaries()
      .then(async ({ cityGeojson, barangayGeojson }) => {
        if (cancelledRef.current || !mapInstanceRef.current) return;

        const davaoFeature = getDavaoCityFeature(cityGeojson);
        if (!davaoFeature) throw new Error('Davao City boundary not found');

        const barangayFeatures = barangayGeojson.features || [];
        if (!barangayFeatures.length) throw new Error('No barangay districts found');

        const mapInstance = mapInstanceRef.current;
        if (!mapInstance.getContainer()?.parentElement) return;

        const { intensityPoints, tempMin, tempMax } = await getBarangayHeatData(barangayFeatures);
        if (cancelledRef.current || !mapInstanceRef.current) return;

        if (!cancelledRef.current) setTempRange({ min: tempMin, max: tempMax });

        const boundaryLayer = L.geoJSON(
          { type: 'FeatureCollection', features: [davaoFeature] },
          {
            style: {
              color: '#1a365d',
              weight: 2,
              fillColor: 'transparent',
              fillOpacity: 0
            }
          }
        ).addTo(mapInstance);
        boundaryLayerRef.current = boundaryLayer;

        const barangayLayer = L.geoJSON(barangayGeojson, {
          style: {
            color: 'rgba(26, 54, 93, 0.35)',
            weight: 1,
            fillColor: 'transparent',
            fillOpacity: 0
          }
        }).addTo(mapInstance);
        barangayLayerRef.current = barangayLayer;

        const heatLayer = L.heatLayer(intensityPoints, {
          radius: 35,
          blur: 40,
          maxZoom: 14,
          minOpacity: 0.4,
          max: 1,
          gradient: {
            0.0: '#206bcb',
            0.2: '#4299e1',
            0.4: '#48bb78',
            0.55: '#ecc94b',
            0.7: '#ed8936',
            0.85: '#e53e3e',
            1.0: '#9b2c2c'
          }
        }).addTo(mapInstance);
        heatLayerRef.current = heatLayer;

        const bounds = boundaryLayer.getBounds();
        if (bounds.isValid()) mapInstance.fitBounds(bounds, { padding: [24, 24], maxZoom: 12 });
      })
      .catch((err) => {
        if (!cancelledRef.current) setError(err.message || 'Failed to load boundaries');
      })
      .finally(() => {
        if (!cancelledRef.current) setLoading(false);
      });

    const BASE_ZOOM = 12;
    const updateHeatLayerRadius = () => {
      if (!mapInstanceRef.current) return;
      const currentZoom = mapInstanceRef.current.getZoom();
      const minZoom = 1;
      const percentage = Math.round(((currentZoom - minZoom) / (BASE_ZOOM - minZoom)) * 100);
      setZoomPercentage(Math.max(0, Math.min(100, percentage)));
    };
    map.on('zoomend', updateHeatLayerRadius);

    return () => {
      cancelledRef.current = true;
      if (barangayLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(barangayLayerRef.current);
        barangayLayerRef.current = null;
      }
      if (boundaryLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(boundaryLayerRef.current);
        boundaryLayerRef.current = null;
      }
      if (heatLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
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
        <div id="heatmap" ref={mapRef} style={{ height: '550px', width: '100%' }} />
        {loading && (
          <div className="heatmap-loading">
            Loading barangay districts…
          </div>
        )}
        {error && (
          <div className="heatmap-error">
            {error}
          </div>
        )}
        <div className="zoom-indicator">{zoomPercentage}%</div>
        <div className="heatmap-legend">
          <span className="heatmap-legend-title">Temperature (°C)</span>
          <div className="heatmap-legend-gradient" />
          <div className="heatmap-legend-labels">
            <span>{tempRange.min}°</span>
            <span>{tempRange.max}°</span>
          </div>
          <span className="heatmap-legend-area">One dot per barangay · PSGC boundaries</span>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
