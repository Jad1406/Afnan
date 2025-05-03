// HeroSection.jsx with Care Guides Modal
import React, { useEffect, useRef, useState } from 'react';
import './HeroSection.css';
import CareGuidesModal from '../CareGuidesModal/CareGuidesModal';

const HeroSection = () => {
  const heroRef = useRef(null);
  const plantRef = useRef(null);
  const textRef = useRef(null);
  const [showCareGuidesModal, setShowCareGuidesModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const heroHeight = heroRef.current.offsetHeight;
      const scrollPercent = Math.min(scrollY / heroHeight, 1);
      
      // Parallax effect for plant image
      if (plantRef.current) {
        plantRef.current.style.transform = `translateY(${scrollPercent * 50}px) rotate(${scrollPercent * 5}deg)`;
        plantRef.current.style.opacity = 1 - scrollPercent * 0.8;
      }
      
      // Parallax effect for text
      if (textRef.current) {
        textRef.current.style.transform = `translateY(${scrollPercent * 70}px)`;
        textRef.current.style.opacity = 1 - scrollPercent;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Plant care facts for the animated ticker
  const plantFacts = [
    "Most houseplants grow faster in the spring and summer",
    "Monstera leaves develop holes as they mature",
    "Snake plants release oxygen at night",
    "Some plants can purify the air in your home",
    "Talking to your plants may actually help them grow",
    "Overwatering is the most common cause of plant death",
    "Plants can recognize their relatives"
  ];

  // Toggle function for Care Guides modal
  const toggleCareGuidesModal = () => {
    setShowCareGuidesModal(!showCareGuidesModal);
  };

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-bg-pattern"></div>
      
      <div className="hero-content">
        <div className="hero-text" ref={textRef}>
          <h1 className="hero-title">
            <span className="title-accent">Afnan</span> 
            <span className="title-separator">-</span> 
            <span className="title-main">Where your greenery takes root.</span>
          </h1>
          
          <p className="hero-description">
            Afnan (أفنان) is an elegant Arabic name that means "branches." It symbolizes growth, expansion, and connections and also reflects the richness of nature, referring to trees at their peak of growth and fruitfulness.
          </p>
          
          <div className="hero-cta">
            <button className="cta-button primary">
              Explore Plants
              <span className="cta-icon">🌿</span>
            </button>
            <button 
              className="cta-button secondary"
              onClick={toggleCareGuidesModal}
            >
              Care Guides
              <span className="cta-icon">📚</span>
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              
            </div>
          </div>
        </div>
        
        <div className="hero-image-container">
          <div className="hero-image" ref={plantRef}>
            <div className="image-glow"></div>
            <img src="/plant-image.png" alt="Monstera plant" className="main-plant" />
          </div>
         
        </div>
      </div>
      
      <div className="hero-ticker">
        <div className="ticker-track">
          {[...plantFacts, ...plantFacts].map((fact, index) => (
            <div className="ticker-item" key={index}>
              <span className="ticker-icon">🌱</span>
              <span className="ticker-text">{fact}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="hero-scroll-indicator">
        <span className="scroll-text">Scroll to discover</span>
        <span className="scroll-icon">↓</span>
      </div>

      {/* Care Guides Modal */}
      <CareGuidesModal 
        isOpen={showCareGuidesModal} 
        onClose={() => setShowCareGuidesModal(false)} 
      />
    </section>
  );
};

export default HeroSection;
