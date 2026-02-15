import Header from '../components/landing/Header.jsx';
import HeroSection from '../components/landing/HeroSection.jsx';
import ProblemSection from '../components/landing/ProblemSection.jsx';
import PhenoSection from '../components/landing/PhenoSection.jsx';
import HealthRisksSection from '../components/landing/HealthRisksSection.jsx';
import LocalSection from '../components/landing/LocalSection.jsx';
import CreativeSeparator from '../components/landing/CreativeSeparator.jsx';
import SolutionSection from '../components/landing/SolutionSection.jsx';
import TryItNowSection from '../components/landing/TryItNowSection.jsx';

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <HeroSection />
      <ProblemSection />
      <PhenoSection />
      <HealthRisksSection />
      <LocalSection />
      <CreativeSeparator />
      <SolutionSection />
      <TryItNowSection />
    </div>
  );
}

export default LandingPage;
