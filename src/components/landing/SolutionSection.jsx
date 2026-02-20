import '../../styles/SolutionSection.css';
import { useEffect, useRef } from 'react';

function SolutionSection() {
  const subsectionsRef = useRef([]);

  useEffect(() => {
    // Set initial state
    subsectionsRef.current.forEach((subsection) => {
      if (subsection) {
        const content = subsection.querySelector('.subsection-content');
        const image = subsection.querySelector('.subsection-image');
        if (content) content.classList.add('initial');
        if (image) image.classList.add('initial');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const content = entry.target.querySelector('.subsection-content');
            const image = entry.target.querySelector('.subsection-image');
            if (content) {
              content.classList.remove('initial');
              content.classList.add('in-view');
            }
            if (image) {
              image.classList.remove('initial');
              image.classList.add('in-view');
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    subsectionsRef.current.forEach((subsection) => {
      if (subsection) observer.observe(subsection);
    });

    return () => {
      subsectionsRef.current.forEach((subsection) => {
        if (subsection) observer.unobserve(subsection);
      });
    };
  }, []);

  return (
    <section id="solution" className="solution-section">
      <div className="solution-card">
        <div className="solution-header">
          <h2 className="solution-title">BanasUno's Approach</h2>
          <p className="solution-description">
            We combine neighborhood-level heat visualization with instant health facility locator to bridge the gap between environmental and actionable health support.
          </p>
        </div>

        <div className="solution-divider"></div>

        <div className="hrv-subsection subsection" ref={(el) => (subsectionsRef.current[0] = el)}>
          <div className="subsection-content">
            <h3 className="subsection-heading">Heat Risk Visualization</h3>
            <p className="subsection-description">
              Interactive color-coded zones showing real-time heat intensity and risk scores
            </p>
          </div>
          <div className="subsection-image">
            <img src="/HeatZone.png" alt="Heat Risk Visualization" />
          </div>
        </div>

        <div className="solution-divider"></div>

        <div className="cls-subsection subsection" ref={(el) => (subsectionsRef.current[1] = el)}>
          <div className="subsection-image">
            <img src="/ClinicLoc.png" alt="Clinic Locator" />
          </div>
          <div className="subsection-content">
            <h3 className="subsection-heading">Clinic Locator</h3>
            <p className="subsection-description">
              Instantly find nearby health facilities that caters to your budget when you're in high-risk zones.
            </p>
          </div>
        </div>

        <div className="solution-divider"></div>

        <div className="das-subsection subsection" ref={(el) => (subsectionsRef.current[2] = el)}>
          <div className="subsection-content">
            <h3 className="subsection-heading">Data Analytics</h3>
            <p className="subsection-description">
              Historical trends and insights for planners and community organizations.
            </p>
          </div>
          <div className="subsection-image">
            <img src="/risk1.jpg" alt="Data Analytics" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SolutionSection;
