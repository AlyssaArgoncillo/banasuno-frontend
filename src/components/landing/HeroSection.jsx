import HeroContent from './HeroContent';
import HeroGraphic from './HeroGraphic';
import '../../styles/HeroSection.css';

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <HeroContent />
        <HeroGraphic />
      </div>
    </section>
  );
}

export default HeroSection;
