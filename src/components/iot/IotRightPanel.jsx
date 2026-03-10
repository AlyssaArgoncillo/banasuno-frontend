import React from 'react';
import { Ic } from './IotIcons.jsx';
import { T } from './theme.js';
import SensorDetailsCard from './SensorDetailsCard.jsx';
import SensorListItem from './SensorListItem.jsx';
import useScrollFade from './useScrollFade.js';

/**
 * Right panel: placeholder or sensor details card, sensor list with summary, Add Sensor button.
 */
export default function IotRightPanel({ sensors, selectedPin, onSelectPin, onAddSensor, onHistory, onCopy, variant = 'full' }) {
  const scrollRef = useScrollFade();
  const selected = selectedPin ? sensors.find((s) => s.id === selectedPin) : null;
  const alerting = sensors.filter((s) => s.status === 'alerting');

  return (
    <div ref={scrollRef} className="iot-right-panel scroll-fade">
      {selected ? (
        <SensorDetailsCard
          sensor={selected}
          onClose={() => onSelectPin?.(null)}
          onHistory={onHistory}
          onCopy={onCopy}
        />
      ) : (
        <div className="iot-right-panel-placeholder">
          <Ic.IoT c={T.o3} s={22} />
          <div className="iot-right-panel-placeholder-text">
            Tap a sensor pin on the map
            <br />
            to see live readings
          </div>
        </div>
      )}

      {variant === 'full' && (
        <div className="iot-sensor-list-card">
          <div className="iot-sensor-list-header">
            <div className="iot-sensor-list-header-left">
              <div className="iot-sensor-list-title">
                <Ic.IoT c={T.o5} s={13} />
                Community Sensors
              </div>
              <div className="iot-sensor-list-concept-label">
                CONCEPT PREVIEW · Mock data for demonstration · Future implementation
              </div>
            </div>
            <div className="iot-sensor-list-badges">
              <span className="iot-sensor-list-badge iot-sensor-list-badge--online">
                {sensors.filter((s) => s.status !== 'inactive').length} online
              </span>
              {alerting.length > 0 && (
                <span className="iot-sensor-list-badge iot-sensor-list-badge--alert">
                  {alerting.length} alert
                </span>
              )}
            </div>
          </div>
          <div className="iot-sensor-list">
            {sensors.map((s) => (
              <SensorListItem
                key={s.id}
                sensor={s}
                selected={selectedPin === s.id}
                onClick={(id) => onSelectPin?.(id === selectedPin ? null : id)}
              />
            ))}
          </div>
          <div className="iot-sensor-list-footer">
            <div className="iot-sensor-list-stat">
              <div className="iot-sensor-list-stat-value" style={{ color: T.g5 }}>
                {sensors.filter((s) => s.status !== 'inactive').length}
              </div>
              <div className="iot-sensor-list-stat-label">Online</div>
            </div>
            <div className="iot-sensor-list-stat">
              <div className="iot-sensor-list-stat-value" style={{ color: T.y5 }}>
                {sensors.filter((s) => s.battery < 40).length}
              </div>
              <div className="iot-sensor-list-stat-label">Low batt</div>
            </div>
            <div className="iot-sensor-list-stat">
              <div className="iot-sensor-list-stat-value" style={{ color: T.mute }}>
                {sensors.filter((s) => s.status === 'inactive').length}
              </div>
              <div className="iot-sensor-list-stat-label">Inactive</div>
            </div>
          </div>
        </div>
      )}

      {variant === 'full' && (
        <button type="button" onClick={onAddSensor} className="iot-add-sensor-btn" aria-label="Add your sensor">
          <Ic.Plus />
          Add Your Sensor
        </button>
      )}
    </div>
  );
}
