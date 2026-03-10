import { useState, useEffect, useRef } from 'react';
import '../../styles/BuiltForSection.css';

// ─── useInView hook ───────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── PERSONAS (theme + copy from reference; images from current codebase) ───
const PERSONAS = [
  {
    id: 'volunteer',
    title: 'Neighborhood Volunteers',
    need: 'Spot local heatspots and guide neighbors',
    provide: 'Simple heat map, risk scores, easy-to-use dashboard',
    imageSrc: '/Volunteer.png',
    imageAlt: 'Neighborhood volunteers',
    theme: {
      titleColor: '#C44F00',
      cardBg: 'linear-gradient(135deg,#FDEBD8 0%,#F4A56A 100%)',
      border: '#E8885A',
      icon: '#C44F00',
      body: '#4A1A00',
      tag: '#7B2E0A',
      pageBg: '#FEF5EC',
    },
  },
  {
    id: 'ngo',
    title: 'NGOs & Community',
    need: 'Support residents and run awareness campaigns',
    provide:
      'Easy-to-understand heat visualization and hotspot data; CSV export for reporting',
    imageSrc: '/NGO.png',
    imageAlt: 'NGO community',
    theme: {
      titleColor: '#1A4731',
      cardBg: 'linear-gradient(135deg,#DFF0E4 0%,#7BAF88 100%)',
      border: '#4D8A5E',
      icon: '#1B5E35',
      body: '#0A2B15',
      tag: '#0F3D20',
      pageBg: '#F0F7F2',
    },
  },
  {
    id: 'resident',
    title: 'Residents',
    need: 'Understand neighborhood heat risk and locate healthcare when needed.',
    provide:
      'Color-coded map, visual alerts, and nearby clinic locator; responsive web access on mobile and desktop.',
    imageSrc: '/family.png',
    imageAlt: 'Family',
    theme: {
      titleColor: '#7B2E0A',
      cardBg: 'linear-gradient(135deg,#F8DFD0 0%,#D4845A 100%)',
      border: '#B05A30',
      icon: '#8B3010',
      body: '#3A1000',
      tag: '#5A1E00',
      pageBg: '#FDF3EC',
    },
  },
];

// ─── Icons for card labels ─────────────────────────────
function SearchIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 14 14" fill="none">
      <circle cx={6} cy={6} r={4.5} stroke="#fff" strokeWidth={1.8} />
      <line
        x1={9.5}
        y1={9.5}
        x2={13}
        y2={13}
        stroke="#fff"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1.5L8.2 5.2H12.1L9 7.5L10.2 11.2L7 9L3.8 11.2L5 7.5L1.9 5.2H5.8L7 1.5Z"
        fill="#fff"
      />
    </svg>
  );
}

function CardLabel({ type, theme }) {
  return (
    <div
      className="built-for-card-label"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          background: theme.icon,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {type === 'need' ? <SearchIcon /> : <StarIcon />}
      </div>
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '8.5px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: theme.tag,
        }}
      >
        {type === 'need' ? 'NEED' : 'WE PROVIDE'}
      </span>
    </div>
  );
}

// ─── Persona image (overlap layout): real image, gradient overlay ───
function PersonaImage({ persona, style: extra = {} }) {
  const { theme, imageSrc, imageAlt } = persona;
  const classes = ['built-for-persona-img'];
  if (persona.id === 'volunteer') classes.push('built-for-persona-img-volunteer');
  if (persona.id === 'resident') classes.push('built-for-persona-img-resident');

  return (
    <div
      className="built-for-persona-image-wrap"
      style={{
        position: 'relative',
        borderRadius: 18,
        overflow: 'hidden',
        background: theme?.titleColor || '#666',
        minHeight: 260,
        ...extra,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(160deg, ${theme?.titleColor}CC, ${theme?.titleColor})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 260,
        }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className={classes.join(' ')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// "BUILT FOR EVERYONE" BANNER — same layout, add animations
// 1. Two horizontal rule lines draw in (scaleX 0→1)
// 2. Icon box drops in with spring bounce
// 3. "BUILT FOR" fades up
// 4. "Everyone" slides in from left with elastic
// 5. Warm shimmer pulse on icon every 3s
// ══════════════════════════════════════════════════════
function BuiltForEveryoneBanner() {
  const [ref, visible] = useInView(0.1);

  return (
    <div
      ref={ref}
      className="built-for-heading-container"
      style={{ position: 'relative' }}
    >
      {/* Original separator (kept for layout; optional: can hide if you prefer only the animated lines) */}
      <div className="built-for-separator" aria-hidden />

      {/* Left: Rectangle with Image — spring drop; pulse on rectangle */}
      <div
        className="built-for-visual-section"
        style={{
          position: 'relative',
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(-36px) scale(0.8)',
          transition:
            'opacity 0.5s 0.3s, transform 0.65s 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div
          className={`built-for-rectangle${visible ? ' built-for-rectangle-pulse' : ''}`}
        >
          <img src="/everyone.png" alt="Everyone" className="built-for-tile-image" />
        </div>
      </div>

      {/* Right: Text — lines above "Built For" and below "Everyone" */}
      <div className="built-for-text-section built-for-text-section-with-hr" style={{ position: 'relative', zIndex: 1 }}>
        {/* Line above "Built For" */}
        <div
          className="built-for-hr built-for-hr-top"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1.5,
            background: 'linear-gradient(90deg, transparent, #FF6B1A66, transparent)',
            transform: visible ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'transform 0.9s 0.1s cubic-bezier(0.76, 0, 0.24, 1)',
          }}
        />
        <h2
          className="built-for-subtitle"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.45s 0.55s, transform 0.45s 0.55s ease',
          }}
        >
          Built For
        </h2>
        <h1
          className="built-for-title"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-32px)',
            transition:
              'opacity 0.55s 0.65s, transform 0.65s 0.65s cubic-bezier(0.34, 1.2, 0.64, 1)',
          }}
        >
          Everyone
        </h1>
        {/* Line below "Everyone" */}
        <div
          className="built-for-hr built-for-hr-bottom"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1.5,
            background: 'linear-gradient(90deg, transparent, #FF6B1A66, transparent)',
            transform: visible ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'transform 0.9s 0.2s cubic-bezier(0.76, 0, 0.24, 1)',
          }}
        />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// OVERLAP CASCADE — persona section: title, image overlapping cards, two cards
// ══════════════════════════════════════════════════════
function OverlapCascade({ persona }) {
  const { theme } = persona;
  const [ref, visible] = useInView(0.08);

  const cards = [
    { type: 'need', text: persona.need, delay: '0.42s', tx: -28 },
    { type: 'provide', text: persona.provide, delay: '0.56s', tx: 28 },
  ];

  return (
    <div
      ref={ref}
      className="built-for-overlap-cascade"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Title at top */}
      <h2
        className="built-for-persona-heading built-for-persona-heading-overlap"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(2.2rem, 4.6vw, 2.8rem)',
          color: theme.titleColor,
          margin: '0 0 32px',
          letterSpacing: '-0.02em',
          textAlign: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(-20px)',
          transition: 'opacity 0.55s ease, transform 0.55s ease',
        }}
      >
        {persona.title}
      </h2>

      {/* Image — overlaps cards below */}
      <div
        className="built-for-overlap-image-wrap"
        style={{
          width: '92%',
          position: 'relative',
          zIndex: 2,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-28px)',
          transition:
            'opacity 0.7s 0.15s ease, transform 0.75s 0.15s cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: `0 24px 64px ${theme.border}55`,
          borderRadius: 20,
        }}
      >
        <PersonaImage persona={persona} style={{ height: 380 }} />
        <div
          className="built-for-overlap-gradient"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 90,
            background: `linear-gradient(transparent, ${theme.pageBg})`,
            borderRadius: '0 0 20px 20px',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Cards — sit under image */}
      <div
        className="built-for-overlap-cards"
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 22,
          marginTop: -40,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="built-for-overlap-card"
            style={{
              background: theme.cardBg,
              border: `1.5px solid ${theme.border}`,
              borderRadius: 16,
              padding: '46px 30px 30px',
              opacity: visible ? 1 : 0,
              transform: visible
                ? 'none'
                : `translateX(${card.tx}px) translateY(18px)`,
              transition: `opacity 0.6s ${card.delay}, transform 0.65s ${card.delay} cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          >
            <CardLabel type={card.type} theme={theme} />
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                  fontSize: 17,
                lineHeight: 1.68,
                color: theme.body,
                margin: 0,
              }}
            >
              {card.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────
function BuiltForSection() {
  return (
    <section className="built-for-section">
      <div className="built-for-container">
        <div className="built-for-content">
          <BuiltForEveryoneBanner />

          <div style={{ width: '100%', marginTop: '6rem' }}>
            {PERSONAS.map((persona) => (
              <div
                key={persona.id}
                className="built-for-persona-block"
                style={{
                  background: persona.theme.pageBg,
                  borderRadius: 24,
                  padding: '36px 32px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
                  marginBottom: '3rem',
                }}
              >
                <OverlapCascade persona={persona} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BuiltForSection;
