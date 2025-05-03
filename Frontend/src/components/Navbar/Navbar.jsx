import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useCart } from '../../CartContext';
import { useWishlist } from '../../WishlistContext';

const Navbar = ({ darkMode, toggleDarkMode, isAuthenticated, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const { cartItemCount, toggleCart } = useCart();
  const { wishlistCount, toggleWishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    if (onLogout) onLogout();
    else {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${darkMode ? 'dark' : 'light'}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <div className="logo-container">
              <img src="/images/plantLogo.png" alt="Afnan Logo" className="logo-image" />
              <span className="logo-text">أفنان</span>
            </div>
          </Link>
        </div>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li className={activeTab === 'home' ? 'active' : ''}>
              <Link to="/" onClick={() => setActiveTab('home')}>
                <img src="/images/home_icon.png" alt="Home" className="icon-img" />
                <span className="nav-text">Home</span>
              </Link>
            </li>
            <li className={activeTab === 'community' ? 'active' : ''}>
              <Link to="/community" onClick={() => setActiveTab('community')}>
                <img src="/images/community_icon.png" alt="Community" className="icon-img" />
                <span className="nav-text">Community</span>
              </Link>
            </li>
            <li className={activeTab === 'education' ? 'active' : ''}>
              <Link to="/education" onClick={() => setActiveTab('education')}>
                <img src="/images/education_icon.png" alt="Education" className="icon-img" />
                <span className="nav-text">Education</span>
              </Link>
            </li>
            <li className={activeTab === 'market' ? 'active' : ''}>
              <Link to="/market" onClick={() => setActiveTab('market')}>
                <img src="/images/market_icon.png" alt="Market" className="icon-img" />
                <span className="nav-text">Market</span>
              </Link>
            </li>
            <li className={activeTab === 'tracker' ? 'active' : ''}>
              <Link to="/tracker" onClick={() => setActiveTab('tracker')}>
                <img src="/images/tracker_icon.png" alt="Tracker" className="icon-img" />
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
            <img 
              src={darkMode ? "/images/sun_icon.png" : "/images/moon_icon.png"} 
              alt="Theme Toggle" 
              className="icon-img" 
            />
          </button>

          <div className="user-actions">
            <button className="wishlist-button" onClick={toggleWishlist}>
              <img src="/images/wishlist_icon.png" alt="Wishlist" className="icon-img" />
              {wishlistCount > 0 && (
                <span className="wishlist-count">{wishlistCount}</span>
              )}
            </button>

            <button className="cart-button" onClick={toggleCart}>
              <img src="/images/cart_icon.png" alt="Cart" className="icon-img" />
              <span className="cart-count">{cartItemCount}</span>
            </button>

            <div className="profile-menu-container">
              <button 
                className="profile-button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <img 
                  src={isAuthenticated ? "/images/profile_icon.png" : "/images/login_icon.png"} 
                  alt="Profile" 
                  className="icon-img" 
                />
              </button>

              {profileMenuOpen && (
                <div className="profile-dropdown">
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" className="profile-menu-item">My Profile</Link>
                      <Link to="/orders" className="profile-menu-item">My Orders</Link>
                      <Link to="/settings" className="profile-menu-item">Settings</Link>
                      <div className="profile-menu-divider"></div>
                      <button className="profile-menu-item logout-button" onClick={handleLogout}>
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="profile-menu-item">Login</Link>
                      <Link to="/signup" className="profile-menu-item">Sign Up</Link>
                    </>
                  )}
                </div>
              )}
            </div>
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
            {!isAuthenticated && (
              <>
                <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
                <li><Link to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link></li>
              </>
            )}
            {isAuthenticated && (
              <li><button className="mobile-logout-btn" onClick={handleLogout}>Logout</button></li>
            )}
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
