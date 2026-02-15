import '../styles/SolutionSection.css';

function SolutionSection() {
  return (
    <section className="solution-section">
      <div className="solution-card">
        <div className="solution-header">
          <h2 className="solution-title">BanasUno's Approach</h2>
          <p className="solution-description">
            We combine neighborhood-level heat visualization with instant health facility locator to bridge the gap between environmental and actionable health support.
          </p>
        </div>

        <div className="solution-divider"></div>

        <div className="hrv-subsection subsection">
          <div className="subsection-content">
            <h3 className="subsection-heading">Heat Risk Visualization</h3>
            <p className="subsection-description">
              Interactive color-coded zones showing real-time heat intensity and risk scores
            </p>
          </div>
          <div className="subsection-image">
            <img src="/risk1.jpg" alt="Heat Risk Visualization" />
          </div>
        </div>

        <div className="solution-divider"></div>

        <div className="cls-subsection subsection">
          <div className="subsection-image">
            <img src="/risk1.jpg" alt="Clinic Locator" />
          </div>
          <div className="subsection-content">
            <h3 className="subsection-heading">Clinic Locator</h3>
            <p className="subsection-description">
              Instantly find nearby health facilities that caters to your budget when you're in high-risk zones.
            </p>
          </div>
        </div>

        <div className="solution-divider"></div>

        <div className="das-subsection subsection">
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
