import '../styles/TryItNowSection.css';
import HeatMap from './HeatMap';

function TryItNowSection() {
  return (
    <section className="try-it-now-section">
      <h1 className="try-it-now-heading">TRY IT NOW</h1>
      
      <div className="smp-container">
        <div className="monitor-frame">
          {/* Corner screws */}
          <div className="screw screw-top-left"></div>
          <div className="screw screw-top-right"></div>
          <div className="screw screw-bottom-left"></div>
          <div className="screw screw-bottom-right"></div>
          
          {/* Monitor screen */}
          <div className="monitor-screen">
            {/* Display area */}
            <div className="display-area">
              <HeatMap />
            </div>
          </div>
          {/* Bottom center controls inside the monitor frame */}
          <div className="monitor-controls">
            <button className="control-btn" aria-label="control-1"></button>
            <button className="control-btn" aria-label="control-2"></button>
            <button className="control-btn" aria-label="control-3"></button>
          </div>
        </div>
      </div>

      {/* Map bar below the smp frame */}
      <div className="map-bar-wrapper">
        <div className="map-bar">
          <button className="launch-btn"><span>Launch Full Map →</span></button>
        </div>
      </div>
    </section>
  );
}

export default TryItNowSection;
