import { useState, useEffect } from "react";
import "../../styles/HowItWorks.css";

// ─── PALETTE ─────────────────────────────────────────
const P = {
  orange500: "#FF6B1A", orange700: "#C44F00", orange900: "#7A2D00",
  orange100: "#FFD4B8", orange50:  "#FFF4ED",
  amber500:  "#F59E0B", amber700:  "#B45309",
  amber100:  "#FDE68A", amber50:   "#FFFBEB",
  yellow500: "#FFB800", yellow100: "#FFEAB3", yellow50: "#FFF9E6",
  // Step 4: warm amber-orange (smooth bridge from step 3 amber → step 5 soft orange)
  warmAmber700: "#C96B1E", warmAmber400: "#E08E3A", warmAmber100: "#F2D4B0", warmAmber50: "#FFF8F2",
  // Step 5: soft orange (bridge to step 6)
  softOrange700: "#B85C1A", softOrange400: "#D97D3A", softOrange100: "#F0D4B8", softOrange50: "#FFF6F0",
  // Step 6: continues from step 5 (starts at softOrange400) → golden yellow
  warmGolden700: "#D97D3A", warmGolden400: "#E5A03C", warmGolden100: "#F5E6B8", warmGolden50: "#FFF9EB",
  green500:  "#4A9C4D", green100:  "#C8E6C9",
  gray900: "#212121", gray700: "#424242",
  gray500: "#757575", gray300: "#BDBDBD",
  gray100: "#EEEEEE",
  white: "#FFFFFF",
};

// ─── STEP ICONS (SVG) ────────────────────────────────
const IconGather = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 2v6" />
    <path d="M8 8l4-4 4 4" />
    <path d="M5 12H2a2 2 0 0 1 0-4h3" />
    <path d="M19 12h3a2 2 0 0 0 0-4h-3" />
    <path d="M12 22v-6" />
    <path d="M12 16l-4 4 4 4 4-4" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconProcess = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
  </svg>
);
const IconAssess = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    <path d="M9 4v2" />
    <path d="M9 10v2" />
    <path d="M9 16v2" />
  </svg>
);
const IconCommunity = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconStore = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);
const IconShow = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);
const stepIconComponents = [IconGather, IconProcess, IconAssess, IconCommunity, IconStore, IconShow];

// ─── STEPS DATA ───────────────────────────────────────
const steps = [
  {
    num: 1, title: "Gather Inputs", short: "Live data",
    sources: ["Open‑Meteo", "WeatherAPI", "PAGASA", "GeoJSON + PSGC", "Healthsites.io", "PSA", "OpenRouteService"],
    bullets: [
      "Temperature & humidity — live and forecast from Open‑Meteo and WeatherAPI",
      "Official heat risk thresholds from PAGASA",
      "Barangay boundaries and IDs from GeoJSON + PSGC",
      "Facility locations and population data from Healthsites.io + PSA",
      "Accessibility data — travel times to nearest facilities from OpenRouteService",
    ],
  },
  {
    num: 2, title: "Process Data", short: "Clean & structure",
    sources: ["Barangay Match", "Facility Filter", "Weather Parse", "Supabase Cache"],
    bullets: [
      "Match population and facility data to barangay boundaries",
      "Keep only relevant facilities — hospitals, clinics, pharmacies",
      "Convert weather inputs into usable values for heat risk calculation",
      "Cache results in Supabase for efficiency",
    ],
  },
  {
    num: 3, title: "Assess Heat Risk", short: "Rothfusz formula",
    sources: ["Rothfusz Regression", "Humidity Adjustments", "PAGASA Risk Bands"],
    bullets: [
      "Apply the Rothfusz regression formula — combines air temperature and humidity into a 'feels‑like' heat index",
      "Apply small adjustments for unusual humidity conditions — very dry or very humid",
      "Use a simpler fallback formula for mild conditions",
      "Map the final heat index into PAGASA risk bands: Caution → Extreme Caution → Danger → Extreme Danger",
    ],
  },
  {
    num: 4, title: "Community Data", short: "Population & Facilities",
    sources: ["Facility Counts", "Population Density", "Travel Distance", "Risk Score"],
    bullets: [
      "Add facility counts and population density for each barangay",
      "(Future) Include accessibility scores from travel distance and time analysis",
      "Generate a composite risk score per barangay reflecting both heat and community resilience",
    ],
  },
  {
    num: 5, title: "Store Results", short: "Supabase backend",
    sources: ["Supabase", "Risk Scores", "Facility Data", "Historical Log"],
    bullets: [
      "Save risk scores, facility details, and historical data in Supabase",
      "Supabase acts as the backend database and API layer for all BanasUno services",
    ],
  },
  {
    num: 6, title: "Show Results", short: "Public interface",
    sources: ["Interactive Maps", "Dashboards", "Route Maps", "AI Advisories"],
    bullets: [
      "Interactive maps display barangay polygons, heat zones, and facility markers",
      "Dashboards show tables, charts, and export options for decision-makers",
      "Route maps and isochrones from ORS highlight accessibility to health facilities",
      "AI advisories provide clear, human‑readable guidance based on current risk levels",
    ],
  },
];

// ─── SUNRISE ORANGE THEME (smooth transition 3→4→5→6) ──
const stepColors = [
  { color: P.orange700, light: P.orange100, bg: P.orange50,  gradient: `linear-gradient(135deg, ${P.orange700} 0%, ${P.orange500} 50%, ${P.orange100} 100%)` },
  { color: P.orange500, light: "#FFD4B8",   bg: "#FFF8F3",   gradient: `linear-gradient(135deg, ${P.orange500} 0%, #FF9559 50%, #FFD4B8 100%)` },
  { color: P.amber700,  light: P.amber100,  bg: P.amber50,   gradient: `linear-gradient(135deg, ${P.amber700} 0%, ${P.amber500} 50%, ${P.amber100} 100%)` },
  { color: P.warmAmber700,  light: P.warmAmber100,  bg: P.warmAmber50,  gradient: `linear-gradient(135deg, ${P.warmAmber700} 0%, ${P.warmAmber400} 50%, ${P.warmAmber100} 100%)` },
  { color: P.softOrange700, light: P.softOrange100, bg: P.softOrange50, gradient: `linear-gradient(135deg, ${P.softOrange700} 0%, ${P.softOrange400} 50%, ${P.softOrange100} 100%)` },
  { color: P.warmGolden700, light: P.warmGolden100, bg: P.warmGolden50, gradient: `linear-gradient(135deg, ${P.warmGolden700} 0%, ${P.warmGolden400} 50%, ${P.warmGolden100} 100%)` },
];

// ─── PIPELINE FLOW ────────────────────────────────────
function HowItWorks() {
  const [active, setActive] = useState(null);
  const [flow, setFlow]     = useState(0);

  useEffect(() => {
    const t = setInterval(() => setFlow(f => (f + 1) % 100), 36);
    return () => clearInterval(t);
  }, []);

  const s  = active !== null ? steps[active]      : null;
  const sc = active !== null ? stepColors[active] : null;

  return (
    <section className="how-it-works-section" style={{  }}>
            <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        .how-it-works-section * { box-sizing: border-box; }
        .how-it-works-section ::-webkit-scrollbar { width: 4px; height: 4px; }
        .how-it-works-section ::-webkit-scrollbar-thumb { background: #FF6B1A55; border-radius: 2px; }
      `}</style>

      <div className="how-it-works-card" style={{
        background: P.orange50,
        borderRadius: 20,
        overflow: "hidden",
        border: `1px solid ${P.orange100}`,
        boxShadow: "0 8px 40px rgba(196,79,0,0.12)",
      }}>

        {/* ── HEADER ── */}
        <div className="how-it-works-header" style={{
          background: `linear-gradient(118deg, ${P.orange900} 0%, ${P.orange700} 30%, ${P.orange500} 65%, ${P.yellow500} 100%)`,
          padding: "22px 28px",
          borderBottom: `1px solid ${P.orange100}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", right: -50, top: -50, width: 200, height: 200, borderRadius: "50%", border: "40px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 70, top: 10, width: 90, height: 90, borderRadius: "50%", border: "18px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: -30, bottom: -30, width: 130, height: 130, borderRadius: "50%", border: "26px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div className="how-it-works-header-inner" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#86EFAC", animation: "pulse 2s infinite" }} />
              <span className="how-it-works-header-label" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.6)" }}>
                DATA PIPELINE
              </span>
            </div>
            <div className="how-it-works-title" style={{ fontWeight: 900, fontSize: 22, color: P.white, letterSpacing: "-0.025em" }}>
              How BanasUno <span style={{ color: P.yellow500 }}>Works</span>
            </div>
          </div>
        </div>

        {/* ── PIPELINE NODES ── */}
        <div className="how-it-works-nodes-wrap" style={{ padding: "28px 24px 16px", overflowX: "auto" }}>
          <div className="how-it-works-nodes" style={{ display: "flex", alignItems: "flex-start", gap: 0, minWidth: 660 }}>
            {steps.map((step, i) => {
              const isAct = active === i;
              const sc2   = stepColors[i];
              return (
                <div key={i} className="how-it-works-node" style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>

                  <button
                    type="button"
                    className="how-it-works-node-btn"
                    onClick={() => setActive(isAct ? null : i)}
                    style={{
                      flexShrink: 0, width: 84,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                      border: "none", background: "transparent", cursor: "pointer", padding: 0,
                    }}
                  >
                    <div className="how-it-works-node-icon" style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: isAct ? sc2.gradient : P.white,
                      border: `2px solid ${isAct ? sc2.color : P.orange100}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isAct ? P.white : P.orange700,
                      boxShadow: isAct
                        ? `0 0 0 5px ${sc2.color}22, 0 6px 20px ${sc2.color}40`
                        : "0 2px 6px rgba(0,0,0,0.06)",
                      transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                    }}>
                      {(() => {
                        const StepIcon = stepIconComponents[i];
                        return StepIcon ? <StepIcon /> : null;
                      })()}
                    </div>

                    <div className="how-it-works-node-step-num" style={{
                      fontSize: 7, fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: isAct ? sc2.color : P.orange100,
                      textAlign: "center", transition: "color 0.2s",
                    }}>
                      STEP {step.num}
                    </div>

                    <div className="how-it-works-node-step-title" style={{
                      fontSize: 10, fontWeight: 700,
                      color: isAct ? sc2.color : P.orange700,
                      textAlign: "center", lineHeight: 1.3, letterSpacing: "-0.01em",
                      transition: "color 0.2s",
                    }}>
                      {step.title}
                    </div>
                  </button>

                  {i < steps.length - 1 && (
                    <div style={{
                      flex: 1, height: 2, background: P.orange100,
                      position: "relative", overflow: "hidden",
                      margin: "0 2px", marginBottom: 42, borderRadius: 1,
                    }}>
                      <div style={{
                        position: "absolute", top: 0, left: 0, height: "100%", width: "35%",
                        background: `linear-gradient(90deg, transparent, ${sc2.color}, ${sc2.light}, transparent)`,
                        transform: `translateX(${(flow / 100) * 380 - 120}%)`,
                      }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── DETAIL PANEL ── */}
        <div className="how-it-works-detail" style={{
          margin: "0 20px 20px",
          borderRadius: 16, overflow: "hidden",
          border: `1.5px solid ${sc ? sc.light : P.orange100}`,
          minHeight: 176,
          background: P.white,
          transition: "border-color 0.3s",
        }}>
          {s && sc ? (
            <div key={active} style={{ animation: "fadeUp 0.28s both" }}>

              <div className="how-it-works-detail-header" style={{
                background: sc.gradient, padding: "16px 24px",
                display: "flex", alignItems: "center", gap: 14,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", right: -28, top: -28, width: 110, height: 110, borderRadius: "50%", border: "22px solid rgba(255,255,255,0.08)", pointerEvents: "none" }} />

                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 100%)",
                  border: "1.5px solid rgba(255,255,255,0.28)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 18,
                  color: sc.color === P.yellow500 || sc.color === P.amber500 ? P.gray900 : P.white,
                  flexShrink: 0,
                }}>
                  {s.num}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="how-it-works-detail-short" style={{
                    fontSize: 8, fontWeight: 700,
                    letterSpacing: "0.14em", marginBottom: 3,
                    color: sc.color === P.yellow500 || sc.color === P.amber500 ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.6)",
                  }}>
                    STEP {s.num} · {s.short.toUpperCase()}
                  </div>
                  <div className="how-it-works-detail-title" style={{
                    fontWeight: 900, fontSize: 17,
                    letterSpacing: "-0.02em",
                    color: sc.color === P.yellow500 || sc.color === P.amber500 ? P.gray900 : P.white,
                  }}>
                    {s.title}
                  </div>
                </div>

                <div className="how-it-works-detail-sources" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 280 }}>
                    {s.sources.map((src, si) => (
                      <span key={si} style={{
                        fontSize: 7, fontWeight: 700,
                        color: sc.color === P.yellow500 || sc.color === P.amber500 ? P.gray900 : P.white,
                        background: sc.color === P.yellow500 || sc.color === P.amber500 ? "rgba(255,255,255,0.92)" : "rgba(122,45,0,0.62)",
                        border: sc.color === P.yellow500 || sc.color === P.amber500 ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.2)",
                        borderRadius: 5, padding: "3px 8px",
                      }}>{src}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="how-it-works-detail-body" style={{ padding: "18px 24px", background: sc.bg }}>
                {s.bullets.map((text, bi) => (
                  <div
                    key={bi}
                    style={{
                      display: "flex", gap: 14, alignItems: "flex-start",
                      paddingBottom: bi < s.bullets.length - 1 ? 13 : 0,
                      marginBottom: bi < s.bullets.length - 1 ? 13 : 0,
                      borderBottom: bi < s.bullets.length - 1 ? `1px solid ${sc.light}` : "none",
                      animation: `fadeUp 0.3s ${bi * 0.07}s both`,
                    }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: 7,
                      background: sc.gradient,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 10,
                      color: sc.color === P.yellow500 || sc.color === P.amber500 ? P.gray900 : P.white,
                      flexShrink: 0, marginTop: 1,
                    }}>
                      {bi + 1}
                    </div>
                    <span style={{ fontSize: 12, color: P.gray700, lineHeight: 1.7 }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 176, gap: 12 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {stepColors.map((sc2, i) => (
                  <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: sc2.color, opacity: 0.3 }} />
                ))}
              </div>
              <span style={{ fontSize: 13, color: P.orange100, letterSpacing: "-0.01em" }}>
                Click any step above to explore
              </span>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className="how-it-works-footer" style={{
          padding: "10px 28px 16px",
          display: "flex", alignItems: "center", gap: 8,
          borderTop: `1px solid ${P.orange100}`,
        }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: P.green500, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: P.white, fontWeight: 700, flexShrink: 0 }}>✓</div>
          <p style={{ fontSize: 12, color: P.gray500, margin: 0, lineHeight: 1.6 }}>
            BanasUno integrates open-source weather APIs, official PAGASA classifications, and community health data to generate real-time risk intelligence for Davao City.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
