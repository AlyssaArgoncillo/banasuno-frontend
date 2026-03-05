import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/landing/Header.jsx';
import HeroAbout from '../components/about/HeroAbout.jsx';
import HowItWorks from '../components/about/HowItWorks.jsx';
import HeatSafety from '../components/about/HeatSafety.jsx';
import ContactSection from '../components/about/ContactSection.jsx';
import '../styles/AboutPage.css';

// ─── PALETTE ─────────────────────────────────────────
const P = {
  orange500: "#FF6B1A", orange700: "#C44F00", orange900: "#7A2D00",
  orange100: "#FFD4B8", orange50: "#FFF4ED",
  yellow500: "#FFB800", yellow100: "#FFEAB3", yellow50: "#FFF9E6",
  blue700: "#1565C0", blue100: "#BBDEFB",
  green500: "#4A9C4D", green100: "#C8E6C9",
  gray900: "#212121", gray700: "#424242",
  gray500: "#757575", gray300: "#BDBDBD", gray100: "#EEEEEE",
  cream: "#FAF7F2", creamBorder: "#EDE8DF",
  white: "#FFFFFF",
};

// ─── CONTENT ─────────────────────────────────────────
const overview = {
  p1: "BanasUno is a web‑based tool that makes neighborhood heat information accessible to everyone. It uses official PAGASA heat levels and translates them into a simple, interactive map so residents can quickly see which areas are hotter and identify nearby health facilities.",
  p2: "The goal is not to replace PAGASA or issue official weather warnings. Instead, BanasUno helps people understand heat risk at the barangay level, making official information easier to see and act upon.",
};
const purpose = "Urban heat exposure is a growing risk in tropical cities. While PAGASA provides official heat alerts, those warnings are often broad and difficult to interpret locally. BanasUno bridges this gap by translating official heat information into actionable, neighborhood‑specific guidance for the public — without claiming higher precision or replacing official forecasts.";
const objectives = [
  "Display barangay‑level heat intensity on an interactive web map.",
  "Calculate and show heat risk scores using temperature and humidity.",
  "Help users locate nearby clinics and health facilities in high‑risk areas.",
  "Provide short‑term historical heat trends for awareness and planning.",
  "Ensure the interface is responsive and accessible on both desktop and mobile devices.",
];
const disclaimer = `The system calculates neighborhood heat risk using the Rothfusz regression heat index, a widely accepted formula that estimates "feels‑like" temperature from actual temperature and humidity. These computed values are then mapped to PAGASA's official heat risk bands (Caution, Extreme Caution, Danger, Extreme Danger). The AI component (Gemini) does not recalculate heat or claim greater precision. Instead, it uses the backend's PAGASA‑aligned levels to generate informative advisories, ensuring they remain reliable, auditable, and consistent with official standards.`;
// ─── SECTION ICONS (SVG) ─────────────────────────────
const IconPurpose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const IconObjectives = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 2C9.24 2 7 4.24 7 7c0 4.42 5 11 5 11s5-6.58 5-11c0-2.76-2.24-5-5-5z" />
    <circle cx="12" cy="7" r="2.5" />
  </svg>
);
const IconDisclaimer = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 4v16" />
    <path d="M5 8h14" />
    <path d="M6 8v3l6 4 6-4V8" />
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
  </svg>
);

// Strategic Goals (SDG) icons
const IconSdgCities = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4 8 4v14" />
    <path d="M9 21v-6h6v6" />
    <path d="M9 9h.01" />
    <path d="M15 9h.01" />
    <path d="M9 15h6" />
  </svg>
);
const IconSdgHealth = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconSdgClimate = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20" />
  </svg>
);
const sdgIconComponents = [IconSdgCities, IconSdgHealth, IconSdgClimate];

const sdgs = [
  {
    num: "11", title: "Sustainable Cities & Communities",
    color: P.orange500, light: P.orange100, bg: P.orange50,
    body: "Supports inclusive and resilient urban awareness. Barangay‑level heat maps and risk scores help communities recognize hotspots and take precautions without implying official hazard measurements.",
  },
  {
    num: "3", title: "Good Health & Well‑Being",
    color: P.green500, light: P.green100, bg: "#F0FAF0",
    body: "Offers actionable health guidance during high‑heat periods. Residents can identify high‑risk areas and nearby clinics, encouraging preventive behavior — especially for vulnerable groups.",
  },
  {
    num: "13", title: "Climate Action",
    color: P.blue700, light: P.blue100, bg: "#EEF4FF",
    body: "Promotes public understanding of urban heat trends. Historical and current data help residents observe patterns, anticipate risks, and adopt adaptive strategies that strengthen resilience.",
  },
];

function AboutPage() {
  const location = useLocation();
  const [hovObj, setHovObj] = useState(null);
  const [openDisc, setOpenDisc] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (location.hash) {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo(0, 0);
      }
    };

    const images = document.querySelectorAll('img');
    if (images.length === 0) {
      setTimeout(handleScroll, 300);
    } else {
      let loadedCount = 0;
      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          handleScroll();
        }
      };

      images.forEach(img => {
        if (img.complete) {
          checkAllLoaded();
        } else {
          img.addEventListener('load', checkAllLoaded);
          img.addEventListener('error', checkAllLoaded);
        }
      });

      setTimeout(handleScroll, 1500);
    }
  }, [location.hash]);

  return (
    <div className="about-page">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <Header />
      <HeroAbout />

      {/* New sections: Purpose, Quote, Objectives, Disclaimer, SDG */}
      <div className="about-detail-sections" style={{ background: "transparent", fontFamily: "'DM Sans', sans-serif" }}>
        <div className="about-detail-sections-wrap">

          {/* BENTO: PURPOSE + QUOTE */}
          <div className="about-detail-bento">
            <div style={{ background: `linear-gradient(135deg, ${P.orange700} 0%, ${P.orange500} 100%)`, borderRadius: 20, padding: "30px 32px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -30, bottom: -30, width: 140, height: 140, borderRadius: "50%", border: "28px solid rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", left: -20, top: -20, width: 90, height: 90, borderRadius: "50%", border: "20px solid rgba(255,255,255,0.05)" }} />
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-flex", color: "rgba(255,255,255,0.85)" }}><IconPurpose /></span>
                PURPOSE
              </div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 20, color: P.white, letterSpacing: "-0.02em", margin: "0 0 12px" }}>Why We Built This</h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.8, margin: 0 }}>{purpose}</p>
            </div>
            <div style={{ background: P.yellow50, border: `1.5px solid ${P.yellow100}`, borderRadius: 20, padding: "28px 26px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 12, fontFamily: "Georgia, serif", color: P.orange700, opacity: 0.25 }}>"</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", fontSize: 13.5, color: P.gray700, lineHeight: 1.75, margin: 0 }}>
                {overview.p2}
              </p>
              <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 3, borderRadius: 2, background: P.orange500 }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: P.orange700 }}>OVERVIEW</span>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 44 }}>
            <div style={{ flex: 1, height: 1, background: P.creamBorder }} />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: P.gray300 }}>DETAILED SECTIONS</div>
            <div style={{ flex: 1, height: 1, background: P.creamBorder }} />
          </div>

          {/* OBJECTIVES */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 4, alignSelf: "stretch", background: P.orange500, borderRadius: 2, flexShrink: 0 }} />
              <div style={{ width: 38, height: 38, borderRadius: 10, background: P.gray900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: P.white }}>
                <IconObjectives />
              </div>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: P.orange500, marginBottom: 2 }}>SECTION 03</div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 22, color: P.gray900, letterSpacing: "-0.02em", margin: 0 }}>Objectives</h2>
              </div>
            </div>
            <div className="about-detail-objectives" style={{ paddingLeft: 16 }}>
              {objectives.map((obj, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHovObj(i)}
                  onMouseLeave={() => setHovObj(null)}
                  style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "14px 18px",
                    background: hovObj === i ? P.white : (i % 2 === 0 ? P.cream : P.white),
                    border: `1.5px solid ${hovObj === i ? P.orange100 : P.creamBorder}`,
                    borderRadius: 12,
                    boxShadow: hovObj === i ? "0 4px 16px rgba(255,107,26,0.08)" : "none",
                    transition: "all 0.18s",
                    cursor: "default",
                  }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: 8,
                    background: hovObj === i ? P.orange500 : P.orange100,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 11,
                    color: hovObj === i ? P.white : P.orange700,
                    flexShrink: 0, marginTop: 1, transition: "all 0.18s",
                  }}>{i + 1}</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: P.gray700, lineHeight: 1.65, margin: 0 }}>{obj}</p>
                </div>
              ))}
            </div>
          </div>

          {/* DISCLAIMER */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 4, alignSelf: "stretch", background: P.orange500, borderRadius: 2, flexShrink: 0 }} />
              <div style={{ width: 38, height: 38, borderRadius: 10, background: P.yellow500, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: P.gray900 }}>
                <IconDisclaimer />
              </div>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: P.orange500, marginBottom: 2 }}>SECTION 04</div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 22, color: P.gray900, letterSpacing: "-0.02em", margin: 0 }}>Disclaimer</h2>
              </div>
            </div>
            <div style={{ paddingLeft: 16, borderRadius: 16, overflow: "hidden", border: `1.5px solid ${P.yellow100}` }}>
              <button
                type="button"
                className="about-detail-disclaimer-btn"
                onClick={() => setOpenDisc(!openDisc)}
                style={{
                  width: "100%", border: "none", background: P.yellow50,
                  padding: "16px 24px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: P.gray900 }}>Accuracy & Scope of the System</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#8B6914", marginTop: 2 }}>
                    {openDisc ? "Click to collapse" : "Click to read the full disclaimer"}
                  </div>
                </div>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: openDisc ? P.orange500 : "#8B6914",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'DM Mono', monospace", fontSize: 18, color: P.white,
                  flexShrink: 0, transition: "all 0.2s",
                  transform: openDisc ? "rotate(45deg)" : "none",
                }}>+</div>
              </button>
              {openDisc && (
                <div style={{ padding: "20px 24px", background: P.white, animation: "fadeUp 0.25s both", borderTop: `1px solid ${P.yellow100}` }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: P.gray700, lineHeight: 1.85, margin: 0 }}>{disclaimer}</p>
                </div>
              )}
            </div>
          </div>

          {/* STRATEGIC GOALS / SDG */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 4, alignSelf: "stretch", background: P.orange500, borderRadius: 2, flexShrink: 0 }} />
              <div style={{ width: 38, height: 38, borderRadius: 10, background: P.blue700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: P.white }}>
                <IconSdgClimate />
              </div>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: P.orange500, marginBottom: 2 }}>SECTION 05 · SDG ALIGNMENT</div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 22, color: P.gray900, letterSpacing: "-0.02em", margin: 0 }}>Strategic Goals</h2>
              </div>
            </div>
            <div style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              {sdgs.map((sdg, i) => (
                <div key={i} className="about-detail-sdg-row" style={{ borderRadius: 16, overflow: "hidden", border: `1.5px solid ${sdg.light}` }}>
                  <div className="about-detail-sdg-icon-cell" style={{ background: sdg.color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 0", gap: 8, color: "rgba(255,255,255,0.95)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {(() => {
                        const SdgIcon = sdgIconComponents[i];
                        return SdgIcon ? <SdgIcon /> : null;
                      })()}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 26, color: "rgba(255,255,255,0.15)", lineHeight: 1 }}>{sdg.num}</div>
                  </div>
                  <div style={{ padding: "22px 26px", background: sdg.bg }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: sdg.color }}>SDG {sdg.num}</div>
                      <div style={{ width: 20, height: 2, background: sdg.color, borderRadius: 1, opacity: 0.4 }} />
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15, color: P.gray900, marginBottom: 10, letterSpacing: "-0.01em" }}>{sdg.title}</div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: P.gray700, lineHeight: 1.8, margin: 0 }}>{sdg.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <HowItWorks />
      <HeatSafety />
      <ContactSection />
    </div>
  );
}

export default AboutPage;
