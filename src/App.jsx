import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NavigationProvider } from './contexts/NavigationContext';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import Footer from './components/landing/Footer';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <ErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <NavigationProvider>
            <div className="app-main">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </div>
            <Footer />
          </NavigationProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
