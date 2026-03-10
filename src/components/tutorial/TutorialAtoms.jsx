import { Ico } from "../ui/Icons.jsx";

export function ProgressBar({ step, total, color = "#FF6B1A" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 3, background: "rgba(0,0,0,0.08)", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            borderRadius: 2,
            background: `linear-gradient(90deg,${color},#FFB800)`,
            width: `${(step / total) * 100}%`,
            transition: "width 0.45s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'DM Mono',monospace",
          fontSize: 9,
          fontWeight: 700,
          color: "rgba(90,60,30,0.45)",
          letterSpacing: "0.10em",
          whiteSpace: "nowrap",
        }}
      >
        {step} / {total}
      </span>
    </div>
  );
}

export function Dots({ step, total, color = "#FF6B1A", onGo }) {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          onClick={() => onGo?.(i)}
          style={{
            width: i === step - 1 ? 18 : 6,
            height: 6,
            borderRadius: 4,
            background: i < step ? color : i === step - 1 ? color : "rgba(0,0,0,0.12)",
            opacity: i < step ? 1 : i === step - 1 ? 1 : 0.35,
            cursor: onGo ? "pointer" : "default",
            transition: "all 0.32s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      ))}
    </div>
  );
}

export function SectionChip({ label }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 20,
        background: "rgba(255,107,26,0.10)",
        border: "1px solid rgba(255,107,26,0.22)",
        fontFamily: "'DM Mono',monospace",
        fontSize: 8.5,
        fontWeight: 700,
        color: "#C44F00",
        letterSpacing: "0.12em",
        marginBottom: 8,
      }}
    >
      {label}
    </div>
  );
}

export function ActionCard({ iconName, label, tip, visible, delay = 0 }) {
  return (
    <div
      style={{
        background: "rgba(255,107,26,0.06)",
        borderRadius: 14,
        padding: "12px 10px",
        textAlign: "center",
        border: "1.5px solid rgba(255,107,26,0.14)",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(14px) scale(0.88)",
        transition: `opacity 0.32s ${delay}s, transform 0.35s ${delay}s cubic-bezier(0.34,1.56,0.64,1)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "rgba(255,107,26,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ico name={iconName} size={18} color="#C44F00" />
      </div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 12, color: "#C44F00" }}>
        {label}
      </div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#757575", lineHeight: 1.5 }}>
        {tip}
      </div>
    </div>
  );
}
