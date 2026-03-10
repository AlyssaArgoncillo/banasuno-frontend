import React, { useState, useEffect } from 'react';
import { Ic } from './IotIcons.jsx';
import { T } from './theme.js';

const STEPS = ['About', 'Pair Device', 'Privacy'];

/**
 * Multi-step add sensor flow: About → Pair Device → Privacy → success.
 */
export default function AddSensorModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [device, setDevice] = useState(null);
  const [usage, setUsage] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (step === 1) {
      const t = setTimeout(() => setScanning(true), 500);
      return () => clearTimeout(t);
    } else {
      setScanning(false);
    }
  }, [step]);

  const scannedDevices = [
    { id: 'BU-SENSOR-B042', sig: 85 },
    { id: 'BU-SENSOR-A038', sig: 60 },
  ];

  return (
    <div className="iot-add-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="iot-add-modal-title" onClick={onClose}>
      <div className="iot-add-modal" onClick={(e) => e.stopPropagation()}>
        <div className="iot-add-modal-header">
          <div>
            <div id="iot-add-modal-title" className="iot-add-modal-title">
              Add Your Sensor
            </div>
            {!done && (
              <div className="iot-add-modal-subtitle">
                Step {step + 1} of {STEPS.length}
              </div>
            )}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="iot-add-modal-close">
            <Ic.Close s={13} />
          </button>
        </div>

        {!done && (
          <div className="iot-add-progress">
            {STEPS.map((s, i) => (
              <div key={s} className="iot-add-progress-step">
                <div className="iot-add-progress-bar" style={{ background: i <= step ? T.o5 : T.line }} />
                <div className="iot-add-progress-label" style={{ color: i === step ? T.o5 : T.mute, fontWeight: i === step ? 700 : 400 }}>
                  {s}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="iot-add-modal-body">
          {done && (
            <div className="iot-add-done">
              <div className="iot-add-done-icon">
                <Ic.Check c={T.g5} s={28} />
              </div>
              <div className="iot-add-done-title">Sensor Connected!</div>
              <div className="iot-add-done-text">
                Your device <span className="iot-add-done-device">{device}</span> is now live.
                <br />
                Heat data will appear on the map shortly.
              </div>
              <button type="button" onClick={onClose} className="iot-add-done-btn">
                View on Map
              </button>
            </div>
          )}

          {!done && step === 0 && (
            <div className="iot-add-step-content">
              <div className="iot-add-step-p">🎯 Help map heat in your neighborhood by hosting a portable community IoT sensor.</div>
              <div className="iot-add-benefits">
                {['No technical skills needed', 'Just place it or carry it', 'Data appears on map automatically', 'You stay fully anonymous'].map(
                  (t, i) => (
                    <div key={i} className="iot-add-benefit-row">
                      <span className="iot-add-benefit-check">✅</span> {t}
                    </div>
                  )
                )}
              </div>
              <div className="iot-add-how">
                <div className="iot-add-how-title">HOW IT WORKS</div>
                {[
                  'Get a sensor from your barangay hall',
                  'Turn it on and pair with the BanasUno app',
                  'Carry or place it anywhere in your area',
                  'See your contribution live on the map!',
                ].map((t, i) => (
                  <div key={i} className="iot-add-how-step">
                    <span className="iot-add-how-num">{i + 1}.</span> {t}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setStep(1)} className="iot-add-cta">
                Get Started →
              </button>
            </div>
          )}

          {!done && step === 1 && (
            <div className="iot-add-step-content">
              <div className="iot-add-step-p">
                Turn on your BanasUno sensor — the indicator light should blink blue.
                <br />
                Hold your device nearby, then tap <strong>Scan</strong>.
              </div>
              <div className="iot-add-scan-box">
                <div className="iot-add-scan-header">
                  <div
                    className="iot-add-scan-dot"
                    style={{
                      background: scanning ? T.o5 : T.mute,
                      animation: scanning ? 'pinAlert 0.9s ease-in-out infinite' : 'none',
                    }}
                  />
                  <span className="iot-add-scan-text">{scanning ? 'Scanning for nearby devices…' : 'Ready to scan'}</span>
                  <button
                    type="button"
                    onClick={() => setScanning((s) => !s)}
                    className="iot-add-scan-btn"
                  >
                    {scanning ? 'Stop' : 'Scan'}
                  </button>
                </div>
                {scanning &&
                  scannedDevices.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDevice(d.id)}
                      className="iot-add-device-row"
                      style={{
                        background: device === d.id ? T.o0 : T.white,
                        border: `1.5px solid ${device === d.id ? T.o5 : T.line}`,
                      }}
                    >
                      <div className="iot-add-device-top">
                        <span className="iot-add-device-id" style={{ color: device === d.id ? T.o7 : T.ink3 }}>
                          {d.id}
                        </span>
                        <div className="iot-add-device-sig">
                          <span className="iot-add-device-sig-text">Signal {d.sig}%</span>
                          {device === d.id && <Ic.Check c={T.o5} s={12} />}
                        </div>
                      </div>
                      <div className="iot-add-device-bar">
                        <div
                          className="iot-add-device-bar-fill"
                          style={{
                            width: `${d.sig}%`,
                            background: d.sig > 75 ? T.g5 : d.sig > 50 ? T.y5 : T.r5,
                          }}
                        />
                      </div>
                    </button>
                  ))}
              </div>
              <div className="iot-add-nav">
                <button type="button" onClick={() => setStep(0)} className="iot-add-back">
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => device && setStep(2)}
                  className="iot-add-next"
                  style={{
                    background: device ? `linear-gradient(135deg,${T.o5},${T.o7})` : T.line,
                    color: device ? '#fff' : T.mute,
                    cursor: device ? 'pointer' : 'not-allowed',
                  }}
                >
                  Pair Device →
                </button>
              </div>
            </div>
          )}

          {!done && step === 2 && (
            <div className="iot-add-step-content">
              <div className="iot-add-privacy-title">How will you use this sensor?</div>
              {[
                ['mobile', 'Carry it with me', 'Your movement path appears on map'],
                ['fixed', 'Leave it in one place', 'Fixed pin at your chosen location'],
              ].map(([k, lbl, sub]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setUsage(k)}
                  className="iot-add-usage-option"
                  style={{
                    background: usage === k ? T.o0 : T.wash,
                    border: `1.5px solid ${usage === k ? T.o5 : T.line}`,
                  }}
                >
                  <div className="iot-add-usage-radio" style={{ borderColor: usage === k ? T.o5 : T.mute }}>
                    {usage === k && <div className="iot-add-usage-radio-dot" />}
                  </div>
                  <div className="iot-add-usage-text">
                    <div className="iot-add-usage-label" style={{ color: usage === k ? T.o7 : T.ink3 }}>
                      {lbl}
                    </div>
                    <div className="iot-add-usage-sub">{sub}</div>
                  </div>
                </button>
              ))}
              <div className="iot-add-privacy-note">
                🔒 <strong>Privacy first.</strong> Only barangay-level location is shared. Your identity stays anonymous.
              </div>
              <div className="iot-add-nav">
                <button type="button" onClick={() => setStep(1)} className="iot-add-back">
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => usage && setDone(true)}
                  className="iot-add-next"
                  style={{
                    background: usage ? `linear-gradient(135deg,${T.g5},${T.g7})` : T.line,
                    color: usage ? '#fff' : T.mute,
                    cursor: usage ? 'pointer' : 'not-allowed',
                  }}
                >
                  Start Contributing ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
