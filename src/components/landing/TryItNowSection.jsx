import { Link } from 'react-router-dom';
import '../../styles/TryItNowSection.css';
import HeatMap from '../HeatMap';

function TryItNowSection() {
  return (
    <section className="try-it-now-section">
      <h1 className="try-it-now-heading">TRY IT NOW</h1>

      <div className="smp-container">
        <div className="monitor-frame">
          <div className="screw screw-top-left"></div>
          <div className="screw screw-top-right"></div>
          <div className="screw screw-bottom-left"></div>
          <div className="screw screw-bottom-right"></div>

          <div className="monitor-screen">
            <div className="display-area">
              <HeatMap compact />
            </div>
          </div>
          <div className="monitor-controls">
            <button className="control-btn" aria-label="control-1"></button>
            <button className="control-btn" aria-label="control-2"></button>
            <button className="control-btn" aria-label="control-3"></button>
          </div>
        </div>
      </div>

      <div className="map-bar-wrapper">
        <div className="map-bar">
          <Link to="/home" className="launch-btn"><span>Launch Full Map →</span></Link>
        </div>
      </div>
    </section>
  );
}

export default TryItNowSection;
