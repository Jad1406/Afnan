// Home.jsx
import React from 'react';
import HeroSection from '../components/HeroSection/HeroSection';
import FeaturedPlants from '../components/FeaturedPlants/FeaturedPlants';
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer';
import PlantChatbot from '../components/PlantChatbot/PlantChatbot'



const Home = () => {
  return (
    <main className="home-page">
      <HeroSection />
      <FeaturedPlants />
      <Navbar />
      <Footer />
      <PlantChatbot/>
      {/* You can add more sections here as needed */}
    </main>
  );
};

export default Home;