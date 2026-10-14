import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NavigationProvider } from './contexts/NavigationContext';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AlertPage from './pages/AlertPage';
import Footer from './components/landing/Footer';
import './styles/App.css';

/** Routes that render without the global site footer (focused, mobile-first flows). */
const ROUTES_WITHOUT_FOOTER = ['/alert'];

function SiteFooter() {
  const { pathname } = useLocation();
  return ROUTES_WITHOUT_FOOTER.includes(pathname) ? null : <Footer />;
}

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
                <Route path="/alert" element={<AlertPage />} />
              </Routes>
            </div>
            <SiteFooter />
          </NavigationProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
