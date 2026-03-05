import { useState, useEffect, useRef } from "react";
import "../styles/StyledCalendar.css";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseDate(s) {
  if (!s) return new Date();
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function toISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function firstDay(y, m) {
  return new Date(y, m, 1).getDay();
}

function isSameDay(d1, d2) {
  return d1 && d2 && d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}
function isInRange(dateStr, minStr, maxStr) {
  if (!dateStr) return false;
  const d = parseDate(dateStr).getTime();
  const min = minStr ? parseDate(minStr).getTime() : -Infinity;
  const max = maxStr ? parseDate(maxStr).getTime() : Infinity;
  return d >= min && d <= max;
}

function Chevron({ direction = "left", color = "#fff" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      {direction === "left" ? (
        <path d="M9 11L5 7l4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M5 3l4 4-4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function CalendarIcon({ color = "#999" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1" y="2.5" width="12" height="10.5" rx="2.5" stroke={color} strokeWidth="1.4" />
      <line x1="1" y1="6" x2="13" y2="6" stroke={color} strokeWidth="1.4" />
      <line x1="4.5" y1="1" x2="4.5" y2="4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="9.5" y1="1" x2="9.5" y2="4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function StyledCalendar({
  value,
  onChange,
  min,
  max,
  accent = "orange",
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const portalRef = useRef(null);

  const sel = parseDate(value);
  const today = new Date();
  const [view, setView] = useState({ y: sel.getFullYear(), m: sel.getMonth() });

  useEffect(() => {
    if (value) {
      const p = parseDate(value);
      setView({ y: p.getFullYear(), m: p.getMonth() });
    }
  }, [value]);

  function openCalendar() {
    setOpen(true);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        portalRef.current && !portalRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const prev = () => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }));
  const next = () => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }));

  function pick(day, isCurrentMonth) {
    if (!isCurrentMonth) return;
    const dateStr = toISO(new Date(view.y, view.m, day));
    if (!isInRange(dateStr, min, max)) return;
    onChange(dateStr);
    setOpen(false);
  }

  function goToday() {
    const t = new Date();
    const dateStr = toISO(t);
    if (isInRange(dateStr, min, max)) {
      onChange(dateStr);
      setView({ y: t.getFullYear(), m: t.getMonth() });
    }
    setOpen(false);
  }

  function clear() {
    const t = new Date();
    const dateStr = toISO(t);
    if (isInRange(dateStr, min, max)) onChange(dateStr);
    setOpen(false);
  }

  const fd = firstDay(view.y, view.m);
  const dim = daysInMonth(view.y, view.m);
  const prevDim = daysInMonth(view.y, view.m === 0 ? 11 : view.m - 1);
  const cells = [];
  for (let i = 0; i < fd; i++) cells.push({ day: prevDim - fd + 1 + i, currentMonth: false });
  for (let i = 1; i <= dim; i++) cells.push({ day: i, currentMonth: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - fd - dim + 1, currentMonth: false });

  const isSelected = (day, currentMonth) =>
    currentMonth && isSameDay(sel, new Date(view.y, view.m, day));
  const isToday = (day, currentMonth) =>
    currentMonth && isSameDay(today, new Date(view.y, view.m, day));
  const isDisabled = (day, currentMonth) => {
    if (!currentMonth) return true;
    const dateStr = toISO(new Date(view.y, view.m, day));
    return !isInRange(dateStr, min, max);
  };

  const accentClass = accent === "green" ? "styled-cal-accent-green" : "styled-cal-accent-orange";

  return (
    <div className={`styled-calendar styled-calendar-inline ${accentClass}`}>
      <button
        ref={triggerRef}
        type="button"
        className={`styled-cal-trigger ${open ? "styled-cal-trigger-open" : ""}`}
        onClick={() => (open ? setOpen(false) : openCalendar())}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Choose date"
      >
        <span className="styled-cal-trigger-icon" aria-hidden>
          <CalendarIcon color={open ? "var(--cal-accent)" : "#999"} />
        </span>
        <span>{value || "—"}</span>
      </button>

      {open && (
        <div
          ref={portalRef}
          className="styled-cal-portal"
          role="dialog"
          aria-modal="true"
          aria-label="Calendar"
        >
          <div className="styled-cal-header">
            <button type="button" className="styled-cal-nav" onClick={prev} aria-label="Previous month">
              <Chevron direction="left" color="#fff" />
            </button>
            <div className="styled-cal-month-year">
              {MONTHS[view.m]} {view.y}
            </div>
            <button type="button" className="styled-cal-nav" onClick={next} aria-label="Next month">
              <Chevron direction="right" color="#fff" />
            </button>
          </div>

          <div className="styled-cal-weekdays">
            {WEEKDAYS.map((d) => (
              <div key={d} className="styled-cal-weekday">{d}</div>
            ))}
          </div>

          <div className="styled-cal-grid">
            {cells.map((c, i) => {
              const selected = isSelected(c.day, c.currentMonth);
              const isTodayCell = isToday(c.day, c.currentMonth);
              const disabled = isDisabled(c.day, c.currentMonth);
              return (
                <button
                  key={i}
                  type="button"
                  className={[
                    "styled-cal-day",
                    !c.currentMonth && "styled-cal-day-other",
                    selected && "styled-cal-day-selected",
                    isTodayCell && !selected && "styled-cal-day-today",
                    disabled && "styled-cal-day-disabled",
                  ].filter(Boolean).join(" ")}
                  onClick={() => pick(c.day, c.currentMonth)}
                  disabled={disabled}
                >
                  {c.day}
                </button>
              );
            })}
          </div>

          <div className="styled-cal-footer">
            <button type="button" className="styled-cal-clear" onClick={clear}>
              Clear
            </button>
            <button type="button" className="styled-cal-today-btn" onClick={goToday}>
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
