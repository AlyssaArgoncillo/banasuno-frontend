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
            <div className="social-icon"></div>
            <div className="social-icon"></div>
          </div>
        </div>
        
        <div className="footer-right">
          <div className="footer-column">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="#">Heat Map</a></li>
              <li><a href="#">Data Export</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h5 className="footer-heading">Resources</h5>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Data Sources</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
