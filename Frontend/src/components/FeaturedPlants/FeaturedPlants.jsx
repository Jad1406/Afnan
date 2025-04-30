// FeaturedPlants.jsx with Wishlist integration
import React, { useState, useEffect, useRef } from 'react';
import './FeaturedPlants.css';
import { useCart } from '../../CartContext';
import { useWishlist } from '../../WishlistContext'; // Import useWishlist
import ProductQuickView from '../ProductQuickView/ProductQuickView';

const FeaturedPlants = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const featuredRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useCart();
  
  // Get wishlist context
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  
  // State for quick view modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Sample plant data with descriptions added
  const plants = [
    {
      id: 1,
      name: 'Monstera Deliciosa',
      category: 'indoor',
      price: 45.99,
      image: '/images/plant1.jpg',
      rating: 4.8,
      badge: 'Popular',
      tags: ['air purifying', 'low light'],
      description: 'The Monstera Deliciosa, or Swiss Cheese Plant, is known for its stunning split leaves. This popular houseplant is easy to care for and makes a dramatic statement in any space with its large, glossy foliage.'
    },
    {
      id: 2,
      name: 'Snake Plant',
      category: 'indoor',
      price: 29.99,
      image: '/images/plant2.jpg',
      rating: 4.9,
      badge: 'Best Seller',
      tags: ['air purifying', 'drought tolerant'],
      description: 'One of the most carefree houseplants you can grow, the Snake Plant (Sansevieria) thrives on neglect. Its striking upright leaves with yellow edges purify air and can survive in low light conditions, making it perfect for beginners.'
    },
    {
      id: 3,
      name: 'Fiddle Leaf Fig',
      category: 'indoor',
      price: 59.99,
      image: '/images/plant3.jpg',
      rating: 4.5,
      badge: null,
      tags: ['bright light', 'statement'],
      description: 'The Fiddle Leaf Fig (Ficus lyrata) is famous for its large, violin-shaped leaves and elegant appearance. This stunning statement plant thrives in bright, indirect light and adds a touch of sophistication to any interior space.'
    },
    {
      id: 4,
      name: 'Lavender',
      category: 'outdoor',
      price: 19.99,
      image: '/images/plant4.jpg',
      rating: 4.7,
      badge: 'New',
      tags: ['fragrant', 'drought tolerant'],
      description: "Lavender is a versatile, aromatic herb beloved for its calming fragrance and beautiful purple blooms. Drought-tolerant and sun-loving, it's perfect for gardens, containers, and even indoors with sufficient light."
    },
    {
      id: 5,
      name: 'String of Pearls',
      category: 'hanging',
      price: 24.99,
      image: '/images/plant5.jpg',
      rating: 4.6,
      badge: null,
      tags: ['succulent', 'trailing'],
      description: 'The String of Pearls (Senecio rowleyanus) features unique round bead-like leaves that cascade down its stems, creating a stunning hanging display. This drought-tolerant succulent requires minimal water and makes a perfect hanging plant for any home.'
    },
    {
      id: 6,
      name: 'ZZ Plant',
      category: 'indoor',
      price: 34.99,
      image: '/images/plant6.jpg',
      rating: 4.9,
      badge: 'Low Maintenance',
      tags: ['low light', 'drought tolerant'],
      description: 'The ZZ Plant (Zamioculcas zamiifolia) is practically indestructible, thriving in low light and requiring minimal water. Its glossy, dark green leaves grow from thick rhizomes that store water, making it extremely drought-tolerant and perfect for beginners.'
    },
    {
      id: 7,
      name: 'Succulent Collection',
      category: 'succulent',
      price: 39.99,
      image: '/images/plant7.jpg',
      rating: 4.8,
      badge: 'Value Pack',
      tags: ['variety', 'drought tolerant'],
      description: 'Our Succulent Collection brings together a variety of stunning, drought-tolerant plants with fascinating shapes and colors. Perfect for busy plant lovers, these hardy plants require minimal watering and make beautiful additions to any home or office.'
    },
    {
      id: 8,
      name: 'Pothos',
      category: 'hanging',
      price: 22.99,
      image: '/images/plant8.jpg',
      rating: 4.7,
      badge: null,
      tags: ['air purifying', 'low light'],
      description: 'Pothos (Epipremnum aureum) is an incredibly adaptable trailing plant with heart-shaped leaves that can brighten any space. Nearly impossible to kill, it thrives in a wide range of conditions from low to bright indirect light, making it perfect for beginners.'
    },
  ];

  // Filter plants by category
  const filteredPlants = activeCategory === 'all' 
    ? plants 
    : plants.filter(plant => plant.category === activeCategory);

  // Handle add to cart click
  const handleAddToCart = (e, plant) => {
    e.preventDefault(); // Prevent any default behavior
    addToCart(plant);
    
    // Optional: Show feedback to user
    const button = e.currentTarget;
    const originalText = button.textContent;
    button.textContent = 'Added!';
    
    setTimeout(() => {
      button.textContent = originalText;
    }, 1000);
  };
  
  // Handle quick view click
  const handleQuickView = (e, plant) => {
    e.preventDefault(); // Prevent any default behavior
    setQuickViewProduct(plant);
    setIsQuickViewOpen(true);
  };
  
  // Handle wishlist toggle
  const handleWishlistToggle = (e, plant) => {
    e.preventDefault(); // Prevent default behavior
    toggleWishlistItem(plant);
  };
  
  // Close quick view modal
  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite error loop
    e.target.src = "https://via.placeholder.com/300x300?text=Plant+Image"; 
  };

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
                <img 
                  src={plant.image} 
                  alt={plant.name} 
                  className="plant-image"
                  onError={handleImageError}
                />
                {plant.badge && (
                  <span className="plant-badge">{plant.badge}</span>
                )}
                <button 
                  className="quick-view-btn" 
                  onClick={(e) => handleQuickView(e, plant)}
                >
                  Quick View
                </button>
                <button 
                  className="add-to-cart-btn"
                  onClick={(e) => handleAddToCart(e, plant)}
                >
                  Add to Cart
                </button>
              </div>
              <div className="plant-info">
                <h3 className="plant-name">{plant.name}</h3>
                
                <div className="plant-category">
                  <span className="category-icon">
                    {plant.category === 'indoor' ? '🏠' : 
                     plant.category === 'outdoor' ? '🌳' : 
                     plant.category === 'hanging' ? '🌵'
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
                  <button 
                    className={`wishlist-btn ${isInWishlist(plant.id) ? 'active' : ''}`}
                    onClick={(e) => handleWishlistToggle(e, plant)}
                  >
                    {isInWishlist(plant.id) ? '❤️' : '♡'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`featured-cta ${isVisible ? 'fade-in-up visible' : ''}`}>
          <button className="btn btn-primary">View All Plants</button>
        </div>
      </div>
      
      {/* Product Quick View Modal */}
      <ProductQuickView 
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </section>
  );
};

export default FeaturedPlants;