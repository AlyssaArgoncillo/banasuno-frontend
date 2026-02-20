import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/landing/Header.jsx';
import HeroSection from '../components/landing/HeroSection.jsx';
import ProblemSection from '../components/landing/ProblemSection.jsx';
import HealthRisksSection from '../components/landing/HealthRisksSection.jsx';
import LocalSection from '../components/landing/LocalSection.jsx';
import CreativeSeparator from '../components/landing/CreativeSeparator.jsx';
import SolutionSection from '../components/landing/SolutionSection.jsx';
import TryItNowSection from '../components/landing/TryItNowSection.jsx';
import BuiltForSubsection from '../components/landing/BuiltForSubsection.jsx';
import DataSourcesSection from '../components/landing/DataSourcesSection.jsx';
import FinalCTA from '../components/landing/FinalCTA.jsx';
import Footer from '../components/landing/Footer.jsx';

function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    // Delay to allow DOM to render
    const timer = setTimeout(() => {
      if (location.hash) {
        // If there's a hash, scroll to that element
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // If no hash, scroll to top
        window.scrollTo(0, 0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <div className="landing-page">
      <Header />
      <HeroSection />
      <ProblemSection />
      <HealthRisksSection />
      <LocalSection />
      <CreativeSeparator />
      <SolutionSection />
      <TryItNowSection />
      <BuiltForSubsection />
      <DataSourcesSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
