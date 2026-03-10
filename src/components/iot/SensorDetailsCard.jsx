import React from 'react';
import { Ic } from './IotIcons.jsx';
import Spark from './Spark.jsx';
import { T, RISK_STYLE, STATUS_DOT } from './theme.js';

/**
 * Expanded sensor card when a pin is selected: ID, status, location, temp, heat index, risk, sparkline, battery, actions.
 */
export default function SensorDetailsCard({ sensor, onClose, onHistory, onCopy }) {
  if (!sensor) return null;
  const rs = RISK_STYLE[sensor.risk] || RISK_STYLE.CAUTION;
  const sdot = STATUS_DOT[sensor.status] || STATUS_DOT.inactive;

  const handleCopy = () => {
    onCopy?.(sensor);
  };

  return (
    <div className="iot-details-card" style={{ flexShrink: 0 }}>
      <div
        style={{
          padding: '10px 13px',
          background: `${sdot}11`,
          borderBottom: `1px solid ${T.line}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: sdot,
              animation:
                sensor.status === 'alerting'
                  ? 'pinAlert 0.9s ease-in-out infinite'
                  : sensor.status === 'active'
                    ? 'pinPulse 2.8s ease-in-out infinite'
                    : 'none',
            }}
          />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11.5, fontWeight: 700, color: T.ink }}>
            SENSOR #{sensor.id}
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 8,
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 20,
              background: `${sdot}18`,
              color: sdot,
            }}
          >
            {sensor.status.toUpperCase()}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            border: 'none',
            background: T.wash,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ic.Close />
        </button>
      </div>
      <div style={{ padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Ic.Pin />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.ink3 }}>
            Barangay {sensor.barangay}
          </span>
          <span style={{ marginLeft: 'auto', fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: T.mute }}>
            ⏱ {sensor.ago} ago
          </span>
        </div>
        <div
          style={{
            background: T.wash,
            borderRadius: 10,
            padding: '10px 11px',
            border: `1px solid ${T.line}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, color: T.mute, letterSpacing: '0.10em', marginBottom: 1 }}>
                TEMP
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 22, color: T.ink, letterSpacing: '-0.03em' }}>
                {sensor.temp}°C
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, color: T.mute, letterSpacing: '0.10em', marginBottom: 3 }}>
                HEAT INDEX
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15, color: rs.text }}>
                  {sensor.heatIdx}°C
                </span>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 8,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 20,
                    background: rs.bg,
                    color: rs.text,
                  }}
                >
                  {sensor.risk}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, color: T.mute, letterSpacing: '0.10em', marginBottom: 2 }}>
                24H TREND
              </div>
              <Spark data={sensor.spark} color={rs.text} w={140} h={26} />
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, color: T.mute, letterSpacing: '0.10em', marginBottom: 3 }}>
                BATTERY
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 22,
                    height: 10,
                    borderRadius: 2,
                    border: `1.5px solid ${sensor.battery < 20 ? T.r5 : sensor.battery < 40 ? T.y5 : T.g5}`,
                    padding: '1px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 1,
                      width: `${sensor.battery}%`,
                      background: sensor.battery < 20 ? T.r5 : sensor.battery < 40 ? T.y5 : T.g5,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: -3,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: 5,
                      background: sensor.battery < 20 ? T.r5 : sensor.battery < 40 ? T.y5 : T.g5,
                      borderRadius: '0 1px 1px 0',
                    }}
                  />
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: sensor.battery < 20 ? T.r5 : T.mute }}>
                  {sensor.battery}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: T.mute }}>
          👤 Anonymous User #{sensor.id}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <button
            type="button"
            onClick={() => onHistory?.(sensor)}
            className="iot-details-btn iot-details-btn--history"
          >
            <Ic.Chart c={T.o7} s={13} />
            History
          </button>
          <button type="button" onClick={handleCopy} className="iot-details-btn iot-details-btn--copy">
            <Ic.Copy c={T.ink3} s={13} />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
