import Header from '../components/landing/Header.jsx';
import HeroSection from '../components/landing/HeroSection.jsx';
import ProblemSection from '../components/landing/ProblemSection.jsx';
import PhenoSection from '../components/landing/PhenoSection.jsx';
import HealthRisksSection from '../components/landing/HealthRisksSection.jsx';
import LocalSection from '../components/landing/LocalSection.jsx';
import CreativeSeparator from '../components/landing/CreativeSeparator.jsx';
import SolutionSection from '../components/landing/SolutionSection.jsx';
import TryItNowSection from '../components/landing/TryItNowSection.jsx';
import BuiltForSubsection from '../components/landing/BuiltForSubsection.jsx';
import DataSourcesSection from '../components/landing/DataSourcesSection.jsx';
import FinalCTA from '../components/landing/FinalCTA.jsx';
import Footer from '../components/landing/Footer.jsx';
import CityPlannersSection from '../components/landing/CityPlannersSection.jsx';

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
      <BuiltForSubsection />
      <CityPlannersSection />
      <CityPlannersSection
        title="NGOs & Community"
        need="Plan outreach and climate awareness campaigns with data."
        provide="Visual hotspot data, downloadable reports, trend analysis."
        imageSrc="/NGO.png"
        imageAlt="NGO community"
      />
      <CityPlannersSection
        title="Residents"
        need="Understand neighborhood heat risk and locate healthcare when needed."
        provide="Color-coded map, visual alerts, nearby clinic locator, mobile access."
        imageSrc="/family.png"
        imageAlt="Family"
      />
      <DataSourcesSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
