/**
 * Shared SVG icons. Use currentColor to inherit text/color from parent.
 * Usage: <IconName width={20} height={20} /> or <IconName style={{ color: 'red' }} />
 */

const svgProps = (w = 24, h = 24, props = {}) => ({
  width: w,
  height: h,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  ...props,
});

// ─── Sidebar / Nav ────────────────────────────────────
export function ChevronDownIcon({ width = 16, height = 16, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function MapIcon({ width = 20, height = 20, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function ChartIcon({ width = 20, height = 20, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M3 3v18h18" />
      <path d="M7 16v-5M11 16v-9M15 16v-3M19 16v-7" />
    </svg>
  );
}

export function AlertIcon({ width = 20, height = 20, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function InfoIcon({ width = 20, height = 20, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 7v1" />
      <circle cx="12" cy="5.5" r="1.5" />
    </svg>
  );
}

// ─── Dashboard facilities ─────────────────────────────
export function HospitalIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M3 21h18M3 9h18M9 21V9M15 21V9" />
      <path d="M12 3v6M10 6h4" />
    </svg>
  );
}

export function ClinicIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M12 2L4 7v3h16V7L12 2z" />
      <path d="M4 12h16v9H4z" />
      <path d="M12 12v9M9 16h6" />
      <path d="M12 8v2M11 9h2" />
    </svg>
  );
}

export function HealthCenterIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M12 2L2 8v12h8v-6h4v6h8V8L12 2z" />
      <path d="M12 10v4M10 12h4" />
    </svg>
  );
}

export function PharmacyIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M18 4L15 7v2h3v10H6V9h3V7L6 4h12z" />
      <path d="M12 9v6M9 12h6" />
    </svg>
  );
}

export function DoctorIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2" />
      <path d="M12 11v4M10 13h4" />
    </svg>
  );
}

export function PinIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// ─── UrgencyTicker risk level emojis → SVG ─────────────
export function SmileIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01M15 9h.01" />
    </svg>
  );
}

export function WarningIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function FireIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M12 22c4-2 6-5.5 6-9.5 0-2-.5-4-1.5-5.5.5 2 .5 4-1 6-2 1-3 2.5-3 5 0 3 2 5 4.5 4z" />
      <path d="M12 2c1 1.5 2 4 2 6a4 4 0 0 1-4 4 4 4 0 0 1-4-4c0-2 1-4 2-5.5 1 0 2 0 2.5.5.5-1.5 1-2.5 1.5-3z" />
    </svg>
  );
}

export function SirenIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <path d="M12 8a4 4 0 0 1 4 4v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a4 4 0 0 1 4-4z" />
    </svg>
  );
}

export function SkullIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M12 2c-4 0-7 3-7 7 0 2 1 4 2 5v7h10v-7c1-1 2-3 2-5 0-4-3-7-7-7z" />
      <circle cx="9" cy="9" r="1.5" />
      <circle cx="15" cy="9" r="1.5" />
      <path d="M9 13h6" />
    </svg>
  );
}

// ─── UrgencyTicker advice icons ────────────────────────
export function DropletIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

export function TreeIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M12 22V10" />
      <path d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <path d="M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M10 4h4" />
    </svg>
  );
}

export function StethoscopeIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M11 3h2a2 2 0 0 1 2 2v2" />
      <path d="M9 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2" />
      <path d="M12 17v2" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function HouseIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

export function FanIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2" />
      <path d="M7.05 7.05l1.4 1.4M15.55 15.55l1.4 1.4M7.05 16.95l1.4-1.4M15.55 8.45l1.4-1.4" />
    </svg>
  );
}

export function IceIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M12 2v6l4 4-4 4v6" />
      <path d="M12 22v-6l-4-4 4-4V2" />
      <path d="M2 12h6l4-4 4 4h6" />
      <path d="M22 12h-6l-4 4-4-4H2" />
    </svg>
  );
}

export function NoEntryIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M4.93 4.93l14.14 14.14" />
    </svg>
  );
}

export function EyeIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function HospitalBuildingIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M3 21h18M5 21V8l7-4 7 4v13" />
      <path d="M9 21v-5h6v5M9 13v3M15 13v3M12 8v3M10.5 9.5h3" />
    </svg>
  );
}

export function NoPhoneIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6.02-6.02A19.79 19.79 0 0 1 2.82 4.18 2 2 0 0 1 4.82 2h3a2 2 0 0 1 2 1.72" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

export function SosIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <path d="M12 8a4 4 0 0 1 4 4v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a4 4 0 0 1 4-4z" />
    </svg>
  );
}

export function SyringeIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M18 5h2v3h-2M18 8l3 3-9 9-3-3 9-9z" />
      <path d="M6 14l-3 3 2 2 3-3" />
      <path d="M15 9v9l-6 6" />
    </svg>
  );
}

export function MegaphoneIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M3 11l9-4v14l-9-4v-6z" />
      <path d="M12 7l6-2v10l-6-2" />
      <path d="M12 11v6" />
    </svg>
  );
}

export function CheckIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// ─── Landing: HealthRisksSection ───────────────────────
export function ThermometerIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  );
}

export function HeartIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// ─── About: HeatSafety ────────────────────────────────
export function HydrateIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      <path d="M12 6v4l2 2" />
    </svg>
  );
}

export function ShadeIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v2M12 21v2M3 12h2M19 12h2M5.64 5.64l1.4 1.4M16.94 16.94l1.4 1.4M5.64 18.36l1.4-1.4M16.94 7.06l1.4-1.4" />
      <path d="M8 17l-2 4h12l-2-4a4 4 0 1 0-8 0z" />
      <path d="M12 14v4" />
    </svg>
  );
}

export function DressLightIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M6 2h12l1 2v2H5V4l1-2z" />
      <path d="M5 8h14v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8z" />
      <path d="M12 11v6M9 14h6" />
    </svg>
  );
}

export function DizzyIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 15h8M9 9l-2 2 2 2M15 9l2 2-2 2" />
    </svg>
  );
}

// ─── Footer ───────────────────────────────────────────
export function GitHubIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function EmailIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

// ─── BuiltForSection "need" ───────────────────────────
export function HandHelpIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M12 12v-2a2 2 0 0 1 2-2 2 2 0 0 1 2 2v2" />
      <path d="M12 12V8a2 2 0 0 1 2-2 2 2 0 0 1 2 2v6" />
      <path d="M12 12V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" />
      <path d="M12 12v10M8 18l-3 3M16 18l3 3" />
    </svg>
  );
}

// ─── DataSourcesSection folder ────────────────────────
export function FolderIcon({ width = 24, height = 24, ...rest }) {
  return (
    <svg {...svgProps(width, height, rest)} aria-hidden>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}
