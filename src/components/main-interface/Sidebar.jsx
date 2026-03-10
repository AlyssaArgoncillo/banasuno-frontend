import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ico } from '../ui/Icons.jsx';
import '../../styles/MainInterface.css';

const ChevronDown = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="main-interface-chevron" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
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

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

function Sidebar({ activeView, onSelectView, onSelectCommunitySensors, onOpenTutorial }) {
  const [homeOpen, setHomeOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(true);
  const [helpOpen, setHelpOpen] = useState(true);

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
              className={`main-interface-nav-item main-interface-nav-item--iot ${activeView === 'community-sensors' ? 'active' : ''}`}
              onClick={() => (typeof onSelectCommunitySensors === 'function' ? onSelectCommunitySensors() : onSelectView('heatmap'))}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="2" />
                <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14" />
              </svg>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%' }}>
                <span>Community Sensors</span>
                <span className="main-interface-nav-pill">Preview</span>
              </span>
            </button>
            <button
              type="button"
              className={`main-interface-nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => onSelectView('dashboard')}
            >
              <ChartIcon />
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              className={`main-interface-nav-item ${activeView === 'heat-advisory' ? 'active' : ''}`}
              onClick={() => onSelectView('heat-advisory')}
            >
              <AlertIcon />
              <span>Heat Advisory</span>
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

        <div className="main-interface-nav-separator" />

        <button
          type="button"
          className="main-interface-nav-section"
          onClick={() => setHelpOpen(!helpOpen)}
          aria-expanded={helpOpen}
        >
          <span>Help</span>
          <ChevronDown open={helpOpen} />
        </button>
        {helpOpen && (
          <div className="main-interface-nav-group">
            <button
              type="button"
              className="main-interface-tutorial-btn"
              onClick={onOpenTutorial}
              aria-label="Open tutorial"
            >
              <Ico name="HelpCircle" size={20} className="main-interface-tutorial-btn-icon" />
              <span>Open Tutorial</span>
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
