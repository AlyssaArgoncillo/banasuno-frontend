import { useState, useEffect } from "react";

// ─── FULL PALETTE ─────────────────────────────────────
const P = {
  orange500: "#FF6B1A", orange700: "#C44F00",
  orange100: "#FFD4B8", orange50:  "#FFF4ED",
  orangeGrad: "linear-gradient(135deg, #FF6B1A 0%, #FFB800 100%)",
  yellow500: "#FFB800", yellow100: "#FFEAB3", yellow50: "#FFF9E6",
  blue700:   "#1565C0", blue500:   "#2196F3",
  blue300:   "#64B5F6", blue100:   "#BBDEFB",
  red700:    "#C62828", red500:    "#F44336", red100: "#FFCDD2",
  green700:  "#2D5F2E", green500:  "#4A9C4D",
  green300:  "#7BC67E", green100:  "#C8E6C9",
  gray900: "#212121", gray700: "#424242",
  gray500: "#757575", gray300: "#BDBDBD",
  gray100: "#EEEEEE", gray50:  "#FAFAFA",
  surfaceSecondary: "#FAFAFA",
  surfaceAccent:    "#FFF9E6",
  surfaceWarning:   "#FFF4ED",
  heat1: "#4A9C4D", heat6: "#FF6B1A", heat7: "#F44336",
  white: "#FFFFFF",
};

const riskMeta = {
  "NOT HAZARDOUS":   { color: P.green500,  bg: P.green100,  border: P.green500,  band: 0 },
  "CAUTION":         { color: P.yellow500, bg: P.yellow100, border: P.yellow500, band: 1 },
  "EXTREME CAUTION": { color: P.orange500, bg: P.orange50,  border: P.orange500, band: 2 },
  "DANGER":          { color: P.red500,    bg: P.red100,    border: P.red500,    band: 3 },
  "EXTREME DANGER":  { color: P.red700,    bg: "#FCE4EC",   border: P.red700,    band: 4 },
};

const facilityMeta = {
  hospital:  { label: "Hospital",          icon: "/hospital.png", color: P.red700,   bg: P.red100   },
  clinic:    { label: "Clinic",            icon: "/clinic.png",   color: P.blue700,  bg: P.blue100  },
  healthctr: { label: "Health Center",     icon: "/cross2.png",    color: P.blue700,  bg: P.blue100  },
  pharmacy:  { label: "Pharmacy",          icon: "/pill2.png",     color: P.green700, bg: P.green100 },
  doctor:    { label: "Doctor's Facility", icon: "/doctor.png",   color: P.green700, bg: P.green100 },
};

const barangays = [
  { name: "Buhangin", temp: 38,   risk: "EXTREME CAUTION", facilities: 4 },
  { name: "Matina",   temp: 36,   risk: "CAUTION",          facilities: 6 },
  { name: "Bangkal",  temp: 35,   risk: "CAUTION",          facilities: 3 },
  { name: "Talomo",   temp: 39.5, risk: "DANGER",            facilities: 2 },
  { name: "Agdao",    temp: 37,   risk: "EXTREME CAUTION",  facilities: 5 },
  { name: "Calinan",  temp: 37.5, risk: "EXTREME CAUTION",  facilities: 3 },
  { name: "Toril",    temp: 34,   risk: "CAUTION",           facilities: 4 },
  { name: "Tugbok",   temp: 33,   risk: "CAUTION",           facilities: 2 },
];

const facilities = [
  { id: 1, name: "Southern Philippines Medical Center", dist: 1.2, type: "hospital"  },
  { id: 2, name: "Mercury Drug",                        dist: 0.8, type: "pharmacy"  },
  { id: 3, name: "Buhangin Health Center",              dist: 1.5, type: "healthctr" },
  { id: 4, name: "Davao Doctors Hospital",              dist: 2.1, type: "hospital"  },
  { id: 5, name: "Community Clinic",                    dist: 0.9, type: "clinic"    },
  { id: 6, name: "Dr. Reyes Medical Clinic",            dist: 1.8, type: "doctor"    },
  { id: 7, name: "Generika Pharmacy",                   dist: 2.4, type: "pharmacy"  },
  { id: 8, name: "San Pedro Hospital",                  dist: 3.1, type: "hospital"  },
];

// ─── MICRO COMPONENTS ─────────────────────────────────
function RiskPill({ risk, mini }) {
  const m = riskMeta[risk] || riskMeta["EXTREME CAUTION"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: m.bg, border: `1.5px solid ${m.border}`,
      borderRadius: 20, padding: mini ? "1px 7px" : "3px 10px",
      fontFamily: "'DM Mono', monospace", fontSize: mini ? 8 : 9,
      fontWeight: 700, letterSpacing: "0.06em", color: m.color, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: m.color, display: "inline-block" }} />
      {risk}
    </span>
  );
}

function TypeChip({ type }) {
  const m = facilityMeta[type] || facilityMeta.healthctr;
  const iconSize = type === 'hospital' ? 14 : 16;
  return (
    <span style={{
      background: m.bg, color: m.color, borderRadius: 6,
      padding: "1px 7px", fontSize: 10, fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      display: "inline-flex", alignItems: "center", gap: 6,
    }}>
      <img src={m.icon} alt="" style={{ width: iconSize, height: iconSize }} />
      {m.label}
    </span>
  );
}

function TempBar({ temp }) {
  const pct = Math.min(100, Math.max(0, ((temp - 26) / (42 - 26)) * 100));
  const color = temp < 32 ? P.green500 : temp < 38 ? P.orange500 : P.red500;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: P.gray100, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: `linear-gradient(90deg, ${P.heat1}, ${color})`,
          borderRadius: 3,
        }} />
      </div>
      <span style={{
        fontFamily: "'DM Mono', monospace", fontSize: 11,
        fontWeight: 700, color, minWidth: 38,
      }}>{temp}°C</span>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────
export default function Dashboard({ selectedZone }) {
  const [trendDays, setTrendDays] = useState(7);
  const [showAll, setShowAll]     = useState(false);
  const [barangayQuery, setBarangayQuery] = useState("");
  const [dirType, setDirType]     = useState("all");
  const [dirSort, setDirSort]     = useState("asc");
  const [facilitiesPanel, setFacilitiesPanel] = useState(null);
  const [tick, setTick]           = useState(0);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const now     = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  // Use selected zone if available, otherwise use default
  const barangay = selectedZone ? {
    name: selectedZone.name,
    temp: selectedZone.temperature,
    risk: selectedZone.riskLevel?.label || "EXTREME CAUTION",
    riskColor: selectedZone.riskLevel?.color,
    facilities: selectedZone.facilities?.length || 0
  } : { name: "Calinan", temp: 37.5, risk: "EXTREME CAUTION", riskColor: P.orange500, facilities: 3 };

  const risk = barangay.risk;
  const rm   = riskMeta[risk] || riskMeta["EXTREME CAUTION"];

  const normalizedQuery = barangayQuery.trim().toLowerCase();
  const filteredBarangays = normalizedQuery
    ? barangays.filter(b => b.name.toLowerCase().includes(normalizedQuery))
    : barangays;
  const displayed = showAll ? filteredBarangays : filteredBarangays.slice(0, 5);

  const dirFacilities = facilities
    .filter(f => dirType === "all" || f.type === dirType)
    .sort((a, b) => dirSort === "asc" ? a.dist - b.dist : b.dist - a.dist);

  const riskCounts = {
    "NOT HAZARDOUS": 1, "CAUTION": 78,
    "EXTREME CAUTION": 103, "DANGER": 0, "EXTREME DANGER": 0,
  };

  const getBarangayFacilities = (b) => {
    const count = Math.max(1, Math.min(facilities.length, b.facilities || 0));
    return facilities.slice(0, count);
  };

  const chartData = Array.from({ length: trendDays }, (_, i) => ({
    day: i + 1,
    temp: 32 + Math.sin(i * 0.6 + 1) * 4 + Math.random() * 2,
  }));
  const maxT = Math.max(...chartData.map(d => d.temp));
  const minT = Math.min(...chartData.map(d => d.temp));
  const avgT = chartData.reduce((sum, d) => sum + d.temp, 0) / chartData.length;
  const trendDelta = chartData[chartData.length - 1].temp - chartData[0].temp;

  return (
    <div style={{ height: "100vh", overflow: "auto", background: P.surfaceSecondary, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #FF6B1A55; border-radius: 2px; }
        .dashboard-kpi { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 900px) {
          .dashboard-kpi { grid-template-columns: 210px 1fr auto; align-items: center; }
        }
        .dashboard-row2 { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 16px; }
        @media (min-width: 900px) {
          .dashboard-row2 { grid-template-columns: 300px 1fr; }
        }
        .dashboard-row3 { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 1000px) {
          .dashboard-row3 { grid-template-columns: 1fr 380px; }
        }
        .export-csv-btn { justify-self: center; }
        .export-csv-long { display: none; }
        .export-csv-short { display: inline; }
        @media (min-width: 900px) {
          .export-csv-btn { justify-self: end; }
          .export-csv-long { display: inline; }
          .export-csv-short { display: none; }
        }
        .trend-data { margin-top: 12px; display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; }
        .trend-data-item { min-width: 0; }
        .trend-layout { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 1000px) {
          .trend-layout { grid-template-columns: minmax(0, 2.2fr) minmax(220px, 1fr); }
        }
        .trend-insights { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
        @media (max-width: 700px) {
          .trend-insights { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 700px) {
          .trend-data { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        .topbar-title { display: inline; }
        @media (max-width: 520px) {
          .topbar-title { display: none; }
        }
        .topbar-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
        .topbar-pill { display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .topbar-name { white-space: normal; }
        .topbar-date { display: inline; }
        .avg-date { display: none; }
        @media (max-width: 700px) {
          .topbar-date { display: none; }
          .avg-date { display: block; }
        }
      `}</style>

      {/* ══ TOPBAR — #C44F00 (simplified & responsive) ══ */}
      <div style={{
        background: "#C44F00", padding: "0 clamp(12px, 4vw, 28px)",
        minHeight: "clamp(48px, 8vh, 56px)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "clamp(8px, 2vw, 12px)",
        position: "sticky", top: 0, zIndex: 30,
        boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px, 3vw, 18px)", minWidth: 110 }}>
          <span className="topbar-title" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(12px, 2.4vw, 14px)",
            fontWeight: 800, color: P.white, letterSpacing: "0.08em",
          }}>
            DASHBOARD
          </span>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", minWidth: 0 }}>
          <div className="topbar-pill" style={{
            padding: "6px clamp(10px, 2vw, 14px)",
            borderRadius: 16,
            background: "rgba(255,255,255,0.22)",
            border: "1px solid rgba(255,255,255,0.35)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            maxWidth: "min(70vw, 560px)",
            marginLeft: 0,
          }}>
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: "clamp(9px, 1.6vw, 10px)",
              letterSpacing: "0.08em", color: "rgba(255,255,255,0.85)",
            }}>
              BARANGAY
            </span>
            <span className="topbar-name" style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(13px, 2.8vw, 18px)",
              fontWeight: 900, color: P.white, letterSpacing: "0.01em",
              overflow: "hidden",
            }}>
              {barangay.name}
            </span>
            <span style={{
              width: 1, height: 18, background: "rgba(255,255,255,0.35)",
            }} />
            <RiskPill risk={risk} mini />
          </div>
        </div>
        <div className="topbar-right">
          <span className="topbar-date" style={{
            fontFamily: "'DM Mono', monospace", fontSize: "clamp(10px, 2vw, 11px)",
            color: P.white, opacity: 0.85,
          }}>
            {dateStr}
          </span>
          <div style={{
            background: "rgba(255,255,255,0.22)",
            border: "1px solid rgba(255,255,255,0.45)",
            color: P.white,
            fontFamily: "'DM Mono', monospace", fontSize: "clamp(9px, 1.5vw, 11px)", fontWeight: 700,
            padding: "4px clamp(8px, 2vw, 12px)", borderRadius: 10, letterSpacing: "0.04em",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
          }}>
            {timeStr}
          </div>
        </div>
      </div>

      <div style={{ padding: "clamp(16px, 4vw, 28px) clamp(12px, 4vw, 28px) 48px", maxWidth: 1280, margin: "0 auto" }}>

        {/* ══ ROW 1: KPI STRIP — Surface-Warning + orange grad ══ */}
        <div className="dashboard-kpi" style={{
          background: P.surfaceWarning, borderRadius: 18,
          padding: "clamp(16px, 3vw, 24px)", marginBottom: 16,
          border: `1px solid ${P.orange100}`,
        }}>

          {/* Avg Temp hero card */}
          <div style={{
            background: P.orangeGrad, borderRadius: 14,
            padding: "clamp(16px, 3vw, 22px)", position: "relative", overflow: "hidden",
            textAlign: "center",
          }}>
            <div style={{ position: "absolute", top: -12, right: -12, width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "clamp(7px, 1.5vw, 8px)", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>
              AVG TEMPERATURE
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "clamp(32px, 8vw, 46px)", color: P.white, lineHeight: 1, letterSpacing: "-0.03em" }}>
              {barangay.temp}°
            </div>
            <div className="avg-date" style={{
              fontFamily: "'DM Mono', monospace", fontSize: "clamp(9px, 2.2vw, 11px)",
              color: "rgba(255,255,255,0.75)", marginTop: 6, textAlign: "center",
            }}>
              {dateStr}
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(10px, 2.4vw, 12px)",
              color: "rgba(255,255,255,0.8)", marginTop: 6,
            }}>
              Barangay {barangay.name}
            </div>
          </div>

          {/* Risk zone count grid */}
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "clamp(11px, 2vw, 13px)", color: P.gray700, marginBottom: 12 }}>
              Heat-Risk Zone Count
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "clamp(6px, 2vw, 8px)" }}>
              {Object.entries(riskCounts).map(([r, count]) => {
                const rm2 = riskMeta[r];
                return (
                  <div key={r} style={{
                    background: rm2.bg, border: `1.5px solid ${rm2.border}`,
                    borderRadius: 12, padding: "clamp(8px, 2vw, 10px) 6px", textAlign: "center",
                  }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "clamp(6px, 1.5vw, 7px)", fontWeight: 700, letterSpacing: "0.05em", color: rm2.color, marginBottom: 4, lineHeight: 1.35 }}>{r}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "clamp(20px, 5vw, 28px)", color: rm2.color, lineHeight: 1 }}>{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export CSV only */}
          <button className="export-csv-btn" style={{
            border: `1.5px solid ${P.orange100}`,
            borderRadius: 12, padding: "10px 16px",
            background: P.orange50, color: P.orange700,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(255,107,26,0.12)",
            marginTop: "16px",
          }}>
            <span className="export-csv-long">⬇ Export CSV</span>
            <span className="export-csv-short">⬇ Export</span>
          </button>
        </div>

        {/* ══ ROW 2: Nearby Facilities (blue) + Barangay Table (dark header) ══ */}
        <div className="dashboard-row2">

          {/* Nearby Health Facilities — Blue-700 header */}
          <div style={{ background: P.white, borderRadius: 16, overflow: "hidden", border: `1px solid ${P.blue100}`, display: "flex", flexDirection: "column" }}>
            <div style={{
              padding: "14px 18px", background: P.blue700,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: P.white }}>
                Nearby Health Facilities
              </div>
              <span style={{
                fontFamily: "'DM Mono', monospace", fontSize: 9, color: P.blue100,
                background: "rgba(255,255,255,0.15)", borderRadius: 20,
                padding: "1px 8px", fontWeight: 700,
              }}>{facilities.length} total</span>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {facilities.map((f, i) => {
                const fm = facilityMeta[f.type];
                return (
                  <div key={f.id} style={{
                    padding: "11px 18px",
                    borderBottom: i < facilities.length - 1 ? `1px solid ${P.gray100}` : "none",
                    display: "flex", alignItems: "center", gap: 10,
                    background: i % 2 === 0 ? P.white : P.blue100 + "33",
                  }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: fm.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <img src={fm.icon} alt="" style={{ width: f.type === 'hospital' ? 20 : 24, height: f.type === 'hospital' ? 20 : 24 }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: P.gray900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                      <TypeChip type={f.type} />
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, color: P.orange500 }}>{f.dist} km</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: P.gray500 }}>{i === 0 ? "Closest" : "away"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Barangays Table — Gray-900 header */}
          <div style={{ background: P.white, borderRadius: 16, border: `1px solid ${P.gray100}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{
              padding: "14px 20px", background: "#FF6B1A",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: P.white }}>
                ALL BARANGAYS — HEAT RISK OVERVIEW
              </div>
              <button style={{
                border: `1px solid rgba(255,255,255,0.3)`, borderRadius: 8, padding: "5px 12px",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 11,
                cursor: "pointer", background: "rgba(255,255,255,0.1)", color: P.white,
              }}>⬇ Export Data</button>
            </div>

            <div style={{ padding: "10px 12px", borderBottom: `1px solid ${P.gray100}`, background: P.white }}>
              <input
                value={barangayQuery}
                onChange={(e) => setBarangayQuery(e.target.value)}
                placeholder="Search barangay"
                style={{
                  width: "min(320px, 100%)",
                  border: `1px solid ${P.gray100}`,
                  borderRadius: 10,
                  padding: "8px 12px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  outline: "none",
                  background: P.gray50,
                }}
              />
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ position: "sticky", top: 0, background: P.gray50, zIndex: 2 }}>
                  <tr>
                    {["Barangay", "Temperature", "Risk Level", "Nearby Facilities", ""].map(h => (
                      <th key={h} style={{
                        padding: "9px 16px", textAlign: "left",
                        fontFamily: "'DM Mono', monospace", fontSize: 8,
                        fontWeight: 700, letterSpacing: "0.1em", color: P.gray500,
                        borderBottom: `1px solid ${P.gray100}`,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((b, i) => (
                    <tr key={b.name} style={{ background: i % 2 === 0 ? P.white : P.gray50 }}>
                      <td style={{ padding: "10px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: P.gray900 }}>{b.name}</td>
                      <td style={{ padding: "10px 16px", minWidth: 140 }}><TempBar temp={b.temp} /></td>
                      <td style={{ padding: "10px 16px" }}><RiskPill risk={b.risk} mini /></td>
                      <td style={{ padding: "10px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: P.gray500 }}>{b.facilities} facilities</td>
                      <td style={{ padding: "10px 16px" }}>
                        <button
                          onClick={() => {
                            setFacilitiesPanel((prev) => {
                              if (prev && prev.barangay === b.name) return null;
                              return { barangay: b.name, list: getBarangayFacilities(b) };
                            });
                          }}
                          style={{
                          border: "none", background: P.orange50, color: P.orange700,
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10,
                          padding: "3px 10px", borderRadius: 6, cursor: "pointer",
                        }}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {facilitiesPanel && (
              <div style={{
                borderTop: `1px solid ${P.gray100}`,
                background: P.surfaceSecondary,
                padding: "12px 16px",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginBottom: 8,
                }}>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, color: P.gray900,
                  }}>
                    Facilities in {facilitiesPanel.barangay}
                  </div>
                  <button
                    onClick={() => setFacilitiesPanel(null)}
                    style={{
                      border: "none", background: "transparent", cursor: "pointer",
                      fontFamily: "'DM Mono', monospace", fontSize: 12, color: P.gray500,
                    }}
                  >
                    Close
                  </button>
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {facilitiesPanel.list.map((f) => {
                    const fm = facilityMeta[f.type] || facilityMeta.healthctr;
                    return (
                      <div key={f.id} style={{
                        background: P.white, border: `1px solid ${P.gray100}`,
                        borderRadius: 10, padding: "8px 10px",
                        display: "flex", alignItems: "center", gap: 10,
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8, background: fm.bg,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <img src={fm.icon} alt="" style={{ width: f.type === 'hospital' ? 18 : 22, height: f.type === 'hospital' ? 18 : 22 }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, color: P.gray900,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>{f.name}</div>
                          <TypeChip type={f.type} />
                        </div>
                        <div style={{
                          fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, color: P.orange500,
                        }}>{f.dist} km</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{
              padding: "10px 20px", borderTop: `1px solid ${P.gray100}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: P.gray50,
            }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: P.gray500 }}>
                Showing {displayed.length} of {filteredBarangays.length} barangays{barangayQuery ? " (filtered)" : ""}
              </span>
              <button
                onClick={() => setShowAll(!showAll)}
                style={{
                  border: `1px solid ${P.orange100}`, borderRadius: 8,
                  background: P.orange50, color: P.orange500,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11,
                  padding: "5px 14px", cursor: "pointer",
                }}
              >
                {showAll ? "Show Less ↑" : "View All 182 →"}
              </button>
            </div>
          </div>
        </div>

        {/* ══ ROW 3: Historical Trends (Yellow) + Facility Directory (Green) ══ */}
        <div className="dashboard-row3">

          {/* Historical Trends — Yellow-500 header + Accent surface */}
          <div style={{ background: P.surfaceAccent, borderRadius: 16, border: `1px solid ${P.yellow100}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{
              padding: "14px 20px", background: P.yellow500,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: P.gray900 }}>
                Historical Trends
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {[7, 14].map(d => (
                  <button
                    key={d}
                    onClick={() => setTrendDays(d)}
                    style={{
                      border: `1.5px solid ${trendDays === d ? P.gray900 : "rgba(0,0,0,0.2)"}`,
                      borderRadius: 8, padding: "4px 12px",
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11,
                      cursor: "pointer",
                      background: trendDays === d ? P.gray900 : "rgba(255,255,255,0.35)",
                      color: trendDays === d ? P.white : P.gray700,
                    }}
                  >{d} Days</button>
                ))}
                <button style={{
                  border: "none", background: "rgba(255,255,255,0.4)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: P.gray700,
                  cursor: "pointer", padding: "4px 10px", borderRadius: 8,
                }}>⬇ CSV</button>
              </div>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
              <div className="trend-layout" style={{ flex: 1, alignItems: "stretch" }}>
                <div>
                  {/* Y-axis labels */}
                  <div style={{ display: "flex", gap: 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 8, paddingBottom: 20 }}>
                      {[maxT.toFixed(0), ((maxT + minT) / 2).toFixed(0), minT.toFixed(0)].map(v => (
                        <span key={v} style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: P.gray500 }}>{v}°</span>
                      ))}
                    </div>
                    <div style={{ flex: 1 }}>
                      <svg width="100%" height="clamp(180px, 32vh, 260px)" viewBox={`0 0 ${trendDays * 46} 120`} preserveAspectRatio="none" style={{ display: "block" }}>
                        <defs>
                          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={P.orange500} stopOpacity="0.35" />
                            <stop offset="100%" stopColor={P.orange500} stopOpacity="0.02" />
                          </linearGradient>
                        </defs>
                        {[0, 40, 80, 120].map(y => (
                          <line key={y} x1="0" y1={y} x2={trendDays * 46} y2={y} stroke={P.yellow100} strokeWidth="1" />
                        ))}
                        <path
                          d={[
                            `M 0 ${120 - ((chartData[0].temp - minT) / (maxT - minT + 1)) * 100}`,
                            ...chartData.slice(1).map((d, i) => `L ${(i + 1) * 46} ${120 - ((d.temp - minT) / (maxT - minT + 1)) * 100}`),
                            `L ${(trendDays - 1) * 46} 120 L 0 120 Z`,
                          ].join(" ")}
                          fill="url(#grad)"
                        />
                        <path
                          d={chartData.map((d, i) => `${i === 0 ? "M" : "L"} ${i * 46} ${120 - ((d.temp - minT) / (maxT - minT + 1)) * 100}`).join(" ")}
                          stroke={P.orange500} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
                        />
                        {chartData.map((d, i) => (
                          <circle key={i} cx={i * 46} cy={120 - ((d.temp - minT) / (maxT - minT + 1)) * 100} r="3.5" fill={P.orange500} stroke={P.yellow50} strokeWidth="2" />
                        ))}
                      </svg>
                      {/* X-axis labels */}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, paddingLeft: 2 }}>
                        {chartData.map((d, i) => (
                          (i === 0 || i === Math.floor(trendDays / 2) || i === trendDays - 1) &&
                          <span key={d.day} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: P.gray500 }}>Day {d.day}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, color: P.gray700,
                    margin: "12px 0 8px",
                  }}>
                    Day-by-day temperatures
                  </div>
                  <div className="trend-data">
                    {chartData.map((d, i) => {
                      const prev = chartData[i - 1]?.temp;
                      const delta = prev != null ? d.temp - prev : 0;
                      const deltaSign = delta > 0 ? "+" : "";
                      const deltaColor = delta > 0 ? P.red500 : delta < 0 ? P.green700 : P.gray500;
                      return (
                        <div key={d.day} className="trend-data-item" style={{
                          background: P.white, border: `1px solid ${P.yellow100}`,
                          borderRadius: 10, padding: "8px 10px",
                        }}>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: P.gray500, marginBottom: 4 }}>
                            Day {d.day}
                          </div>
                          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, color: P.gray900 }}>
                            {d.temp.toFixed(1)}°C
                          </div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: deltaColor }}>
                            {i === 0 ? "—" : `${deltaSign}${delta.toFixed(1)}°`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, color: P.gray700,
                    marginBottom: 8,
                  }}>
                    Trend insights
                  </div>
                  <div className="trend-insights">
                    {[
                      { label: "Average", value: `${avgT.toFixed(1)}°C` },
                      { label: "Peak", value: `${maxT.toFixed(1)}°C` },
                      { label: "Lowest", value: `${minT.toFixed(1)}°C` },
                      { label: "Net change", value: `${trendDelta > 0 ? "+" : ""}${trendDelta.toFixed(1)}°` },
                    ].map((s) => (
                      <div key={s.label} style={{
                        background: P.white, border: `1px solid ${P.yellow100}`,
                        borderRadius: 10, padding: "8px 10px",
                      }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: P.gray500, marginBottom: 4 }}>
                          {s.label}
                        </div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 13, color: P.gray900 }}>
                          {s.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Facility Directory — Green-700 header */}
          <div style={{ background: P.white, borderRadius: 16, overflow: "hidden", border: `1px solid ${P.green100}`, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 18px", background: P.green700 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: P.green100, marginBottom: 10 }}>
                HEALTH FACILITY DIRECTORY
              </div>
              {/* Type filters */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {[{ key: "all", label: "All Types" }, ...Object.entries(facilityMeta).map(([k, v]) => ({ key: k, label: v.label }))].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setDirType(f.key)}
                    style={{
                      border: `1px solid ${dirType === f.key ? P.white : "rgba(255,255,255,0.2)"}`,
                      borderRadius: 8, padding: "2px 8px",
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 9,
                      cursor: "pointer",
                      background: dirType === f.key ? P.white : "transparent",
                      color: dirType === f.key ? P.green700 : "rgba(255,255,255,0.7)",
                    }}
                  >{f.label}</button>
                ))}
              </div>
              {/* Distance sort */}
              <button
                onClick={() => setDirSort(dirSort === "asc" ? "desc" : "asc")}
                style={{
                  border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8,
                  padding: "3px 10px", background: "rgba(255,255,255,0.1)",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 10,
                  cursor: "pointer", color: "rgba(255,255,255,0.75)",
                }}
              >
                Distance {dirSort === "asc" ? "↑ Near–Far" : "↓ Far–Near"}
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {dirFacilities.map((f, i) => {
                const fm = facilityMeta[f.type];
                return (
                  <div
                    key={f.id}
                    style={{
                      padding: "10px 18px",
                      borderBottom: i < dirFacilities.length - 1 ? `1px solid ${P.gray100}` : "none",
                      display: "flex", alignItems: "center", gap: 10,
                      background: i % 2 === 0 ? P.white : P.green100 + "44",
                    }}
                  >
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: fm.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <img src={fm.icon} alt="" style={{ width: f.type === 'hospital' ? 18 : 22, height: f.type === 'hospital' ? 18 : 22 }} />
                      </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: P.gray900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                      <TypeChip type={f.type} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, color: P.orange500 }}>{f.dist} km</div>
                      <button style={{
                        border: "none", background: P.blue100, color: P.blue700,
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 8,
                        padding: "1px 6px", borderRadius: 5, cursor: "pointer",
                        display: "inline-flex", alignItems: "center", gap: 4,
                      }}>
                        <img src="/pin.png" alt="" style={{ width: 10, height: 10 }} />
                        Map
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
