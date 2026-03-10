import React from 'react';
import { T, STATUS_DOT } from './theme.js';

/**
 * Teardrop map pin with status-based color and animation.
 * Position via parent (left/top %). active=pinPulse, alerting=pinAlert+"!", recent/inactive=no animation.
 */
export default function SensorPin({ sensor, selected, onClick }) {
  const dot = STATUS_DOT[sensor.status] || STATUS_DOT.inactive;
  const isSel = selected;
  const sz = isSel ? 13 : 9;
  const anim =
    sensor.status === 'alerting'
      ? 'pinAlert 0.9s ease-in-out infinite'
      : sensor.status === 'active'
        ? 'pinPulse 2.8s ease-in-out infinite'
        : 'none';

  return (
    <button
      type="button"
      className="iot-sensor-pin"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(sensor.id);
      }}
      aria-label={`Sensor ${sensor.id} ${sensor.barangay}`}
      style={{
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        padding: 0,
        minWidth: 44,
        minHeight: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: sz * 2,
          height: sz * 2,
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)',
          background: dot,
          border: `2px solid ${T.white}`,
          boxShadow: isSel
            ? `0 0 0 3px ${dot}44, 0 4px 12px rgba(0,0,0,0.22)`
            : '0 2px 6px rgba(0,0,0,0.20)',
          animation: anim,
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
      {sensor.status === 'alerting' && (
        <span
          className="iot-pin-badge"
          style={{
            position: 'absolute',
            top: -5,
            right: -5,
            width: 13,
            height: 13,
            borderRadius: '50%',
            background: T.r5,
            border: `1.5px solid ${T.white}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 7.5,
            color: '#fff',
            fontWeight: 700,
          }}
        >
          !
        </span>
      )}
    </button>
  );
}
