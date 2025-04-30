
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Market.css';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { useAuth } from '../components/Auth/AuthContext';
import ProductQuickView from '../components/ProductQuickView/ProductQuickView';
import ProductRating from '../components/ProductRating/ProductRating';
import ClipLoader from 'react-spinners/ClipLoader';

// Consistent API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

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
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    stock: '',
    image: null,
    imageFile: null
  });
  
  // State for quick view
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  // Get cart context
  const { addToCart } = useCart();
  
  // Get wishlist context
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  
  // Get auth context
  const { isAuthenticated, requireAuth, registerCallback } = useAuth();
  
  // Initialize products and categories on component mount
  useEffect(() => {
    setLoading(true);
    
    // Get authentication token if available
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    axios
      .get(`${API_BASE_URL}/api/v1/market/public`, { 
        withCredentials: true,
        headers
      })
      .then(response => {
        let productsData = response.data.products;
        if(!productsData || productsData.length === 0) {
          console.error('No products found in the response');
        } else {
          console.log('Fetched products:', productsData);
        }
        setProducts(productsData);
        setFilteredProducts(productsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error.message, error.response);
        setLoading(false);
      });
  }, []);
  
  // Register callbacks for actions that require authentication
  useEffect(() => {
    registerCallback('addProductToWishlist', (productId) => {
      const product = products.find(p => p.id === productId || p._id === productId);
      if (product) {
        toggleWishlistItem(product);
      }
    });
    
    registerCallback('openAddProductModal', () => {
      setIsAddProductOpen(true);
    });
    
    registerCallback('addProductToCart', (product) => {
      addToCart(product);
    });
    
    registerCallback('openProductQuickView', (product) => {
      setQuickViewProduct(product);
      setIsQuickViewOpen(true);
    });
  }, [products]);
  
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
        // Use averageRating instead of rating
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      default:
        // 'featured' - no specific sorting
        break;
    }
    
    setFilteredProducts(result);
  }, [activeCategory, priceRange, searchQuery, sortBy, products]);
  
  // Handle wishlist toggle with authentication
  const handleWishlistToggle = (productId) => {
    if (requireAuth({
      type: 'CALLBACK',
      payload: {
        callbackName: 'addProductToWishlist',
        args: [productId]
      }
    })) {
      const product = products.find(p => p.id === productId || p._id === productId);
      if (product) {
        toggleWishlistItem(product);
      }
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

  // Handle quick view with authentication check if needed
  const handleQuickView = (product, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    // Make sure we have a valid product before opening
    if (product && (product.id || product._id)) {
      setQuickViewProduct(product);
      setIsQuickViewOpen(true);
    } else {
      console.error("Attempted to open quick view with invalid product:", product);
    }
  };
  
  // closeQuickView function
  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    
    // Delay clearing the product to prevent rendering issues
    setTimeout(() => {
      setQuickViewProduct(null);
    }, 300);
  };
  
  // Handle product updates (after rating changes)
  const handleProductUpdate = (updatedProduct) => {
    // First, update the product in the products array
    const updatedProducts = products.map(product => 
      (product.id === updatedProduct.id || product._id === updatedProduct._id) ? updatedProduct : product
    );
    
    setProducts(updatedProducts);

    // Also update the filtered products to ensure the UI reflects the change
    setFilteredProducts(prevFiltered => {
      return prevFiltered.map(product => 
        (product.id === updatedProduct.id || product._id === updatedProduct._id) ? updatedProduct : product
      );
    });
    
    // Update quickViewProduct if it's the one being rated
    if (quickViewProduct && (quickViewProduct.id === updatedProduct.id || quickViewProduct._id === updatedProduct._id)) {
      setQuickViewProduct(updatedProduct);
    }
  };
  
  // Handle image error
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite error loop
    e.target.src = "https://via.placeholder.com/300x300?text=Product+Image"; 
  };
  
  // Handle opening add product modal with authentication check
  const handleOpenAddProduct = () => {
    if (requireAuth({
      type: 'CALLBACK',
      payload: {
        callbackName: 'openAddProductModal',
        args: []
      }
    })) {
      setIsAddProductOpen(true);
    }
  };
  
  // Check if user is authenticated and fetch categories on mount
  useEffect(() => {
    // Get predefined categories from backend
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get(
          `${API_BASE_URL}/api/v1/market/categories`
        );
        
        if (categoriesResponse.data && categoriesResponse.data.categories) {
          setCategories(categoriesResponse.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File size validation (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.log("File is too large. Maximum size is 5MB.");
        return;
      }
      
      // File type validation
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        console.log("Invalid file type. Please upload JPEG, PNG, or WebP images.");
        return;
      }
      
      // Read the file as base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({
          ...newProduct,
          image: reader.result,
          imageFile: file
        });
      };
      reader.readAsDataURL(file);
    }
  };
  // Handle form submission for new product with authentication check
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    
    // Check authentication before proceeding
    if (!requireAuth({
      type: 'CALLBACK',
      payload: {
        callbackName: 'submitProductForm',
        args: []
      }
    })) {
      return;
    }
    
    try {
      // Set submitting state to true
      setIsSubmitting(true);
      
      // Get authentication token from localStorage
      const token = localStorage.getItem('token');
      
      // Create headers with authentication
      const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const formDataHeaders = {
        'Authorization': `Bearer ${token}`
      };
      
      // Step 1: Upload image to Firebase
      let imageUrl = null;
      
      if (newProduct.imageFile) {
        // Create form data for the image upload
        const formData = new FormData();
        formData.append('media', newProduct.imageFile);
        
        // Upload image to your Firebase endpoint with folder parameter
        const imageResponse = await axios.post(
          `${API_BASE_URL}/api/v1/utils/upload-image?folder=products`, 
          formData, 
          {
            headers: formDataHeaders,
            withCredentials: true
          }
        );
        
        // Get the image URL from the response
        imageUrl = imageResponse.data.imageUrl;
      }
      
      // Step 2: Create the product object with the image URL
      const productToAdd = {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        stock: parseInt(newProduct.stock),
        image: imageUrl
      };
      
      // Step 3: Send the product data to MongoDB API
      const productResponse = await axios.post(
        `${API_BASE_URL}/api/v1/market`, 
        productToAdd, 
        {
          headers: authHeaders,
          withCredentials: true
        }
      );
      
      // Step 4: Add the new product to the local state
      const addedProduct = productResponse.data.product;
      
      const updatedProducts = [...products, addedProduct];
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      
      // Add new category if it doesn't exist
      if (!categories.includes(addedProduct.category) && addedProduct.category) {
        setCategories([...categories, addedProduct.category]);
      }
      
      // Success message
      console.log("Product added successfully!");
      alert("Product added successfully!");
      
      // Reset form and close modal
      setNewProduct({
        name: '',
        category: '',
        price: '',
        description: '',
        stock: '',
        image: null,
        imageFile: null
      });
      setIsAddProductOpen(false);
      
    } catch (error) {
      // Handle errors
      console.error("Error adding product:", error);
      
      // Check for specific error types
      if (error.response) {
        if (error.response.status === 401) {
          alert("Authentication failed. Please log in again.");
        } else if (error.response.status === 403) {
          alert("You don't have permission to add products.");
        } else {
          alert(`Failed to add product: ${error.response.data?.msg || 'Server error'}`);
        }
      } else {
        alert("Failed to add product. Please try again.");
      }
    } finally {
      // Reset submitting state
      setIsSubmitting(false);
    }
  };

  // Register product submission callback
  useEffect(() => {
    registerCallback('submitProductForm', handleSubmitProduct);
  }, [newProduct]);

  
  // Render rating or "No ratings" message
  const renderRating = (product) => {
    if (!product.numRatings || product.numRatings === 0) {
      return <span className="no-ratings">No ratings yet</span>;
    }
    
    // Ensure rating is a valid number between 0 and 5
    const safeRating = !isNaN(product.averageRating) && product.averageRating !== null ? 
      Math.max(0, Math.min(5, product.averageRating)) : 0;
    
    // Use a safer approach that doesn't rely on String.repeat
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= safeRating) {
        stars.push('★'); // filled star
      } else {
        stars.push('☆'); // empty star
      }
    }
    
    return (
      <div className="product-rating">
        <span className="stars" style={{ color: '#FFD700' }}>
          {stars.join('')}
        </span>
        <span className="rating-value">
          {safeRating.toFixed(1)} ({product.numRatings})
        </span>
      </div>
    );
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
            <button 
              className="sell-product-btn" 
              onClick={handleOpenAddProduct}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                marginLeft: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Sell a Product
            </button>
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
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      // Filter products with rating >= 4
                      if (e.target.checked) {
                        setFilteredProducts(products.filter(p => p.averageRating >= 4));
                      } else {
                        // Reset filter
                        setFilteredProducts(products);
                      }
                    }}
                  /> 
                  4★ & above
                </label>
                <label className="rating-option">
                  <input 
                    type="checkbox"
                    onChange={(e) => {
                      // Filter products with rating >= 3
                      if (e.target.checked) {
                        setFilteredProducts(products.filter(p => p.averageRating >= 3));
                      } else {
                        // Reset filter
                        setFilteredProducts(products);
                      }
                    }}
                  /> 
                  3★ & above
                </label>
              </div>
            </div>
            
            <div className="filter-section">
              <h3>Availability</h3>
              <div className="availability-filter">
                <label className="availability-option">
                  <input 
                    type="checkbox"
                    onChange={(e) => {
                      // Filter in-stock products
                      if (e.target.checked) {
                        setFilteredProducts(products.filter(p => p.stock > 0));
                      } else {
                        // Reset filter
                        setFilteredProducts(products);
                      }
                    }}
                  /> 
                  In Stock
                </label>
              </div>
            </div>
            
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setActiveCategory('all');
                setPriceRange([0, 100]);
                setSearchQuery('');
                setFilteredProducts(products);
              }}
            >
              Reset Filters
            </button>
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
              <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <ClipLoader color="#4CAF50" size={60} loading={loading} />
                <p style={{ marginLeft: '15px', fontSize: '18px' }}>Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div className="product-card" key={product.id || product._id}>
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
                      {/* Quick View and Add to Cart buttons */}
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
                        {/* Updated Rating Display */}
                        {renderRating(product)}
                      </div>
                      <p className="product-description">{product.description.substring(0, 80)}...</p>
                      <div className="product-price-row">
                        <span className="product-price">${product.price.toFixed(2)}</span>
                        <button 
                          className={`wishlist-btn ${isInWishlist(product.id || product._id) ? 'active' : ''}`}
                          onClick={() => handleWishlistToggle(product.id || product._id)}
                        >
                          {isInWishlist(product.id || product._id) ? '❤️' : '♡'}
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
      
      {/* Add Product Overlay Form */}
      {isAddProductOpen && (
        <>
          <div 
            className="product-form-overlay"
            onClick={() => setIsAddProductOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 999,
            }}
          ></div>
          
          <div 
            className="product-form-container"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              zIndex: 1000,
            }}
          >
            <div className="product-form-header" style={{ marginBottom: '20px' }}>
              <h2 style={{ marginBottom: '10px' }}>Sell a New Product</h2>
              <p style={{ color: '#666' }}>List your plant or gardening item for sale</p>
              <button 
                className="close-form-btn"
                onClick={() => setIsAddProductOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmitProduct}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Product Name *
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  }}
                />
              </div>
              
              <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="category" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Category *
                  </label>
                  <select 
                    id="category" 
                    name="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      backgroundColor: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="price" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Price ($) *
                  </label>
                  <input 
                    type="number" 
                    id="price" 
                    name="price"
                    min="0.01" 
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                    }}
                  />
                </div>
              </div>
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Description *
                </label>
                <textarea 
                  id="description" 
                  name="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows="4"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    resize: 'vertical',
                  }}
                ></textarea>
              </div>
              
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="stock" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Stock Quantity *
                </label>
                <input 
                  type="number" 
                  id="stock" 
                  name="stock"
                  min="1" 
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  }}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="image" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Product Image *
                </label>
                <input 
                  type="file" 
                  id="image" 
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required={!newProduct.image}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  }}
                />
                
                {newProduct.image && (
                  <div className="image-preview" style={{ marginTop: '10px' }}>
                    <img 
                      src={newProduct.image} 
                      alt="Product preview" 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button 
                  type="button" 
                  onClick={() => setIsAddProductOpen(false)}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f5f5f5',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <ClipLoader color="#ffffff" size={20} loading={true} style={{ marginRight: '10px' }} />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    'List Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Product Quick View Modal */}
      <ProductQuickView 
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
        onProductUpdate={handleProductUpdate}
      />
    </div>
  );
};

export default Market;