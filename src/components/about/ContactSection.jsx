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
    role: "Backend & Frontend Designer",
    bio: "Leads backend development (APIs, data sourcing, and core logic), frontend styling and branding, plus repository management, framework decisions, and integration oversight.",
    image: "/Ar.jpg",
    github: "https://github.com/AlyssaArgoncillo",
  },
  {
    id: 2,
    name: "Kisha Ann Joy M. Sanchez",
    role: "UI/UX & Integration Developer",
    bio: "Drives frontend and UI/UX implementation, AI integration and backend refinement, and documentation of sources, citations, and design choices for traceability.",
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
  const s = size * 0.45;
  const icons = {
    email: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
    phone: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6.02-6.02A19.79 19.79 0 0 1 2.82 4.18 2 2 0 0 1 4.82 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    location: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <div className="contact-section-wrapper" style={{ background: "#111", minHeight: "100vh", padding: "8rem 3rem 10rem 3rem",  }}>
      <style>{`
        .contact-section-wrapper { box-sizing: border-box; }
        .contact-section-wrapper * { box-sizing: border-box; }
        .contact-main { width: 100% !important; max-width: 100% !important; overflow-x: hidden; }
        .contact-container { width: 100% !important; max-width: 100% !important; }
        .contact-card-item { min-width: 0; }
        .contact-card-item .contact-card-text { min-width: 0; overflow-wrap: break-word; word-break: break-word; }
        .contact-team-card { min-width: 0; }
        .contact-team-card .contact-team-content { min-width: 0; overflow-wrap: break-word; word-break: break-word; }
        @media (max-width: 900px) {
          .contact-section-wrapper { padding: 6rem 2rem 8rem 2rem !important; }
        }
        @media (max-width: 768px) {
          .contact-section-wrapper { padding: 4rem 1.5rem 6rem 1.5rem !important; }
          .contact-main { display: flex !important; flex-direction: column !important; align-items: center !important; }
          .contact-container {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
            width: 100% !important;
          }
          .contact-left, .contact-right {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,107,26,0.15) !important;
            padding: 2rem 1.5rem !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .contact-right {
            border-bottom: none !important;
            padding-top: 2rem !important;
          }
          .contact-left > div:first-child,
          .contact-right > div:first-child { align-self: center !important; }
          .contact-heading {
            font-size: 28px !important;
            text-align: center !important;
          }
          .contact-desc {
            font-size: 13px !important;
            text-align: center !important;
          }
          .contact-left > div:last-child {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
          }
          .contact-card-item {
            flex-direction: row !important;
            padding: 1rem 1.25rem !important;
            gap: 1rem !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .contact-card-item .contact-card-text { text-align: center !important; }
          .contact-card-item .contact-icon-wrap {
            width: 48px !important;
            height: 48px !important;
            min-width: 48px !important;
          }
          .contact-card-item .contact-icon-wrap > div {
            width: 100% !important;
            height: 100% !important;
            max-width: 48px !important;
            max-height: 48px !important;
          }
          .contact-card-item .contact-icon-wrap svg {
            width: 22px !important;
            height: 22px !important;
          }
          .contact-right > div:last-child {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
          }
          .contact-team-card {
            flex-direction: column !important;
            align-items: center !important;
            padding: 1.25rem !important;
            gap: 1rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .contact-team-card .team-avatar-wrap {
            width: 72px !important;
            height: 72px !important;
          }
          .contact-team-card .team-avatar-wrap .team-image,
          .contact-team-card .team-avatar-wrap > div {
            width: 100% !important;
            height: 100% !important;
            max-width: 72px !important;
            max-height: 72px !important;
          }
          .contact-team-card .contact-team-content {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
          }
          .contact-team-card .contact-team-content .contact-team-name { font-size: 14px !important; }
          .contact-team-card .contact-team-content .contact-team-role { font-size: 12px !important; }
          .contact-team-card .contact-team-content .contact-team-bio { font-size: 12px !important; padding: 8px 10px !important; }
        }
        @media (max-width: 480px) {
          .contact-section-wrapper { padding: 3rem 1rem 5rem 1rem !important; }
          .contact-main { display: flex !important; flex-direction: column !important; align-items: center !important; }
          .contact-container {
            border-radius: 16px !important;
          }
          .contact-left, .contact-right {
            padding: 1.5rem 1rem !important;
            align-items: center !important;
            text-align: center !important;
          }
          .contact-left > div:first-child,
          .contact-right > div:first-child { align-self: center !important; }
          .contact-heading {
            font-size: 22px !important;
            line-height: 1.2 !important;
            text-align: center !important;
          }
          .contact-desc {
            font-size: 12px !important;
            text-align: center !important;
          }
          .contact-left > div:last-child { align-items: center !important; }
          .contact-card-item {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            padding: 1rem !important;
          }
          .contact-card-item .contact-card-text { text-align: center !important; }
          .contact-card-item .contact-icon-wrap {
            width: 44px !important;
            height: 44px !important;
            min-width: 44px !important;
          }
          .contact-card-item .contact-icon-wrap > div {
            max-width: 44px !important;
            max-height: 44px !important;
          }
          .contact-team-card .team-avatar-wrap {
            width: 64px !important;
            height: 64px !important;
          }
          .contact-team-card .team-avatar-wrap .team-image,
          .contact-team-card .team-avatar-wrap > div {
            max-width: 64px !important;
            max-height: 64px !important;
          }
          .contact-team-card .contact-team-content {
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
          }
          .contact-team-card .contact-team-content .contact-team-name { font-size: 13px !important; }
          .contact-team-card .contact-team-content .contact-team-role { font-size: 11px !important; }
          .contact-team-card .contact-team-content .contact-team-bio { font-size: 11px !important; }
        }
        @media (max-width: 360px) {
          .contact-section-wrapper { padding: 2.5rem 0.75rem 4rem 0.75rem !important; }
          .contact-left, .contact-right { padding: 1.25rem 0.75rem !important; }
          .contact-heading { font-size: 20px !important; }
        }
      `}</style>
      
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
          <p className="contact-desc" style={{ fontSize: 14, color: GRAY, marginBottom: 32, lineHeight: 1.6, margin: "0 0 32px" }}>
            Questions? Feedback? Opportunities?<br />We'd love to hear from you.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
            {contacts.map(c => (
              <div
                key={c.id}
                className="contact-card-item"
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
                <div className="contact-icon-wrap" style={{ flexShrink: 0 }}>
                  <ContactIcon type={c.type} size={64} />
                </div>
                <div className="contact-card-text">
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: ORANGE, marginBottom: 5 }}>{c.label}</div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: WHITE }}>{c.value}</div>
                  <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — MEET THE TEAM */}
        <div className="contact-right" style={{ padding: "52px 40px" }}>
          <div style={tagStyle}>THE PEOPLE BEHIND IT</div>
          <h2 className="contact-heading" style={{
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
                className="contact-team-card"
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
                <div className="team-avatar-wrap" style={{ flexShrink: 0 }}>
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
                      }}
                    />
                  ) : (
                    <Avatar name={m.name} size={100} />
                  )}
                </div>
                <div className="contact-team-content" style={{ flex: 1, minWidth: 0 }}>
                  <div className="contact-team-name" style={{ fontWeight: 800, fontSize: 16, color: WHITE, letterSpacing: "-0.01em" }}>{m.name}</div>
                  <div className="contact-team-role" style={{ fontSize: 13, color: ORANGE, marginTop: 2, fontWeight: 600 }}>{m.role}</div>
                  <div className="contact-team-bio" style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    border: `1.5px dashed ${ORANGE}55`,
                    borderRadius: 10,
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
