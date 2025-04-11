// FeaturedPlants.jsx
import React, { useState, useEffect, useRef } from 'react';
import './FeaturedPlants.css';

const FeaturedPlants = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const featuredRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Sample plant data
  const plants = [
    {
      id: 1,
      name: 'Monstera Deliciosa',
      category: 'indoor',
      price: 45.99,
      image: '/images/plant1.jpg',
      rating: 4.8,
      badge: 'Popular',
      tags: ['air purifying', 'low light']
    },
    {
      id: 2,
      name: 'Snake Plant',
      category: 'indoor',
      price: 29.99,
      image: '/images/plant2.jpg',
      rating: 4.9,
      badge: 'Best Seller',
      tags: ['air purifying', 'drought tolerant']
    },
    {
      id: 3,
      name: 'Fiddle Leaf Fig',
      category: 'indoor',
      price: 59.99,
      image: '/images/plant3.jpg',
      rating: 4.5,
      badge: null,
      tags: ['bright light', 'statement']
    },
    {
      id: 4,
      name: 'Lavender',
      category: 'outdoor',
      price: 19.99,
      image: '/images/plant4.jpg',
      rating: 4.7,
      badge: 'New',
      tags: ['fragrant', 'drought tolerant']
    },
    {
      id: 5,
      name: 'String of Pearls',
      category: 'hanging',
      price: 24.99,
      image: '/images/plant5.jpg',
      rating: 4.6,
      badge: null,
      tags: ['succulent', 'trailing']
    },
    {
      id: 6,
      name: 'ZZ Plant',
      category: 'indoor',
      price: 34.99,
      image: '/images/plant6.jpg',
      rating: 4.9,
      badge: 'Low Maintenance',
      tags: ['low light', 'drought tolerant']
    },
    {
      id: 7,
      name: 'Succulent Collection',
      category: 'succulent',
      price: 39.99,
      image: '/images/plant7.jpg',
      rating: 4.8,
      badge: 'Value Pack',
      tags: ['variety', 'drought tolerant']
    },
    {
      id: 8,
      name: 'Pothos',
      category: 'hanging',
      price: 22.99,
      image: '/images/plant8.jpg',
      rating: 4.7,
      badge: null,
      tags: ['air purifying', 'low light']
    },
  ];

  // Filter plants by category
  const filteredPlants = activeCategory === 'all' 
    ? plants 
    : plants.filter(plant => plant.category === activeCategory);

  // Intersection Observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (featuredRef.current) {
      observer.observe(featuredRef.current);
    }
    
    return () => {
      if (featuredRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <section className="featured-plants-section section" ref={featuredRef}>
      <div className="container">
        <div className={`section-header ${isVisible ? 'fade-in-up visible' : ''}`}>
          <h2 className="section-title">Featured Plants</h2>
          <p className="section-subtitle">
            Discover our selection of beautiful plants that will bring life to your space.
            We carefully select each plant for its beauty, health, and ease of care.
          </p>
          
          <div className="category-tabs">
            <button 
              className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Plants
            </button>
            <button 
              className={`category-tab ${activeCategory === 'indoor' ? 'active' : ''}`}
              onClick={() => setActiveCategory('indoor')}
            >
              Indoor
            </button>
            <button 
              className={`category-tab ${activeCategory === 'outdoor' ? 'active' : ''}`}
              onClick={() => setActiveCategory('outdoor')}
            >
              Outdoor
            </button>
            <button 
              className={`category-tab ${activeCategory === 'hanging' ? 'active' : ''}`}
              onClick={() => setActiveCategory('hanging')}
            >
              Hanging
            </button>
            <button 
              className={`category-tab ${activeCategory === 'succulent' ? 'active' : ''}`}
              onClick={() => setActiveCategory('succulent')}
            >
              Succulents
            </button>
          </div>
        </div>
        
        <div className={`plants-grid ${isVisible ? 'fade-in visible' : ''}`}>
          {filteredPlants.map((plant, index) => (
            <div 
              className="plant-card" 
              key={plant.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="plant-image-container">
                  {/* We're using a placeholder since actual images would need to be imported */}
                  <img 
                      src={plant.image} 
                      alt={plant.name} 
                      className="plant-image" 
                    />
                {plant.badge && (
                  <span className="plant-badge">{plant.badge}</span>
                )}
                <button className="quick-view-btn">Quick View</button>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
              <div className="plant-info">
                <h3 className="plant-name">{plant.name}</h3>
                
                <div className="plant-category">
                  <span className="category-icon">
                    {plant.category === 'indoor' ? '🏠' : 
                     plant.category === 'outdoor' ? '🌳' : 
                     plant.category === 'hanging' ?'🌵'
                     : '🌿'}
                  </span>
                  <span className="category-name">{plant.category.charAt(0).toUpperCase() + plant.category.slice(1)}</span>
                </div>
                
                <div className="plant-rating">
                  <div className="stars">
                    {'★'.repeat(Math.floor(plant.rating))}
                    {plant.rating % 1 !== 0 ? '⯨' : ''}
                    {'☆'.repeat(5 - Math.ceil(plant.rating))}
                  </div>
                  <span className="rating-value">{plant.rating}</span>
                </div>
                
                <div className="plant-tags">
                  {plant.tags.map((tag, idx) => (
                    <span className="plant-tag" key={idx}>{tag}</span>
                  ))}
                </div>
                
                <div className="plant-footer">
                  <span className="plant-price">${plant.price.toFixed(2)}</span>
                  <button className="wishlist-btn">♡</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`featured-cta ${isVisible ? 'fade-in-up visible' : ''}`}>
          <button className="btn btn-primary">View All Plants</button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPlants;