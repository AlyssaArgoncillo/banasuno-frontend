import React from 'react';
import { Ic } from './IotIcons.jsx';
import { T } from './theme.js';

const OPTIONS = ['Official only', 'Community only'];

/**
 * Two-state toggle for IoT layer: Official only | Community only.
 */
export default function IotLayerToggle({ value, onChange }) {
  return (
    <div className="iot-layer-toggle" style={{ minWidth: 140 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          marginBottom: 3,
        }}
      >
        <Ic.IoT c={T.o5} s={10} />
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: T.mute,
          }}
        >
          IoT LAYER
        </span>
      </div>
      {OPTIONS.map((opt) => {
        const isActive = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '5px 7px',
              borderRadius: 7,
              border: 'none',
              cursor: 'pointer',
              background: isActive ? T.o0 : 'transparent',
              transition: 'background 0.18s',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 26,
                height: 13,
                borderRadius: 7,
                flexShrink: 0,
                background: isActive ? T.o5 : T.line,
                position: 'relative',
                transition: 'background 0.22s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  left: isActive ? 14 : 2,
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: T.white,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  transition: 'left 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? T.o7 : T.ink3,
              }}
            >
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}
