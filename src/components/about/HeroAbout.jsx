import '../../styles/HeroAbout.css';

function HeroAbout() {
  return (
    <section className="hero-about-section">
      <img src="/banner2.png" alt="About BanasUno Banner" className="hero-about-visual" />
      <div className="hero-about-content">
        <h1 className="hero-about-title">ABOUT BANASUNO</h1>
        <p className="hero-about-description">
          BanasUno turns complex urban heat data into clear, actionable insights. 
          Using satellite imagery and temperature analysis, we create interactive 
          neighborhood-level heat maps that show you exactly where risk is highest 
          and where to find help when you need it.
        </p>
        <br />
        <p className="hero-about-description">
          We make critical climate information accessible to everyone. Because 
          understanding your environment is the first step to staying safe in it.
        </p>
      </div>
    </section>
  );
}

export default HeroAbout;
