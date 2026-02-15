import { useState } from "react";
import { Map } from "pigeon-maps";  // Named import
import * as OverlayPkg from "pigeon-overlay";  // Namespace import
const Overlay = (OverlayPkg && OverlayPkg.default) ? OverlayPkg.default : OverlayPkg;

const HeatZonePreview = () => {
  const [center, setCenter] = useState([7.1907, 125.4553]); // Davao City
  const [zoom, setZoom] = useState(12);

  const heatZones = [
    {
      id: 1,
      anchor: [7.10, 125.61],
      color: '#ef4444',
      opacity: 0.6,
      name: 'Downtown'
    },
    {
      id: 2,
      anchor: [7.16, 125.59],
      color: '#f59e0b',
      opacity: 0.5,
      name: 'Residential'
    },
    {
      id: 3,
      anchor: [7.22, 125.56],
      color: '#3b82f6',
      opacity: 0.4,
      name: 'Green District'
    }
  ];

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '6px', overflow: 'hidden' }}>
      <Map
        center={center}
        zoom={zoom}
        width="100%"
        height={'100%'}
        onBoundsChanged={({ center, zoom }) => {
          setCenter(center);
          setZoom(zoom);
        }}
      >
        {heatZones.map(zone => (
          <Overlay
            key={zone.id}
            anchor={zone.anchor}
            offset={[0, 0]}
          >
            <div
              style={{
                width: '150px',
                height: '150px',
                backgroundColor: zone.color,
                opacity: zone.opacity,
                borderRadius: '50%',
                border: '3px solid white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            >
              <span style={{
                background: 'white',
                padding: '4px 8px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: zone.color,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                {zone.name}
              </span>
            </div>
          </Overlay>
        ))}
      </Map>
    </div>
  );
};

export default HeatZonePreview;