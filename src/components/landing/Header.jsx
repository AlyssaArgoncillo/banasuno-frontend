import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigationLoader } from '../../contexts/NavigationContext';
import '../../styles/Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { navigateWithLoader } = useNavigationLoader();
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAccessBanasUno = (e) => {
    closeMenu();
    navigateWithLoader('/home?view=heatmap')(e);
  };

  const handleAboutSectionClick = (e, hash) => {
    e.preventDefault();
    closeMenu();
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.location.href = `/about${hash}`;
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/BanasUno Text Colored.png" alt="BanasUno" className="logo-image" />
        </Link>

        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {isAboutPage ? (
            <>
              <a href="#sdgs" className="nav-link" onClick={(e) => handleAboutSectionClick(e, '#sdgs')}>SDGs</a>
              <a href="#objectives" className="nav-link" onClick={(e) => handleAboutSectionClick(e, '#objectives')}>Objectives</a>
              <a href="#how-it-works" className="nav-link" onClick={(e) => handleAboutSectionClick(e, '#how-it-works')}>How it Works</a>
              <a href="/home?view=heatmap" className="cta-button mobile-cta" onClick={handleAccessBanasUno}>
                Access BanasUno→
              </a>
            </>
          ) : (
            <>
              <Link to="/about" className="nav-link" onClick={closeMenu}>About Us</Link>
              <a href="/#solution" className="nav-link" onClick={closeMenu}>Features</a>
              <a href="/#data-sources" className="nav-link" onClick={closeMenu}>Data</a>
              <a href="/home?view=heatmap" className="cta-button mobile-cta" onClick={handleAccessBanasUno}>
                Access BanasUno→
              </a>
            </>
          )}
        </nav>

        <a href="/home?view=heatmap" className="cta-button desktop-cta" onClick={navigateWithLoader('/home?view=heatmap')}>
          Access BanasUno→
        </a>

        <button
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
