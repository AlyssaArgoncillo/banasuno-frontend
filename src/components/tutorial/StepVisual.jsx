import { Ico } from "../ui/Icons.jsx";
import { SectionChip, ActionCard } from "./TutorialAtoms.jsx";

export function StepVisual({ s, visible }) {
  const { visual } = s;

  if (visual === "overview")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { iconName: "Map", label: "Heat Map", sub: "Color-coded barangay heat risk overview" },
          { iconName: "ClipboardList", label: "Barangay Selection", sub: "Zone Info Card with facilities & routing" },
          { iconName: "AlertTriangle", label: "Heat Advisory", sub: "AI-generated safety recommendations" },
          { iconName: "BarChart", label: "Dashboard", sub: "City-wide KPIs, trends & data export" },
        ].map((f, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(255,107,26,0.06)",
              border: "1px solid rgba(255,107,26,0.16)",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(-12px)",
              transition: `opacity 0.30s ${0.06 + i * 0.07}s, transform 0.32s ${0.06 + i * 0.07}s cubic-bezier(0.22,1,0.36,1)`,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "rgba(255,107,26,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Ico name={f.iconName} size={20} color="#C44F00" />
            </div>
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 13, color: "#C44F00" }}>
                {f.label}
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#757575", marginTop: 1 }}>
                {f.sub}
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <Ico name="ChevronRight" size={14} color="rgba(255,107,26,0.45)" />
            </div>
          </div>
        ))}
      </div>
    );

  if (visual === "heatmap_intro")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SectionChip label="SECTION 1 OF 4 — HEAT MAP" />
        {[
          "See heat levels at a glance across all barangays",
          "Navigate the map by panning, zooming, or locating yourself",
          "Select a barangay to open its detailed Zone Info Card",
          "Use the search bar to pin specific locations",
          "Expand the PAGASA legend and check the temperature gradient",
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 10,
              background: "rgba(255,107,26,0.05)",
              border: "1px solid rgba(255,107,26,0.12)",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(8px)",
              transition: `opacity 0.28s ${0.05 + i * 0.06}s, transform 0.30s ${0.05 + i * 0.06}s ease`,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#FF6B1A",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'DM Mono',monospace",
                fontSize: 9,
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {i + 1}
            </div>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: "#4A3828", lineHeight: 1.5 }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    );

  if (visual === "colors")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {(s.levels || []).map((l, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(-14px)",
              transition: `opacity 0.28s ${i * 0.06}s, transform 0.32s ${i * 0.06}s cubic-bezier(0.22,1,0.36,1)`,
            }}
          >
            <div
              style={{
                minWidth: 64,
                height: 26,
                borderRadius: 13,
                background: l.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'DM Mono',monospace",
                fontSize: 8,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.03em",
                flexShrink: 0,
              }}
            >
              {l.temp}
            </div>
            <div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12, color: "#1A1A1A" }}>
                {l.label}
              </span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#757575", marginLeft: 6 }}>
                {l.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    );

  if (visual === "nav")
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {(s.actions || []).map((a, i) => (
          <ActionCard key={i} iconName={a.iconName} label={a.label} tip={a.tip} visible={visible} delay={0.06 + i * 0.09} />
        ))}
      </div>
    );

  if (visual === "search_legend")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "10px 14px",
            border: "1.5px solid #EDE8DF",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.38s 0.06s",
          }}
        >
          <Ico name="Search" size={15} color="#BDBDBD" />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#BDBDBD" }}>
            Search for a location in Davao City...
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {(s.actions || []).map((a, i) => (
            <ActionCard key={i} iconName={a.iconName} label={a.label} tip={a.tip} visible={visible} delay={0.08 + i * 0.09} />
          ))}
        </div>
      </div>
    );

  if (visual === "card")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SectionChip label="SECTION 2 OF 4 — BARANGAY SELECTION" />
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            overflow: "hidden",
            border: "1.5px solid #EDE8DF",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(12px)",
            transition: "opacity 0.38s 0.08s, transform 0.38s 0.08s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div
            style={{
              background: "#FF9800",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.8)" }} />
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  color: "#fff",
                  letterSpacing: "0.05em",
                }}
              >
                EXTREME CAUTION
              </span>
            </div>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ico name="XCircle" size={14} color="rgba(255,255,255,0.9)" />
            </div>
          </div>
          <div style={{ padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 900, fontSize: 16, color: "#1A1A1A" }}>
                  Talomo
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#9E9E9E" }}>
                  Barangay · Davao Region
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  ["RISK", "3"],
                  ["TEMP", "36.2°C"],
                ].map(([k, v], i) => (
                  <div
                    key={i}
                    style={{
                      background: "#F5F0EA",
                      borderRadius: 10,
                      padding: "6px 10px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 8,
                        fontWeight: 700,
                        color: "#9E9E9E",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {k}
                    </div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 900, fontSize: 14, color: "#1A1A1A" }}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {(s.items || []).map((it, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  padding: "6px 0",
                  borderTop: "1px solid #F5F0EA",
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.25s ${0.18 + i * 0.06}s`,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#FF6B1A",
                    flexShrink: 0,
                    marginTop: 5,
                  }}
                />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#424242", lineHeight: 1.5 }}>
                  {it}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  if (visual === "routing")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {(s.routeItems || []).map((r, i) => (
            <ActionCard key={i} iconName={r.iconName} label={r.label} tip={r.sub} visible={visible} delay={0.06 + i * 0.08} />
          ))}
        </div>
        <div
          style={{
            background: "#FFF8E1",
            borderRadius: 10,
            padding: "10px 12px",
            border: "1px solid rgba(255,152,0,0.28)",
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.32s 0.38s",
          }}
        >
          <Ico name="AlertTriangle" size={16} color="#E65100" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: "#BF360C", lineHeight: 1.55 }}>
            If no road route exists, you'll see <strong>"No route found — straight-line only"</strong> — but the distance
            still displays.
          </span>
        </div>
      </div>
    );

  if (visual === "full_report")
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.38s 0.06s",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#4CAF50,#388E3C)",
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Ico name="FileText" size={18} color="rgba(255,255,255,0.9)" />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>
              Full Report
            </span>
            <Ico name="ChevronRight" size={14} color="rgba(255,255,255,0.8)" />
          </div>
          <span
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.1em",
            }}
          >
            OPENS DASHBOARD
          </span>
        </div>
        {(s.reportItems || []).map((it, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "9px 12px",
              background: "#fff",
              borderRadius: 10,
              border: "1px solid #EDE8DF",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(8px)",
              transition: `opacity 0.28s ${0.12 + i * 0.07}s, transform 0.30s ${0.12 + i * 0.07}s ease`,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#4CAF50",
                flexShrink: 0,
                marginTop: 5,
              }}
            />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: "#424242", lineHeight: 1.5 }}>
              {it}
            </span>
          </div>
        ))}
      </div>
    );

  if (visual === "advisory_intro")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SectionChip label="SECTION 3 OF 4 — HEAT ADVISORY" />
        <div
          style={{
            background: "#FFF3E0",
            borderRadius: 12,
            padding: "14px 16px",
            border: "1.5px solid rgba(255,152,0,0.30)",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "scale(0.95)",
            transition: "opacity 0.38s 0.08s, transform 0.38s 0.08s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "#E65100",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Ico name="Pin" size={14} color="#E65100" />
            When No Zone Is Selected:
          </div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#BF360C", lineHeight: 1.6 }}>
            A friendly message explains that data requires a location. Tap <strong>"Choose location"</strong> to jump back
            to the Heat Map and select a barangay.
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,107,26,0.06)",
            borderRadius: 12,
            padding: "14px 16px",
            border: "1px solid rgba(255,107,26,0.16)",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "scale(0.95)",
            transition: "opacity 0.38s 0.18s, transform 0.38s 0.18s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "#C44F00",
              marginBottom: 6,
            }}
          >
            All recommendations align with official PAGASA levels:
          </div>
          {[
            ["< 27°C", "Not Hazardous", "#4CAF50"],
            ["27–32°C", "Caution", "#FFD600"],
            ["33–41°C", "Extreme Caution", "#FF9800"],
            ["42–51°C", "Danger", "#F44336"],
            ["≥ 52°C", "Extreme Danger", "#B71C1C"],
          ].map(([t, l, c], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
              <div
                style={{
                  minWidth: 52,
                  height: 18,
                  borderRadius: 9,
                  background: c,
                  flexShrink: 0,
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 7.5,
                  color: "#fff",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {t}
              </div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: "#424242" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    );

  if (visual === "advisory")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(s.advItems || []).map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              padding: "10px 12px",
              background: i === 3 ? "rgba(255,107,26,0.06)" : "#fff",
              borderRadius: 12,
              border: `1.5px solid ${i === 3 ? "rgba(255,107,26,0.18)" : "#EDE8DF"}`,
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(-12px)",
              transition: `opacity 0.28s ${0.06 + i * 0.07}s, transform 0.30s ${0.06 + i * 0.07}s ease`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(255,107,26,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Ico name={a.iconName} size={18} color="#C44F00" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 800,
                  fontSize: 13,
                  color: "#C44F00",
                  marginBottom: 2,
                }}
              >
                {a.label}
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#757575", lineHeight: 1.5 }}>
                {a.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    );

  if (visual === "dashboard_intro")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SectionChip label="SECTION 4 OF 4 — DASHBOARD" />
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1.5px solid #EDE8DF",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(10px)",
            transition: "opacity 0.38s 0.08s, transform 0.38s 0.08s ease",
          }}
        >
          <div
            style={{
              background: "#F5F0EA",
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 8.5,
                fontWeight: 700,
                color: "#9E9E9E",
                letterSpacing: "0.12em",
              }}
            >
              ROW 1 — KPI STRIP
            </span>
            <Ico name="BarChart" size={13} color="#9E9E9E" />
          </div>
          <div style={{ display: "flex", gap: 6, padding: "10px 14px", overflowX: "auto" }}>
            {[
              { icon: "Thermometer", k: "AVG TEMP", v: "27.4°C", c: "#FF6B1A" },
              { icon: "CheckCircle", k: "NOT HAZ", v: "142", c: "#4CAF50" },
              { icon: "AlertTriangle", k: "CAUTION", v: "38", c: "#FFD600" },
              { icon: "AlertTriangle", k: "EXT CAU", v: "12", c: "#FF9800" },
              { icon: "AlertTriangle", k: "DANGER", v: "3", c: "#F44336" },
            ].map(({ icon, k, v, c }, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  background: "#F9F5F0",
                  borderRadius: 10,
                  padding: "8px 10px",
                  textAlign: "center",
                  minWidth: 62,
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
                  <Ico name={icon} size={14} color={c} />
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 7,
                    fontWeight: 700,
                    color: "#9E9E9E",
                    letterSpacing: "0.10em",
                    marginBottom: 2,
                  }}
                >
                  {k}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 900, fontSize: 14, color: c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 12,
            color: "#757575",
            lineHeight: 1.6,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.32s 0.24s",
          }}
        >
          When no barangay is selected, city-wide KPIs and the full barangay list remain visible. The top bar shows{" "}
          <strong style={{ color: "#FF6B1A" }}>"No area selected"</strong> as a reminder.
        </div>
      </div>
    );

  if (visual === "table")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1.5px solid #EDE8DF",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(10px)",
            transition: "opacity 0.38s 0.06s, transform 0.38s 0.06s ease",
          }}
        >
          <div
            style={{
              background: "#F5F0EA",
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 8.5,
                fontWeight: 700,
                color: "#9E9E9E",
                letterSpacing: "0.12em",
              }}
            >
              ALL BARANGAYS TABLE
            </span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#FF6B1A", fontWeight: 700 }}>
              View All
            </span>
          </div>
          {[
            ["Talomo", "36.2°C", "Extreme Caution"],
            ["Mulig", "20.2°C", "Not Hazardous"],
            ["Calinan", "29.5°C", "Caution"],
          ].map(([name, temp, level], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderTop: "1px solid #F5F0EA",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  color: "#1A1A1A",
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 11,
                  color: "#424242",
                  minWidth: 50,
                  flexShrink: 0,
                }}
              >
                {temp}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 10,
                  color: "#757575",
                  flex: 1,
                  textAlign: "center",
                  minWidth: 0,
                }}
              >
                {level}
              </span>
              <div
                style={{
                  height: 26,
                  padding: "0 10px",
                  borderRadius: 8,
                  background: "#FF6B1A",
                  border: "none",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11,
                  color: "#fff",
                  fontWeight: 700,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.7,
                  cursor: "default",
                  pointerEvents: "none",
                }}
              >
                View
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {(s.tableItems || []).map((it, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "10px 8px",
                borderRadius: 12,
                background: "rgba(255,107,26,0.05)",
                border: "1px solid rgba(255,107,26,0.12)",
                textAlign: "center",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(6px)",
                transition: `opacity 0.26s ${0.14 + i * 0.06}s, transform 0.28s ${0.14 + i * 0.06}s ease`,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "rgba(255,107,26,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ico name={it.iconName} size={16} color="#C44F00" />
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11, color: "#C44F00" }}>
                {it.label}
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "#757575", lineHeight: 1.4 }}>
                {it.tip}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (visual === "facilities_trends")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(s.ftItems || []).map((f, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              padding: "10px 12px",
              background: "#fff",
              borderRadius: 12,
              border: "1.5px solid #EDE8DF",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(-10px)",
              transition: `opacity 0.28s ${0.06 + i * 0.08}s, transform 0.30s ${0.06 + i * 0.08}s ease`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(255,107,26,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Ico name={f.iconName} size={18} color="#C44F00" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 800,
                  fontSize: 13,
                  color: "#C44F00",
                  marginBottom: 2,
                }}
              >
                {f.label}
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#757575", lineHeight: 1.5 }}>
                {f.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    );

  if (visual === "done")
    return (
      <div
        style={{
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "scale(0.82)",
          transition: "opacity 0.48s 0.08s, transform 0.48s 0.08s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div
          style={{
            marginBottom: 14,
            display: "flex",
            justifyContent: "center",
            animation: visible ? "tutorial-spinBounce 0.55s 0.15s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "linear-gradient(135deg,#FF8C3A,#C44F00)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 28px rgba(255,107,26,0.45)",
            }}
          >
            <Ico name="Party" size={30} color="#fff" />
          </div>
        </div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#9E9E9E", marginBottom: 14 }}>
          Reopen anytime via the <strong style={{ color: "#FF6B1A" }}>?</strong> button
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          {[
            { iconName: "Map", label: "Heat Map", hint: "Explore Davao's heat risk zones" },
            { iconName: "AlertTriangle", label: "Heat Advisory", hint: "Get AI safety recommendations" },
            { iconName: "BarChart", label: "Dashboard", hint: "View city-wide KPIs & trends" },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 14px",
                borderRadius: 12,
                background: `rgba(255,107,26,${0.06 + i * 0.03})`,
                border: "1px solid rgba(255,107,26,0.15)",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(8px)",
                transition: `opacity 0.30s ${0.22 + i * 0.09}s, transform 0.32s ${0.22 + i * 0.09}s cubic-bezier(0.34,1.56,0.64,1)`,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "rgba(255,107,26,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Ico name={t.iconName} size={16} color="#C44F00" />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12, color: "#C44F00" }}>
                  {t.label}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#9E9E9E" }}>{t.hint}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { iconName: "Snowflake", label: "Stay Cool" },
            { iconName: "Eye", label: "Stay Aware" },
            { iconName: "Shield", label: "Keep Safe" },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 20,
                background: `rgba(255,107,26,${0.08 + i * 0.04})`,
                border: "1px solid rgba(255,107,26,0.18)",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#C44F00",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(10px)",
                transition: `opacity 0.32s ${0.42 + i * 0.09}s, transform 0.32s ${0.42 + i * 0.09}s cubic-bezier(0.34,1.56,0.64,1)`,
              }}
            >
              <Ico name={t.iconName} size={13} color="#C44F00" />
              {t.label}
            </div>
          ))}
        </div>
      </div>
    );

  return null;
}
