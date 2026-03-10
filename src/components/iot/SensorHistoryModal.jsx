import React from 'react';
import { Ic } from './IotIcons.jsx';
import { T, RISK_STYLE } from './theme.js';
import { gen24h } from './data/mockSensors.js';
import useScrollFade from './useScrollFade.js';

/**
 * History modal: 24-hour temperature trend (stats only), recent readings, sensor info.
 */
export default function SensorHistoryModal({ sensor, onClose }) {
  if (!sensor) return null;
  const scrollRef = useScrollFade();
  const data = gen24h(sensor.temp);

  const readings = [
    { time: '2:00 PM', temp: sensor.temp, hum: sensor.humidity, label: sensor.risk },
    { time: '1:00 PM', temp: sensor.temp - 0.4, hum: 70, label: 'EXTREME CAUTION' },
    { time: '12:00 PM', temp: sensor.temp - 2.1, hum: 72, label: 'EXTREME CAUTION' },
    { time: '11:00 AM', temp: sensor.temp - 3.7, hum: 75, label: 'CAUTION' },
    { time: '10:00 AM', temp: sensor.temp - 5.0, hum: 78, label: 'CAUTION' },
  ];

  return (
    <div
      className="iot-history-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="iot-history-title"
      onClick={onClose}
    >
      <div className="iot-history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="iot-history-modal-header">
          <div>
            <div className="iot-history-modal-sensor-id">⚡ SENSOR #{sensor.id}</div>
            <div className="iot-history-modal-location">
              📍 {sensor.landmark} · {sensor.barangay}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="iot-history-modal-close">
            <Ic.Close c="#fff" s={13} />
          </button>
        </div>

        <div ref={scrollRef} className="iot-history-modal-body scroll-fade">
          <div className="iot-history-trend-section">
            <div className="iot-history-trend-title">24-HOUR TEMPERATURE TREND</div>
            <div className="iot-history-stats">
            {[
              ['Max', `${Math.max(...data).toFixed(1)}°C`, T.r5],
              ['Min', `${Math.min(...data).toFixed(1)}°C`, T.g5],
              ['Avg', `${(data.reduce((a, b) => a + b) / data.length).toFixed(1)}°C`, T.o5],
            ].map(([lbl, val, col]) => (
              <div key={lbl} className="iot-history-stat-item">
                <div className="iot-history-stat-label">{lbl}</div>
                <div className="iot-history-stat-value" style={{ color: col }}>
                  {val}
                </div>
              </div>
            ))}
            </div>
          </div>

          <div className="iot-history-readings">
            <div className="iot-history-readings-title">RECENT READINGS</div>
            {readings.map((r, i) => {
              const rl = RISK_STYLE[r.label] || RISK_STYLE.CAUTION;
              return (
                <div key={i} className="iot-history-reading-row" style={{ background: i % 2 === 0 ? T.wash : T.white }}>
                  <span className="iot-history-reading-time">{r.time}</span>
                  <span className="iot-history-reading-temp">{r.temp.toFixed(1)}°C</span>
                  <span className="iot-history-reading-hum">{r.hum}% hum</span>
                  <span className="iot-history-reading-badge" style={{ background: rl.bg, color: rl.text }}>
                    {r.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="iot-history-sensor-info">
            <div className="iot-history-sensor-info-title">SENSOR INFO</div>
            {[
              ['Model', 'BanasUno Sensor v1.0'],
              ['Battery', `${sensor.battery}%`],
              ['Accuracy', '±0.3°C'],
              ['Reliability', '98% uptime'],
            ].map(([k, v]) => (
              <div key={k} className="iot-history-sensor-info-row">
                <span style={{ color: T.mute }}>{k}</span>
                <span style={{ fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
