/**
 * Shared location-permission screens: the "Allow location" explainer, the waiting state,
 * the denied/unavailable help with a manual barangay picker, and the page shell around them.
 * Used by the SMS landing page (/alert) and the location gate in front of the map (/home).
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getBarangayId, getBarangayName } from '../../utils/heatMap.js';
import '../../styles/AlertPage.css';

export function PinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function BarangayPicker({ features, onPick }) {
  const options = useMemo(
    () =>
      [...(features ?? [])]
        .map((f) => ({ id: String(getBarangayId(f)), name: getBarangayName(f), feature: f }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [features]
  );
  if (!options.length) return null;
  return (
    <label className="alert-picker">
      <span className="alert-picker-label">Or choose your barangay</span>
      <select
        defaultValue=""
        onChange={(e) => {
          const opt = options.find((o) => o.id === e.target.value);
          if (opt) onPick(opt.feature);
        }}
      >
        <option value="" disabled>Select barangay…</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
    </label>
  );
}

export function PermissionPrompt({ onAllow, onSkip }) {
  return (
    <section className="alert-card alert-intro">
      <div className="alert-icon-badge"><PinIcon width={30} height={30} /></div>
      <h1 className="alert-title">Check the heat where you are</h1>
      <p className="alert-lead">
        Allow BanasUno to use your location so we can show your barangay&apos;s heat level,
        the nearest clinics and how to reach them, and what to do to stay safe.
      </p>
      <button type="button" className="alert-btn alert-btn-primary" onClick={onAllow}>
        <PinIcon width={18} height={18} /> Allow location
      </button>
      <p className="alert-fineprint">
        Your browser will ask for permission next. Your location stays on this device and is
        only used while this page is open.
      </p>
      {onSkip && (
        <button type="button" className="alert-btn alert-btn-link" onClick={onSkip}>Not now</button>
      )}
    </section>
  );
}

export function Requesting({ onSkip }) {
  return (
    <section className="alert-card alert-center" aria-live="polite">
      <div className="alert-pulse" aria-hidden><PinIcon width={28} height={28} /></div>
      <h1 className="alert-title">Finding your location…</h1>
      <p className="alert-lead">If your browser asks, tap <strong>Allow</strong>.</p>
      {onSkip && (
        <button type="button" className="alert-btn alert-btn-link" onClick={onSkip}>Skip and open the map</button>
      )}
    </section>
  );
}

export function LocationProblem({ status, errorMessage, onRetry, features, onPick, onSkip }) {
  const denied = status === 'denied';
  return (
    <section className="alert-card" aria-live="polite">
      <div className="alert-icon-badge alert-icon-badge-warn"><PinIcon width={28} height={28} /></div>
      <h1 className="alert-title">
        {denied ? 'Location is turned off for this site' : 'We couldn’t get your location'}
      </h1>
      {errorMessage && <p className="alert-lead">{errorMessage}</p>}
      {denied && (
        <ol className="alert-steps">
          <li>Tap the lock or <strong>ⓘ</strong> icon beside the web address.</li>
          <li>Set <strong>Location</strong> to <strong>Allow</strong>.</li>
          <li>Come back here and tap <strong>Try again</strong>.</li>
        </ol>
      )}
      {status !== 'unsupported' && (
        <button type="button" className="alert-btn alert-btn-primary" onClick={onRetry}>Try again</button>
      )}
      <BarangayPicker features={features} onPick={onPick} />
      {onSkip && (
        <button type="button" className="alert-btn alert-btn-link" onClick={onSkip}>Continue without location</button>
      )}
    </section>
  );
}

/** Full-page, mobile-first frame (brand header + optional footer link) around the screens above. */
export function LocationShell({ children, footer }) {
  return (
    <main className="alert-page">
      <header className="alert-header">
        <Link to="/" className="alert-brand" aria-label="BanasUno home">
          <img src="/BanasUno Colored.svg" alt="" width="28" height="28" />
          <span>BANASUNO</span>
        </Link>
        <span className="alert-badge">Heat alert</span>
      </header>
      <div className="alert-body">{children}</div>
      {footer && <footer className="alert-foot">{footer}</footer>}
    </main>
  );
}
