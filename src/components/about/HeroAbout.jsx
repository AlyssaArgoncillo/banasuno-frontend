import { useEffect, useRef, useState } from 'react';
import '../../styles/HeroAbout.css';

const overviewP1 =
  "BanasUno is a web‑based tool that makes neighborhood heat information accessible to everyone. It uses official PAGASA heat levels and translates them into a simple, interactive map so residents can quickly see which areas are hotter and identify nearby health facilities.";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function HeroAbout() {
  const [ref, visible] = useInView(0.1);

  return (
    <section
      ref={ref}
      className={`hero-about-section${visible ? ' hero-about-visible' : ''}`}
    >
      <img
        src="/banner2.png"
        alt="About BanasUno Banner"
        className="hero-about-visual"
      />
      <div className="hero-about-content">
        <h1 className="hero-about-title">
          ABOUT <span className="hero-about-title-accent">BANASUNO</span>
        </h1>
        <p className="hero-about-description">{overviewP1}</p>
      </div>
    </section>
  );
}

export default HeroAbout;
