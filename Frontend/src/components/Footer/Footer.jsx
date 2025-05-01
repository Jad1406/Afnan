// Footer.jsx with New Logo
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';
// Import the logo image - you'll need to save the image to your assets folder
// Assuming you save it as plantLogo.png in the assets/images directory
import plantLogo from '../../assets/images/plantLogo.png';

const Footer = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Handle navigation to ensure proper routing
  const handleNavigation = (path, e) => {
    e.preventDefault();
    navigate(path);
  };

  // Open the About modal
  const openAboutModal = (e) => {
    e.preventDefault();
    setShowAboutModal(true);
  };

  // Close the About modal
  const closeAboutModal = () => {
    setShowAboutModal(false);
  };

  // About Modal Component
  const AboutModal = () => (
    <div className="modal-overlay" onClick={closeAboutModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeAboutModal}>×</button>
        <h2>Our Story</h2>
        <div className="modal-body">
          <p>
            <strong>Afnan (أفنان)</strong> was born from the shared passion of four students at the 
            Lebanese American University (LAU), brought together by our love for nature and our drive 
            to create something meaningful through software engineering.
          </p>
          <p>
            As plant enthusiasts and tech dreamers, we envisioned a space where anyone — whether a 
            beginner or an expert — could find the inspiration, tools, and community to nurture 
            their own little corner of green.
          </p>
          <p>
            Balancing our studies with late-night brainstorming sessions, we poured our hearts into 
            building a platform that not only simplifies plant care but also brings people closer to nature.
          </p>
          <p>
            At Afnan, we believe that small steps — like planting a seed — can lead to beautiful, 
            lasting change. 🌱
          </p>
          <p>
            We are proud to invite you to grow with us.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <footer className={`footer ${darkMode ? 'dark' : 'light'}`}>
      <div className="footer-content container">
        <div className="footer-top">
          <div className="footer-logo">
            <div className="logo-container">
              <img src={plantLogo} alt="Afnan Logo" className="logo-image" />
              <span className="logo-text">أفنان</span>
            </div>
          </div>
        </div>
        
        <div className="footer-links">
          <div className="footer-links-column">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/" onClick={(e) => handleNavigation('/', e)}>Home</Link></li>
              <li><Link to="/community" onClick={(e) => handleNavigation('/community', e)}>Community</Link></li>
              <li><Link to="/education" onClick={(e) => handleNavigation('/education', e)}>Education</Link></li>
              <li><Link to="/market" onClick={(e) => handleNavigation('/market', e)}>Market</Link></li>
              <li><Link to="/tracker" onClick={(e) => handleNavigation('/tracker', e)}>Plant Tracker</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h4>Help</h4>
            <ul>
              <li><Link to="/faq" onClick={(e) => handleNavigation('/faq', e)}>FAQs</Link></li>
              <li><Link to="/shipping" onClick={(e) => handleNavigation('/shipping', e)}>Shipping Information</Link></li>
              <li><Link to="/returns" onClick={(e) => handleNavigation('/returns', e)}>Returns & Refunds</Link></li>
              <li><Link to="/plant-care" onClick={(e) => handleNavigation('/plant-care', e)}>Plant Care Guides</Link></li>
              <li><Link to="/contact" onClick={(e) => handleNavigation('/contact', e)}>Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h4>About</h4>
            <ul>
              <li><a href="#" onClick={openAboutModal}>Our Story</a></li>
              <li><Link to="/sustainability" onClick={(e) => handleNavigation('/sustainability', e)}>Sustainability</Link></li>
              <li><Link to="/blog" onClick={(e) => handleNavigation('/blog', e)}>Blog</Link></li>
              <li><Link to="/press" onClick={(e) => handleNavigation('/press', e)}>Press</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <span className="social-icon">📷</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <span className="social-icon">👥</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <span className="social-icon">🐦</span>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                <span className="social-icon">📌</span>
              </a>
            </div>
            <div className="contact-info">
              <p><strong>Email:</strong> hello@afnan.com</p>
              <p><strong>Phone:</strong> +1 (888) 123-4567</p>
              <p><strong>Hours:</strong> Mon-Fri: 9AM-5PM</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; {currentYear} Afnan. All rights reserved.</p>
          </div>
          <div className="footer-bottom-right">
            <Link to="/terms" onClick={(e) => handleNavigation('/terms', e)}>Terms of Service</Link>
            <Link to="/privacy" onClick={(e) => handleNavigation('/privacy', e)}>Privacy Policy</Link>
            <Link to="/accessibility" onClick={(e) => handleNavigation('/accessibility', e)}>Accessibility</Link>
          </div>
        </div>
      </div>

      {/* Render the About modal if showAboutModal is true */}
      {showAboutModal && <AboutModal />}
    </footer>
  );
};

export default Footer;
