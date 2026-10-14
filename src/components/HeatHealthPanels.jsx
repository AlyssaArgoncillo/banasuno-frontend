/**
 * Risks and Remedies tab panels for ZoneInfoCard, driven by the zone's PAGASA heat level.
 */

import {
  HEAT_FIRST_AID,
  REMEDY_DISCLAIMER,
  getHeatRemedies,
  getHeatRisks,
} from '../utils/heatHealthGuidance.js';

export function HeatRisksPanel({ riskLevel }) {
  const risks = getHeatRisks(riskLevel?.level);
  const accent = riskLevel?.color;
  return (
    <div className="zone-info-card-health">
      <div className="zone-info-card-health-summary" style={accent ? { borderLeftColor: accent } : undefined}>
        <strong>{risks.summary}</strong>
        <span>{risks.detail}</span>
      </div>

      <div className="zone-info-card-section-title zone-info-card-health-subtitle">Watch for</div>
      <ul className="zone-info-card-health-list">
        {risks.conditions.map((c) => (
          <li
            key={c.key}
            className={`zone-info-card-health-item${c.emergency ? ' zone-info-card-health-item--emergency' : ''}`}
          >
            <div className="zone-info-card-health-item-name">
              {c.name}
              {c.emergency && <span className="zone-info-card-health-tag">Emergency · call 911</span>}
            </div>
            <div className="zone-info-card-health-item-body">{c.signs}</div>
          </li>
        ))}
      </ul>

      {risks.atRiskGroups && (
        <div className="zone-info-card-notice">
          <strong>More at risk:</strong> {risks.atRiskGroups}
        </div>
      )}
    </div>
  );
}

export function HeatRemediesPanel({ riskLevel }) {
  const remedies = getHeatRemedies(riskLevel?.level);
  return (
    <div className="zone-info-card-health">
      <div className="zone-info-card-health-disclaimer" role="note">
        {REMEDY_DISCLAIMER}
      </div>

      <div className="zone-info-card-section-title zone-info-card-health-subtitle">What you can do now</div>
      <ul className="zone-info-card-health-checklist">
        {remedies.map((r) => <li key={r}>{r}</li>)}
      </ul>

      <div className="zone-info-card-section-title zone-info-card-health-subtitle">If someone feels unwell</div>
      <ol className="zone-info-card-health-steps">
        {HEAT_FIRST_AID.map((s) => <li key={s}>{s}</li>)}
      </ol>
    </div>
  );
}
