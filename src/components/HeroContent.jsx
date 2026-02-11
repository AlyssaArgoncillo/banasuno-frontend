import '../styles/HeroContent.css';

function HeroContent() {
  return (
    <div className="hero-content">
      <h1 className="hero-heading">
        <span className="hero-heading-main">
          Visualizing Urban<br />
          <span className="hero-heading-accent">Heat Risk</span> & Health<br />
        </span>
        <span className="hero-heading-accent2">Support</span>
      </h1>
      
      <p className="hero-description">
        Real-time heat risk mapping that shows you where it's hot, why it matters, 
        and where to find help when you need it most.
      </p>
      
      <div className="scroll-indicator">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 13L12 18L17 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

export default HeroContent;
