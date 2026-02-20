import Header from '../components/landing/Header.jsx';
import HeroAbout from '../components/about/HeroAbout.jsx';
import HowItWorks from '../components/about/HowItWorks.jsx';
import HeatSafety from '../components/about/HeatSafety.jsx';
import ContactSection from '../components/about/ContactSection.jsx';

function AboutPage() {
  return (
    <div className="about-page">
      <Header />
      <HeroAbout />
      <HowItWorks />
      <HeatSafety />
      <ContactSection />
    </div>
  );
}

export default AboutPage;
