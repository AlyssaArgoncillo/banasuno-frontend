import { useEffect, useRef, useState } from 'react';
import '../../styles/HealthRisksSection.css';

const RISKS = [
  {
    icon: '/thermo.png',
    color: '#F4A820',
    bg: '#FFF8E1',
    border: '#F4A82033',
    label: 'Heat Exhaustion',
    stat: '38°C',
    statLabel: 'danger threshold',
    desc: 'Excessive heat can lead to heat exhaustion, causing dizziness, nausea, weakness, and heavy sweating. If untreated, it can progress to heat stroke.',
  },
  {
    icon: '/heart.png',
    color: '#E05050',
    bg: '#FFF0F0',
    border: '#E0505033',
    label: 'Cardiovascular Strain',
    stat: '2×',
    statLabel: 'cardiac risk increase',
    desc: 'High temperatures put extra stress on the heart and can worsen existing cardiovascular conditions, increasing risk of heart attacks and strokes.',
  },
  {
    icon: '/drop.png',
    color: '#35A89A',
    bg: '#E8F7F5',
    border: '#35A89A33',
    label: 'Dehydration',
    stat: '1.5L',
    statLabel: 'lost per hour outdoors',
    desc: "Increased sweating and heat exposure can lead to severe dehydration if fluids aren't replaced, affecting kidney function and overall health.",
  },
];

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function HealthRisksSection() {
  const [ref, visible] = useInView(0.08);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scanned, setScanned] = useState([false, false, false]);
  const [activeIndex, setActiveIndex] = useState(null);
  const lastTapRef = useRef({ time: 0, index: -1 });

  useEffect(() => {
    if (!visible) return;
    RISKS.forEach((_, index) => {
      setTimeout(() => {
        setScanned((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
      }, 200 + index * 180);
    });
  }, [visible]);

  return (
    <section ref={ref} className="health-risks-section">
      <div className="health-risks-inner">
        <div className="health-risks-title-block">
          <h2
            className="health-risks-title"
            data-visible={visible ? 'true' : 'false'}
          >
            Possible Health Risks
          </h2>
          <div
            className="health-risks-underline"
            data-visible={visible ? 'true' : 'false'}
          />
        </div>

        <div className="health-risks-grid">
          {RISKS.map((risk, index) => {
            const isHovered = hoveredIndex === index;
            const isActive = activeIndex === index;
            // Click selection takes priority; when a card is active, hover does not change its state.
            const isElevated = activeIndex != null ? isActive : isHovered;
            const isScanned = scanned[index];

            const toggleCard = () => {
              setActiveIndex((prev) => (prev === index ? null : index));
            };

            const handleTap = (e) => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }
              const now = Date.now();
              const { time, index: lastIndex } = lastTapRef.current;
              if (now - time < 500 && lastIndex === index) return;
              lastTapRef.current = { time: now, index };
              toggleCard();
            };

            return (
              <article
                key={risk.label}
                className="health-risk-card"
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`${risk.label}. Click to ${isActive ? 'collapse' : 'expand'} card.`}
                style={{
                  boxShadow: isElevated
                    ? `0 16px 48px ${risk.color}44`
                    : '0 3px 16px rgba(0,0,0,0.07)',
                  borderColor: isElevated ? `${risk.color}66` : 'transparent',
                  transform: isElevated
                    ? `translateY(-8px) rotate(${index % 2 === 0 ? '0.8deg' : '-0.8deg'}) scale(1.02)`
                    : 'none',
                  opacity: isScanned ? 1 : 0,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={handleTap}
                onTouchEnd={handleTap}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCard();
                  }
                }}
              >
                <div
                  className="health-risk-scanner-bar"
                  style={{
                    background: `linear-gradient(180deg, ${risk.color} 0%, ${risk.color}BB 100%)`,
                    width: isScanned ? '4px' : '100%',
                    borderRadius: isScanned ? '0' : '20px 0 0 20px',
                    transition: isScanned
                      ? `width 0.42s ${index * 0.12}s cubic-bezier(0.76,0,0.24,1), border-radius 0.3s ${index * 0.12 + 0.1}s`
                      : 'none',
                  }}
                />

                <div
                  className="health-risk-card-content"
                  style={{
                    opacity: isScanned ? 1 : 0,
                    transition: `opacity 0.35s ${index * 0.12 + 0.36}s`,
                  }}
                >
                  <div className="health-risk-icon-wrap">
                    <div
                      className="health-risk-icon-ring"
                      style={{
                        borderColor: risk.color,
                        opacity: isElevated ? 0 : 0.25,
                        transform: isElevated ? 'scale(1.4)' : 'scale(1)',
                        animation: isElevated ? `ringPulse_${index} 1.2s ease-in-out infinite` : 'none',
                      }}
                    />
                    <div
                      className="health-risk-icon-circle"
                      style={{
                        background: risk.bg,
                        borderColor: `${risk.color}33`,
                        boxShadow: isElevated ? `0 4px 20px ${risk.color}55` : 'none',
                        transform: isElevated
                          ? 'scale(1.15) rotate(-4deg)'
                          : 'scale(1) rotate(0deg)',
                      }}
                    >
                      <img
                        src={risk.icon}
                        alt=""
                        className="health-risk-icon-img"
                        aria-hidden
                      />
                    </div>
                  </div>

                  <div className="health-risk-label">{risk.label}</div>

                  <div className="health-risk-stat-row">
                    <div
                      className="health-risk-stat-badge"
                      style={{
                        background: risk.bg,
                        borderColor: `${risk.color}44`,
                        transform: isScanned
                          ? isElevated
                            ? 'scale(1.08)'
                            : 'scale(1)'
                          : 'scaleX(0)',
                        transition: isScanned
                          ? 'transform 0.22s ease'
                          : `transform 0.35s ${index * 0.12 + 0.5}s cubic-bezier(0.34,1.56,0.64,1)`,
                      }}
                    >
                      <span
                        className="health-risk-stat-value"
                        style={{ color: risk.color }}
                      >
                        {risk.stat}
                      </span>
                      <span
                        className="health-risk-stat-label"
                        style={{ color: risk.color }}
                      >
                        {risk.statLabel}
                      </span>
                    </div>
                  </div>

                  <p
                    className="health-risk-description"
                    style={{
                      opacity: isScanned ? 1 : 0,
                      transform: isScanned ? 'translateY(0)' : 'translateY(8px)',
                      transition: `opacity 0.4s ${index * 0.12 + 0.55}s, transform 0.4s ${
                        index * 0.12 + 0.55
                      }s ease`,
                    }}
                  >
                    {risk.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HealthRisksSection;
