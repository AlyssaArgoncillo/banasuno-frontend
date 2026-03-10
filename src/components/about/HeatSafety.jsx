import { useState, useRef, useEffect } from 'react';
import '../../styles/HeatSafety.css';

// Custom SVG icons – scalable, match card color schemes
const SvgWaterDrop = ({ color = '#1565C0', className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M32 8c-6 10-16 22-16 32a16 16 0 1 0 32 0c0-10-10-22-16-32z" fill={color} fillOpacity="0.9" />
    <path d="M32 12c-4 7-12 18-12 28a12 12 0 0 0 24 0c0-10-8-21-12-28z" fill={color} />
  </svg>
);
const SvgTreeShade = ({ color = '#4A9C4D', className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    {/* Canopy – soft rounded shape */}
    <path d="M32 12c-12 0-18 10-18 18 0 8 8 14 18 14s18-6 18-14c0-8-6-18-18-18z" fill={color} fillOpacity="0.95" />
    <path d="M32 16c-8 0-12 6-12 12 0 6 5 10 12 10s12-4 12-10c0-6-4-12-12-12z" fill={color} />
    {/* Trunk */}
    <rect x="28" y="42" width="8" height="10" rx="2" fill="#5D4E37" />
    <rect x="29" y="44" width="6" height="6" rx="1" fill="#6B5B42" />
  </svg>
);
const SvgRunner = ({ color = '#009688', className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    {/* Limit / Pause – universal “ease off” symbol */}
    <circle cx="32" cy="32" r="20" stroke={color} strokeWidth="3" fill="none" />
    <rect x="24" y="20" width="6" height="24" rx="2" fill={color} />
    <rect x="34" y="20" width="6" height="24" rx="2" fill={color} />
  </svg>
);
const SvgSOS = ({ color = '#C62828', className }) => {
  const isLight = color === '#fff' || color?.includes('255, 255, 255');
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="10" y="14" width="44" height="36" rx="6" fill={color} stroke={isLight ? '#333' : undefined} strokeWidth={isLight ? 2 : 0} />
      <text x="32" y="38" textAnchor="middle" dominantBaseline="middle" fill={isLight ? '#333' : '#fff'} fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">SOS</text>
    </svg>
  );
};
const HEAT_SAFETY_ICONS = [SvgWaterDrop, SvgTreeShade, SvgRunner, SvgSOS];

const TIP_CARDS = [
  {
    label: 'Stay Hydrated',
    color: '#1565C0',
    bg: '#DCEEFB',
    bgTop: '#E8F4FC',
    tipLines: [
      'Drink water regularly, even if not thirsty.',
      'Avoid alcohol and caffeine.',
      'Carry a water bottle outdoors.',
    ],
  },
  {
    label: 'Seek Shade',
    color: '#4A9C4D',
    bg: '#E0F4E1',
    bgTop: '#E8F8E9',
    tipLines: [
      'Avoid peak sun hours (12–3 PM).',
      'Stay in air-conditioned spaces.',
      'Use umbrellas or hats when outside.',
    ],
  },
  {
    label: 'Limit Exertion',
    color: '#009688',
    bg: '#E0F2F1',
    bgTop: '#E8F6F5',
    tipLines: [
      'Avoid strenuous activity 10AM–4PM.',
      'Wear loose, breathable clothing.',
      'Use sunscreen SPF 30+.',
    ],
  },
  {
    label: 'Know Warning Signs',
    color: '#C62828',
    bg: '#FFEBEE',
    bgTop: '#FFF0F2',
    tipLines: [
      'Seek medical attention immediately if experiencing:',
      'dizziness, confusion, rapid heartbeat,',
      'nausea, headache, or hot dry skin.',
    ],
  },
];

function HeatSafety() {
  const [flipped, setFlipped] = useState({});
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const toggle = (index) =>
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));

  return (
    <section id="heat-safety" ref={sectionRef} className="heat-safety-section heat-safety-flip">
      <h1
        className="heat-safety-title"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-14px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        STAY SAFE IN THIS HEAT
      </h1>
      <p
        className="heat-safety-subtitle"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s 0.18s ease',
        }}
      >
        Tap any card to reveal the tip
      </p>

      <div className="heat-safety-grid">
        {TIP_CARDS.map((card, index) => {
          const isFlipped = !!flipped[index];
          return (
            <button
              key={card.label}
              type="button"
              className="heat-safety-card-outer"
              onClick={() => toggle(index)}
              aria-label={`${card.label}, tap to ${isFlipped ? 'flip back' : 'view tip'}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? 'translateY(0) scale(1)'
                  : 'translateY(22px) scale(0.9)',
                transition: `opacity 0.5s ${index * 0.1}s ease, transform 0.55s ${
                  index * 0.1
                }s cubic-bezier(0.34,1.56,0.64,1)`,
              }}
            >
              <div
                className="heat-safety-card-inner"
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transition: 'transform 0.58s cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                {/* Front */}
                <div
                  className="heat-safety-face heat-safety-face-front"
                  style={{
                    background: card.bgTop
                      ? `linear-gradient(180deg, ${card.bgTop} 0%, ${card.bg} 100%)`
                      : card.bg,
                    borderColor: `${card.color}22`,
                    boxShadow: `0 6px 20px rgba(0,0,0,0.08)`,
                  }}
                >
                  <div className="heat-safety-front-content">
                    <div className="heat-safety-icon-wrap" style={{ color: card.color }}>
                      {(() => {
                        const IconComponent = HEAT_SAFETY_ICONS[index];
                        return IconComponent ? <IconComponent color={card.color} className="heat-safety-icon-svg" /> : null;
                      })()}
                    </div>
                    <div
                      className="heat-safety-label"
                      style={{ color: card.color }}
                    >
                      {card.label}
                    </div>
                  </div>
                  <div className="heat-safety-flip-hint" aria-hidden>
                    ↩
                  </div>
                </div>

                {/* Back */}
                <div
                  className="heat-safety-face heat-safety-face-back"
                  style={{
                    background: `linear-gradient(145deg, ${card.color}, ${card.color}dd)`,
                    boxShadow: `0 8px 28px ${card.color}55`,
                  }}
                >
                  <div className="heat-safety-back-top">
                    <div className="heat-safety-back-icon-wrap">
                      {(() => {
                        const IconComponent = HEAT_SAFETY_ICONS[index];
                        return IconComponent ? <IconComponent color="#fff" className="heat-safety-back-icon-svg" /> : null;
                      })()}
                    </div>
                    <div className="heat-safety-back-label">
                      {card.label.toUpperCase()}
                    </div>
                    {index < 3 ? (
                      <ul className="heat-safety-back-list heat-safety-back-list--large">
                        {card.tipLines.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="heat-safety-back-text">
                        {card.tipLines.map((line) => (
                          <span key={line}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                  <div className="heat-safety-back-footer">TAP TO FLIP BACK</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default HeatSafety;
