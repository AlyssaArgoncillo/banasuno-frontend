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

export default function HeatAdvisoryPage({ selectedZone }) {
  const barangay = selectedZone?.name ?? "Calinan";
  const riskKey = riskKeyFromZone(selectedZone);

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
        <UrgencyTicker barangay={barangay} riskKey={riskKey} selectedZone={selectedZone} />
      </div>
    </div>
  );
}
