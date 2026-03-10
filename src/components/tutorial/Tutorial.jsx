import { useState, useEffect } from "react";
import { Ico } from "../ui/Icons.jsx";
import { STEPS, TOTAL_STEPS, STEP_ICONS } from "./tutorialSteps.js";
import { useSlide } from "./useSlide.js";
import { ProgressBar, Dots } from "./TutorialAtoms.jsx";
import { StepVisual } from "./StepVisual.jsx";
import "../../styles/Tutorial.css";

export function Tutorial({ onClose, onDontShowAgain }) {
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setClosing(true);
    if (dontShow && typeof onDontShowAgain === "function") onDontShowAgain();
    setTimeout(onClose, 420);
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));
  const next = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else close();
  };

  const visible = useSlide(step);
  const s = STEPS[step - 1];
  const isLast = step === TOTAL_STEPS;

  return (
    <>
      <div
        onClick={close}
        className="tutorial-backdrop"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1300,
          background: mounted && !closing ? "rgba(10,4,0,0.62)" : "rgba(10,4,0,0)",
          backdropFilter: mounted && !closing ? "blur(8px)" : "blur(0px)",
          WebkitBackdropFilter: mounted && !closing ? "blur(8px)" : "blur(0px)",
          transition: "background 0.42s ease, backdrop-filter 0.42s ease",
        }}
      />

      <div
        className="tutorial-sheet-wrapper"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1301,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="tutorial-sheet"
          style={{
            width: "100%",
            maxWidth: 540,
            background: "#FFFAF5",
            borderRadius: "22px 22px 0 0",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 -20px 72px rgba(0,0,0,0.24), 0 -1px 0 rgba(255,107,26,0.12)",
            overflow: "hidden",
            transform: closing ? "translateY(100%)" : mounted ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.46s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <div style={{ padding: "12px 0 0", display: "flex", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.12)" }} />
          </div>

          <div
            style={{
              margin: "12px 20px 0",
              borderRadius: 16,
              background: `linear-gradient(135deg, ${s.color} 0%, ${s.color === "#C44F00" ? "#FF8C3A" : "#C44F00"} 100%)`,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              position: "relative",
              overflow: "hidden",
              transition: "background 0.38s ease",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                flexShrink: 0,
                position: "relative",
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                animation: visible ? "tutorial-iconPulse 2.6s 0.6s ease-in-out infinite" : "none",
              }}
            >
              <Ico name={STEP_ICONS[s.iconKey]} size={22} color="rgba(255,255,255,0.95)" />
              <svg width="46" height="46" viewBox="0 0 46 46" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
                <circle cx="23" cy="23" r="20" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
                <circle
                  cx="23"
                  cy="23"
                  r="20"
                  fill="none"
                  stroke="rgba(255,255,255,0.90)"
                  strokeWidth="2.5"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 - (2 * Math.PI * 20 * step) / TOTAL_STEPS}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.22,1,0.36,1)" }}
                />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 8.5,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: 2,
                  opacity: visible ? 1 : 0,
                  transition: "opacity 0.3s 0.08s",
                }}
              >
                {s.tag}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 900,
                  fontSize: 15,
                  color: "#fff",
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(6px)",
                  transition: "opacity 0.35s 0.12s, transform 0.35s 0.12s ease",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {s.title}
              </div>
            </div>
            <button
              onClick={close}
              type="button"
              aria-label="Close tutorial"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                flexShrink: 0,
                background: "rgba(255,255,255,0.18)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.18s, transform 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.32)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Ico name="XCircle" size={16} color="rgba(255,255,255,0.95)" />
            </button>
          </div>

          <div style={{ padding: "14px 20px 0", flexShrink: 0 }}>
            <ProgressBar step={step} total={TOTAL_STEPS} color={s.color} />
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              WebkitOverflowScrolling: "touch",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                lineHeight: 1.78,
                color: "#4A3828",
                margin: 0,
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(8px)",
                transition: "opacity 0.36s 0.14s, transform 0.36s 0.14s ease",
              }}
            >
              {s.desc}
            </p>
            <StepVisual s={s} visible={visible} />
          </div>

          <div style={{ padding: "4px 20px 10px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
            <Dots step={step} total={TOTAL_STEPS} color={s.color} onGo={(i) => setStep(i + 1)} />
          </div>

          <div style={{ padding: "10px 20px 32px", flexShrink: 0, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            {isLast && (
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  marginBottom: 12,
                  userSelect: "none",
                }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setDontShow((d) => !d)}
                  onKeyDown={(e) => e.key === "Enter" && setDontShow((d) => !d)}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    flexShrink: 0,
                    background: dontShow ? "#FF6B1A" : "#fff",
                    border: `2px solid ${dontShow ? "#FF6B1A" : "#DDD6CC"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.18s",
                  }}
                >
                  {dontShow && <Ico name="CheckCircle" size={12} color="#fff" />}
                </div>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#757575" }}>
                  Don't show this again
                </span>
              </label>
            )}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {step > 1 && (
                <button
                  onClick={prev}
                  type="button"
                  className="tutorial-btn tutorial-btn-prev"
                >
                  <Ico name="ChevronLeft" size={14} color="#5A4030" /> Prev
                </button>
              )}
              {!isLast && (
                <button onClick={close} type="button" className="tutorial-btn tutorial-btn-skip">
                  Skip
                </button>
              )}
              <button
                onClick={next}
                type="button"
                className="tutorial-btn tutorial-btn-next"
                style={{
                  background: `linear-gradient(135deg, ${s.color}, ${s.color === "#C44F00" ? "#FF8C3A" : "#C44F00"})`,
                  boxShadow: `0 4px 16px ${s.color}44`,
                }}
              >
                {isLast ? (
                  <>
                    <Ico name="Map" size={16} color="#fff" /> Start Exploring
                  </>
                ) : (
                  <>
                    Next <Ico name="ChevronRight" size={14} color="#fff" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
