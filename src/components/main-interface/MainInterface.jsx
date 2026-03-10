import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import '../../styles/MainInterface.css';

function MainInterface() {
  const [activeView, setActiveView] = useState(() => {
    try {
      const saved = localStorage.getItem('activeView');
      if (saved && ['dashboard', 'heatmap', 'heat-advisory', 'community-sensors'].includes(saved)) {
        return saved;
      }
    } catch (err) {
      console.error('Failed to read activeView from localStorage:', err);
    }
    return 'heatmap';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [facilityToFocusOnMap, setFacilityToFocusOnMap] = useState(null);
  const [heatmapIotLayer, setHeatmapIotLayer] = useState('Official only');
  const [heatmapIotLayerKey, setHeatmapIotLayerKey] = useState(0);
  const location = useLocation();

  const onFocusFacilityOnMap = (facility) => {
    if (facility && (facility.lat != null || facility.latitude != null) && (facility.lng != null || facility.longitude != null)) {
      setFacilityToFocusOnMap(facility);
      setActiveView('heatmap');
      closeMobileMenu();
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    if (view === 'dashboard' || view === 'heatmap' || view === 'heat-advisory' || view === 'community-sensors') {
      setActiveView(view);
    }
    // Do not restore selectedZone from localStorage — no location is selected until the user selects one on the Heat Map.
  }, [location.search]);

  // Reset scroll to top when switching between Dashboard, Heat Map, Community Sensors, Heat Advisory
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  // When landing on /home?view=dashboard#dashboard-export, scroll to the CSV export cards.
  useEffect(() => {
    if (activeView !== 'dashboard') return;
    if (location.hash !== '#dashboard-export') return;
    const el = document.querySelector('#dashboard-export');
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [activeView, location.hash]);

  // Persist activeView to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('activeView', activeView);
    } catch (err) {
      console.error('Failed to save activeView to localStorage:', err);
    }
  }, [activeView]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const setViewAndClose = (view) => {
    setActiveView(view);
    if (view === 'heatmap') {
      setHeatmapIotLayer('Official only');
      setHeatmapIotLayerKey((k) => k + 1);
    }
    if (view === 'community-sensors') {
      setHeatmapIotLayer('Community only');
      setHeatmapIotLayerKey((k) => k + 1);
    }
    closeMobileMenu();
  };
  
  const handleZoneSelected = (zone) => {
    setSelectedZone(zone);
    
    // Persist selected zone to localStorage
    try {
      if (zone) {
        localStorage.setItem('selectedZone', JSON.stringify(zone));
      } else {
        localStorage.removeItem('selectedZone');
      }
    } catch (err) {
      console.error('Failed to save selected zone to localStorage:', err);
    }
  };
  const onGoToDashboard = () => {
    setActiveView('dashboard');
    setHeatmapIotLayer('Official only');
    setHeatmapIotLayerKey((k) => k + 1);
    closeMobileMenu();
  };

  return (
    <div className="main-interface">
      <Sidebar
        activeView={activeView}
        onSelectView={(view) => {
          setActiveView(view);
          if (view === 'heatmap') {
            setHeatmapIotLayer('Official only');
            setHeatmapIotLayerKey((k) => k + 1);
          }
          if (view === 'community-sensors') {
            setHeatmapIotLayer('Community only');
            setHeatmapIotLayerKey((k) => k + 1);
          }
        }}
        onSelectCommunitySensors={() => {
          setActiveView('community-sensors');
          setHeatmapIotLayer('Community only');
          setHeatmapIotLayerKey((k) => k + 1);
          closeMobileMenu();
        }}
        onOpenTutorial={() => { setActiveView('heatmap'); setHeatmapIotLayer('Official only'); setShowTutorial(true); }}
      />

      <div className="main-interface-body">
        <main className="main-interface-content main-interface-content-card">
          <MainContent
            view={activeView}
            selectedZone={selectedZone}
            onZoneSelected={handleZoneSelected}
            onGoToDashboard={onGoToDashboard}
            onFocusFacilityOnMap={onFocusFacilityOnMap}
            facilityToFocusOnMap={facilityToFocusOnMap}
            onClearFocusFacility={() => setFacilityToFocusOnMap(null)}
            onGoToHeatMap={() => setViewAndClose('heatmap')}
            showTutorial={showTutorial}
            setShowTutorial={setShowTutorial}
            heatmapIotLayer={heatmapIotLayer}
            heatmapIotLayerKey={heatmapIotLayerKey}
          />
        </main>
      </div>

      {/* Mobile: header bar (logo + burger) */}
      <header className="main-interface-mobile-header">
        <Link to="/" className="main-interface-mobile-logo" aria-label="BanasUno home">
          <img src="/BanasUno Text Colored.png" alt="BanasUno" className="main-interface-mobile-logo-image" />
        </Link>
        <div className="main-interface-mobile-actions">
          <button
            type="button"
            className={`main-interface-burger ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="main-interface-burger-line" />
            <span className="main-interface-burger-line" />
            <span className="main-interface-burger-line" />
          </button>
        </div>
      </header>

      {/* Mobile: overlay nav (same links as sidebar) */}
      <div
        className={`main-interface-mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className="main-interface-mobile-nav">
          <button
            type="button"
            className={`main-interface-mobile-nav-item ${activeView === 'heatmap' ? 'active' : ''}`}
            onClick={() => setViewAndClose('heatmap')}
          >
            Heat Map
          </button>
          <button
            type="button"
            className="main-interface-mobile-nav-item"
            onClick={() => setViewAndClose('community-sensors')}
          >
            Community Sensors
          </button>
          <button
            type="button"
            className={`main-interface-mobile-nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setViewAndClose('dashboard')}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`main-interface-mobile-nav-item ${activeView === 'heat-advisory' ? 'active' : ''}`}
            onClick={() => setViewAndClose('heat-advisory')}
          >
            Heat Advisory
          </button>
          <Link to="/about" className="main-interface-mobile-nav-item main-interface-mobile-nav-link" onClick={closeMobileMenu}>
            About Us
          </Link>
          <button
            type="button"
            className="main-interface-mobile-nav-item main-interface-mobile-tutorial-btn"
            onClick={() => { setActiveView('heatmap'); setShowTutorial(true); closeMobileMenu(); }}
          >
            Open Tutorial
          </button>
        </nav>
      </div>
      <div
        className={`main-interface-mobile-backdrop ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
        onKeyDown={(e) => e.key === 'Escape' && closeMobileMenu()}
        role="button"
        tabIndex={-1}
        aria-label="Close menu"
        aria-hidden={!isMobileMenuOpen}
      />
    </div>
  );
}

export default MainInterface;
