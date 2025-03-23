import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import Link
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    // Set active link based on current pathname when route changes
    setActiveLink(location.pathname);

    const mode = document.body;
    if (mode.classList.contains('menu-active')) {
      mode.classList.remove('menu-active');
    }
  }, [location.pathname]);

  const toggleMenu = () => {
    document.body.classList.toggle('menu-active');
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <header className={`${styles.header} ${lightMode ? styles.lightMode : ''}`}>
      <div className={styles.logo}>
        <img src="/sayan_docs/potrait.jpg" alt="Logo" />
      </div>

      <nav className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
        <Link
          to="/"
          className={activeLink === '/' ? styles.active : ''}
          onClick={() => handleLinkClick('/')}
        >
          Launchpad
        </Link>
        <Link
          to="/essence"
          className={activeLink === '/essence' ? styles.active : ''}
          onClick={() => handleLinkClick('/essence')}
        >
          Essence
        </Link>
        <Link
          to="/accademia"
          className={activeLink === '/accademia' ? styles.active : ''}
          onClick={() => handleLinkClick('/accademia')}
        >
          Accademia
        </Link>
        <Link
          to="/expertise"
          className={activeLink === '/expertise' ? styles.active : ''}
          onClick={() => handleLinkClick('/expertise')}
        >
          Expertise
        </Link>
        <Link
          to="/craft"
          className={activeLink === '/craft' ? styles.active : ''}
          onClick={() => handleLinkClick('/craft')}
        >
          Craft
        </Link>
        <Link
          to="/verified"
          className={activeLink === '/verified' ? styles.active : ''}
          onClick={() => handleLinkClick('/verified')}
        >
          Verified
        </Link>
        <Link
          to="/onePager"
          className={activeLink === '/onePager' ? styles.active : ''}
          onClick={() => handleLinkClick('/onePager')}
        >
          One-Pager
        </Link>
        <Link
          to="/linkUp"
          className={activeLink === '/linkUp' ? styles.active : ''}
          onClick={() => handleLinkClick('/linkUp')}
        >
          LinkUp
        </Link>
      </nav>

      {/* Hamburger Menu */}
      <div
        className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
        onClick={toggleMenu}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
  );
};

export default Header;
