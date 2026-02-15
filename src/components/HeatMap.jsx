import React, { useEffect, useRef, useState } from 'react';
import '../styles/HeatMap.css';

/* global L */
const HeatMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [zoomPercentage, setZoomPercentage] = useState(100);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([7.1907, 125.4553], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const BASE_ZOOM = 12;

      const updateHeatLayerRadius = () => {
        const currentZoom = map.getZoom();
        const minZoom = 1;
        const percentage = Math.round(((currentZoom - minZoom) / (BASE_ZOOM - minZoom)) * 100);
        setZoomPercentage(percentage);
      };

      // Listen for zoom events and update radius
      map.on('zoomend', updateHeatLayerRadius);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-container">
        <div id="heatmap" ref={mapRef} style={{ height: '550px', width: '100%' }}></div>
        <div className="zoom-indicator">
          {zoomPercentage}%
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
