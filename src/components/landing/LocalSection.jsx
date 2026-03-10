import { useEffect, useRef, useState } from 'react';
import '../../styles/LocalSection.css';

const WHY_DAVAO_TEXT =
  "Davao City is an ideal case study because it is one of the Philippines' fastest‑growing highly urbanized cities, with rapid development intensifying urban heat island effects that put its growing population at risk. With its tropical climate, densely built‑up central districts, and limited accessible green spaces for many urban residents, the city faces rising heat‑related health challenges that demand timely action. By starting with Davao, we can demonstrate how our tool operates in a large, real‑world Philippine city before scaling to other urban centers nationwide.";

const STATS = [
  {
    main: '31–32°C',
    line1: 'Avg daytime high',
    line2: '(up to 34–36°C)',
  },
  {
    main: '1.85–2.1M',
    line1: 'Residents in',
    line2: 'urban area',
  },
  {
    main: '<15%',
    line1: 'Urban/built-up',
    line2: 'land; majority agri/forest',
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

function LocalSection() {
  const [heroRef, visible] = useInView(0.12);

  return (
    <section className="local-section">
      <div className="local-container">
        <h3 className="local-heading">Why Davao City?</h3>

        <div
          ref={heroRef}
          className={`local-hero${visible ? ' local-hero-visible' : ''}`}
        >
          <div className="local-hero-image">
            <div className="local-hero-photo" aria-hidden />

            <div className="local-hero-glass">
              <div className="local-hero-label">WHY DAVAO CITY?</div>

              <div className="local-hero-content">
                <p className="local-hero-body">
                  {WHY_DAVAO_TEXT}
                </p>

                <div className="local-hero-stats">
                  {STATS.map((stat, index) => (
                    <div key={stat.main} className="local-hero-stat-pill">
                      {index > 0 && (
                        <div className="local-hero-stat-divider" aria-hidden />
                      )}
                      <div className="local-hero-stat-content">
                        <div className="local-hero-stat-value">
                          {stat.main}
                        </div>
                        <div className="local-hero-stat-label">
                          <span>{stat.line1}</span>
                          <br />
                          {index === 1 ? (
                            <>
                              <span>{stat.line2}</span>
                              <span className="local-hero-stat-subnote">(2024–2026)</span>
                            </>
                          ) : (
                            <span>{stat.line2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LocalSection;
