import { useState, useEffect, useMemo, useRef } from "react";
import { getApiBase } from "../../services/apiConfig.js";
import { fetchDavaoBoundaries } from "../../services/boundariesService.js";
import StyledCalendar from "../StyledCalendar.jsx";
import "../../styles/NavigationLoader.css";
import { fetchBarangayTemperatures, fetchHeatSummary, fetchHistoricalTrends } from "../../services/heatService.js";
import { getHealthFacilitiesNearBarangay, getFacilityCountsByBarangays } from "../../services/healthFacilitiesService.js";
import { getBarangayId, tempToHeatRiskLevel } from "../../utils/heatMap.js";

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
  amber50: "#FFFBEB", amber100: "#FDE68A", gray400: "#9E9E9E",
};

function todayStr() {
  return new Date().toISOString().split("T")[0];
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}
function fmtDate(s) {
  return s
    ? new Date(s).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })
    : "—";
}

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
  healthctr: { label: "Health Center",     icon: "/cross2.png",   color: P.blue700,  bg: P.blue100  },
  pharmacy:  { label: "Pharmacy",          icon: "/pill2.png",    color: P.green700, bg: P.green100 },
  doctor:    { label: "Doctor's Facility", icon: "/doctor.png",   color: P.green700, bg: P.green100 },
};

const RISK_FILTER_OPTIONS = [
  "NOT HAZARDOUS",
  "CAUTION",
  "EXTREME CAUTION",
  "DANGER",
  "EXTREME DANGER",
];

const TEMP_FILTER_OPTIONS = [
  ["any", "Any"],
  ["low", "Below 26C"],
  ["mid", "26-33C"],
  ["high", "Above 33C"],
];

const FACILITY_FILTER_OPTIONS = [
  ["any", "Any"],
  ["few", "1-5"],
  ["some", "6-15"],
  ["many", "15+"],
];

// ─── HISTORICAL TRENDS GRAPH HELPERS (Neon Noon–style) ─────────────
function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function useAnimatedProgress(trigger, duration = 900) {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    if (!trigger) {
      setProg(0);
      return;
    }
    let start = null;
    let frame;
    const step = (ts) => {
      if (!start) start = ts;
      const t = clamp((ts - start) / duration, 0, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setProg(ease);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [trigger, duration]);
  return prog;
}

function buildTrendPath(data, w, h, padX, padY, prog = 1) {
  if (!data.length) return { linePath: "", areaPath: "", pts: [] };
  const temps = data.map((d) => d.temp);
  const min = Math.min(...temps) - 2;
  const max = Math.max(...temps) + 2;
  const pts = data.map((d, i) => ({
    x: padX + (i / Math.max(1, data.length - 1)) * (w - padX * 2),
    y: padY + (1 - (d.temp - min) / Math.max(1, max - min)) * (h - padY * 2),
  }));
  const count = Math.max(2, Math.floor(pts.length * prog) + 1);
  const vis = pts.slice(0, count);
  const linePath = vis
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${vis[vis.length - 1].x.toFixed(1)},${h - padY} L${vis[0].x.toFixed(1)},${h - padY} Z`;
  return { linePath, areaPath, pts };
}

function tempColor(t) {
  return `hsl(${lerp(140, 10, clamp((t - 25) / 15, 0, 1))}, 78%, 48%)`;
}
function tempBg(t) {
  return `hsl(${lerp(140, 20, clamp((t - 25) / 15, 0, 1))}, 60%, 96%)`;
}
function tempBorder(t) {
  return `hsl(${lerp(140, 20, clamp((t - 25) / 15, 0, 1))}, 50%, 87%)`;
}

function normalizeFacilityTypeKey(raw) {
  if (!raw) return null;
  const s = String(raw).trim().toLowerCase();
  if (s.includes("hospital")) return "hospital";
  if (s.includes("pharma") || s.includes("drugstore")) return "pharmacy";
  if (s.includes("clinic")) return "clinic";
  if (s.includes("health") && (s.includes("center") || s.includes("centre"))) return "healthctr";
  if (s.includes("doctor") || s.includes("physician")) return "doctor";
  return null;
}

function riskLabelToKey(label) {
  if (!label) return null;
  const s = String(label).trim().toLowerCase();
  if (s === "not hazardous") return "NOT HAZARDOUS";
  if (s === "caution") return "CAUTION";
  if (s === "extreme caution") return "EXTREME CAUTION";
  if (s === "danger") return "DANGER";
  if (s === "extreme danger") return "EXTREME DANGER";
  return null;
}

function escapeCsvField(val) {
  if (val == null) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Build KPI CSV with columns: barangay_id, selectedzone, date, time, davao_city_avg_temp, heat risk zone counts */
function buildKpiCsvContent(kpiData) {
  const {
    barangayId = "",
    selectedZoneName = "",
    date = "",
    avgCityTemp,
    riskCounts = {},
  } = kpiData || {};
  const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const notHazardous = riskCounts["NOT HAZARDOUS"] ?? 0;
  const caution = riskCounts["CAUTION"] ?? 0;
  const extremeCaution = riskCounts["EXTREME CAUTION"] ?? 0;
  const danger = riskCounts["DANGER"] ?? 0;
  const extremeDanger = riskCounts["EXTREME DANGER"] ?? 0;
  const header = "barangay_id,selectedzone,date,time,davao_city_avg_temp,not_hazardous,caution,extreme_caution,danger,extreme_danger";
  const row = [
    escapeCsvField(barangayId),
    escapeCsvField(selectedZoneName),
    escapeCsvField(date),
    escapeCsvField(time),
    escapeCsvField(avgCityTemp != null && Number.isFinite(avgCityTemp) ? avgCityTemp.toFixed(1) : ""),
    escapeCsvField(notHazardous),
    escapeCsvField(caution),
    escapeCsvField(extremeCaution),
    escapeCsvField(danger),
    escapeCsvField(extremeDanger),
  ].join(",");
  return header + "\n" + row + "\n";
}

function haversineKm(lat1, lng1, lat2, lng2) {
  if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── MICRO COMPONENTS ─────────────────────────────────
function RiskPill({ risk, mini, fontSize, padding }) {
  const m = riskMeta[risk] || riskMeta["EXTREME CAUTION"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: m.bg, border: `1.5px solid ${m.border}`,
      borderRadius: 999,
      padding: padding ?? (mini ? "2px 9px" : "4px 12px"),
      fontSize: fontSize ?? (mini ? 9.5 : 11),
      fontWeight: 800, letterSpacing: "0.03em", color: m.color, whiteSpace: "nowrap",
      lineHeight: 1.2,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.color, display: "inline-block" }} />
      {risk}
    </span>
  );
}

function TypeChip({ type, fontSize = 10, padding = "1px 7px", iconSizeOverride }) {
  const key = normalizeFacilityTypeKey(type) || (facilityMeta[type] ? type : null) || "healthctr";
  const m = facilityMeta[key] || facilityMeta.healthctr;
  const iconSize = iconSizeOverride ?? (key === "hospital" ? 14 : 16);
  return (
    <span style={{
      background: m.bg, color: m.color, borderRadius: 6,
      padding, fontSize, fontWeight: 700,
      display: "inline-flex", alignItems: "center", gap: 6,
    }}>
      <img src={m.icon} alt="" style={{ width: iconSize, height: iconSize }} />
      {m.label}
    </span>
  );
}

function TempWithRiskColor({ temp, riskKey, fontSize = 11, minWidth = 38 }) {
  const valid = temp != null && Number.isFinite(temp);
  const meta = riskMeta[riskKey] || riskMeta["EXTREME CAUTION"];
  const color = valid ? meta.color : P.gray500;
  return (
    <span style={{
      fontSize,
      fontWeight: 700, color, minWidth,
    }}>{valid ? `${Number(temp).toFixed(1)}°C` : "—"}</span>
  );
}

function facilityCountLabel(count) {
  const n = count ?? 0;
  return n === 1 ? "1 facility" : `${n} facilities`;
}

function getDisplayFacilityCount(barangay, facilitiesPanel, facilityCountCache = {}) {
  const id = String(barangay.id);
  if (facilityCountCache[id] != null) return facilityCountCache[id];
  if (String(facilitiesPanel?.barangayId) === id && facilitiesPanel?.list != null) {
    return facilitiesPanel.list.length;
  }
  return barangay.facilityCount ?? 0;
}

function ExportSpinner({ color = P.white }) {
  return (
    <div style={{
      width: 13, height: 13,
      border: `2px solid ${color}44`,
      borderTop: `2px solid ${color}`,
      borderRadius: "50%",
      animation: "dashboard-spin 0.7s linear infinite",
      flexShrink: 0,
    }} />
  );
}

function ExportDisclaimer() {
  return (
    <div style={{
      display: "flex", gap: 7, alignItems: "flex-start",
      padding: "8px 12px",
      background: P.amber50,
      border: `1px solid ${P.amber100}`,
      borderRadius: 9,
      marginTop: 12,
    }}>
      <span style={{ fontSize: 12, flexShrink: 0 }}>⚠️</span>
      <p style={{
        fontSize: 10.5, color: "#78350F",
        lineHeight: 1.55, margin: 0,
      }}>
        Data is AI‑generated for assistance only. No guarantees.
        Always cross‑check with PAGASA and official sources.
      </p>
    </div>
  );
}

function ExportToast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [msg, onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24,
      background: P.green500, color: P.white,
      borderRadius: 12, padding: "11px 20px",
      fontSize: 13, fontWeight: 600,
      boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      zIndex: 9999, display: "flex", alignItems: "center", gap: 10,
      animation: "dashboard-slideUp 0.3s both",
    }}>
      ✓ {msg}
      <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────
export default function Dashboard({ selectedZone, onFocusFacilityOnMap }) {
  const [trendDays, setTrendDays] = useState(7);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches);
  const [allBarangaysPanelOpen, setAllBarangaysPanelOpen] = useState(false);
  const [barangayQuery, setBarangayQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [riskFilters, setRiskFilters] = useState(() => new Set());
  const [tempFilter, setTempFilter] = useState("any");
  const [facilityFilter, setFacilityFilter] = useState("any");
  const [dirType, setDirType]     = useState("all");
  const [dirSort, setDirSort]     = useState("asc");
  const [facilitiesPanel, setFacilitiesPanel] = useState(null);
  const [facilityCountCache, setFacilityCountCache] = useState({});
  const [tick, setTick]           = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportDateKpi, setExportDateKpi] = useState(() => todayStr());
  const [exportDateTrends, setExportDateTrends] = useState(() => todayStr());
  const [exportToast, setExportToast] = useState(null);
  const [trendTooltip, setTrendTooltip] = useState(null); // { index, day, temp }
  const [trendHoverIndex, setTrendHoverIndex] = useState(null);
  const [trendMounted, setTrendMounted] = useState(false);
  const [trendCardsIn, setTrendCardsIn] = useState(false);
  const trendsRef = useRef(null);
  const [barangayRows, setBarangayRows] = useState([]);
  const [barangaysLoading, setBarangaysLoading] = useState(true);
  const [barangaysError, setBarangaysError] = useState(null);
  const [nearbyFacilities, setNearbyFacilities] = useState([]);
  const [nearbyTotalLabel, setNearbyTotalLabel] = useState(null);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [trendError, setTrendError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [heatSummary, setHeatSummary] = useState(null);

  // Desktop breakpoint for trends chart (expand graph, no scroll)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const fn = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadBarangays() {
      setBarangaysLoading(true);
      setBarangaysError(null);
      try {
        const [{ barangayGeojson }, backend] = await Promise.all([
          fetchDavaoBoundaries(),
          fetchBarangayTemperatures("davao"),
        ]);
        if (!backend || !backend.temperatures) {
          throw new Error("Heat API is unreachable. Please start/configure the backend.");
        }
        const features = barangayGeojson?.features ?? [];
        const temps = backend.temperatures ?? {};
        const backendBarangaysById = {};
        if (Array.isArray(backend.barangays) && backend.barangays.length > 0) {
          for (const b of backend.barangays) {
            const id = b.barangay_id ?? b.id;
            if (id != null) backendBarangaysById[String(id)] = b;
          }
        }
        const risks = {};
        for (const [id, t] of Object.entries(temps)) {
          if (t != null && Number.isFinite(t)) risks[id] = tempToHeatRiskLevel(t);
        }
        // Use backend barangay_id for counts API so keys match backend; fallback to GeoJSON ids
        const idsForCounts = Array.isArray(backend.barangays) && backend.barangays.length > 0
          ? backend.barangays.map((b) => String(b.barangay_id ?? b.id)).filter(Boolean)
          : features.map((f) => getBarangayId(f)).filter((id) => id != null).map((id) => String(id));
        const counts = (await getFacilityCountsByBarangays(idsForCounts)) ?? {};
        const rows = features
          .map((f) => {
            const id = getBarangayId(f);
            if (id == null) return null;
            const key = String(id);
            const name = f.properties?.adm4_en ?? f.properties?.name ?? "Barangay";
            const back = backendBarangaysById[key];
            const temperature = back?.temp_c ?? back?.temperature_c ?? temps[key];
            const riskLevel = (temperature != null && Number.isFinite(temperature))
              ? tempToHeatRiskLevel(temperature)
              : (risks[key] ?? tempToHeatRiskLevel(null));
            const countKey = back != null ? String(back.barangay_id ?? back.id ?? key) : key;
            const facilityCount = counts[countKey] ?? null;
            return { id: key, name, temperature, riskLevel, facilityCount };
          })
          .filter(Boolean)
          .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        if (!cancelled) setBarangayRows(rows);
      } catch (err) {
        if (!cancelled) setBarangaysError(err?.message || String(err));
      } finally {
        if (!cancelled) setBarangaysLoading(false);
      }
    }
    loadBarangays();
    return () => { cancelled = true; };
  }, []);

  // Pre-fetch facility counts from by-barangay API so table shows correct counts (batch API is unreliable)
  const BATCH_SIZE = 6;
  useEffect(() => {
    if (!barangayRows.length) return;
    let cancelled = false;
    const ids = barangayRows.map((r) => r.id);
    (async function fetchCountsInBatches() {
      for (let i = 0; i < ids.length && !cancelled; i += BATCH_SIZE) {
        const chunk = ids.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(
          chunk.map((id) => getHealthFacilitiesNearBarangay(id).then((res) => ({ id, count: res?.facilities?.length ?? 0 })))
        );
        if (cancelled) return;
        setFacilityCountCache((prev) => {
          const next = { ...prev };
          for (const { id, count } of results) next[String(id)] = count;
          return next;
        });
      }
    })();
    return () => { cancelled = true; };
  }, [barangayRows.length]);

  useEffect(() => {
    let cancelled = false;
    async function loadSummary() {
      try {
        const res = await fetchHeatSummary("davao");
        if (!cancelled && res) setHeatSummary(res);
      } catch (_) {}
    }
    loadSummary();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadHistoricalTrends() {
      setTrendError(null);
      try {
        const res = await fetchHistoricalTrends("davao", trendDays);
        if (!res || !Array.isArray(res.rows) || res.rows.length === 0) {
          throw new Error("Historical trends API returned no data.");
        }
        const rows = res.rows.slice(0, trendDays);
        const reversed = [...rows].reverse();
        const cd = reversed.map((r, i) => ({
          day: i + 1,
          temp: r.city_avg_temp_c,
          dateLabel: new Date(r.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        }));
        if (!cancelled) setChartData(cd);
      } catch (err) {
        if (!cancelled) setTrendError(err?.message || String(err));
        if (!cancelled) setChartData([]);
      }
    }
    loadHistoricalTrends();
    return () => { cancelled = true; };
  }, [trendDays]);

  // Animate historical trends line + day-by-day cards when section first enters viewport (don't reset when 7→14)
  useEffect(() => {
    if (!chartData.length) {
      setTrendMounted(false);
      setTrendCardsIn(false);
      return;
    }

    const el = trendsRef.current;
    if (typeof window === "undefined" || !el || typeof IntersectionObserver === "undefined") {
      setTrendMounted(true);
      setTrendCardsIn(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTrendMounted(true);
            setTrendCardsIn(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [chartData]);

  useEffect(() => {
    let cancelled = false;
    async function syncNearbyFacilities() {
      if (Array.isArray(selectedZone?.facilities)) {
        setNearbyFacilities(selectedZone.facilities);
        setNearbyTotalLabel(selectedZone.facilitiesTotalLabel ?? null);
        setNearbyLoading(!!selectedZone.facilitiesLoading);
        return;
      }
      if (selectedZone?.barangayId != null) {
        setNearbyLoading(true);
        try {
          const center = { lat: selectedZone.lat, lng: selectedZone.lng };
          const res = await getHealthFacilitiesNearBarangay(selectedZone.barangayId, center);
          if (!cancelled) {
            setNearbyFacilities(res?.facilities ?? []);
            setNearbyTotalLabel(res?.total_label ?? null);
          }
        } finally {
          if (!cancelled) setNearbyLoading(false);
        }
        return;
      }
      setNearbyFacilities([]);
      setNearbyTotalLabel(null);
      setNearbyLoading(false);
    }
    syncNearbyFacilities();
    return () => { cancelled = true; };
  }, [selectedZone]);

  useEffect(() => {
    if (!facilitiesPanel?.barangayId || facilitiesPanel.list != null) return;
    let cancelled = false;
    const id = facilitiesPanel.barangayId;
    getHealthFacilitiesNearBarangay(id).then((res) => {
      if (cancelled) return;
      const list = res?.facilities ?? [];
      const count = res?.total ?? list.length;
      setFacilityCountCache((prev) => ({ ...prev, [String(id)]: count }));
      setFacilitiesPanel((prev) => prev && prev.barangayId === id ? { ...prev, list, totalLabel: res?.total_label ?? null } : prev);
    });
    return () => { cancelled = true; };
  }, [facilitiesPanel?.barangayId, facilitiesPanel?.list]);

  // Body scroll lock when All Barangays modal is open
  useEffect(() => {
    if (allBarangaysPanelOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [allBarangaysPanelOpen]);

  const handleExportCsv = async (kind, dateOrDays, filenameBase, overrideDate, kpiData) => {
    const date = overrideDate ?? ((dateOrDays && typeof dateOrDays === "string") ? dateOrDays : new Date().toISOString().slice(0, 10));
    const defaultFilename = kind === "city" ? `kpi_barangay_heat_risk_${date}.csv` : `historical_trends_${date}.csv`;
    const filename = filenameBase || defaultFilename;
    setExportLoading(true);
    try {
      if (kind === "city" && kpiData != null) {
        const csvContent = buildKpiCsvContent({
          ...kpiData,
          date: date,
        });
        const blob = new Blob([csvContent], { type: "text/csv; charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
        setExportToast(`${filename} downloaded.`);
        return;
      }
      const base = getApiBase();
      const path = kind === "city"
        ? `/api/heat/export/city?date=${date}&city_id=davao`
        : `/api/historical-trends/export?city_id=davao&days=${dateOrDays ?? 7}&date=${date}`;
      const url = base ? `${base}${path}` : path;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(res.statusText);
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      let resolvedFilename = filename;
      if (disposition) {
        const match = disposition.match(/filename[*]?=(?:UTF-8'')?["']?([^"'\s;]+)/i);
        if (match) resolvedFilename = match[1].trim();
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = resolvedFilename;
      a.click();
      URL.revokeObjectURL(a.href);
      setExportToast(`${resolvedFilename} downloaded.`);
    } catch (err) {
      console.warn("[Dashboard] Export failed:", err?.message);
    } finally {
      setExportLoading(false);
    }
  };

  const now     = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const activeZone = selectedZone ?? null;
  const noSelection = !activeZone;

  const activeRiskKey = riskLabelToKey(activeZone?.riskLevel?.label);

  const toggleRiskFilter = (risk) => {
    setRiskFilters((prev) => {
      const next = new Set(prev);
      if (next.has(risk)) next.delete(risk);
      else next.add(risk);
      return next;
    });
  };

  const clearBarangayFilters = () => {
    setRiskFilters(new Set());
    setTempFilter("any");
    setFacilityFilter("any");
  };

  const hasActiveFilters = riskFilters.size > 0 || tempFilter !== "any" || facilityFilter !== "any";
  const activeFilterCount = (riskFilters.size > 0 ? 1 : 0) + (tempFilter !== "any" ? 1 : 0) + (facilityFilter !== "any" ? 1 : 0);

  const normalizedQuery = barangayQuery.trim().toLowerCase();
  const filteredBarangays = barangayRows.filter((b) => {
    if (normalizedQuery && !(b.name || "").toLowerCase().includes(normalizedQuery)) return false;

    const rowRisk = riskLabelToKey(b.riskLevel?.label) ?? "EXTREME CAUTION";
    if (riskFilters.size > 0 && !riskFilters.has(rowRisk)) return false;

    const t = Number(b.temperature);
    if (tempFilter === "low" && !(Number.isFinite(t) && t < 26)) return false;
    if (tempFilter === "mid" && !(Number.isFinite(t) && t >= 26 && t < 33)) return false;
    if (tempFilter === "high" && !(Number.isFinite(t) && t >= 33)) return false;

    const count = getDisplayFacilityCount(b, facilitiesPanel, facilityCountCache);
    if (facilityFilter === "few" && !(count >= 1 && count <= 5)) return false;
    if (facilityFilter === "some" && !(count >= 6 && count <= 15)) return false;
    if (facilityFilter === "many" && !(count >= 15)) return false;

    return true;
  });
  const displayed = filteredBarangays.slice(0, 15);

  // Derive risk counts from the same barangay data shown in the list/map so the count always matches what the user sees.
  const riskCounts = useMemo(() => {
    const out = { "NOT HAZARDOUS": 0, "CAUTION": 0, "EXTREME CAUTION": 0, "DANGER": 0, "EXTREME DANGER": 0 };
    for (const b of barangayRows) {
      const key = riskLabelToKey(b.riskLevel?.label);
      if (key && out[key] != null) out[key] += 1;
    }
    return out;
  }, [barangayRows]);

  const avgCityTemp = useMemo(() => {
    if (heatSummary?.city_avg_temp_c != null && Number.isFinite(heatSummary.city_avg_temp_c)) return heatSummary.city_avg_temp_c;
    const temps = barangayRows.map((b) => b.temperature).filter((t) => t != null && Number.isFinite(t));
    if (temps.length === 0) return null;
    return temps.reduce((s, t) => s + t, 0) / temps.length;
  }, [barangayRows, heatSummary]);

  const dirFacilities = useMemo(() => {
    const list = nearbyFacilities.map((f) => {
      const dist = f.distKm ?? (f.distance_km != null ? Number(f.distance_km) : null);
      return { ...f, distKm: dist, dist: f.distance ?? (dist != null ? `${dist.toFixed(1)} km` : "—") };
    });
    return list
      .filter((f) => {
        const key = normalizeFacilityTypeKey(f.facility_type);
        return dirType === "all" || key === dirType;
      })
      .sort((a, b) => {
        if (dirSort === "asc") return (a.distKm ?? Infinity) - (b.distKm ?? Infinity);
        return (b.distKm ?? -Infinity) - (a.distKm ?? -Infinity);
      });
  }, [nearbyFacilities, dirType, dirSort]);

  const maxT = chartData.length ? Math.max(...chartData.map((d) => d.temp)) : 0;
  const minT = chartData.length ? Math.min(...chartData.map((d) => d.temp)) : 0;
  const avgT = chartData.length ? chartData.reduce((sum, d) => sum + d.temp, 0) / chartData.length : 0;
  const trendDelta = chartData.length ? chartData[chartData.length - 1].temp - chartData[0].temp : 0;

  const trendProg = useAnimatedProgress(trendMounted && chartData.length ? trendDays : null, 1000);
  const trendSparkProg = useAnimatedProgress(trendProg >= 1 && !!chartData.length, 2200);

  return (
    <div className="dashboard-loading-wrapper">
      {barangaysLoading && (
        <div className="dashboard-loading-overlay" role="status" aria-live="polite" aria-label="Loading dashboard">
          <div className="navigation-loader-content">
            <div className="radar-loader">
              <span className="radar-ring" aria-hidden />
              <span className="radar-ring" aria-hidden />
            </div>
            <p className="navigation-loader-text">Loading dashboard…</p>
          </div>
        </div>
      )}
      <div
        className="dashboard-panel-scroll"
        style={{
          height: "100%",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          background: P.surfaceSecondary,
          }}
      >
            <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #FF6B1A55; border-radius: 2px; }
        .dashboard-panel-scroll::-webkit-scrollbar { display: none; }
        .dashboard-kpi { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 900px) {
          .dashboard-kpi { grid-template-columns: 210px 1fr auto; align-items: center; }
        }
        .dashboard-row2 { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 16px; }
        .dashboard-clear-filters-mobile { display: none !important; }
        @media (max-width: 768px) {
          .dashboard-clear-filters-mobile { display: inline-flex !important; }
        }
        .dashboard-row3 { display: block; margin-bottom: 16px; }
        .dashboard-row4 { margin-bottom: 16px; }
        @media (max-width: 899px) {
          .dashboard-trends-header-row {
            flex-wrap: wrap;
            justify-content: center !important;
            gap: 12px;
          }
          .dashboard-trends-header-row .dashboard-trends-header-controls {
            justify-content: center;
          }
        }
        .trend-data { margin-top: 0; display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; }
        .trend-data-item { min-width: 0; }
        .trend-layout { display: flex; flex-direction: column; gap: 14px; width: 100%; }
        .trend-graph-wrap { width: 100%; flex: 1 1 auto; min-height: 240px; }
        .trend-left-col { display: flex; flex-direction: column; gap: 10px; min-width: 0; flex: 1; width: 100%; }
        .trend-right-col { min-width: 0; }
        @media (min-width: 768px) {
          .trend-layout { flex-direction: column; }
          .trend-left-col { flex: 1; min-width: 0; }
          .trend-right-col { width: 240px; flex-shrink: 0; }
          .trend-graph-wrap { min-height: 280px; }
        }
        .trend-insights { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
        @media (max-width: 700px) {
          .trend-insights { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        .trend-insights { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
        @media (max-width: 700px) {
          .trend-insights { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 768px) {
          .trend-data { grid-template-columns: repeat(auto-fit, minmax(95px, 1fr)); }
        }
        @media (min-width: 769px) and (max-width: 1100px) {
          .trend-data { grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); }
        }
        .trend-chart-scroll-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .trend-chart-scroll-wrap::-webkit-scrollbar { height: 5px; }
        .trend-chart-scroll-wrap::-webkit-scrollbar-track { background: transparent; }
        .trend-chart-scroll-wrap::-webkit-scrollbar-thumb { background: rgba(236, 169, 124, 0.95); border-radius: 999px; }
        .trend-chart-scroll-wrap::-webkit-scrollbar-thumb:hover { background: rgba(228, 156, 108, 0.98); }
        .all-barangays-scroll, .dashboard-match-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(236, 169, 124, 0.95) transparent;
        }
        .all-barangays-scroll::-webkit-scrollbar, .dashboard-match-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .all-barangays-scroll::-webkit-scrollbar-track, .dashboard-match-scroll::-webkit-scrollbar-track { background: transparent; }
        .all-barangays-scroll::-webkit-scrollbar-thumb, .dashboard-match-scroll::-webkit-scrollbar-thumb { background: rgba(236, 169, 124, 0.95); border-radius: 999px; }
        .all-barangays-scroll::-webkit-scrollbar-thumb:hover, .dashboard-match-scroll::-webkit-scrollbar-thumb:hover { background: rgba(228, 156, 108, 0.98); }
        .all-barangays-scroll::-webkit-scrollbar-button, .dashboard-match-scroll::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
        @media (min-width: 1024px) {
          .dashboard-trends-content { padding-left: 10px; padding-right: 6px; }
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
        @keyframes dashboard-fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dashboard-spin { to { transform: rotate(360deg); } }
        @keyframes dashboard-slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.6; }
      `}</style>

      {/* ══ TOPBAR — #C44F00 (barangay on far left, compact) ══ */}
      <div style={{
        background: "#C44F00", padding: "0 clamp(12px, 4vw, 28px)",
        minHeight: "clamp(44px, 7vh, 52px)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "clamp(8px, 2vw, 12px)",
        position: "sticky", top: 0, zIndex: 30,
        boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
      }}>
        {/* Barangay location — far left, compact */}
        <div className="topbar-pill" style={{
          padding: "4px 10px 4px 10px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.22)",
          border: "1px solid rgba(255,255,255,0.35)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: "9px",
            letterSpacing: "0.08em", color: "rgba(255,255,255,0.85)",
          }}>
            BARANGAY
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span className="topbar-name" style={{
              fontSize: "13px",
              fontWeight: 800, color: P.white, letterSpacing: "0.01em",
            }}>
              {noSelection ? "No area selected" : (activeZone?.name ?? (barangaysLoading ? "Loading…" : "—"))}
            </span>
            {!noSelection && activeRiskKey && <RiskPill risk={activeRiskKey} mini />}
          </div>
        </div>
        <div className="topbar-right" style={{ marginLeft: "auto" }}>
          <span className="topbar-date" style={{
            fontSize: "clamp(10px, 2vw, 11px)",
            color: P.white, opacity: 0.85,
          }}>
            {dateStr}
          </span>
          <div style={{
            background: "rgba(255,255,255,0.22)",
            border: "1px solid rgba(255,255,255,0.45)",
            color: P.white,
            fontSize: "clamp(9px, 1.5vw, 11px)", fontWeight: 700,
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
          overflow: "visible",
        }}>

          {/* Avg Temp hero card */}
          <div style={{
            background: P.orangeGrad, borderRadius: 14,
            padding: "clamp(16px, 3vw, 22px)", position: "relative", overflow: "hidden",
            textAlign: "center",
          }}>
            <div style={{ position: "absolute", top: -12, right: -12, width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
            <div style={{ fontSize: "clamp(7px, 1.5vw, 8px)", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>
              AVG TEMPERATURE
            </div>
            <div style={{ fontWeight: 900, fontSize: "clamp(32px, 8vw, 46px)", color: P.white, lineHeight: 1, letterSpacing: "-0.03em" }}>
              {noSelection ? "—°C" : (avgCityTemp ?? avgT).toFixed(1) + "°"}
            </div>
            <div className="avg-date" style={{
              fontSize: "clamp(9px, 2.2vw, 11px)",
              color: "rgba(255,255,255,0.75)", marginTop: 6, textAlign: "center",
            }}>
              {noSelection ? "" : dateStr}
            </div>
            <div style={{
              fontSize: "clamp(10px, 2.4vw, 12px)",
              color: noSelection ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.8)", marginTop: 6,
            }}>
              {noSelection ? "No barangay selected" : "Davao City"}
            </div>
          </div>

          {/* Risk zone count grid */}
          <div>
            <div style={{ fontWeight: 700, fontSize: "clamp(11px, 2vw, 13px)", color: P.gray700, marginBottom: 12 }}>
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
                    <div style={{ fontSize: "clamp(6px, 1.5vw, 7px)", fontWeight: 700, letterSpacing: "0.05em", color: rm2.color, marginBottom: 4, lineHeight: 1.35 }}>{r}</div>
                    <div style={{ fontWeight: 900, fontSize: "clamp(20px, 5vw, 28px)", color: rm2.color, lineHeight: 1 }}>{noSelection ? "—" : count}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ══ ROW 2: All Barangays Table (full width) ══ */}
        <div className="dashboard-row2">

          {/* All Barangays Table — Gray-900 header */}
          <div style={{ background: P.white, borderRadius: 16, border: `1px solid ${P.gray100}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{
              padding: "18px 28px", background: "#FF6B1A",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: P.white }}>
                ALL BARANGAYS — HEAT RISK OVERVIEW
              </div>
            </div>

            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${P.gray100}`, background: P.white }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <input
                  value={barangayQuery}
                  onChange={(e) => setBarangayQuery(e.target.value)}
                  placeholder="Search barangay"
                  disabled={noSelection}
                  style={{
                    flex: 1,
                    minWidth: 240,
                    maxWidth: 360,
                    border: `1.5px solid ${P.gray100}`,
                    borderRadius: 10,
                    padding: "9px 12px",
                    fontSize: 13,
                    outline: "none",
                    background: noSelection ? P.gray100 : P.gray50,
                    cursor: noSelection ? "not-allowed" : "text",
                    opacity: noSelection ? 0.8 : 1,
                  }}
                />
                <button
                  type="button"
                  disabled={noSelection}
                  onClick={() => !noSelection && setFiltersOpen((o) => !o)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "8px 13px", borderRadius: 10,
                    border: `1.5px solid ${(filtersOpen || hasActiveFilters) ? P.orange500 : P.gray100}`,
                    background: filtersOpen ? P.orange50 : P.white,
                    color: hasActiveFilters ? P.orange500 : P.gray700,
                    fontWeight: 700, fontSize: 12,
                    cursor: noSelection ? "not-allowed" : "pointer",
                    opacity: noSelection ? 0.7 : 1,
                  }}
                >
                  Filters
                  {activeFilterCount > 0 && (
                    <span style={{ background: P.orange500, color: P.white, borderRadius: 99, fontSize: 10, fontWeight: 800, padding: "1px 6px" }}>
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="dashboard-clear-filters-mobile"
                    onClick={clearBarangayFilters}
                    style={{
                      display: "none",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 14px",
                      minHeight: 44,
                      borderRadius: 10,
                      border: "none",
                      background: "none",
                      color: P.orange500,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: noSelection ? "not-allowed" : "pointer",
                      opacity: noSelection ? 0.7 : 1,
                    }}
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div
                style={{
                  overflow: "hidden",
                  maxHeight: filtersOpen ? 360 : 0,
                  transition: "max-height 0.25s ease",
                }}
              >
                <div style={{ marginTop: 10, background: P.white, border: `1px solid ${P.gray100}`, borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: P.gray500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Risk Level</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {RISK_FILTER_OPTIONS.map((risk) => {
                      const on = riskFilters.has(risk);
                      const m = riskMeta[risk];
                      return (
                        <button
                          key={risk}
                          type="button"
                          onClick={() => toggleRiskFilter(risk)}
                          style={{
                            padding: "6px 12px", borderRadius: 99,
                            border: `1.5px solid ${on ? m.color : P.gray100}`,
                            background: on ? m.bg : P.gray50,
                            color: on ? m.color : P.gray700,
                            fontWeight: on ? 700 : 600,
                            fontSize: 12,
                            display: "inline-flex", alignItems: "center", gap: 5,
                            cursor: "pointer",
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.color }} />
                          {risk}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: P.gray500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Temperature</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {TEMP_FILTER_OPTIONS.map(([val, label]) => {
                          const on = tempFilter === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setTempFilter(val)}
                              style={{
                                width: "100%", textAlign: "left",
                                padding: "8px 10px", borderRadius: 9,
                                border: `1.5px solid ${on ? P.orange500 : P.gray100}`,
                                background: on ? P.orange50 : P.gray50,
                                color: on ? P.orange500 : P.gray700,
                                fontWeight: on ? 700 : 600,
                                fontSize: 12,
                                cursor: "pointer",
                              }}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: P.gray500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Nearby Facilities</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {FACILITY_FILTER_OPTIONS.map(([val, label]) => {
                          const on = facilityFilter === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setFacilityFilter(val)}
                              style={{
                                width: "100%", textAlign: "left",
                                padding: "8px 10px", borderRadius: 9,
                                border: `1.5px solid ${on ? P.orange500 : P.gray100}`,
                                background: on ? P.orange50 : P.gray50,
                                color: on ? P.orange500 : P.gray700,
                                fontWeight: on ? 700 : 600,
                                fontSize: 12,
                                cursor: "pointer",
                              }}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <div style={{ textAlign: "right", marginTop: 10 }}>
                      <button
                        type="button"
                        onClick={clearBarangayFilters}
                        style={{ background: "none", border: "none", color: P.orange500, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="all-barangays-scroll" style={{ flex: 1, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ position: "sticky", top: 0, background: P.gray50, zIndex: 2 }}>
                  <tr>
                    {["Barangay", "Temperature", "Risk Level", "Nearby Facilities", ""].map(h => (
                      <th key={h} style={{
                        padding: "12px 16px", textAlign: "left",
                        fontSize: 12,
                        fontWeight: 700, letterSpacing: "0.04em", color: P.gray700,
                        borderBottom: `1px solid ${P.gray100}`,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {noSelection ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 32, textAlign: "center", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: P.gray700 }}>Select a barangay to begin</span>
                          <p style={{ margin: 0, fontSize: 12, color: P.gray500, maxWidth: 320 }}>
                            Click any area on the map or use search above to view heat risk and facilities.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : barangaysLoading ? (
                    <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", fontSize: 12, color: P.gray500 }}>Loading barangays…</td></tr>
                  ) : barangaysError ? (
                    <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", fontSize: 12, color: P.red500 }}>{barangaysError}</td></tr>
                  ) : (
                    displayed.map((b, i) => {
                      const riskKey = riskLabelToKey(b.riskLevel?.label) ?? "EXTREME CAUTION";
                      return (
                        <tr key={b.id} style={{ background: i % 2 === 0 ? P.white : P.gray50 }}>
                          <td style={{ padding: "10px 16px", fontSize: 12, fontWeight: 700, color: P.gray900 }}>{b.name}</td>
                          <td style={{ padding: "10px 16px", minWidth: 80 }}><TempWithRiskColor temp={b.temperature} riskKey={riskKey} /></td>
                          <td style={{ padding: "10px 16px" }}><RiskPill risk={riskKey} mini fontSize={10.5} padding="4px 10px" /></td>
                          <td style={{ padding: "10px 16px", fontSize: 11, color: P.gray500 }}>{facilityCountLabel(getDisplayFacilityCount(b, facilitiesPanel, facilityCountCache))}</td>
                          <td style={{ padding: "10px 16px" }}>
                            <button
                              onClick={() => {
                                setFacilitiesPanel((prev) => {
                                  if (prev && prev.barangayId === b.id) return null;
                                  return { barangay: b.name, barangayId: b.id, list: null };
                                });
                              }}
                              style={{
                                border: "none", background: P.orange50, color: P.orange700,
                                fontWeight: 700, fontSize: 10,
                                padding: "3px 10px", borderRadius: 6, cursor: "pointer",
                              }}>
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div style={{
              padding: "10px 20px", borderTop: `1px solid ${P.gray100}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: P.gray50,
            }}>
              <span style={{ fontSize: 11, color: P.gray500 }}>
                {noSelection ? "Select a barangay on the map to see the list" : `Showing ${displayed.length} of ${filteredBarangays.length} barangays${barangayQuery ? " (filtered)" : ""}`}
              </span>
              <button
                type="button"
                disabled={noSelection}
                onClick={() => !noSelection && setAllBarangaysPanelOpen(true)}
                style={{
                  border: `1px solid ${noSelection ? P.gray300 : P.orange100}`, borderRadius: 8,
                  background: noSelection ? P.gray100 : P.orange50, color: noSelection ? P.gray500 : P.orange500,
                  fontWeight: 700, fontSize: 11,
                  padding: "5px 14px", cursor: noSelection ? "not-allowed" : "pointer",
                  opacity: noSelection ? 0.8 : 1,
                }}>
                View All {filteredBarangays.length} →
              </button>
            </div>
          </div>
        </div>

        {/* ROW 3: Health Facility Directory */}
        <div className="dashboard-row3">
          <div style={{ background: P.white, borderRadius: 16, overflow: "hidden", border: `1px solid ${P.green100}`, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 18px", background: P.green700 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: P.green100 }}>HEALTH FACILITY DIRECTORY</div>
                <span style={{
                  fontSize: 11, color: P.green100,
                  background: "rgba(255,255,255,0.18)", borderRadius: 20,
                  padding: "7px 13px", fontWeight: 700,
                  display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0,
                  textAlign: "center", minWidth: 72,
                }}>
                  <span style={{ textAlign: "center" }}>
                    {noSelection ? "—" : (nearbyLoading ? "…" : (nearbyTotalLabel ?? `${nearbyFacilities.length} facilities`))}
                  </span>
                </span>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {[{ key: "all", label: "All Types" }, ...Object.entries(facilityMeta).map(([k, v]) => ({ key: k, label: v.label }))].map(f => (
                  <button key={f.key} disabled={noSelection} onClick={() => !noSelection && setDirType(f.key)} style={{ border: `1px solid ${dirType === f.key ? P.white : "rgba(255,255,255,0.2)"}`, borderRadius: 8, padding: "4px 10px", fontWeight: 700, fontSize: 11, cursor: noSelection ? "not-allowed" : "pointer", background: dirType === f.key ? P.white : "transparent", color: dirType === f.key ? P.green700 : "rgba(255,255,255,0.78)", opacity: noSelection ? 0.6 : 1 }}>{f.label}</button>
                ))}
              </div>
              <button disabled={noSelection} onClick={() => !noSelection && setDirSort(dirSort === "asc" ? "desc" : "asc")} style={{ border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, padding: "5px 12px", background: "rgba(255,255,255,0.1)", fontWeight: 700, fontSize: 12, cursor: noSelection ? "not-allowed" : "pointer", color: "rgba(255,255,255,0.8)", opacity: noSelection ? 0.6 : 1 }}>Distance {dirSort === "asc" ? "↑ Near–Far" : "↓ Far–Near"}</button>
            </div>
            <div className="dashboard-match-scroll" style={{ flex: 1, overflowY: "auto" }}>
              {noSelection ? (
                <div style={{ padding: 24, textAlign: "center" }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: P.gray700 }}>No facilities shown</p>
                  <p style={{ margin: "8px 0 0", fontSize: 13, color: P.gray500 }}>Select a barangay on the map to see facilities here.</p>
                </div>
              ) : nearbyLoading ? (
                <p style={{ padding: 16, margin: 0, fontSize: 13, color: P.gray500 }}>Loading facilities…</p>
              ) : dirFacilities.length === 0 ? (
                <p style={{ padding: 16, margin: 0, fontSize: 13, color: P.gray500 }}>No facilities in this barangay.</p>
              ) : (
                dirFacilities.map((f, i) => {
                  const key = normalizeFacilityTypeKey(f.facility_type);
                  const fm = facilityMeta[key] || facilityMeta.healthctr;
                  const distLabel = f.dist ?? (f.distKm != null ? `${Number(f.distKm).toFixed(1)} km` : "—");
                  const hasCoords = (f.lat != null || f.latitude != null) && (f.lng != null || f.longitude != null);
                  return (
                    <div
                      key={f.id}
                      role="button"
                      tabIndex={hasCoords ? 0 : -1}
                      onClick={() => hasCoords && onFocusFacilityOnMap?.(f)}
                      onKeyDown={(e) => hasCoords && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onFocusFacilityOnMap?.(f))}
                      style={{
                        padding: "12px 18px",
                        borderBottom: i < dirFacilities.length - 1 ? `1px solid ${P.gray100}` : "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: i % 2 === 0 ? P.white : P.green100 + "44",
                        cursor: hasCoords ? "pointer" : "default",
                        transition: "background 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (hasCoords) {
                          e.currentTarget.style.background = P.blue100 + "33";
                          e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(33, 150, 243, 0.25)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = i % 2 === 0 ? P.white : P.green100 + "44";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      aria-label={hasCoords ? `Show ${f.name} on map` : undefined}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: fm.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><img src={fm.icon} alt="" style={{ width: key === "hospital" ? 20 : 24, height: key === "hospital" ? 20 : 24 }} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: P.gray900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                        <TypeChip type={f.facility_type} fontSize={11} padding="3px 9px" iconSizeOverride={16} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: P.orange500 }}>{distLabel}</div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); hasCoords && onFocusFacilityOnMap?.(f); }}
                          style={{ border: "none", background: P.blue100, color: P.blue700, fontWeight: 700, fontSize: 11, padding: "3px 8px", borderRadius: 6, cursor: hasCoords ? "pointer" : "default", display: "inline-flex", alignItems: "center", gap: 4 }}
                          aria-label={`Show ${f.name} on map`}
                        >
                          <img src="/pin.png" alt="" style={{ width: 12, height: 12 }} />Map
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ROW 4: Historical Trends */}
        <div className="dashboard-row4" ref={trendsRef}>
          <div style={{ background: P.surfaceAccent, borderRadius: 16, border: `1px solid ${P.yellow100}`, overflowX: "hidden", overflowY: "visible", display: "flex", flexDirection: "column" }}>
            <div className="dashboard-trends-header-row" style={{ padding: "14px 20px", background: P.yellow500, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: P.gray900 }}>Historical Trends</div>
              <div className="dashboard-trends-header-controls" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {[7, 14].map(d => (
                  <button key={d} disabled={noSelection} onClick={() => !noSelection && setTrendDays(d)} style={{ border: `1.5px solid ${trendDays === d ? P.gray900 : "rgba(0,0,0,0.2)"}`, borderRadius: 8, padding: "4px 12px", fontWeight: 700, fontSize: 11, cursor: noSelection ? "not-allowed" : "pointer", background: trendDays === d ? P.gray900 : "rgba(255,255,255,0.35)", color: trendDays === d ? P.white : P.gray700, opacity: noSelection ? 0.6 : 1 }}>{d} Days</button>
                ))}
              </div>
            </div>
            <div className="dashboard-trends-content" style={{ padding: "16px 16px 16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {noSelection ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 200, background: "rgba(255,255,255,0.5)", borderRadius: 12, border: `1px dashed ${P.yellow100}` }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: P.gray700 }}>No data to display</div>
                  <p style={{ margin: 0, fontSize: 12, color: P.gray500, textAlign: "center", maxWidth: 280 }}>
                    Select a barangay on the map to view temperature trends.
                  </p>
                </div>
              ) : trendError ? (
                <p style={{ margin: 0, fontSize: 12, color: P.red500 }}>{trendError}</p>
              ) : chartData.length === 0 ? (
                <p style={{ margin: 0, fontSize: 12, color: P.gray500 }}>Loading forecast…</p>
              ) : (
                (() => {
                  const trendData = chartData.map((d) => ({
                    day: `Day ${d.day}`,
                    date: d.dateLabel,
                    temp: d.temp,
                  }));
                  const W = Math.round(620 * (trendDays / 7));
                  const H = 210;
                  const PX = isDesktop ? 20 : 44;
                  const PY = isDesktop ? 24 : 30;
                  const { linePath, areaPath, pts } = buildTrendPath(trendData, W, H, PX, PY, trendProg);
                  const hotPt =
                    pts.length > 0
                      ? pts.reduce(
                          (b, p, i) =>
                            trendData[i].temp > trendData[b.i].temp ? { i, p } : b,
                          { i: 0, p: pts[0] }
                        )
                      : null;
                  const sparkPt =
                    pts.length > 0
                      ? pts[clamp(Math.floor(trendSparkProg * (pts.length - 1)), 0, pts.length - 1)]
                      : null;
                  const gridLine = P.yellow100;
                  const areaTop = "rgba(255,107,26,0.22)";
                  const areaBot = "rgba(255,107,26,0.00)";
                  const lineColor = P.orange500;
                  const glowColor = "#FF8C3A";
                  const dotStroke = P.orange500;
                  const dotFill = P.white;
                  const dotActive = P.orange500;
                  const labelClr = P.gray500;

                  return (
                    <div className="trend-layout">
                      <div
                        className="trend-left-col"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 20,
                          minWidth: 0,
                          flex: 1,
                          width: "100%",
                        }}
                      >
                        {/* Line graph */}
                        <div className="trend-chart-scroll-wrap" style={{ width: "100%" }}>
                          <div className="trend-chart-scroll-inner" style={{ minWidth: W }}>
                            <div className="trend-graph-wrap" onClick={() => setTrendTooltip(null)} style={{ overflow: "visible" }}>
                              <svg
                                viewBox={`0 0 ${W} ${H}`}
                                style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
                              >
                                <defs>
                                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={areaTop} />
                                    <stop offset="100%" stopColor={areaBot} />
                                  </linearGradient>
                                  <filter id="trendGlow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                                    <feMerge>
                                      <feMergeNode in="blur" />
                                      <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                  </filter>
                                  <filter id="trendSparkGlow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                                    <feMerge>
                                      <feMergeNode in="blur" />
                                      <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                  </filter>
                                </defs>

                                {[0.25, 0.5, 0.75].map((f, i) => (
                                  <line
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={i}
                                    x1={PX}
                                    y1={PY + f * (H - PY * 2)}
                                    x2={W - PX}
                                    y2={PY + f * (H - PY * 2)}
                                    stroke={gridLine}
                                    strokeWidth={1}
                                    strokeDasharray="4 4"
                                  />
                                ))}

                                <path d={areaPath} fill="url(#trendFill)" />

                                <path
                                  d={linePath}
                                  fill="none"
                                  stroke={glowColor}
                                  strokeWidth={8}
                                  strokeLinejoin="round"
                                  opacity={0.3}
                                  filter="url(#trendGlow)"
                                />

                                <path
                                  d={linePath}
                                  fill="none"
                                  stroke={lineColor}
                                  strokeWidth={2.5}
                                  strokeLinejoin="round"
                                  strokeLinecap="round"
                                />

                                {pts.map((pt, i) => {
                                  if (i / Math.max(1, pts.length - 1) > trendProg + 0.01) return null;
                                  const isHov = trendHoverIndex === i;
                                  const active = trendTooltip && trendTooltip.index === i;
                                  const d = trendData[i];
                                  const tempLabel = `${Number(d.temp).toFixed(1)}°C`;
                                  const tooltipW = 56;
                                  const tooltipH = 30;
                                  const arrowH = 6;
                                  const baseRadius = 4.5;
                                  const hoverRadius = 7;
                                  const radius = isHov || active ? hoverRadius : baseRadius;
                                  const placeBelow = pt.y < PY + 40;
                                  const tooltipDy = placeBelow ? 28 : -(tooltipH + arrowH + 4);
                                  const tooltipLabelY = placeBelow ? -tooltipH - arrowH : 0;
                                  const tooltipTempY = tooltipLabelY + 11;
                                  const tooltipDateY = tooltipLabelY + 21;
                                  const labelBg = P.orange500;
                                  const labelDateColor = "rgba(255,255,255,0.9)";

                                  return (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <g
                                      key={i}
                                      style={{ cursor: "pointer" }}
                                      onMouseEnter={() => setTrendHoverIndex(i)}
                                      onMouseLeave={() => setTrendHoverIndex(null)}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setTrendTooltip({ index: i, day: d.day, temp: d.temp, date: d.date });
                                      }}
                                    >
                                      {/* Invisible larger hit area so last/first points are easy to click */}
                                      <circle cx={pt.x} cy={pt.y} r={14} fill="transparent" />
                                      {(isHov || active) && (
                                        <circle cx={pt.x} cy={pt.y} r={16} fill={labelBg} opacity={0.12} />
                                      )}
                                      <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r={radius}
                                        fill={isHov || active ? labelBg : dotFill}
                                        stroke={isHov || active ? labelBg : dotStroke}
                                        strokeWidth={2}
                                        style={{ transition: "all 0.15s" }}
                                      />
                                      {active && (
                                        <g transform={`translate(${pt.x}, ${pt.y + tooltipDy})`}>
                                          <rect
                                            x={-tooltipW / 2}
                                            y={tooltipLabelY}
                                            width={tooltipW}
                                            height={tooltipH}
                                            rx={7}
                                            ry={7}
                                            fill={labelBg}
                                          />
                                          {placeBelow ? (
                                            <polygon points="-6,-6 0,0 6,-6" fill={labelBg} />
                                          ) : (
                                            <polygon
                                              points={`${-6},${tooltipH} 0,${tooltipH + arrowH} ${6},${tooltipH}`}
                                              fill={labelBg}
                                            />
                                          )}
                                          <text
                                            x={0}
                                            y={tooltipTempY}
                                            textAnchor="middle"
                                            fill={P.white}
                                            fontSize={8}
                                            fontWeight={800}
                                          >
                                            {tempLabel}
                                          </text>
                                          <text
                                            x={0}
                                            y={tooltipDateY}
                                            textAnchor="middle"
                                            fill={labelDateColor}
                                            fontSize={6}
                                          >
                                            {d.date}
                                          </text>
                                        </g>
                                      )}
                                    </g>
                                  );
                                })}

                                {trendProg >= 1 && sparkPt && (
                                  <g style={{ pointerEvents: "none" }}>
                                    <circle cx={sparkPt.x} cy={sparkPt.y} r={12} fill={lineColor} opacity={0.12} />
                                    <circle
                                      cx={sparkPt.x}
                                      cy={sparkPt.y}
                                      r={5}
                                      fill={lineColor}
                                      opacity={0.9}
                                      filter="url(#trendSparkGlow)"
                                    />
                                    <circle cx={sparkPt.x} cy={sparkPt.y} r={3} fill={P.white} />
                                  </g>
                                )}

                                {hotPt && trendProg >= 1 && !trendTooltip && (
                                  <g style={{ pointerEvents: "none" }}>
                                    <rect
                                      x={hotPt.p.x - 32}
                                      y={hotPt.p.y - 44}
                                      width={64}
                                      height={24}
                                      rx={7}
                                      fill={lineColor}
                                    />
                                    <text
                                      x={hotPt.p.x}
                                      y={hotPt.p.y - 27}
                                      textAnchor="middle"
                                      fill={P.white}
                                      fontSize={11}
                                      fontWeight={800}
                                    >
                                      PEAK ↑
                                    </text>
                                  </g>
                                )}

                                {trendData.map((d, i) => {
                                  const x = PX + (i / Math.max(1, trendData.length - 1)) * (W - PX * 2);
                                  const isLabelIndex =
                                    trendDays === 7 ? [0, 3, 6].includes(i) : [0, 3, 6, 9, 13].includes(i);
                                  if (!isLabelIndex) return null;
                                  return (
                                    <text
                                      key={d.day}
                                      x={x}
                                      y={H - 2}
                                      textAnchor="middle"
                                      fill={labelClr}
                                      fontSize={10}
                                      fontWeight={700}
                                    >
                                      {d.day}
                                    </text>
                                  );
                                })}
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Day-by-day cards */}
                        <div className="trend-day-section" style={{ paddingTop: 6 }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 12,
                              color: P.gray700,
                              marginBottom: 12,
                            }}
                          >
                            Day-by-day temperatures
                          </div>
                          <div className="trend-data">
                            {trendData.map((d, i) => {
                              const gc = tempColor(d.temp);
                              return (
                                <div
                                  key={d.day}
                                  className="trend-data-item"
                                  style={{
                                    background: "rgba(255,255,255,0.55)",
                                    backdropFilter: "blur(12px)",
                                    WebkitBackdropFilter: "blur(12px)",
                                    border: `1.5px solid ${tempBorder(d.temp)}`,
                                    borderRadius: 10,
                                    padding: "14px 16px",
                                    boxShadow:
                                      "inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(200,160,100,0.08)",
                                    animation: trendCardsIn ? `dashboard-fadeUp 0.4s ${i * 0.05}s both` : "none",
                                    opacity: trendCardsIn ? 1 : 0,
                                    transition:
                                      "border-color 0.2s, box-shadow 0.2s, transform 0.18s, background 0.2s",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = gc;
                                    e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 18px ${gc}28`;
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.background = tempBg(d.temp);
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = tempBorder(d.temp);
                                    e.currentTarget.style.boxShadow =
                                      "inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(200,160,100,0.08)";
                                    e.currentTarget.style.transform = "none";
                                    e.currentTarget.style.background = "rgba(255,255,255,0.55)";
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: 10,
                                      color: "rgba(160,140,120,0.7)",
                                      marginBottom: 5,
                                      letterSpacing: "0.08em",
                                      fontWeight: 700,
                                    }}
                                  >
                                    {d.day}
                                  </div>
                                  <div
                                    style={{
                                      fontWeight: 800,
                                      fontSize: 18,
                                      color: gc,
                                      letterSpacing: "-0.02em",
                                    }}
                                  >
                                    {Number(d.temp).toFixed(1)}°C
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 10,
                                      color: P.gray700,
                                      marginTop: 4,
                                    }}
                                  >
                                    {d.date}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

          </div>
        </div>

        {/* Export section — two cards (ExportPair layout) */}
        <div className="dashboard-export-section" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(264px, 1fr))", gap: 20, marginBottom: 24 }}>
          {/* KPI Heat Risk card */}
          <div style={{ borderRadius: 20, boxShadow: "0 8px 36px rgba(0,0,0,0.12)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ background: `linear-gradient(135deg, ${P.orange500} 0%, ${P.orange700} 100%)`, padding: "20px 18px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 8, fontWeight: 500, letterSpacing: "0.14em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>Hourly Export</div>
              <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2, color: P.white }}>KPI Heat Risk</div>
              <div style={{ display: "inline-flex", alignSelf: "flex-start", marginTop: 7, borderRadius: 20, padding: "3px 11px", fontSize: 9, fontWeight: 500, background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.9)" }}>7-Day Window</div>
            </div>
            <div style={{ background: P.white, padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 13, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                <StyledCalendar value={exportDateKpi} onChange={setExportDateKpi} min={daysAgo(6)} max={todayStr()} accent="orange" />
                <span style={{ fontSize: 12, fontWeight: 500, color: P.gray500 }}>{fmtDate(exportDateKpi)}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: P.gray300 }}>FILE</div>
                <div style={{ fontSize: 10, color: P.orange700, background: P.orange50, border: `1px solid ${P.orange100}`, borderRadius: 8, padding: "7px 11px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>kpi_barangay_heat_risk_{exportDateKpi}.csv</div>
              </div>
              <button type="button" onClick={() => handleExportCsv("city", exportDateKpi, `kpi_barangay_heat_risk_${exportDateKpi}.csv`, null, { barangayId: activeZone?.barangayId ?? activeZone?.id ?? "", selectedZoneName: activeZone?.name ?? "", avgCityTemp, riskCounts })} disabled={!!exportLoading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12, fontWeight: 700, color: P.white, background: P.orange700, border: "none", borderRadius: 11, padding: 11, cursor: exportLoading ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(255,107,26,0.35)" }}>
                {exportLoading ? <><ExportSpinner color={P.white} /> Exporting…</> : <>↓ Download CSV</>}
              </button>
            </div>
          </div>

          {/* Historical Trends card */}
          <div style={{ borderRadius: 20, boxShadow: "0 8px 36px rgba(0,0,0,0.12)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ background: `linear-gradient(135deg, ${P.green500} 0%, ${P.green700} 100%)`, padding: "20px 18px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 8, fontWeight: 500, letterSpacing: "0.14em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Daily Export</div>
              <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2, color: P.white }}>Historical Trends</div>
              <div style={{ display: "inline-flex", alignSelf: "flex-start", marginTop: 7, borderRadius: 20, padding: "3px 11px", fontSize: 9, fontWeight: 500, background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.92)" }}>{trendDays}-Day Window</div>
            </div>
            <div style={{ background: P.white, padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 13, flex: 1 }}>
              <div style={{ display: "flex", gap: 2, background: "rgba(0,0,0,0.05)", borderRadius: 8, padding: 3 }}>
                {[7, 14].map(d => (
                  <button key={d} type="button" onClick={() => setTrendDays(d)} style={{ flex: 1, fontSize: 11, fontWeight: 600, border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer", background: trendDays === d ? P.white : "transparent", color: trendDays === d ? P.yellow500 : P.gray500, boxShadow: trendDays === d ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>{d}-Day</button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                <StyledCalendar value={exportDateTrends} onChange={setExportDateTrends} min={daysAgo(29)} max={todayStr()} accent="green" />
                <span style={{ fontSize: 12, fontWeight: 500, color: P.gray500 }}>{fmtDate(exportDateTrends)}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: P.gray300 }}>FILE</div>
                <div style={{ fontSize: 10, color: "#92400E", background: P.yellow50, border: `1px solid ${P.yellow100}`, borderRadius: 8, padding: "7px 11px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>historical_trends_{exportDateTrends}.csv</div>
              </div>
              <button type="button" onClick={() => handleExportCsv("trends", trendDays, `historical_trends_${exportDateTrends}.csv`, exportDateTrends)} disabled={!!exportLoading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12, fontWeight: 700, color: P.white, background: P.gray900, border: "none", borderRadius: 11, padding: 11, cursor: exportLoading ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.22)" }}>
                {exportLoading ? <><ExportSpinner color={P.white} /> Exporting…</> : <>↓ Download CSV</>}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

    {allBarangaysPanelOpen && (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="All barangays"
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}
        onClick={(e) => e.target === e.currentTarget && setAllBarangaysPanelOpen(false)}
      >
        <div
          style={{
            background: P.white, borderRadius: 16, border: `1px solid ${P.gray100}`,
            boxShadow: "0 12px 48px rgba(0,0,0,0.2)", maxWidth: "min(920px, 94vw)", width: "100%",
            maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: "14px 20px", background: "#FF6B1A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", color: P.white }}>ALL BARANGAYS</span>
            <button
              type="button"
              onClick={() => setAllBarangaysPanelOpen(false)}
              aria-label="Close"
              style={{ border: "none", background: "rgba(255,255,255,0.2)", color: P.white, width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 18, lineHeight: 1 }}
            >×</button>
          </div>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${P.gray100}`, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <input
              value={barangayQuery}
              onChange={(e) => setBarangayQuery(e.target.value)}
              placeholder="Search barangay"
              style={{ flex: 1, minWidth: 0, border: `1px solid ${P.gray300}`, borderRadius: 10, padding: "12px 15px", fontSize: 15, color: P.gray900 }}
            />
            {hasActiveFilters && (
              <button
                type="button"
                className="dashboard-clear-filters-mobile"
                onClick={clearBarangayFilters}
                style={{
                  padding: "10px 14px", minHeight: 44, borderRadius: 10, border: "none", background: "none",
                  color: P.orange500, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
          <div className="all-barangays-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 16px 16px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
              <thead style={{ position: "sticky", top: 0, background: "#f2f2f2", zIndex: 2 }}>
                <tr>
                  {["Barangay", "Temperature", "Risk Level", "Nearby Facilities", ""].map(h => (
                    <th key={h} style={{ padding: "14px 12px", textAlign: "left", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", color: P.gray700, borderBottom: `1px solid ${P.gray100}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBarangays.map((b, i) => {
                  const riskKey = riskLabelToKey(b.riskLevel?.label) ?? "EXTREME CAUTION";
                  return (
                    <tr key={b.id} style={{ background: i % 2 === 0 ? P.white : "#f7f7f7" }}>
                      <td style={{ padding: "13px 12px", fontSize: 15, fontWeight: 700, color: P.gray900, lineHeight: 1.5 }}>{b.name}</td>
                      <td style={{ padding: "13px 12px", minWidth: 102, lineHeight: 1.5 }}><TempWithRiskColor temp={b.temperature} riskKey={riskKey} fontSize={15} minWidth={62} /></td>
                      <td style={{ padding: "13px 12px", lineHeight: 1.5 }}><RiskPill risk={riskKey} fontSize={12.5} padding="6px 13px" /></td>
                      <td style={{ padding: "13px 12px", fontSize: 14, color: P.gray700, lineHeight: 1.5 }}>{facilityCountLabel(getDisplayFacilityCount(b, facilitiesPanel, facilityCountCache))}</td>
                      <td style={{ padding: "12px 12px" }}>
                        <button
                          onClick={() => setFacilitiesPanel((prev) => (prev && prev.barangayId === b.id ? null : { barangay: b.name, barangayId: b.id, list: null }))}
                          style={{ border: `1px solid ${P.orange100}`, background: "#fff1e8", color: P.orange700, fontWeight: 700, fontSize: 13, padding: "7px 14px", borderRadius: 7, cursor: "pointer" }}
                        >View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}

    {/* View Facilities modal (Data Sources–style) */}
    {facilitiesPanel && (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Facilities in barangay"
        style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}
        onClick={(e) => e.target === e.currentTarget && setFacilitiesPanel(null)}
      >
        <div
          className="dashboard-facilities-modal-panel"
          style={{
            background: "#ffffff", borderRadius: 22, padding: 0,
            boxShadow: "0 24px 60px rgba(24,24,24,0.18)", border: "1px solid rgba(253,111,0,0.2)",
            maxWidth: "min(480px, 94vw)", width: "100%", maxHeight: "80vh",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px",
            background: "linear-gradient(180deg, #fff1e6 0%, #ffffff 100%)",
            borderBottom: "1px solid rgba(253,111,0,0.15)",
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }} aria-hidden />
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }} aria-hidden />
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }} aria-hidden />
            </div>
            <button
              type="button"
              onClick={() => setFacilitiesPanel(null)}
              aria-label="Close"
              style={{
                width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(253,111,0,0.25)",
                background: "#fff6ef", color: "#b35000", fontSize: 18, lineHeight: 1,
                display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}
            >×</button>
          </div>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(253,111,0,0.2)", fontWeight: 700, fontSize: 14, color: P.gray900 }}>
            Facilities in {facilitiesPanel.barangay}{facilitiesPanel.totalLabel ? ` (${facilitiesPanel.totalLabel})` : ""}
          </div>
          <div className="dashboard-match-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 16, background: "#fff6ef" }}>
            {facilitiesPanel.list == null ? (
              <p style={{ margin: 0, fontSize: 12, color: P.gray500 }}>Loading…</p>
            ) : facilitiesPanel.list.length === 0 ? (
              <p style={{ margin: 0, fontSize: 12, color: P.gray500 }}>No facilities.</p>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {facilitiesPanel.list.map((f) => {
                  const key = normalizeFacilityTypeKey(f.facility_type);
                  const fm = facilityMeta[key] || facilityMeta.healthctr;
                  const distLabel = f.distance ?? (f.distance_km != null ? `${Number(f.distance_km).toFixed(1)} km` : "—");
                  return (
                    <div key={f.id} style={{ background: P.white, border: `1px solid ${P.gray100}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: fm.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <img src={fm.icon} alt="" style={{ width: key === "hospital" ? 18 : 22, height: key === "hospital" ? 18 : 22 }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: P.gray900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                        <TypeChip type={f.facility_type} />
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: P.orange500, flexShrink: 0 }}>{distLabel}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    {exportToast && <ExportToast msg={exportToast} onClose={() => setExportToast(null)} />}
    </div>
  );
}
