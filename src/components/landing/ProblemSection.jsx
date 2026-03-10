import { useEffect, useRef, useState } from 'react';
import '../../styles/ProblemSection.css';

const UHI_TEXT =
  'Cities trap heat. Concrete, asphalt, dense buildings, and limited green spaces cause urban areas to be significantly hotter than surrounding rural locations - a phenomenon known as the Urban Heat Island (UHI) effect. As cities grow, this heat buildup becomes more intense and more frequent.';

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

function ProblemSection() {
  const [ref, visible] = useInView(0.1);

  return (
    <section
      id="problem"
      ref={ref}
      className={`problem-section${visible ? ' problem-visible' : ''}`}
    >
      <div className="problem-container">
        <div className="problem-intro">
          <h2>What is BanasUno Aiming to Solve?</h2>
          <p>
            Cities are getting hotter, and rising urban temperatures create serious health and safety
            risks for residents. This section highlights the causes, the populations most affected.
          </p>
        </div>

        <div className="problem-detail">
          <h3>The Urban Heat Island Effect</h3>
          <p className="problem-detail-body">
            {UHI_TEXT.split(' ').map((word, index) => (
              <span
                key={index}
                className="problem-detail-word"
                style={{ transitionDelay: `${0.68 + index * 0.03}s` }}
              >
                {word}{' '}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;
