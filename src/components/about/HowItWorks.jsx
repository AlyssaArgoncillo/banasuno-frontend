import '../../styles/HowItWorks.css';

function HowItWorks() {
  return (
    <section className="how-it-works-section">
      <h1 className="how-it-works-main-title">HOW IT WORKS</h1>
      <div className="how-it-works-container">
        <div className="step-item">
          <div className="step-icon"></div>
          <div className="step-content">
            <h2 className="step-title">Data Collection</h2>
            <p className="step-description">
              We gather temperature and urban density from satellite imagery, weather 
              stations APIs, validated research datasets, and real-time environmental 
              monitoring systems.
            </p>
          </div>
        </div>

        <div className="step-item">
          <div className="step-icon"></div>
          <div className="step-content">
            <h2 className="step-title">Risk Calculation</h2>
            <p className="step-description">
              We use a rule-based algorithm that processes temperature and urban density 
              data to compute heat risk scores for each neighborhood zone.
            </p>
          </div>
        </div>

        <div className="step-item">
          <div className="step-icon"></div>
          <div className="step-content">
            <h2 className="step-title">Visualization</h2>
            <p className="step-description">
              Risk-data is mapped onto an interactive color-coded interface that anyone 
              can explore, no technical skills needed.
            </p>
          </div>
        </div>

        <div className="step-item">
          <div className="step-icon"></div>
          <div className="step-content">
            <h2 className="step-title">Health Support</h2>
            <p className="step-description">
              High-risk zones trigger our clinic locator showing the nearest health 
              facilities so you can get help fast.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
