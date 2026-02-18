import Header from '../components/landing/Header.jsx';
import HeroAbout from '../components/landing/HeroAbout.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import HeatSafety from '../components/landing/HeatSafety.jsx';
import ContactSection from '../components/landing/ContactSection.jsx';

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
