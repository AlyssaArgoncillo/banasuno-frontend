import '../../styles/ContactSection.css';

function ContactSection() {
  return (
    <section className="contact-section">
      <div className="contact-layout">
        <div className="contact-right">
          <h2 className="team-title">MEET THE TEAM</h2>
          <div className="team-cards">
            <div className="team-card">
              <div className="team-upper">
                <img src="/ArAr.png" alt="Team member" className="team-photo" />
              </div>
              <div className="team-lower">
                <h3>Alyssa Nicole A. Argoncillo</h3>
                <h4>Project Lead & System Developer</h4>
                <p>Dummy data</p>
                <a className="team-btn" href="https://www.facebook.com/ekleas.prsea" target="_blank" rel="noopener noreferrer">Profile</a>
              </div>
            </div>

            <div className="team-card">
              <div className="team-upper">
                <img src="/KS.png" alt="Team member" className="team-photo" />
              </div>
              <div className="team-lower">
                <h3>Kisha Ann Joy M. Sanchez</h3>
                <h4>Data Analyst & UI Documentation Lead</h4>
                <p>Dummy data</p>
                <a className="team-btn" href="https://www.facebook.com/kishaannjoy.sanchez" target="_blank" rel="noopener noreferrer">Profile</a>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-left">
          <div className="contact-header">
            <h1 className="contact-title">
              GET IN
              <br />
              TOUCH
            </h1>
            <p className="contact-description">
              Questions? Feedback? Opportunities? We'd love to hear from you.
            </p>
          </div>

          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-visual">
                <img src="/email.png" alt="Email" />
              </div>
              <div className="contact-content">
                <h5 className="contact-label">EMAIL</h5>
                <p className="contact-value">banasgmail.com</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-visual">
                <img src="/phone.png" alt="Phone" />
              </div>
              <div className="contact-content">
                <h5 className="contact-label">PHONE</h5>
                <p className="contact-value">0938434743</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-visual">
                <img src="/loc.png" alt="Location" />
              </div>
              <div className="contact-content">
                <h5 className="contact-label">LOCATION</h5>
                <p className="contact-value">Davao City</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
