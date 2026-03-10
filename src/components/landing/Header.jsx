import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigationLoader } from '../../contexts/NavigationContext';
import '../../styles/Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { navigateWithLoader } = useNavigationLoader();
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) setOpenDropdown(null);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleAccessBanasUno = (e) => {
    closeMenu();
    navigateWithLoader('/home?view=heatmap')(e);
  };

  const handleContactClick = (e) => {
    closeMenu();
    if (isAboutPage) {
      e.preventDefault();
      const el = document.querySelector('#contact');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.location.href = '/about#contact';
    } else {
      navigateWithLoader('/about#contact')(e);
    }
  };

  const handleSectionClick = (e, path) => {
    closeMenu();
    if (path === '/about' || path.startsWith('/about#')) {
      const hash = path.includes('#') ? path.slice(path.indexOf('#')) : null;
      if (isAboutPage) {
        e.preventDefault();
        if (hash) {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        navigateWithLoader(path)(e);
      }
    } else {
      navigateWithLoader(path)(e);
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const aboutDropdownLinks = [
    { label: 'Purpose', path: '/about#purpose' },
    { label: 'How It Works', path: '/about#how-it-works' },
    { label: 'Strategic Goals (SDGs)', path: '/about#sdgs' },
  ];

  /* Dashboard sections – match Sidebar (MainInterface): Heat Map, Dashboard, Heat Advisory */
  const dashboardDropdownLinks = [
    { label: 'Heat Map', path: '/home?view=heatmap' },
    { label: 'Dashboard', path: '/home?view=dashboard' },
    { label: 'Heat Advisory', path: '/home?view=heat-advisory' },
  ];

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/BanasUno Text Colored.png" alt="BanasUno" className="logo-image" />
        </Link>

        <nav ref={dropdownRef} className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {/* About Us with dropdown */}
          <div
            className={`nav-item-with-dropdown${openDropdown === 'about' ? ' open' : ''}`}
            onMouseEnter={() => setOpenDropdown('about')}
            onMouseLeave={() => setOpenDropdown((prev) => (prev === 'about' ? null : prev))}
          >
            <div className="nav-item-row">
              <Link to="/about" className="nav-link" onClick={closeMenu}>
                About Us
              </Link>
              <button
                type="button"
                className="nav-dropdown-trigger"
                aria-expanded={openDropdown === 'about'}
                aria-haspopup="true"
                aria-label="About Us menu"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleDropdown('about'); }}
              >
                <span className="nav-dropdown-chevron" aria-hidden>▼</span>
              </button>
            </div>
            <div className={`nav-dropdown ${openDropdown === 'about' ? ' open' : ''}`}>
              <ul className="nav-dropdown-list">
                {aboutDropdownLinks.map((item) => (
                  <li key={item.label + item.path}>
                    <a
                      href={item.path}
                      className="nav-dropdown-link"
                      onClick={(e) => handleSectionClick(e, item.path)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tools (dashboard) with dropdown */}
          <div
            className={`nav-item-with-dropdown${openDropdown === 'dashboard' ? ' open' : ''}`}
            onMouseEnter={() => setOpenDropdown('dashboard')}
            onMouseLeave={() => setOpenDropdown((prev) => (prev === 'dashboard' ? null : prev))}
          >
            <div className="nav-item-row">
              <Link to="/home" className="nav-link" onClick={closeMenu}>
                Tools
              </Link>
              <button
                type="button"
                className="nav-dropdown-trigger"
                aria-expanded={openDropdown === 'dashboard'}
                aria-haspopup="true"
                aria-label="Tools menu"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleDropdown('dashboard'); }}
              >
                <span className="nav-dropdown-chevron" aria-hidden>▼</span>
              </button>
            </div>
            <div className={`nav-dropdown ${openDropdown === 'dashboard' ? ' open' : ''}`}>
              <ul className="nav-dropdown-list">
                {dashboardDropdownLinks.map((item) => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      className="nav-dropdown-link"
                      onClick={(e) => { closeMenu(); navigateWithLoader(item.path)(e); }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact with dropdown */}
          <div
            className={`nav-item-with-dropdown${openDropdown === 'contact' ? ' open' : ''}`}
            onMouseEnter={() => setOpenDropdown('contact')}
            onMouseLeave={() => setOpenDropdown((prev) => (prev === 'contact' ? null : prev))}
          >
            <div className="nav-item-row">
              <a
                href={isAboutPage ? '#contact' : '/about#contact'}
                className="nav-link"
                onClick={handleContactClick}
              >
                Contact
              </a>
              <button
                type="button"
                className="nav-dropdown-trigger"
                aria-expanded={openDropdown === 'contact'}
                aria-haspopup="true"
                aria-label="Contact menu"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleDropdown('contact'); }}
              >
                <span className="nav-dropdown-chevron" aria-hidden>▼</span>
              </button>
            </div>
            <div className={`nav-dropdown ${openDropdown === 'contact' ? ' open' : ''}`}>
              <ul className="nav-dropdown-list">
                <li>
                  <a
                    href="/about#contact"
                    className="nav-dropdown-link"
                    onClick={(e) => handleContactClick(e)}
                  >
                    Contact Section
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@banasuno.example" className="nav-dropdown-link" onClick={closeMenu}>
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <a href="/home?view=heatmap" className="cta-button mobile-cta" onClick={handleAccessBanasUno}>
            Access BanasUno→
          </a>
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
