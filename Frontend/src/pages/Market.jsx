
import React, { useState, useEffect,useRef } from 'react';

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
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isEditingMinPrice, setIsEditingMinPrice] = useState(false);
  const [isEditingMaxPrice, setIsEditingMaxPrice] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState("0");
  const [maxPriceInput, setMaxPriceInput] = useState("1000");  const [searchQuery, setSearchQuery] = useState('');
  const [inStock, setInStock] = useState(false);

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
  const Cart = useCart();
  
  // Get wishlist context
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  
  // Get auth context
  const { isAuthenticated, requireAuth, registerCallback } = useAuth();

  // Pagination state
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [totalItems, setTotalItems] = useState(0);
const [itemsPerPage, setItemsPerPage] = useState(12);
const [loadingMore, setLoadingMore] = useState(false);

// Last element reference for infinite scroll
const lastProductRef = useRef(null);
const observer = useRef(null);
// Debounced search input (prevents making API calls for each keystroke)
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
const searchTimeoutRef = useRef(null);
  


// Modified useEffect to include inStock in dependencies
useEffect(() => {
  fetchProducts();
}, [currentPage, activeCategory, minPrice, maxPrice, debouncedSearchQuery, minRatingFilter, sortBy, inStock]);

// New function to debounce search input
useEffect(() => {
  if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current);
  }
  
  searchTimeoutRef.current = setTimeout(() => {
    setDebouncedSearchQuery(searchQuery);
    // Reset to first page when search query changes
    setCurrentPage(1);
  }, 500); // 500ms delay
  
  return () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };
}, [searchQuery]);

// Intersection Observer for infinite scroll
useEffect(() => {
  if (loading || loadingMore || currentPage >= totalPages) return;
  
  const options = {
    root: null,
    rootMargin: '100px',
    threshold: 0.05
  };
  
  const handleObserver = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && currentPage < totalPages) {
      loadMoreProducts();
    }
  };
  
  observer.current = new IntersectionObserver(handleObserver, options);
  
  if (lastProductRef.current) {
    observer.current.observe(lastProductRef.current);
  }
  
  return () => {
    if (observer.current) {
      observer.current.disconnect();
    }
  };
}, [loading, loadingMore, currentPage, totalPages]);

// New function to fetch products with server-side filtering and pagination
const fetchProducts = async () => {
  // setLoading(true);
  // setError(null);


   // For first page, show loading and clear existing products
   if (currentPage === 1) {
    setLoading(true);
    setProducts([]);
    setFilteredProducts([]);
  }
  setError(null);

  try {
    // Get authentication token if available
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    // Build query parameters for server-side filtering
    const params = new URLSearchParams();
    params.append('page', currentPage);
    params.append('limit', itemsPerPage);
    
    // Add filters
    if (activeCategory && activeCategory !== 'all') {
      params.append('category', activeCategory);
    }
    
    if (minPrice > 0) {
      params.append('minPrice', minPrice);
    }
    
    if (maxPrice) {
      params.append('maxPrice', maxPrice);
    }
    
    if (debouncedSearchQuery) {
      params.append('search', debouncedSearchQuery);
    }
    
    if (minRatingFilter > 0) {
      params.append('minRating', minRatingFilter);
    }
    
    if (sortBy && sortBy !== 'featured') {
      params.append('sort', sortBy);
    }

    if (inStock === true) {
      params.append('stock', 1);
    }
    console.log('In stock:', params.toString());
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/market/public?${params.toString()}`, 
      { 
        withCredentials: true,
        headers 
      }
    );
    
    const { products: fetchedProducts, pagination } = response.data;
    
    if (!fetchedProducts || fetchedProducts.length === 0) {
      console.error('No products found in the response');
    }
    

    
    // For first page, replace products; for subsequent pages with infinite scroll, append
    if (currentPage === 1) {
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    } else {
      setProducts(prev => [...prev, ...fetchedProducts]);
      setFilteredProducts(prev => [...prev, ...fetchedProducts]);    
    }
    // Update pagination data
    if (pagination) {
      setTotalPages(pagination.totalPages || 1);
      setTotalItems(pagination.totalItems || 0);
      setItemsPerPage(pagination.itemsPerPage || 12);
    }


  } catch (error) {
    console.error('Error fetching products:', error.message, error.response);
    setError('Failed to load products. Please try again.');
  } finally {
    setLoading(false);
    setLoadingMore(false);   }
};

// const updateFilters = (newFilterValues) => {
//   // Reset to page 1 when filters change
//   setCurrentPage(1);
  
//   // Update the relevant filter state
//   if ('category' in newFilterValues) {
//     setActiveCategory(newFilterValues.category);
//   }
  
//   if ('minPrice' in newFilterValues) {
//     setMinPrice(newFilterValues.minPrice);
//     setMinPriceInput(newFilterValues.minPrice.toString());
//   }
  
//   if ('maxPrice' in newFilterValues) {
//     setMaxPrice(newFilterValues.maxPrice);
//     setMaxPriceInput(newFilterValues.maxPrice.toString());
//   }
  
//   if ('minRating' in newFilterValues) {
//     setMinRatingFilter(newFilterValues.minRating);
//   }
  
//   if ('searchQuery' in newFilterValues) {
//     setSearchQuery(newFilterValues.searchQuery);
//   }
  
//   if ('sortBy' in newFilterValues) {
//     setSortBy(newFilterValues.sortBy);
//   }
  
//   if ('inStock' in newFilterValues) {
//     setInStock(newFilterValues.inStock);
//   }
//   console.log('Filters updated:', newFilterValues);
// };


// New function to load more products (for infinite scroll)
const loadMoreProducts = () => {
  if (loadingMore || currentPage >= totalPages) return;
  
  setLoadingMore(true);
  setCurrentPage(prev => prev + 1);
  // setLoadingMore(false);
};

// Update your existing handleSearch function to use server-side search
const handleSearch = (e) => {
  e.preventDefault();
  // The debounced effect will trigger the actual search
};


// Improved resetFilters function that resets all filter states
const resetFilters = () => {
  setActiveCategory('all');
  setMinPrice(0);
  setMaxPrice(1000);
  setMinPriceInput("0");
  setMaxPriceInput("1000");
  setSearchQuery('');
  setDebouncedSearchQuery('');
  setMinRatingFilter(0);
  setSortBy('featured');
  setInStock(false);
  setCurrentPage(1);
};






  
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
    
    registerCallback('addProductToCart', (product, quantity = 1) => {
      Cart.addToCart(product, quantity);
    });
    
    registerCallback('openProductQuickView', (product) => {
      setQuickViewProduct(product);
      setIsQuickViewOpen(true);
    });


  }, [products]);
  

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
const handleAddToCart = (product, event, quantity = 1) => {
  if (event) {
    event.stopPropagation();
  }
  
  // Use the updated Cart.addToCart function with quantity
  Cart.addToCart(product, quantity);
  
  // Optional: Give user feedback that item was added
  if (event && event.target) {
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = `Added ${quantity}!`;
    
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





const handleProductUpdate = (updatedProduct) => {
  // Get the ID of the updated product
  const updatedProductId = updatedProduct._id;
  
  if (!updatedProductId) {
    console.error("Updated product has no ID:", updatedProduct);
    return;
  }
  

  
  // Update the products array with strict ID matching
  const updatedProducts = products.map(product => {
    const productId = product._id;
    
    // Only update the matching product
    if (productId && productId === updatedProductId) {
      // console.log("Found matching product to update:", productId);
      return { ...product, ...updatedProduct };
    }
    
    // Keep all other products unchanged
    return product;
  });
  

  
  // Set the main products state
  setProducts(updatedProducts);
  
  // Update filtered products separately with the same strict matching
  setFilteredProducts(prevFiltered => {
    return prevFiltered.map(product => {
      const productId = product._id;
      
      if (productId && productId === updatedProductId) {
        return { ...product, ...updatedProduct };
      }
      
      return product;
    });
  });
  
  // Update quickViewProduct if it's the one being rated
  if (quickViewProduct) {
    const quickViewId = quickViewProduct._id;
    
    if (quickViewId && quickViewId === updatedProductId) {
      setQuickViewProduct({ ...quickViewProduct, ...updatedProduct });
    }
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
  


    //  Handler functions for price editing
        const handleMinPriceClick = () => {
          setMinPriceInput(minPrice.toString());
          setIsEditingMinPrice(true);
        };

        const handleMaxPriceClick = () => {
          setMaxPriceInput(maxPrice.toString());
          setIsEditingMaxPrice(true);
        };

        const handleMinPriceChange = (e) => {
          setMinPriceInput(e.target.value);
        };

        const handleMaxPriceChange = (e) => {
          setMaxPriceInput(e.target.value);
        };

        const handleMinPriceBlur = () => {
          let value = parseInt(minPriceInput);
          
          // Validate input
          if (isNaN(value) || value < 0) {
            value = 0;
          } else if (value > maxPrice) {
            value = maxPrice;
          }
          
          setMinPrice(value);
          setMinPriceInput(value.toString());
          setIsEditingMinPrice(false);
        };

        const handleMaxPriceBlur = () => {
          let value = parseInt(maxPriceInput);
          
          // Validate input
          if (isNaN(value) || value < minPrice) {
            value = minPrice;
          }
          
          setMaxPrice(value);
          setMaxPriceInput(value.toString());
          setIsEditingMaxPrice(false);
        };

        const handleMinPriceKeyDown = (e) => {
          if (e.key === 'Enter') {
            handleMinPriceBlur();
          }
        };

        const handleMaxPriceKeyDown = (e) => {
          if (e.key === 'Enter') {
            handleMaxPriceBlur();
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
            <div className="price-sliders">
              <input 
                type="range" 
                min="0" 
                max="1000" 
                value={minPrice} 
                onChange={(e) => {
                  const newMin = parseInt(e.target.value);
                  if (newMin <= maxPrice) {
                    setMinPrice(newMin);
                  }
                }}
                className="price-slider min-slider"
                style={{
                  width: '100%',
                  marginBottom: '5px'
                }}
              />
              <input 
                type="range" 
                min="0" 
                max="1000" 
                value={maxPrice} 
                onChange={(e) => {
                  const newMax = parseInt(e.target.value);
                  if (newMax >= minPrice) {
                    setMaxPrice(newMax);
                  }
                }}
                className="price-slider max-slider"
                style={{
                  width: '100%',
                  marginBottom: '15px'
                }}
              />
            </div>
            
            <div className="price-inputs" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="min-price-container">
                <span className="price-label">Min: $</span>
                {isEditingMinPrice ? (
                  <input
                    type="text"
                    value={minPriceInput}
                    onChange={handleMinPriceChange}
                    onBlur={handleMinPriceBlur}
                    onKeyDown={handleMinPriceKeyDown}
                    autoFocus
                    style={{
                      width: '50px',
                      padding: '2px 5px',
                      border: '1px solid #ccc',
                      borderRadius: '3px'
                    }}
                  />
                ) : (
                  <span 
                    className="price-value clickable" 
                    onClick={handleMinPriceClick}
                    style={{ 
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#4CAF50'
                    }}
                  >
                    {minPrice}
                  </span>
                )}
              </div>
              
              <div className="max-price-container">
                <span className="price-label">Max: $</span>
                {isEditingMaxPrice ? (
                  <input
                    type="text"
                    value={maxPriceInput}
                    onChange={handleMaxPriceChange}
                    onBlur={handleMaxPriceBlur}
                    onKeyDown={handleMaxPriceKeyDown}
                    autoFocus
                    style={{
                      width: '50px',
                      padding: '2px 5px',
                      border: '1px solid #ccc',
                      borderRadius: '3px'
                    }}
                  />
                ) : (
                  <span 
                    className="price-value clickable" 
                    onClick={handleMaxPriceClick}
                    style={{ 
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#4CAF50'
                    }}
                  >
                    {maxPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
            
      <div className="filter-section">
        <h3>Rating</h3>
        <div className="rating-filter">
          <div className="rating-slider-container">
            <input
        type="range"
        min="0"
        max="5"
        step="0.5"
        value={minRatingFilter}
        onChange={(e) => setMinRatingFilter(parseFloat(e.target.value))}
        className="rating-slider"
        style={{
          width: '100%',
          marginBottom: '10px'
        }}
      />
      <div className="rating-slider-labels" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Any</span>
        <span>5★</span>
      </div>
      <div className="current-rating-filter" style={{ 
        textAlign: 'center', 
        marginTop: '5px',
        fontWeight: minRatingFilter > 0 ? 'bold' : 'normal',
        color: minRatingFilter > 0 ? '#4CAF50' : '#666'
      }}>
        {minRatingFilter === 0 ? 'All Ratings' : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Min Rating: </span>
            <span style={{ color: '#FFD700', marginLeft: '5px' }}>
              {'★'.repeat(Math.floor(minRatingFilter))}
              {minRatingFilter % 1 === 0.5 ? '½' : ''}
              {'☆'.repeat(5 - Math.ceil(minRatingFilter))}
            </span>
            <span style={{ marginLeft: '5px' }}>({minRatingFilter})</span>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
            
            <div className="filter-section">
              <h3>Availability</h3>
              <div className="availability-filter">
              <label className="availability-option">
                <input 
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => {
                    // Update the inStock filter state
                    setInStock(e.target.checked);
                    console.log('In Stock filter:', inStock);
                  }}
                /> 
                  In Stock
                </label>
              </div>
            </div>
            
            <button 
              className="reset-filters-btn"
              onClick={() => {resetFilters();
              }}
            >
              Reset Filters
            </button>
          </aside>
          
          {/* Main product grid */}
          <main className="market-main">
            <div className="market-controls">
            <div className="results-count">
              {loading ? 'Loading products...' : 
                `Showing ${filteredProducts.length} of ${totalItems} product${totalItems !== 1 ? 's' : ''}`
              }
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
                {filteredProducts.map((product,index) => (
                    <div 
                    className="product-card" 
                    key={product.id || product._id}
                    ref={index === filteredProducts.length - 1 ? lastProductRef : null}
                  >
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
                        {product.stock>0?(<button 
                          className="product-add-cart-btn"
                          onClick={(e) => handleAddToCart(product, e)}
                        >
                          Add to Cart
                        </button>):
                        (<button 
                          className="product-out-of-stock-btn"
                          disabled
                      > Out of Stock</button>)}
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
                {/* Loading more products indicator */}
                {loadingMore && (
                    <div className="loading-more" style={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      background: 'rgba(255,255,255,0.8)',
                      zIndex: 5
                    }}>
                      <ClipLoader color="#4CAF50" size={30} loading={loadingMore} />
                      <p style={{ marginLeft: '10px' }}>Loading more products...</p>
                    </div>
                  )}
              </div>
            ) : (
              <div className="no-results">
                <p>No products found matching your filters.</p>
                <button 
              className="reset-filters-btn"
              onClick={() => {
              resetFilters(); }}
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