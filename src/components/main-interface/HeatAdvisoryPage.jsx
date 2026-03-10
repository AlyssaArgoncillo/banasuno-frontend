import { UrgencyTicker } from "./UrgencyTicker";
import "../../styles/MainInterface.css";

const P = {
  orange500: "#FF6B1A", orange700: "#C44F00",
  orange100: "#FFD4B8", orange50: "#FFF4ED",
  gray900: "#212121", gray700: "#424242", gray500: "#757575",
};

const RISK_KEYS = ["not_hazardous", "caution", "extreme_caution", "danger", "extreme_danger"];

function riskKeyFromZone(selectedZone) {
  if (!selectedZone?.riskLevel?.level) return "extreme_caution";
  const level = selectedZone.riskLevel.level;
  return RISK_KEYS[Math.max(0, Math.min(level - 1, 4))] ?? "extreme_caution";
}

export default function HeatAdvisoryPage({ selectedZone, onGoToHeatMap }) {
  const barangay = selectedZone?.name ?? "Calinan";
  const riskKey = riskKeyFromZone(selectedZone);
  const hasZone = !!selectedZone;

  return (
    <div
      className="heat-advisory-page"
      style={{
        height: "100%",
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div style={{ padding: "clamp(16px, 4vw, 28px)", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: P.orange50, border: `1px solid ${P.orange100}`, borderRadius: 20, padding: "3px 12px", marginBottom: 10 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: P.orange700 }}>
              HEAT ADVISORY AI
            </span>
          </div>
          <h1 style={{ fontWeight: 900, fontSize: 26, color: P.gray900, margin: "0 0 6px", letterSpacing: "-0.025em" }}>
            Safety Recommendations
          </h1>
          <p style={{ fontSize: 13, color: P.gray500, margin: 0, lineHeight: 1.6 }}>
            AI-generated advisories based on the current PAGASA heat index for your selected area. Select a barangay on the Heat Map or use the gauge below to preview recommendations by risk level.
          </p>
        </div>

        {!hasZone ? (
          <div className="heat-advisory-choose-location" style={{
            background: P.orange50,
            border: `1px solid ${P.orange100}`,
            borderRadius: 16,
            padding: "clamp(24px, 5vw, 32px)",
            textAlign: "center",
          }}>
            <p style={{ fontSize: 15, color: P.gray700, margin: "0 0 8px", lineHeight: 1.5 }}>
              No data available – please select a zone first.
            </p>
            <p style={{ fontSize: 13, color: P.gray500, margin: "0 0 20px", lineHeight: 1.5 }}>
              Choose a location on the Heat Map to see safety recommendations for that area.
            </p>
            <button
              type="button"
              onClick={onGoToHeatMap}
              className="heat-advisory-choose-location-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                padding: "12px 24px",
                background: P.orange500,
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                borderRadius: 10,
                border: "none",
                boxShadow: "0 2px 10px rgba(255, 107, 26, 0.3)",
                transition: "background 0.2s, transform 0.15s",
                cursor: "pointer",
              }}
            >
              Choose location
            </button>
          </div>
        ) : (
          <UrgencyTicker barangay={barangay} riskKey={riskKey} selectedZone={selectedZone} />
        )}
      </div>
    </div>
  );
}
