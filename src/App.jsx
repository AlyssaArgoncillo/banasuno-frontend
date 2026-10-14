import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NavigationProvider } from './contexts/NavigationContext';
import ScrollToTop from './components/ScrollToTop';
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
                {/* No landing page: opening the site goes straight to the location prompt + map. */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                {/* SMS link target: location prompt + heat report now live on the map page. */}
                <Route path="/alert" element={<Navigate to="/home?view=heatmap" replace />} />
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
