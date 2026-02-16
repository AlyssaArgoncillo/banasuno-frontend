import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/MainInterface.css';

const ChevronDown = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className="main-interface-chevron"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const GearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 14l4-4 4 4 4-4" />
    <path d="M7 17v-3m5 3v-6m5 6v-2" />
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4m0-4h.01" />
  </svg>
);

function Sidebar({ activeView, onSelectView }) {
  const [homeOpen, setHomeOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(true);

  return (
    <aside className="main-interface-sidebar">
      <Link to="/" className="main-interface-logo" aria-label="Back to home">
        <img src="/BanasUno Text Colored.png" alt="BanasUno" className="main-interface-logo-image" />
      </Link>

      <nav className="main-interface-nav">
        <button
          type="button"
          className="main-interface-nav-section"
          onClick={() => setHomeOpen(!homeOpen)}
          aria-expanded={homeOpen}
        >
          <span>Home</span>
          <ChevronDown open={homeOpen} />
        </button>
        {homeOpen && (
          <div className="main-interface-nav-group">
            <button
              type="button"
              className={`main-interface-nav-item ${activeView === 'heatmap' ? 'active' : ''}`}
              onClick={() => onSelectView('heatmap')}
            >
              <GearIcon />
              <span>Heat Map</span>
            </button>
            <button
              type="button"
              className={`main-interface-nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => onSelectView('dashboard')}
            >
              <ChartIcon />
              <span>Dashboard</span>
            </button>
          </div>
        )}

        <div className="main-interface-nav-separator" />

        <button
          type="button"
          className="main-interface-nav-section"
          onClick={() => setInfoOpen(!infoOpen)}
          aria-expanded={infoOpen}
        >
          <span>Info</span>
          <ChevronDown open={infoOpen} />
        </button>
        {infoOpen && (
          <div className="main-interface-nav-group">
            <Link to="/about" className="main-interface-nav-item main-interface-nav-link">
              <InfoIcon />
              <span>About Us</span>
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
