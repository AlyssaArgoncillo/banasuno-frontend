import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}
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

// Map pin for Objectives section header
const IconMapPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Target for SDG section header
const IconTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
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
  const [purposeRef, purposeVis] = useInView(0.35);
  const [objRef, objVis] = useInView(0.35);
  const [sdgRef, sdgVis] = useInView(0.35);

  useEffect(() => {
    // Respect hash from URL (e.g. from nav dropdown): scroll to section after mount.
    if (location.hash) {
      const scrollToHash = () => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      const t = setTimeout(scrollToHash, 150);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [location.hash]);

  return (
    <div className="about-page">
            <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <Header />
      <HeroAbout />

      {/* New sections: Purpose, Quote, Objectives, Disclaimer, SDG */}
      <div className="about-detail-sections" style={{ background: "transparent",  }}>
        <div className="about-detail-sections-wrap">

          {/* PURPOSE & OVERVIEW — ghost watermark, two-column, animations */}
          <div
            id="purpose"
            ref={purposeRef}
            className="about-purpose-card"
            style={{
              opacity: purposeVis ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          >
            <div className="about-purpose-watermark" aria-hidden>PURPOSE</div>
            <div className="about-purpose-inner">
              <div className="about-purpose-left">
                <div className="about-purpose-kicker">
                  <IconPurpose /> WHY WE BUILT THIS
                </div>
                <h2
                  className="about-purpose-heading"
                  style={{
                    opacity: purposeVis ? 1 : 0,
                    transform: purposeVis ? 'none' : 'translateX(-16px)',
                    transition: 'opacity 0.55s 0.15s, transform 0.55s 0.15s cubic-bezier(0.22,1,0.36,1)',
                  }}
                >
                  Bridging the Gap<br />in Heat Awareness
                </h2>
                <div
                  className="about-purpose-rule"
                  style={{
                    width: purposeVis ? 56 : 0,
                    transition: 'width 0.6s 0.38s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
                <p
                  className="about-purpose-meta"
                  style={{
                    opacity: purposeVis ? 1 : 0,
                    transition: 'opacity 0.4s 0.7s',
                  }}
                >
                  SECTION 02 · PURPOSE
                </p>
              </div>
              <div className="about-purpose-right">
                <p
                  className="about-purpose-body"
                  style={{
                    opacity: purposeVis ? 1 : 0,
                    transform: purposeVis ? 'none' : 'translateY(16px)',
                    transition: 'opacity 0.55s 0.22s, transform 0.55s 0.22s ease',
                  }}
                >
                  {purpose}
                </p>
                <blockquote
                  className="about-purpose-quote"
                  style={{
                    opacity: purposeVis ? 1 : 0,
                    transform: purposeVis ? 'none' : 'translateX(16px)',
                    transition: 'opacity 0.55s 0.40s, transform 0.55s 0.40s ease',
                  }}
                >
                  "{overview.p2}"
                </blockquote>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 44 }}>
            <div style={{ flex: 1, height: 1, background: P.creamBorder }} />
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: P.gray300 }}>DETAILED SECTIONS</div>
            <div style={{ flex: 1, height: 1, background: P.creamBorder }} />
          </div>

          {/* OBJECTIVES — timeline line, dots, 5 cards */}
          <div id="objectives" ref={objRef} className="about-objectives-wrap" style={{ marginBottom: 48 }}>
            <div
              className="about-objectives-header"
              style={{
                opacity: objVis ? 1 : 0,
                transform: objVis ? 'none' : 'translateX(-16px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              <div className="about-objectives-bar" />
              <div className="about-objectives-icon">
                <IconMapPin />
              </div>
              <div>
                <div className="about-objectives-kicker">SECTION 03</div>
                <h2 className="about-objectives-title">What We Set Out to Do</h2>
              </div>
            </div>

            <div className="about-objectives-timeline">
              <div className="about-objectives-track">
                <div
                  className="about-objectives-track-fill"
                  style={{
                    width: objVis ? '100%' : '0%',
                    transition: 'width 1.1s 0.18s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              </div>
              <div className="about-objectives-dots">
                {objectives.map((_, i) => (
                  <div
                    key={i}
                    className="about-objectives-dot"
                    style={{
                      background: objVis ? P.orange500 : P.creamBorder,
                      transform: objVis ? 'scale(1)' : 'scale(0)',
                      boxShadow: objVis ? '0 2px 8px rgba(255,107,26,0.35)' : 'none',
                      transition: `background 0.3s ${0.18 + i * 0.16}s, transform 0.42s ${0.18 + i * 0.16}s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ${0.18 + i * 0.16}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="about-objectives-grid">
              {objectives.map((text, i) => (
                <div
                  key={i}
                  className="about-objectives-card"
                  style={{
                    opacity: objVis ? 1 : 0,
                    transform: objVis ? 'translateY(0)' : 'translateY(24px)',
                    transition: `opacity 0.5s ${0.32 + i * 0.1}s, transform 0.56s ${0.32 + i * 0.1}s cubic-bezier(0.22,1,0.36,1)`,
                  }}
                >
                  <div className="about-objectives-number">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <p className="about-objectives-text">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* STRATEGIC GOALS / SDG — animations only, same layout */}
          <div id="sdgs" ref={sdgRef}>
            <div
              className="about-sdg-header"
              style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
                opacity: sdgVis ? 1 : 0,
                transform: sdgVis ? 'none' : 'translateX(-16px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              <div style={{ width: 4, alignSelf: 'stretch', background: P.blue700, borderRadius: 2, flexShrink: 0 }} />
              <div style={{ width: 38, height: 38, borderRadius: 10, background: P.blue700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: P.white }}>
                <IconTarget />
              </div>
              <div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: P.gray500, marginBottom: 2 }}>SECTION 05 · SDG ALIGNMENT</div>
                <h2 style={{ fontWeight: 900, fontSize: 22, color: P.gray900, letterSpacing: '-0.02em', margin: 0 }}>Strategic Goals</h2>
              </div>
            </div>
            <div style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {sdgs.map((sdg, i) => (
                <div
                  key={i}
                  className="about-detail-sdg-row"
                  style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: `1.5px solid ${sdg.light}`,
                    opacity: sdgVis ? 1 : 0,
                    transform: sdgVis ? 'none' : 'translateX(-24px)',
                    transition: `opacity 0.55s ${0.14 + i * 0.13}s, transform 0.6s ${0.14 + i * 0.13}s cubic-bezier(0.22,1,0.36,1)`,
                    boxShadow: `0 4px 18px ${sdg.color}1A`,
                  }}
                >
                  <div className="about-detail-sdg-icon-cell" style={{ background: sdg.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: 8, color: 'rgba(255,255,255,0.95)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {(() => {
                        const SdgIcon = sdgIconComponents[i];
                        return SdgIcon ? <SdgIcon /> : null;
                      })()}
                    </div>
                    <div style={{ fontWeight: 900, fontSize: 26, color: 'rgba(255,255,255,0.15)', lineHeight: 1 }}>{sdg.num}</div>
                  </div>
                  <div style={{ padding: '22px 26px', background: sdg.bg }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                      <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: sdg.color }}>SDG {sdg.num}</div>
                      <div style={{ width: 20, height: 2, background: sdg.color, borderRadius: 1, opacity: 0.4 }} />
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: P.gray900, marginBottom: 10, letterSpacing: '-0.01em' }}>{sdg.title}</div>
                    <p style={{ fontSize: 13, color: P.gray700, lineHeight: 1.8, margin: 0 }}>{sdg.body}</p>
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
