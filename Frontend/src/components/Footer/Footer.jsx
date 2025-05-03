// Footer.jsx with Modals for Terms, Accessibility, and FAQs
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';

// Instead of importing the image, reference it directly from the public folder
// This is the key change to fix the error

const Footer = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  // State for modals
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  // Handle navigation to ensure proper routing
  const handleNavigation = (path, e) => {
    e.preventDefault();
    navigate(path);
  };

  // Modal open/close handlers
  const openAboutModal = (e) => {
    e.preventDefault();
    setShowAboutModal(true);
  };

  const closeAboutModal = () => {
    setShowAboutModal(false);
  };

  const openTermsModal = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  const openPrivacyModal = (e) => {
    e.preventDefault();
    setShowPrivacyModal(true);
  };

  const closePrivacyModal = () => {
    setShowPrivacyModal(false);
  };

  const openFaqModal = (e) => {
    e.preventDefault();
    setShowFaqModal(true);
  };

  const closeFaqModal = () => {
    setShowFaqModal(false);
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

  // Terms of Service Modal Component
  const TermsModal = () => (
    <div className="modal-overlay" onClick={closeTermsModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeTermsModal}>×</button>
        <h2>Terms of Service</h2>
        <div className="modal-body">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using Afnan, you agree to be bound by these Terms of Service, all applicable laws and regulations, 
            and agree that you are responsible for compliance with any applicable local laws.
          </p>
          
          <h3>2. Use License</h3>
          <p>
            Permission is granted to temporarily use Afnan for personal, non-commercial use only. This is the grant of a license, 
            not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on Afnan</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
          
          <h3>3. User Content</h3>
          <p>
            Users may be able to post content, including photos, reviews, and comments. By submitting content to Afnan, you grant 
            us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute your 
            user content across our platform and promotional materials.
          </p>
          
          <h3>4. Account Responsibilities</h3>
          <p>
            If you create an account on Afnan, you are responsible for maintaining the security of your account and for any activities 
            that occur under your account. You must immediately notify Afnan of any unauthorized use of your account.
          </p>
          
          <h3>5. Limitation of Liability</h3>
          <p>
            Afnan shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any 
            way connected with the use of our services, whether based on contract, tort, strict liability, or otherwise.
          </p>
          
          <h3>6. Changes to Terms</h3>
          <p>
            Afnan reserves the right to revise these terms of service at any time without notice. By using this website, you are agreeing 
            to be bound by the current version of these Terms of Service.
          </p>
          
          <h3>7. Contact</h3>
          <p>
            If you have any questions about these Terms, please contact us at <strong>contact-us@afnan.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );

  // Privacy Policy Modal Component
  const PrivacyModal = () => (
    <div className="modal-overlay" onClick={closePrivacyModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closePrivacyModal}>×</button>
        <h2>Privacy Policy</h2>
        <div className="modal-body">
          <h3>Information We Collect</h3>
          <p>
            At Afnan, we collect information you provide directly to us when you create an account, update your profile, 
            use interactive features, participate in contests, promotions, surveys, request customer support, or otherwise 
            communicate with us.
          </p>
          
          <h3>How We Use Your Information</h3>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Communicate with you about products, services, offers, promotions, and events</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
          </ul>
          
          <h3>Sharing of Information</h3>
          <p>
            We may share information about you as follows or as otherwise described in this Privacy Policy:
          </p>
          <ul>
            <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
            <li>In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process</li>
            <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of Afnan or others</li>
          </ul>
          
          <h3>Data Security</h3>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, 
            disclosure, alteration, and destruction.
          </p>
          
          <h3>Your Rights</h3>
          <p>
            You may update, correct, or delete your account information at any time by logging into your account. If you wish to delete 
            your account, please email us at <strong>contact-us@afnan.com</strong>, but note that we may retain certain information as 
            required by law or for legitimate business purposes.
          </p>
          
          <h3>Changes to This Policy</h3>
          <p>
            We may change this privacy policy from time to time. If we make changes, we will notify you by revising the date at the top 
            of the policy and, in some cases, provide you with additional notice.
          </p>
          
          <h3>Contact Us</h3>
          <p>
            If you have any questions about this privacy policy, please contact us at <strong>contact-us@afnan.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );

  // FAQ Modal Component
  const FaqModal = () => (
    <div className="modal-overlay" onClick={closeFaqModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeFaqModal}>×</button>
        <h2>Frequently Asked Questions</h2>
        <div className="modal-body faq-content">
          <div className="faq-item">
            <h3>What is Afnan?</h3>
            <p>
              Afnan is a comprehensive platform for plant enthusiasts that provides educational resources, 
              a marketplace for plants and gardening tools, a plant care tracker, and a community space to connect 
              with other plant lovers.
            </p>
          </div>
          
          <div className="faq-item">
            <h3>Do I need to create an account?</h3>
            <p>
              While some features are available without an account, creating an account allows you to track your plants, 
              save favorites, participate in the community, and make purchases in the marketplace.
            </p>
          </div>
          
          <div className="faq-item">
            <h3>How does the Plant Tracker work?</h3>
            <p>
              The Plant Tracker allows you to maintain a digital record of your plants including watering schedules, 
              fertilization dates, growth progress, and health status. You can set reminders and track the care history 
              of each of your plants.
            </p>
          </div>
          
          <div className="faq-item">
            <h3>How do I identify my plant?</h3>
            <p>
              You can use our plant identification feature by uploading a clear photo of your plant. Our system will 
              analyze the image and provide you with the most likely plant identification along with care information.
            </p>
          </div>
          
          <div className="faq-item">
            <h3>How is shipping handled for marketplace purchases?</h3>
            <p>
              Plants and products are carefully packaged to ensure they arrive in perfect condition. Shipping times and 
              costs vary depending on location. Orders over $50 qualify for free shipping within the continental United States.
            </p>
          </div>
          
          <div className="faq-item">
            <h3>What if my plant arrives damaged?</h3>
            <p>
              We have a 14-day guarantee on all plants. If your plant arrives damaged or dies within 14 days of delivery, 
              please contact us with photos of the plant, and we'll provide a replacement or refund.
            </p>
          </div>
          
          <div className="faq-item">
            <h3>Can I sell my own plants on Afnan?</h3>
            <p>
              Yes! Approved sellers can list their plants and gardening supplies on our marketplace. To become a seller, 
              you'll need to complete our seller application process to ensure quality standards.
            </p>
          </div>
          
          <div className="faq-item">
            <h3>How can I participate in the community?</h3>
            <p>
              You can join discussions, share photos of your plants, write blog posts, ask questions, and offer advice 
              to other members. The more you engage, the more you'll get out of the Afnan community!
            </p>
          </div>
          
          <div className="faq-item">
            <h3>I have a question that's not answered here. How can I get help?</h3>
            <p>
              For any other questions, please reach out to our team at <strong>contact-us@afnan.com</strong> or call us 
              at <strong>+961 81 796 460</strong> during our business hours (Monday-Friday, 9AM-5PM).
            </p>
          </div>
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
              {/* Fix: Use public folder path for the image instead of import */}
              <img src="/images/plantLogo.png" alt="Afnan Logo" className="logo-image" />
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
              <li><a href="#" onClick={openFaqModal}>FAQs</a></li>
              <li><Link to="/plant-care" onClick={(e) => handleNavigation('/plant-care', e)}>Plant Care Guides</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h4>About</h4>
            <ul>
              <li><a href="#" onClick={openAboutModal}>Our Story</a></li>
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
              <p><strong>Email:</strong> contact-us@afnan.com</p>
              <p><strong>Phone:</strong> +961 81 796 460</p>
              <p><strong>Hours:</strong> Mon-Fri: 9AM-5PM</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; {currentYear} Afnan. All rights reserved.</p>
          </div>
          <div className="footer-bottom-right">
            <a href="#" onClick={openTermsModal}>Terms of Service</a>
            <a href="#" onClick={openPrivacyModal}>Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* Render modals when their respective state is true */}
      {showAboutModal && <AboutModal />}
      {showTermsModal && <TermsModal />}
      {showPrivacyModal && <PrivacyModal />}
      {showFaqModal && <FaqModal />}
    </footer>
  );
};

export default Footer;
