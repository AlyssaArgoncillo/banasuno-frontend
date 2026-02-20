import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h3 className="footer-brand">BANASUNO</h3>
          <p className="footer-description">
            Visualizing urban heat risk and connecting communities to health support. 
            Making climate data accessible and actionable.
          </p>
          <div className="footer-social">
            <div className="social-icon" aria-hidden="true">
              <img src="/github.png" alt="GitHub" />
            </div>
            <div className="social-icon" aria-hidden="true">
              <img src="/email.png" alt="Email" />
            </div>
          </div>
        </div>
        
        <div className="footer-right">
          <div className="footer-column">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/home?view=heatmap">Heat Map</Link></li>
              <li><Link to="/home?view=dashboard">Data Export</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h5 className="footer-heading">Resources</h5>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><a href="/#data-sources">Data Sources</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
