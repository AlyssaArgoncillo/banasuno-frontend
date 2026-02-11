import { useState } from 'react';
import '../styles/Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src="/BanasUno Text Colored.png" alt="BanasUno" className="logo-image" />
        </div>
        
        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="#about" className="nav-link" onClick={closeMenu}>About Us</a>
          <a href="#features" className="nav-link" onClick={closeMenu}>Features</a>
          <a href="#data" className="nav-link" onClick={closeMenu}>Data</a>
          <button className="cta-button mobile-cta" onClick={closeMenu}>
            Access BanasUno→
          </button>
        </nav>
        
        <button className="cta-button desktop-cta">
          Access BanasUno→
        </button>

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
