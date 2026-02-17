import '../../styles/FinalCTA.css';

function FinalCTA() {
  return (
    <section className="final-cta-section">
      <div className="cta-card">
        <div className="cta-content">
          <h3 className="cta-title">Ready to Explore The City's Heat Risk?</h3>
          <p className="cta-description">
            Start visualizing heat zones and locating health facilities near you.
          </p>
          <div className="cta-buttons">
            <button className="cta-button primary">Launch the Map -&gt;</button>
            <button className="cta-button secondary">Heat Safety Tips</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;
