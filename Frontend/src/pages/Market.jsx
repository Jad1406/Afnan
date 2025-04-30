// Market.jsx 
import React, { useState, useEffect } from 'react';
import './Market.css';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext'; // Import useWishlist
import ProductQuickView from '../components/ProductQuickView/ProductQuickView';
import ClipLoader from 'react-spinners/ClipLoader';

const Market = () => {
  // State for products and filters
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State for quick view
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  // Get cart context
  const { addToCart } = useCart();
  
  // Get wishlist context
  const { toggleWishlistItem, isInWishlist } = useWishlist();

  // Mock product data for testing
  const mockProducts = [
    {
      id: 101,
      name: "Monstera Deliciosa",
      category: "indoor",
      price: 45.99,
      description: "The Monstera Deliciosa, or Swiss Cheese Plant, is known for its stunning split leaves. This popular houseplant is easy to care for and makes a dramatic statement in any space with its large, glossy foliage.",
      image: "/images/plant1.jpg",
      rating: 4.8,
      stock: 15,
      badge: "Popular",
      tags: ["air purifying", "low light"]
    },
    {
      id: 102,
      name: "Snake Plant",
      category: "indoor",
      price: 29.99,
      description: "One of the most carefree houseplants you can grow, the Snake Plant (Sansevieria) thrives on neglect. Its striking upright leaves with yellow edges purify air and can survive in low light conditions, making it perfect for beginners.",
      image: "/images/plant2.jpg",
      rating: 4.9,
      stock: 20,
      badge: "Best Seller",
      tags: ["air purifying", "drought tolerant"]
    },
    {
      id: 103,
      name: "Fiddle Leaf Fig",
      category: "indoor",
      price: 59.99,
      description: "The Fiddle Leaf Fig (Ficus lyrata) is famous for its large, violin-shaped leaves and elegant appearance. This stunning statement plant thrives in bright, indirect light and adds a touch of sophistication to any interior space.",
      image: "/images/plant3.jpg",
      rating: 4.5,
      stock: 8,
      badge: null,
      tags: ["bright light", "statement"]
    },
    {
      id: 104,
      name: "Lavender",
      category: "outdoor",
      price: 19.99,
      description: "Lavender is a versatile, aromatic herb beloved for its calming fragrance and beautiful purple blooms. Drought-tolerant and sun-loving, it's perfect for gardens, containers, and even indoors with sufficient light.",
      image: "/images/plant4.jpg",
      rating: 4.7,
      stock: 25,
      badge: "New",
      tags: ["fragrant", "drought tolerant"]
    },
    {
      id: 105,
      name: "String of Pearls",
      category: "hanging",
      price: 24.99,
      description: "The String of Pearls (Senecio rowleyanus) features unique round bead-like leaves that cascade down its stems, creating a stunning hanging display. This drought-tolerant succulent requires minimal water and makes a perfect hanging plant for any home.",
      image: "/images/plant5.jpg",
      rating: 4.6,
      stock: 12,
      badge: null,
      tags: ["succulent", "trailing"]
    },
    {
      id: 106,
      name: "ZZ Plant",
      category: "indoor",
      price: 34.99,
      description: "The ZZ Plant (Zamioculcas zamiifolia) is practically indestructible, thriving in low light and requiring minimal water. Its glossy, dark green leaves grow from thick rhizomes that store water, making it extremely drought-tolerant and perfect for beginners.",
      image: "/images/plant6.jpg",
      rating: 4.9,
      stock: 18,
      badge: "Low Maintenance",
      tags: ["low light", "drought tolerant"]
    },
    {
      id: 107,
      name: "Terracotta Pot Set",
      category: "accessories",
      price: 39.99,
      description: "This set of 3 terracotta pots in various sizes is perfect for your houseplant collection. These classic clay pots provide excellent drainage and airflow for plant roots, promoting healthy growth.",
      image: "/images/accessory1.jpg",
      rating: 4.8,
      stock: 20,
      badge: "Value Pack",
      tags: ["pots", "accessories"]
    },
    {
      id: 108,
      name: "Premium Potting Soil",
      category: "accessories",
      price: 15.99,
      description: "Our premium potting soil blend is specially formulated for indoor plants. Rich in organic matter and balanced nutrients, it provides the perfect growing medium for your houseplants.",
      image: "/images/accessory2.jpg",
      rating: 4.7,
      stock: 50,
      badge: null,
      tags: ["soil", "accessories"]
    }
  ];

  // Initialize products and categories on component mount
  useEffect(() => {
    setLoading(true);
    
    // Simulating API fetch with setTimeout
    setTimeout(() => {
      try {
        // Use mock data for now
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(mockProducts.map(product => product.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.toString());
        setLoading(false);
      }
    }, 1000);
    
    // In a real implementation, you would fetch from your API:
    /*
    axios
      .get('http://localhost:3000/api/v1/market/public', { withCredentials: true })
      .then(response => {
        let productsData = response.data.products;
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Extract unique categories
        const uniqueCategories = [...new Set(productsData.map(product => product.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
    */
  }, []);

  // Filter products when filters change
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Filter by price range
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Sort products
    switch(sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 'featured' - no specific sorting
        break;
    }
    
    setFilteredProducts(result);
  }, [activeCategory, priceRange, searchQuery, sortBy, products]);
  
  // Handle wishlist toggle
  const handleWishlistToggle = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      toggleWishlistItem(product);
    }
  };
  
  // Handle adding product to cart
  const handleAddToCart = (product, event) => {
    if (event) {
      event.stopPropagation();
    }
    addToCart(product);
    
    // Optional: Give user feedback that item was added
    if (event && event.target) {
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = 'Added!';
      
      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
    }
  };
  
  // Handle quick view
  const handleQuickView = (product, event) => {
    if (event) {
      event.stopPropagation();
    }
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };
  
  // Close quick view
  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };
  
  // Handle image error
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite error loop
    e.target.src = "https://via.placeholder.com/300x300?text=Product+Image"; 
  };

  return (
    <div className="market-page">
      <div className="market-header">
        <div className="container">
          <h1>Plant Marketplace</h1>
          <p>Discover our curated selection of plants, pots, tools, and accessories.</p>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button">Search</button>
          </div>
        </div>
      </div>
      
      {/* Main Market Content */}
      <div className="market-content container">
        <div className="market-layout">
          {/* Sidebar with filters */}
          <aside className="market-sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <ul className="category-list">
                <li 
                  className={activeCategory === 'all' ? 'active' : ''}
                  onClick={() => setActiveCategory('all')}
                >
                  All Products
                </li>
                {categories.map(category => (
                  <li 
                    key={category}
                    className={activeCategory === category ? 'active' : ''}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-range-control">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="price-slider"
                />
                <div className="price-inputs">
                  <div>
                    <span className="price-label">Min:</span>
                    <span className="price-value">${priceRange[0]}</span>
                  </div>
                  <div>
                    <span className="price-label">Max:</span>
                    <span className="price-value">${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="filter-section">
              <h3>Rating</h3>
              <div className="rating-filter">
                <label className="rating-option">
                  <input type="checkbox" /> 4★ & above
                </label>
                <label className="rating-option">
                  <input type="checkbox" /> 3★ & above
                </label>
              </div>
            </div>
            
            <div className="filter-section">
              <h3>Availability</h3>
              <div className="availability-filter">
                <label className="availability-option">
                  <input type="checkbox" /> In Stock
                </label>
                <label className="availability-option">
                  <input type="checkbox" /> Ships in 24 Hours
                </label>
              </div>
            </div>
            
            <button className="reset-filters-btn">Reset Filters</button>
          </aside>
          
          {/* Main product grid */}
          <main className="market-main">
            <div className="market-controls">
              <div className="results-count">
                {loading ? 'Loading products...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
              </div>
              <div className="sort-control">
                <label htmlFor="sort-select">Sort by:</label>
                <select 
                  id="sort-select" 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <ClipLoader color="#4CAF50" size={60} loading={loading} />
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div className="product-card" key={product.id}>
                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}
                    
                    <div className="product-image-container">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="product-image" 
                        onError={handleImageError}
                      />
                      
                      {/* Add Quick View and Add to Cart buttons */}
                      <div className="product-hover-buttons">
                        <button 
                          className="product-quick-view-btn"
                          onClick={(e) => handleQuickView(product, e)}
                        >
                          Quick View
                        </button>
                        <button 
                          className="product-add-cart-btn"
                          onClick={(e) => handleAddToCart(product, e)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-meta">
                        <div className="product-category">{product.category}</div>
                        <div className="product-rating">
                          <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
                          <span className="rating-value">{product.rating}</span>
                        </div>
                      </div>
                      <p className="product-description">{product.description.substring(0, 80)}...</p>
                      <div className="product-price-row">
                        <span className="product-price">${product.price.toFixed(2)}</span>
                        <button 
                          className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                          onClick={() => handleWishlistToggle(product.id)}
                        >
                          {isInWishlist(product.id) ? '❤️' : '♡'}
                        </button>
                      </div>
                      <div className="product-actions">
                        <button 
                          className="add-to-cart-btn"
                          onClick={(e) => handleAddToCart(product, e)}
                        >
                          Add to Cart
                        </button>
                        <button 
                          className="view-details-btn"
                          onClick={(e) => handleQuickView(product, e)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No products found matching your filters.</p>
                <button 
                  className="reset-btn"
                  onClick={() => {
                    setActiveCategory('all');
                    setPriceRange([0, 100]);
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Promotional section */}
      <section className="promo-section container">
        <div className="promo-header">
          <h2>Special Offers</h2>
          <p>Limited time deals on select products</p>
        </div>
        
        <div className="promotions">
          <div className="promo-card">
            <div className="promo-content">
              <h3>Summer Sale</h3>
              <p>20% off all outdoor plants</p>
              <span className="promo-code">SUMMER20</span>
              <button className="promo-btn">Shop Now</button>
            </div>
          </div>
          
          <div className="promo-card">
            <div className="promo-content">
              <h3>Bundle & Save</h3>
              <p>Buy any 3 plants, get the 4th free</p>
              <span className="promo-code">BUNDLE4</span>
              <button className="promo-btn">Shop Now</button>
            </div>
          </div>
          
          <div className="promo-card">
            <div className="promo-content">
              <h3>New Arrivals</h3>
              <p>First-time customers get 10% off</p>
              <span className="promo-code">WELCOME10</span>
              <button className="promo-btn">Shop Now</button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Shipping policy section */}
      <section className="shipping-section">
        <div className="container">
          <div className="shipping-features">
            <div className="shipping-feature">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>On all orders over $50</p>
            </div>
            
            <div className="shipping-feature">
              <div className="feature-icon">🪴</div>
              <h3>Plant Guarantee</h3>
              <p>30-day guarantee on all plants</p>
            </div>
            
            <div className="shipping-feature">
              <div className="feature-icon">🔄</div>
              <h3>Easy Returns</h3>
              <p>Simple return process</p>
            </div>
            
            <div className="shipping-feature">
              <div className="feature-icon">🌐</div>
              <h3>Nationwide Delivery</h3>
              <p>We ship to all 50 states</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product Quick View Modal */}
      <ProductQuickView 
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </div>
  );
};

export default Market;