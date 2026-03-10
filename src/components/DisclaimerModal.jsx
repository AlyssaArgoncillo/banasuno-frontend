import { useState, useEffect } from "react";
import "../styles/DisclaimerModal.css";

const TITLE = "About heat risk on this map";
const BODY = "BanasUno estimates heat risk using temperature and humidity, then matches it to PAGASA's official heat levels (Caution, Extreme Caution, Danger, Extreme Danger). Our AI generates advisories based on these official levels — it does not calculate its own heat readings. This keeps all information reliable and consistent with government standards.";

// Animation: phase 0 → backdrop + rings | phase 1 → curtain drops | phase 2 → curtain retracts | phase 3 → content
function DisclaimerModal({ onClose }) {
  const [phase, setPhase] = useState(0);
  const [closing, setClosing] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const [thermoImgOk, setThermoImgOk] = useState(true); // use thermo.png if it loads

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 180);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => setPhase(3), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 1100);
  };

  const words = BODY.split(" ");

  const show = phase >= 1 && !closing;
  const curtainOn = phase === 1 && !closing;
  const content = phase >= 3 && !closing;

  return (
    <div
      className="disclaimer-modal-overlay"
      onClick={close}
      role="dialog"
      aria-labelledby="disclaimer-modal-title"
      aria-modal="true"
      style={{
        background: closing
          ? "rgba(28,10,2,0)"
          : phase >= 1
            ? "rgba(28,10,2,0.58)"
            : "rgba(28,10,2,0)",
        backdropFilter: !closing && phase >= 1 ? "blur(20px) saturate(1.5)" : "blur(0px)",
        WebkitBackdropFilter: !closing && phase >= 1 ? "blur(20px) saturate(1.5)" : "blur(0px)",
      }}
    >
      <div
        className="disclaimer-modal-inner"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Radiating rings behind the card */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`disclaimer-modal-ring disclaimer-modal-ring--${i}`}
            style={{
              width: show ? 360 + i * 110 : 0,
              height: show ? 360 + i * 110 : 0,
              border: `${2 - i * 0.5}px solid rgba(255,107,26,${0.28 - i * 0.07})`,
              animation:
                !closing && phase >= 3
                  ? `disclaimerRingPulse${i} ${4.5 + i * 0.6}s ${i * 0.5}s ease-in-out infinite`
                  : "none",
            }}
            aria-hidden
          />
        ))}

        {/* Gradient-bordered card wrapper */}
        <div
          className="disclaimer-modal-card-wrapper"
          style={{
            padding: 2,
            borderRadius: 26,
            background:
              show && phase >= 2
                ? "linear-gradient(135deg, #FF6B1A 0%, #FFB800 50%, #FF6B1A 100%)"
                : "transparent",
            boxShadow:
              show && phase >= 2
                ? "0 0 56px rgba(255,107,26,0.30), 0 32px 80px rgba(0,0,0,0.28)"
                : "0 32px 80px rgba(0,0,0,0.28)",
            transform: closing
              ? "scale(0.86) translateY(22px)"
              : phase >= 1
                ? "scale(1) translateY(0)"
                : "scale(0.76) translateY(28px)",
            opacity: closing ? 0 : phase >= 1 ? 1 : 0,
          }}
        >
          {/* Frosted glass card */}
          <div className="disclaimer-modal-card">
            {/* Orange curtain that drops then retracts */}
            <div
              className="disclaimer-modal-curtain"
              style={{
                height: curtainOn ? "100%" : "0%",
              }}
            >
              <div className="disclaimer-modal-curtain-fill">
                <div className="disclaimer-modal-curtain-dots" aria-hidden />
                <div className="disclaimer-modal-curtain-wordmark" aria-hidden>
                  BANASUNO
                </div>
              </div>
            </div>

            {/* Card content (under curtain) */}
            <div className="disclaimer-modal-content">
              {/* Top row: icon + label + close */}
              <div className="disclaimer-modal-header">
                <div className="disclaimer-modal-header-left">
                  <div
                    className="disclaimer-modal-icon-wrap"
                    style={{
                      animation: content ? "disclaimerIconPulse 3.8s 0.6s ease-in-out infinite" : "none",
                    }}
                    aria-hidden
                  >
                    {thermoImgOk ? (
                      <img src="/thermo.png" alt="" width={76} height={76} onError={() => setThermoImgOk(false)} />
                    ) : (
                      <span style={{ fontSize: "76px" }}>🌡️</span>
                    )}
                  </div>
                  <div
                    className="disclaimer-modal-label"
                    style={{ opacity: content ? 1 : 0 }}
                  >
                    HEAT RISK INFO
                  </div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="disclaimer-modal-close"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Title */}
              <h2
                id="disclaimer-modal-title"
                className="disclaimer-modal-title"
                style={{
                  opacity: content ? 1 : 0,
                  transform: content ? "none" : "translateY(10px)",
                }}
              >
                {TITLE}
              </h2>

              {/* Animated rule */}
              <div
                className="disclaimer-modal-rule"
                style={{ width: content ? "100%" : "0%" }}
              />

              {/* Word-by-word body */}
              <p className="disclaimer-modal-body">
                {words.map((w, i) => (
                  <span
                    key={i}
                    style={{
                      opacity: content ? 1 : 0,
                      transition: `opacity 0.32s ${0.22 + i * 0.03}s`,
                    }}
                  >
                    {w}{" "}
                  </span>
                ))}
              </p>

              {/* Bottom accent bar */}
              <div
                className="disclaimer-modal-accent"
                style={{
                  transform: content ? "scaleX(1)" : "scaleX(0)",
                }}
              />

              {/* Got it button */}
              <button
                type="button"
                onClick={close}
                onMouseEnter={() => setBtnHov(true)}
                onMouseLeave={() => setBtnHov(false)}
                className="disclaimer-modal-btn"
                style={{
                  border: `2px solid ${btnHov ? "#FF6B1A" : "#1A1A1A"}`,
                  background: btnHov
                    ? "linear-gradient(135deg,#FF8C3A,#C44F00)"
                    : "#1A1A1A",
                  boxShadow: btnHov
                    ? "0 6px 22px rgba(255,107,26,0.40)"
                    : "0 4px 14px rgba(0,0,0,0.18)",
                  transform: btnHov ? "translateY(-2px)" : "translateY(0)",
                  opacity: content ? 1 : 0,
                  transitionDelay: content ? "0.6s" : "0s",
                }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisclaimerModal;
