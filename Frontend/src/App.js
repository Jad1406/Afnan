// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HeroSection from './components/HeroSection/HeroSection';
import FeaturedPlants from './components/FeaturedPlants/FeaturedPlants';
import PlantChatbot from './components/PlantChatbot/PlantChatbot';
import './App.css';

// Import placeholder components for other tabs
import Community from './pages/Community';
import Education from './pages/Education';
import Market from './pages/Market';
import Tracker from './pages/Tracker';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for user preference in localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Check for system preference if no saved preference
    if (localStorage.getItem('darkMode') === null) {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
    } else {
      setDarkMode(savedDarkMode);
    }
  }, []);

  useEffect(() => {
    // Update body class when darkMode changes
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Save to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark' : 'light'}`}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <Routes>
          <Route path="/" element={
            <main className="home-page">
              <HeroSection />
              <FeaturedPlants />
              {/* Add more homepage sections here */}
            </main>
          } />
          <Route path="/community" element={<Community />} />
          <Route path="/education" element={<Education />} />
          <Route path="/market" element={<Market />} />
          <Route path="/tracker" element={<Tracker />} />
        </Routes>
        
        {/* Footer would go here */}
        
        {/* Chatbot component - available on all pages */}
        <PlantChatbot />
      </div>
    </Router>
  );
}

export default App;