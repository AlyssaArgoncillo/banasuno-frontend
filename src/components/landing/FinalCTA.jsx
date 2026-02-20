import { Link } from 'react-router-dom';
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
            <Link to="/home?view=heatmap" className="cta-button primary">Launch the Map</Link>
            <Link to="/about#heat-safety" className="cta-button secondary">Heat Safety Tips</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;
