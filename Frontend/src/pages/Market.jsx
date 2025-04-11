// Market.jsx
import React, { useState, useEffect } from 'react';
import './Market.css';

const Market = () => {
  // State for products and filters
  //We need models for the products and wishlist(Link the wishlist to the user)
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Sample products data
  const productsData = [
    {
      id: 1,
      name: "Monstera Deliciosa",
      category: "indoor",
      price: 45.99,
      image: "/images/plant1.jpg",
      rating: 4.8,
      badge: "Popular",
      description: "The Swiss Cheese Plant with iconic split leaves. Easy to care for and fast-growing.",
      stock: 15,
      seller: {
        name: "Green Thumb Nursery",
        rating: 4.9
      }
    },
    {
      id: 2,
      name: "Snake Plant (Sansevieria)",
      category: "indoor",
      price: 29.99,
      image: "/images/plant2.jpg",
      rating: 4.9,
      badge: "Best Seller",
      description: "Virtually indestructible and perfect for beginners. Thrives in low light and purifies air.",
      stock: 23,
      seller: {
        name: "Urban Jungle",
        rating: 4.7
      }
    },
    {
      id: 3,
      name: "Fiddle Leaf Fig",
      category: "indoor",
      price: 59.99,
      image: "/images/plant3.jpg",
      rating: 4.5,
      badge: null,
      description: "Statement plant with large, violin-shaped leaves. Adds instant drama to any room.",
      stock: 8,
      seller: {
        name: "Exotic Plant Co.",
        rating: 4.8
      }
    },
    {
      id: 4,
      name: "Terracotta Pot - Medium",
      category: "pots",
      price: 14.99,
      image: "/images/pot1.jpg",
      rating: 4.6,
      badge: null,
      description: "Classic terracotta pot with drainage hole. 6-inch diameter, perfect for medium plants.",
      stock: 42,
      seller: {
        name: "Pottery Paradise",
        rating: 4.5
      }
    },
    {
      id: 5,
      name: "Organic Potting Soil",
      category: "supplies",
      price: 18.99,
      image: "/images/soil.jpg",
      rating: 4.8,
      badge: "Organic",
      description: "Premium organic potting mix, perfect for houseplants. Contains perlite for drainage.",
      stock: 30,
      seller: {
        name: "Garden Essentials",
        rating: 4.6
      }
    },
    {
      id: 6,
      name: "Lavender Plant",
      category: "outdoor",
      price: 19.99,
      image: "/images/plant4.jpg",
      rating: 4.7,
      badge: "Fragrant",
      description: "Aromatic herb with beautiful purple flowers. Attracts pollinators and repels pests.",
      stock: 18,
      seller: {
        name: "Herb Haven",
        rating: 4.8
      }
    },
    {
      id: 7,
      name: "Pruning Shears",
      category: "tools",
      price: 24.99,
      image: "/images/tool1.jpg",
      rating: 4.9,
      badge: "Top Rated",
      description: "Professional-grade pruning shears with ergonomic handles and ultra-sharp blades.",
      stock: 15,
      seller: {
        name: "Garden Essentials",
        rating: 4.6
      }
    },
    {
      id: 8,
      name: "Succulent Collection (5 Pack)",
      category: "indoor",
      price: 39.99,
      image: "/images/plant5.jpg",
      rating: 4.8,
      badge: "Value Pack",
      description: "Curated collection of 5 different succulents in 2-inch pots. Perfect for beginners.",
      stock: 12,
      seller: {
        name: "Succulent Source",
        rating: 4.9
      }
    },
    {
      id: 9,
      name: "Decorative Plant Stand",
      category: "accessories",
      price: 32.99,
      image: "/images/stand1.jpg",
      rating: 4.5,
      badge: null,
      description: "Mid-century inspired wooden plant stand. Elevates your plants for better display.",
      stock: 7,
      seller: {
        name: "Home & Garden Decor",
        rating: 4.4
      }
    },
    {
      id: 10,
      name: "Pothos Golden",
      category: "indoor",
      price: 22.99,
      image: "/images/plant6.jpg",
      rating: 4.7,
      badge: "Easy Care",
      description: "Trailing vine with marbled golden and green leaves. Perfect for beginners.",
      stock: 20,
      seller: {
        name: "Green Thumb Nursery",
        rating: 4.9
      }
    }
  ];
  
  // Initialize products and categories on component mount
  useEffect(() => {
    setProducts(productsData);
    setFilteredProducts(productsData);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(productsData.map(product => product.category))];
    setCategories(uniqueCategories);
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
  
  // Toggle wishlist status
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };
  
  // Add to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  
  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  // Update cart item quantity
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };
  
  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
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
              <h3>Seller Rating</h3>
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
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
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
            
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
              {filteredProducts.map(product => (
              <div className="product-card" key={product.id}>
                {product.badge && (
                  <span className="product-badge">{product.badge}</span>
                )}
                
                {/* Replace this placeholder div with an actual image */}
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image" 
                  />
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
                      className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                      onClick={() => toggleWishlist(product.id)}
                    >
                      {wishlist.includes(product.id) ? '❤️' : '♡'}
                    </button>
                  </div>
                  <div className="product-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <button className="view-details-btn">View Details</button>
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
      
      {/* Shopping Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h2>
          <button 
            className="close-cart-btn"
            onClick={() => setIsCartOpen(false)}
          >
            ×
          </button>
        </div>
        
        {cart.length > 0 ? (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div className="cart-item" key={item.id}>
                  {/* Replace this placeholder div with an actual image */}
                  <div className="cart-item-image">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="cart-item-img" 
                    />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <div className="cart-item-price">${item.price.toFixed(2)}</div>
                    <div className="cart-item-controls">
                      <div className="quantity-control">
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="cart-total">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="cart-actions">
                <button className="checkout-btn">Proceed to Checkout</button>
                <button 
                  className="continue-shopping-btn"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                </button>
              </div>
              
              <div className="cart-promo">
                <input type="text" placeholder="Enter promo code" />
                <button>Apply</button>
              </div>
              
              <div className="shipping-info">
                <p>Free shipping on orders over $50!</p>
                <p>Most orders ship within 1-2 business days.</p>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <p>Your cart is empty</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => setIsCartOpen(false)}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
      
      {/* Cart overlay */}
      {isCartOpen && (
        <div 
          className="cart-overlay"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}
      
      {/* Floating cart button */}
      <button 
        className="cart-floating-btn"
        onClick={() => setIsCartOpen(true)}
      >
        <span className="cart-icon">🛒</span>
        <span className="cart-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
      </button>
      
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
    </div>
  );
};

export default Market;