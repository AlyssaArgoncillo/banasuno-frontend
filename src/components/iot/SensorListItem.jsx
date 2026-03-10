import React from 'react';
import Spark from './Spark.jsx';
import { T, RISK_STYLE, STATUS_DOT } from './theme.js';

/**
 * Single row in the sensor list: status dot, ID, barangay, sparkline, temp, time ago.
 */
export default function SensorListItem({ sensor, selected, onClick }) {
  const dot = STATUS_DOT[sensor.status] || STATUS_DOT.inactive;
  const rk = RISK_STYLE[sensor.risk] || RISK_STYLE.CAUTION;
  const isSel = selected;

  return (
    <button
      type="button"
      className="iot-sensor-list-item"
      onClick={() => onClick?.(sensor.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 8px',
        borderRadius: 9,
        cursor: 'pointer',
        background: isSel ? T.o0 : 'transparent',
        border: `1.5px solid ${isSel ? T.o1 : 'transparent'}`,
        transition: 'all 0.16s',
        width: '100%',
        textAlign: 'left',
        minHeight: 44,
      }}
      onMouseEnter={(e) => {
        if (!isSel) e.currentTarget.style.background = T.wash;
      }}
      onMouseLeave={(e) => {
        if (!isSel) e.currentTarget.style.background = 'transparent';
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: dot,
          flexShrink: 0,
          animation:
            sensor.status === 'alerting'
              ? 'pinAlert 0.9s ease-in-out infinite'
              : sensor.status === 'active'
                ? 'pinPulse 2.8s ease-in-out infinite'
                : 'none',
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, color: T.ink }}>
          #{sensor.id}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: T.mute }}>
          {sensor.barangay}
        </div>
      </div>
      <Spark data={sensor.spark} color={rk.text} w={40} h={16} />
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, color: rk.text }}>
          {sensor.temp}°
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, color: T.mute }}>
          {sensor.ago}
        </div>
      </div>
    </button>
  );
}
