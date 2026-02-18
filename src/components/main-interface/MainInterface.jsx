import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import '../../styles/MainInterface.css';

function MainInterface() {
  const [activeView, setActiveView] = useState('heatmap');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const setViewAndClose = (view) => {
    setActiveView(view);
    closeMobileMenu();
  };

  return (
    <div className="main-interface">
      <Sidebar activeView={activeView} onSelectView={setActiveView} />

      <div className="main-interface-body">
        <main className="main-interface-content main-interface-content-card">
          <MainContent view={activeView} />
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
            className={`main-interface-mobile-nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setViewAndClose('dashboard')}
          >
            Dashboard
          </button>
          <Link to="/about" className="main-interface-mobile-nav-item main-interface-mobile-nav-link" onClick={closeMobileMenu}>
            About Us
          </Link>
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
