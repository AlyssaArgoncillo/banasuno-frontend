import { useState, useEffect, useRef } from "react";
import { fetchHeatAdvisory } from "../../services/heatAdvisoryService.js";
import { getFallbackAdvisoryForFrontend } from "../../utils/heatAdvisoryFallback.js";
import {
  SmileIcon,
  WarningIcon,
  FireIcon,
  SirenIcon,
  SkullIcon,
  DropletIcon,
  TreeIcon,
  StethoscopeIcon,
  HouseIcon,
  FanIcon,
  IceIcon,
  NoEntryIcon,
  EyeIcon,
  HospitalBuildingIcon,
  NoPhoneIcon,
  SosIcon,
  SyringeIcon,
  MegaphoneIcon,
  CheckIcon,
} from "../icons";

// ─── PALETTE ─────────────────────────────────────────
const P = {
  orange500: "#FF6B1A", orange700: "#C44F00",
  orange100: "#FFD4B8", orange50:  "#FFF4ED",
  yellow500: "#FFB800", yellow100: "#FFEAB3", yellow50: "#FFF9E6",
  blue700:   "#1565C0", blue100:   "#BBDEFB",
  red700:    "#C62828", red500:    "#F44336", red100:   "#FFCDD2",
  green700:  "#2D5F2E", green500:  "#4A9C4D",
  green300:  "#7BC67E", green100:  "#C8E6C9",
  gray900: "#212121", gray700: "#424242",
  gray500: "#757575", gray100: "#EEEEEE", gray50: "#FAFAFA",
  white: "#FFFFFF",
};

// ─── LEVEL ICONS (hero) ───────────────────────────────
const LEVEL_ICONS = { smile: SmileIcon, warning: WarningIcon, fire: FireIcon, siren: SirenIcon, skull: SkullIcon };

// ─── RISK DATA ────────────────────────────────────────
const riskLevels = [
  {
    key: "not_hazardous",
    label: "Not Hazardous",
    level: 1,
    color: P.green500,
    dark:  P.green700,
    light: P.green100,
    bg:    "#F0FAF0",
    iconKey: "smile",
    temp:  "< 27°C",
    tagline: "You're in the clear — but staying cool is always smart.",
    advices: [
      { iconKey: "droplet", title: "Stay Hydrated", body: "Drink at least 8 glasses of water today even if you don't feel thirsty. Mild heat still causes gradual dehydration throughout the day." },
      { iconKey: "tree", title: "Enjoy Outdoor Time Wisely", body: "Morning walks and evening activities are ideal. Avoid peak sun between 10AM–2PM even on low-risk days to prevent skin damage." },
      { iconKey: "stethoscope", title: "Check on Vulnerable Neighbors", body: "Elderly residents and young children are more sensitive to heat. A friendly check-in can prevent heat-related incidents in your community." },
    ],
  },
  {
    key: "caution",
    label: "Caution",
    level: 2,
    color: P.yellow500,
    dark:  "#8B6914",
    light: P.yellow100,
    bg:    P.yellow50,
    iconKey: "warning",
    temp:  "27–32°C",
    tagline: "Heat is noticeable. Make smart choices throughout the day.",
    advices: [
      { iconKey: "droplet", title: "Hydrate Every Hour", body: "At this level, your body loses water faster. Set hourly reminders and carry a water bottle with you at all times — don't wait until you're thirsty." },
      { iconKey: "house", title: "Limit Outdoor Exposure", body: "Keep outdoor activities under 30 minutes during daytime. Seek shade, wear a wide-brimmed hat, and apply SPF 30+ sunscreen before going out." },
      { iconKey: "fan", title: "Keep Your Space Cool", body: "Use electric fans, open windows at night for cross-ventilation, and hang damp cloths near fans to cool down indoor spaces effectively." },
    ],
  },
  {
    key: "extreme_caution",
    label: "Extreme Caution",
    level: 3,
    color: P.orange500,
    dark:  P.orange700,
    light: P.orange100,
    bg:    P.orange50,
    iconKey: "fire",
    temp:  "33–41°C",
    tagline: "Significant heat stress risk. Modify your activities now.",
    advices: [
      { iconKey: "ice", title: "Cool Down Immediately", body: "Apply cool, damp cloths to your neck, wrists, and forehead. Take cool showers if possible — avoid ice-cold water which can cause circulatory shock." },
      { iconKey: "noEntry", title: "Postpone Strenuous Activity", body: "Heavy exercise and manual labor outdoors should be rescheduled to before 7AM or after 6PM. Heat exhaustion can set in within minutes of exertion." },
      { iconKey: "eye", title: "Watch for Heat Illness Signs", body: "Dizziness, nausea, rapid heartbeat, or confusion are red flags. Move to a cool area immediately and call your nearest Barangay Health Center." },
    ],
  },
  {
    key: "danger",
    label: "Danger",
    level: 4,
    color: P.red500,
    dark:  P.red700,
    light: P.red100,
    bg:    "#FFF5F5",
    iconKey: "siren",
    temp:  "42–51°C",
    tagline: "Heat stroke risk is high. Stay indoors and act now.",
    advices: [
      { iconKey: "hospitalBuilding", title: "Locate Nearest Cool Facility", body: "Find the nearest air-conditioned public space — a barangay hall, mall, or health center. Do not remain in unventilated spaces without active cooling." },
      { iconKey: "noPhone", title: "No Outdoor Activity", body: "All non-essential outdoor exposure should stop immediately. Even short walks at this level can trigger heat stroke in otherwise healthy individuals." },
      { iconKey: "sos", title: "Emergency Protocol Ready", body: "Save emergency numbers now: SPMC (082) 227-2731 and your Barangay Emergency line. Heat stroke is a life-threatening medical emergency." },
    ],
  },
  {
    key: "extreme_danger",
    label: "Extreme Danger",
    level: 5,
    color: P.red700,
    dark:  "#7B0000",
    light: P.red100,
    bg:    "#FFF0F0",
    iconKey: "skull",
    temp:  "≥ 52°C",
    tagline: "Life-threatening. Immediate protective action required.",
    advices: [
      { iconKey: "sos", title: "Seek Emergency Shelter Now", body: "Move to a climate-controlled facility immediately. Contact barangay emergency services if transportation is unavailable — this is a declared crisis situation." },
      { iconKey: "syringe", title: "Monitor for Heatstroke Symptoms", body: "Body temperature above 39°C, absent sweating, confusion, or unconsciousness requires immediate emergency medical care. Call 911 without delay." },
      { iconKey: "megaphone", title: "Alert Your Community", body: "Notify your Barangay Captain and neighbors immediately. Communities must activate cooling centers and conduct a door-to-door check on every household." },
    ],
  },
];

const ADVICE_ICONS = {
  droplet: DropletIcon,
  tree: TreeIcon,
  stethoscope: StethoscopeIcon,
  house: HouseIcon,
  fan: FanIcon,
  ice: IceIcon,
  noEntry: NoEntryIcon,
  eye: EyeIcon,
  hospitalBuilding: HospitalBuildingIcon,
  noPhone: NoPhoneIcon,
  sos: SosIcon,
  syringe: SyringeIcon,
  megaphone: MegaphoneIcon,
};

// ─── AI SPINNER ───────────────────────────────────────
function AISpinner({ color }) {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 7, height: 7, borderRadius: "50%",
            background: color || P.orange500,
            animation: `urgency-bounce 1.2s ${i * 0.2}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── URGENCY TICKER ───────────────────────────────────
const RISK_KEYS = ["not_hazardous", "caution", "extreme_caution", "danger", "extreme_danger"];

/** Build cache key for advisory: same (barangay_id, risk_level) reuses cached response (backend also caches ~10 min). */
function advisoryCacheKey(barangayId, riskLevel) {
  return `${barangayId ?? ''}|${riskLevel ?? ''}`;
}

/** Normalize risk_label for comparison (trim, lowercase) so "Extreme Caution" matches "extreme caution". */
function normalizeLabel(label) {
  return (label == null || typeof label !== 'string') ? '' : String(label).trim().toLowerCase();
}

/** Not Hazardous tagline (fallback) – if API returns this for a level >= 2 request, reject and use our fallback. */
const NOT_HAZARDOUS_TAGLINE = "Conditions are comfortable. Stay hydrated and dress for the weather.";
function looksLikeNotHazardousContent(tagline) {
  if (!tagline || typeof tagline !== 'string') return false;
  const t = tagline.trim().toLowerCase();
  return t === NOT_HAZARDOUS_TAGLINE.toLowerCase() || t.startsWith('conditions are comfortable');
}

export function UrgencyTicker({ barangay, riskKey, selectedZone }) {
  const initialKey = riskKey && RISK_KEYS.includes(riskKey) ? riskKey : "extreme_caution";
  const [selected, setSelected] = useState(initialKey);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [apiAdvisory, setApiAdvisory] = useState(null);
  const requestIdRef = useRef(0);
  /** Params we sent for the in-flight request; used to ignore responses that don't match (e.g. late default). */
  const requestedParamsRef = useRef(null);
  /** Cache by (barangay_id, risk_level) to avoid calling API again for the same selection; reuse last response when possible. */
  const advisoryCacheRef = useRef(Object.create(null));
  /** Last selection key we ran the effect for; avoids duplicate work when deps are stable. */
  const lastSelectionKeyRef = useRef('');

  const prevRiskKeyRef = useRef(riskKey);
  useEffect(() => {
    const next = riskKey && RISK_KEYS.includes(riskKey) ? riskKey : "extreme_caution";
    if (prevRiskKeyRef.current === riskKey) return;
    prevRiskKeyRef.current = riskKey;
    setLoading(true);
    setVisible(false);
    setSelected(next);
    setApiAdvisory(null);
    const t = setTimeout(() => {
      setLoading(false);
      setVisible(true);
    }, 700);
    return () => clearTimeout(t);
  }, [riskKey]);

  // Call API only once per user action (barangay or level change). Reuse cached advisory for same (barangay_id, risk_level).
  // Only call when user has chosen a barangay; do not call on every render, gauge hover, or for every gauge level on page load.
  const zoneBarangayId = selectedZone?.barangayId ?? '';
  const zoneRiskLevel = selectedZone?.riskLevel?.level;
  const selectedZoneRef = useRef(selectedZone);
  selectedZoneRef.current = selectedZone;
  useEffect(() => {
    const selectedZone = selectedZoneRef.current;
    if (!selectedZone) {
      requestedParamsRef.current = null;
      setApiAdvisory(null);
      lastSelectionKeyRef.current = '';
      return;
    }
    const level = riskLevels.find(l => l.key === selected);
    const requestedRiskLevel = level?.level ?? zoneRiskLevel;
    const requestedRiskLabel = level?.label ?? selectedZone?.riskLevel?.label ?? null;
    const requestedBarangayId = selectedZone?.barangayId ?? null;
    const requestedBarangayName = selectedZone?.name ?? barangay ?? undefined;
    const key = advisoryCacheKey(requestedBarangayId, requestedRiskLevel);
    if (lastSelectionKeyRef.current === key) return;
    lastSelectionKeyRef.current = key;

    const cached = advisoryCacheRef.current[key];
    if (cached && cached.tagline && Array.isArray(cached.advices) && cached.advices.length > 0) {
      const cacheLevelOk = cached.risk_level == null || cached.risk_level === requestedRiskLevel;
      const cacheLabelOk = requestedRiskLabel == null || cached.risk_label == null || normalizeLabel(cached.risk_label) === normalizeLabel(requestedRiskLabel);
      const cacheNotWrongContent = requestedRiskLevel < 2 || !looksLikeNotHazardousContent(cached.tagline);
      if (cacheLevelOk && cacheLabelOk && cacheNotWrongContent) {
        setApiAdvisory(cached);
        requestedParamsRef.current = { risk_level: requestedRiskLevel, risk_label: requestedRiskLabel, barangay_id: requestedBarangayId, barangay_name: requestedBarangayName };
        return;
      }
      if (process.env.NODE_ENV === 'development' && (!cacheLevelOk || !cacheLabelOk || !cacheNotWrongContent)) {
        console.warn('[UrgencyTicker] Cached advisory does not match selection or has wrong content - refetching');
      }
    }

    const id = ++requestIdRef.current;
    requestedParamsRef.current = { risk_level: requestedRiskLevel, risk_label: requestedRiskLabel, barangay_id: requestedBarangayId, barangay_name: requestedBarangayName };
    setApiAdvisory(null);
    const minDelay = new Promise(r => setTimeout(r, 400));
    const req = fetchHeatAdvisory({
      barangay_id: requestedBarangayId ?? undefined,
      barangay_name: requestedBarangayName,
      risk_level: requestedRiskLevel,
      risk_label: requestedRiskLabel ?? undefined,
      temperature_c: selectedZone?.temperature,
    });
    Promise.all([req, minDelay]).then(([data]) => {
      if (requestIdRef.current !== id) return;
      const requested = requestedParamsRef.current;
      if (!requested) return;
      if (!data) return;
      if (requested.risk_level != null && (data.risk_level == null || data.risk_level !== requested.risk_level)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[UrgencyTicker] Response risk_level missing or mismatch: got', data.risk_level, 'expected', requested.risk_level, '- not showing (avoids Not Hazardous for higher-risk selection)');
        }
        return;
      }
      if (requested.risk_label != null && data.risk_label != null && normalizeLabel(data.risk_label) !== normalizeLabel(requested.risk_label)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[UrgencyTicker] Response risk_label mismatch: got', data.risk_label, 'expected', requested.risk_label, '- not showing');
        }
        return;
      }
      if (requested.barangay_id != null && requested.barangay_name != null && data.barangay_name != null) {
        if (String(data.barangay_name).trim().toLowerCase() !== String(requested.barangay_name).trim().toLowerCase()) return;
      }
      if (requested.risk_level >= 2 && looksLikeNotHazardousContent(data.tagline)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[UrgencyTicker] Response tagline is Not Hazardous but requested level was', requested.risk_level, '- using frontend fallback instead');
        }
        return;
      }
      advisoryCacheRef.current[advisoryCacheKey(requested.barangay_id, requested.risk_level)] = data;
      setApiAdvisory(data);
    });
  }, [zoneBarangayId, zoneRiskLevel, selected, barangay]);

  const r = riskLevels.find(l => l.key === selected) || riskLevels[2];
  const displayLevel = r.level;
  const displayLabel = r.label;
  const fallbackForLevel = getFallbackAdvisoryForFrontend(displayLabel, displayLevel);
  const apiMatchesSelection = apiAdvisory && (apiAdvisory.risk_level == null || apiAdvisory.risk_level === displayLevel);
  const hasApiContent = apiMatchesSelection && typeof apiAdvisory.tagline === "string" && Array.isArray(apiAdvisory.advices) && apiAdvisory.advices.length > 0;
  if (apiAdvisory && !apiMatchesSelection && process.env.NODE_ENV === 'development') {
    console.warn('[UrgencyTicker] Ignoring stale apiAdvisory (level', apiAdvisory.risk_level, ') – current selection is level', displayLevel, '; using fallback');
  }
  const effectiveTagline = hasApiContent ? apiAdvisory.tagline : fallbackForLevel.tagline;
  const effectiveAdvices = hasApiContent
    ? apiAdvisory.advices.map((a, i) => ({ ...a, iconKey: (r.advices[i]?.iconKey) ?? r.advices[0]?.iconKey ?? "droplet" }))
    : fallbackForLevel.advices.map((a, i) => ({ ...a, iconKey: (r.advices[i]?.iconKey) ?? r.advices[0]?.iconKey ?? "droplet" }));

  const handleSelect = (key) => {
    if (key === selected) return;
    setLoading(true);
    setVisible(false);
    setSelected(key);
    setTimeout(() => {
      setLoading(false);
      setVisible(true);
    }, 700);
  };

  const stepColors = [P.green500, P.yellow500, P.orange500, P.red500, P.red700];
  const stepLabels = ["Not\nHazardous", "Caution", "Extreme\nCaution", "Danger", "Extreme\nDanger"];

  return (
    <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 48px rgba(0,0,0,0.13)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes urgency-fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes urgency-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: .5; transform: scale(1.4); }
        }
        @keyframes urgency-bounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
      `}</style>

      {/* ── HERO BANNER ── */}
      <div style={{
        background: `linear-gradient(120deg, ${r.dark} 0%, ${r.color} 100%)`,
        padding: "28px 32px 0",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -70, top: -70, width: 260, height: 260, borderRadius: "50%", border: "44px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 30, top: -30, width: 110, height: 110, borderRadius: "50%", border: "22px solid rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: -40, bottom: -40, width: 160, height: 160, borderRadius: "50%", border: "30px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 52, lineHeight: 1, flexShrink: 0, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))", color: P.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {(() => { const LevelIcon = LEVEL_ICONS[r.iconKey]; return LevelIcon ? <LevelIcon width={40} height={40} /> : null; })()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 7, padding: "3px 11px" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700, color: P.white, letterSpacing: "0.12em" }}>LEVEL {r.level}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.13)", borderRadius: 7, padding: "3px 11px" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: P.green300, animation: "urgency-pulse 2s infinite" }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em" }}>AI ADVISORY</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 7, padding: "3px 11px" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.65)", letterSpacing: "0.08em" }}>{r.temp}</span>
              </div>
              {barangay && (
                <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 7, padding: "3px 11px" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.65)", letterSpacing: "0.06em" }}>📍 {barangay}</span>
                </div>
              )}
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 28, color: P.white, letterSpacing: "-0.025em", lineHeight: 1.1 }}>
              {r.label}{" "}<span style={{ opacity: 0.55, fontSize: 18, fontWeight: 600 }}>Advisory</span>
            </div>
          </div>
          <div style={{ flexShrink: 0, textAlign: "right", userSelect: "none" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 72, color: P.white, lineHeight: 1, opacity: 0.1, letterSpacing: "-0.05em" }}>{r.level}</div>
          </div>
        </div>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.72)", margin: "14px 0 20px", lineHeight: 1.6, position: "relative", zIndex: 1, maxWidth: 520 }}>
          {effectiveTagline}
        </p>

        {/* ── RISK LEVEL SELECTOR (step gauge) ── */}
        <div style={{ display: "flex", gap: 0, position: "relative", zIndex: 1, paddingBottom: 0 }}>
          {riskLevels.map((rl, i) => {
            const isActive = rl.key === selected;
            const isPast   = rl.level < r.level;
            return (
              <button
                key={rl.key}
                onClick={() => handleSelect(rl.key)}
                style={{
                  flex: 1, border: "none", background: "transparent",
                  cursor: "pointer", padding: 0, display: "flex",
                  flexDirection: "column", alignItems: "center", gap: 0,
                }}
              >
                <div style={{
                  width: "100%", height: 5,
                  background: isPast || isActive ? stepColors[i] : "rgba(255,255,255,0.18)",
                  borderRadius: i === 0 ? "3px 0 0 3px" : i === 4 ? "0 3px 3px 0" : 0,
                  transition: "background 0.3s",
                }} />
                <div style={{
                  width:  isActive ? 34 : 26,
                  height: isActive ? 34 : 26,
                  borderRadius: "50%",
                  background: isActive ? P.white : isPast ? stepColors[i] : "rgba(255,255,255,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 900,
                  fontSize: isActive ? 14 : 11,
                  color: isActive ? stepColors[i] : P.white,
                  marginTop: -4,
                  boxShadow: isActive ? `0 0 0 5px rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.22)` : "none",
                  transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                  flexShrink: 0,
                }}>
                  {rl.level}
                </div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 7, fontWeight: 700,
                  color: isActive ? P.white : "rgba(255,255,255,0.4)",
                  letterSpacing: "0.04em", textAlign: "center",
                  marginTop: 5, marginBottom: 14,
                  lineHeight: 1.4,
                  transition: "color 0.25s",
                }}>
                  {rl.label.split(" ").join("\n")}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAGLINE STRIP ── */}
      <div style={{
        background: r.light,
        padding: "10px 32px",
        borderBottom: `1px solid rgba(0,0,0,0.06)`,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: r.color, flexShrink: 0 }} />
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: r.dark, margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>"{effectiveTagline}"</p>
      </div>

      {/* ── ADVICE ROWS ── */}
      <div style={{ background: P.white }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0", gap: 12 }}>
            <AISpinner color={r.color} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: P.gray500, letterSpacing: "0.08em" }}>GENERATING ADVISORY...</span>
          </div>
        ) : (
          effectiveAdvices.map((a, i) => {
            const numBg = [r.color, r.dark, r.light][i];
            const numColor = i === 2 ? r.dark : P.white;
            return (
              <div
                key={`${selected}-${i}`}
                style={{
                  display: "flex",
                  borderBottom: i < effectiveAdvices.length - 1 ? `1px solid ${P.gray100}` : "none",
                  animation: visible ? `urgency-fadeUp 0.38s ${i * 0.11}s both` : "none",
                }}
              >
                <div style={{
                  width: 64,
                  background: numBg,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "22px 0",
                  flexShrink: 0,
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 22, color: numColor, position: "relative", zIndex: 1, opacity: i === 2 ? 0.65 : 1 }}>0{i + 1}</div>
                </div>
                <div style={{ flex: 1, padding: "22px 28px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 13,
                    background: r.bg, border: `1.5px solid ${r.light}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: r.color, flexShrink: 0, marginTop: 2,
                  }}>
                    {(() => { const AdviceIcon = ADVICE_ICONS[a.iconKey]; return AdviceIcon ? <AdviceIcon width={22} height={22} /> : null; })()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15, color: P.gray900, letterSpacing: "-0.01em" }}>{a.title}</div>
                      <div style={{ width: 28, height: 2, background: r.color, borderRadius: 1, opacity: 0.6 }} />
                    </div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: P.gray500, lineHeight: 1.75, margin: 0 }}>{a.body}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        background: P.gray50,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderTop: `1px solid ${P.gray100}`,
      }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: P.green500, color: P.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <CheckIcon width={10} height={10} strokeWidth={3} />
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: P.gray500, margin: 0, lineHeight: 1.55 }}>
          Advisory generated by BanasUno AI based on PAGASA heat index classification for <strong style={{ color: P.gray700 }}>{barangay || "the selected area"}</strong>.
          Always monitor official PAGASA channels for the most accurate and up-to-date local weather information.
        </p>
      </div>
    </div>
  );
}

export default UrgencyTicker;
