// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Handle theme toggling
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${darkMode ? 'dark' : 'light'}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <div className="logo-container">
              <span className="logo-icon">🪴</span>
              <span className="logo-text">أفنان</span>
            </div>
          </Link>
        </div>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li className={activeTab === 'home' ? 'active' : ''}>
              <Link to="/" onClick={() => setActiveTab('home')}>
                <span className="nav-icon">🏡</span>
                <span className="nav-text">Home</span>
              </Link>
            </li>
            <li className={activeTab === 'community' ? 'active' : ''}>
              <Link to="/community" onClick={() => setActiveTab('community')}>
                <span className="nav-icon">👥</span>
                <span className="nav-text">Community</span>
              </Link>
            </li>
            <li className={activeTab === 'education' ? 'active' : ''}>
              <Link to="/education" onClick={() => setActiveTab('education')}>
                <span className="nav-icon">📚</span>
                <span className="nav-text">Education</span>
              </Link>
            </li>
            <li className={activeTab === 'market' ? 'active' : ''}>
              <Link to="/market" onClick={() => setActiveTab('market')}>
                <span className="nav-icon">🛒</span>
                <span className="nav-text">Market</span>
              </Link>
            </li>
            <li className={activeTab === 'tracker' ? 'active' : ''}>
              <Link to="/tracker" onClick={() => setActiveTab('tracker')}>
                <span className="nav-icon">📊</span>
                <span className="nav-text">Tracker</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-actions">
          <div className="search-container">
            <input type="text" placeholder="Search plants..." className="search-input" />
            <button className="search-button">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="search-icon">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            </button>
          </div>
          
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          <div className="user-actions">
            <button className="cart-button">
              <span className="cart-icon">🛒</span>
              <span className="cart-count">3</span>
            </button>
            <button className="profile-button">👤</button>
          </div>

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      
      {menuOpen && (
        <div className="mobile-menu">
          <ul>
            <li><Link to="/" onClick={() => {setActiveTab('home'); setMenuOpen(false)}}>Home</Link></li>
            <li><Link to="/community" onClick={() => {setActiveTab('community'); setMenuOpen(false)}}>Community</Link></li>
            <li><Link to="/education" onClick={() => {setActiveTab('education'); setMenuOpen(false)}}>Education</Link></li>
            <li><Link to="/market" onClick={() => {setActiveTab('market'); setMenuOpen(false)}}>Market</Link></li>
            <li><Link to="/tracker" onClick={() => {setActiveTab('tracker'); setMenuOpen(false)}}>Tracker</Link></li>
          </ul>
          <div className="mobile-search">
            <input type="text" placeholder="Search plants..." />
            <button>Search</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;