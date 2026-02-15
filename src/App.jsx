import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ProblemSection from './components/ProblemSection'
import PhenoSection from './components/PhenoSection'
import HealthRisksSection from './components/HealthRisksSection'
import LocalSection from './components/LocalSection'
import CreativeSeparator from './components/CreativeSeparator'
import SolutionSection from './components/SolutionSection'
import TryItNowSection from './components/TryItNowSection'
import './styles/App.css'

function App() {
  return (
    <div className="app">
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
  )
}

export default App
