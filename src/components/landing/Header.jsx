import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

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
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/BanasUno Text Colored.png" alt="BanasUno" className="logo-image" />
        </Link>

        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/about" className="nav-link" onClick={closeMenu}>About Us</Link>
          <a href="/#solution" className="nav-link" onClick={closeMenu}>Features</a>
          <a href="/#data-sources" className="nav-link" onClick={closeMenu}>Data</a>
          <Link to="/home" className="cta-button mobile-cta" onClick={closeMenu}>
            Access BanasUno→
          </Link>
        </nav>

        <Link to="/home" className="cta-button desktop-cta">
          Access BanasUno→
        </Link>

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
