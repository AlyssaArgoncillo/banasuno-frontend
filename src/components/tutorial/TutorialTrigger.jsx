import { useState } from "react";
import { Ico } from "../ui/Icons.jsx";

export function TutorialTrigger({ onClick, className = "", style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title="Open tutorial"
      aria-label="Open tutorial"
      className={`tutorial-trigger ${className}`}
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "none",
        background: hov ? "linear-gradient(135deg,#FF8C3A,#C44F00)" : "linear-gradient(135deg,#FF6B1A,#E85A00)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: hov ? "0 8px 28px rgba(255,107,26,0.55)" : "0 4px 16px rgba(255,107,26,0.40)",
        transform: hov ? "scale(1.1)" : "scale(1)",
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        ...style,
      }}
    >
      <Ico name="HelpCircle" size={20} color="#fff" />
    </button>
  );
}
