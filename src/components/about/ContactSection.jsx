import { useState } from "react";

const BG_DARK = "#1A1A1A";
const BG_CARD = "#3A3A3A";
const ORANGE = "#FF6B1A";
const ORANGE_GRAD = "linear-gradient(135deg, #FF6B1A 0%, #FFB800 100%)";
const WHITE = "#FFFFFF";
const GRAY = "#8A8A8A";

const team = [
  {
    id: 1,
    name: "Alyssa Nicole A. Argoncillo",
    role: "Project Lead & System Developer",
    bio: "Leads system architecture and end-to-end development of the BanasUno platform.",
    image: "/Ar.jpg",
    github: "https://github.com/AlyssaArgoncillo",
  },
  {
    id: 2,
    name: "Kisha Ann Joy M. Sanchez",
    role: "Data Analyst & UI Documentation Lead",
    bio: "Drives data analysis pipelines and maintains comprehensive UI documentation standards.",
    image: "/KS2.jpg",
    github: "https://github.com/KishaSanchez",
  },
];

const contacts = [
  { id: 1, type: "email",    label: "EMAIL",    value: "banasgmail.com",  sub: "Drop us a message anytime" },
  { id: 2, type: "phone",    label: "PHONE",    value: "0938 434 743",    sub: "Mon – Fri, 8 AM to 5 PM" },
  { id: 3, type: "location", label: "LOCATION", value: "Davao City",      sub: "Davao del Sur, Philippines" },
];

function Avatar({ name, size = 80 }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2);
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.22,
      background: ORANGE_GRAD,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32,
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 900, color: "#fff",
      flexShrink: 0,
      boxShadow: `0 8px 24px rgba(255,107,26,0.35)`,
      letterSpacing: "-0.02em",
    }}>
      {initials}
    </div>
  );
}

function ContactIcon({ type, size = 52 }) {
  const icons = {
    email: (
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
    phone: (
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6.02-6.02A19.79 19.79 0 0 1 2.82 4.18 2 2 0 0 1 4.82 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    location: (
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  };
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.22,
      background: ORANGE_GRAD,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      boxShadow: `0 6px 20px rgba(255,107,26,0.4)`,
    }}>
      {icons[type]}
    </div>
  );
}

const tagStyle = {
  display: "inline-flex",
  alignItems: "center",
  fontFamily: "'DM Mono', monospace",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.14em",
  color: ORANGE,
  background: `${ORANGE}18`,
  border: `1px solid ${ORANGE}44`,
  borderRadius: 20,
  padding: "3px 10px",
};

const btnStyle = {
  border: "none",
  background: ORANGE_GRAD,
  color: WHITE,
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 700,
  fontSize: 15,
  padding: "12px 28px",
  borderRadius: 12,
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(255,107,26,0.4)",
  transition: "opacity 0.18s",
  letterSpacing: "-0.01em",
};

export default function ContactSection() {
  const [hovT, setHovT] = useState(null);
  const [hovC, setHovC] = useState(null);

  return (
    <div style={{ background: "#111", minHeight: "100vh", padding: "8rem 3rem 10rem 3rem", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @media (max-width: 768px) {
          .contact-container {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          .contact-left, .contact-right {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,107,26,0.15) !important;
            padding: 40px 28px !important;
          }
          .contact-right {
            border-bottom: none !important;
          }
          .contact-heading {
            font-size: 28px !important;
          }
          .contact-desc {
            font-size: 12px !important;
          }
        }
        @media (max-width: 480px) {
          .contact-main {
            padding: 4rem 1.5rem 6rem 1.5rem !important;
          }
          .contact-container {
            border-radius: 16px !important;
            max-width: 100% !important;
          }
          .contact-left, .contact-right {
            padding: 28px 20px !important;
          }
          .contact-heading {
            font-size: 24px !important;
          }
          .team-image {
            width: 80px !important;
            height: 80px !important;
          }
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=DM+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <div className="contact-main" style={{
        maxWidth: 1200,
        margin: "0 auto",
      }}>
        <div className="contact-container" style={{
          background: BG_DARK,
          borderRadius: 24,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          minHeight: 700,
        }}>

        {/* LEFT — GET IN TOUCH */}
        <div className="contact-left" style={{ padding: "52px 36px", display: "flex", flexDirection: "column", borderRight: `1px solid rgba(255,107,26,0.15)` }}>
          <div style={tagStyle}>REACH OUT</div>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 900,
            fontSize: 36,
            color: WHITE,
            margin: "12px 0 10px",
            letterSpacing: "-0.02em",
            textAlign: "left",
            lineHeight: 1.15,
          }} className="contact-heading">
            GET IN<br /><span style={{ color: ORANGE }}>TOUCH</span>
          </h2>
          <p className="contact-desc" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: GRAY, marginBottom: 32, lineHeight: 1.6, margin: "0 0 32px" }}>
            Questions? Feedback? Opportunities?<br />We'd love to hear from you.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
            {contacts.map(c => (
              <div
                key={c.id}
                onMouseEnter={() => setHovC(c.id)}
                onMouseLeave={() => setHovC(null)}
                style={{
                  background: BG_CARD,
                  borderRadius: 18,
                  padding: "22px 24px",
                  display: "flex",
                  gap: 18,
                  alignItems: "center",
                  border: `1.5px solid ${hovC === c.id ? ORANGE + "55" : "transparent"}`,
                  boxShadow: hovC === c.id ? `0 8px 24px rgba(255,107,26,0.18)` : "0 2px 8px rgba(0,0,0,0.2)",
                  transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                  transform: hovC === c.id ? "translateX(4px)" : "none",
                  cursor: "default",
                }}
              >
                <ContactIcon type={c.type} size={64} />
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: ORANGE, marginBottom: 5 }}>{c.label}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, color: WHITE }}>{c.value}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: GRAY, marginTop: 2 }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — MEET THE TEAM */}
        <div className="contact-right" style={{ padding: "52px 40px" }}>
          <div style={tagStyle}>THE PEOPLE BEHIND IT</div>
          <h2 className="contact-heading" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 900,
            fontSize: 36,
            color: WHITE,
            margin: "12px 0 32px",
            letterSpacing: "-0.02em",
            textAlign: "left",
            lineHeight: 1.15,
          }}>
            MEET THE<br /><span style={{ color: ORANGE }}>TEAM</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {team.map(m => (
              <div
                key={m.id}
                onMouseEnter={() => setHovT(m.id)}
                onMouseLeave={() => setHovT(null)}
                style={{
                  background: BG_CARD,
                  borderRadius: 20,
                  padding: "24px",
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  border: `1.5px solid ${hovT === m.id ? ORANGE + "55" : "transparent"}`,
                  boxShadow: hovT === m.id ? `0 8px 28px rgba(255,107,26,0.18)` : "0 2px 8px rgba(0,0,0,0.2)",
                  transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                  transform: hovT === m.id ? "translateX(-4px)" : "none",
                }}
              >
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="team-image"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "20px",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Avatar name={m.name} size={100} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 16, color: WHITE, letterSpacing: "-0.01em" }}>{m.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: ORANGE, marginTop: 2, fontWeight: 600 }}>{m.role}</div>
                  <div style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    border: `1.5px dashed ${ORANGE}55`,
                    borderRadius: 10,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, color: GRAY, lineHeight: 1.6,
                  }}>{m.bio}</div>
                  <button
                    onClick={() => window.open(m.github, "_blank")}
                    style={{ ...btnStyle, marginTop: 12, padding: "9px 20px", fontSize: 13 }}
                  >
                    Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}
