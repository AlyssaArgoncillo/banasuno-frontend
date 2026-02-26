import '../../styles/HeroAbout.css';

const overviewP1 = "BanasUno is a web‑based tool that makes neighborhood heat information accessible to everyone. It uses official PAGASA heat levels and translates them into a simple, interactive map so residents can quickly see which areas are hotter and identify nearby health facilities.";

function HeroAbout() {
  return (
    <section className="hero-about-section">
      <img src="/banner2.png" alt="About BanasUno Banner" className="hero-about-visual" />
      <div className="hero-about-content">
        <h1 className="hero-about-title">
          ABOUT <span className="hero-about-title-accent">BANASUNO</span>
        </h1>
        <p className="hero-about-description">{overviewP1}</p>
      </div>
    </section>
  );
}

export default HeroAbout;
