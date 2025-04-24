// // Market.jsx
// import React, { useState, useEffect } from 'react';
// import './Market.css';
// import axios from 'axios';
// import ClipLoader from 'react-spinners/ClipLoader';  // Import the spinner component


// const Market = () => {
//   // State for products and filters
//   //We need models for the products and wishlist(Link the wishlist to the user)
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [priceRange, setPriceRange] = useState([0, 100]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortBy, setSortBy] = useState('featured');
//   const [wishlist, setWishlist] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [loading, setLoading] = useState(true);  // New state for loading
  

  
//   // Initialize products and categories on component mount
// // Update the useEffect that fetches products
// useEffect(() => {
//   setLoading(true); // Set loading to true before fetching
//   axios
//     .get('http://localhost:3000/api/v1/market/public', { withCredentials: true })
//     .then(response => {
//       let productsData = response.data.products;
//       if(!productsData || productsData.length === 0) {
//         console.error('No products found in the response');
//       } else {
//         console.log('Fetched products:', productsData);
//       }
//       setProducts(productsData);
//       setFilteredProducts(productsData);

//       // Extract unique categories
//       const uniqueCategories = [...new Set(productsData.map(product => product.category))];
//       setCategories(uniqueCategories);
      
//       setLoading(false); // Set loading to false after fetching
//     })
//     .catch(error => {
//       console.error('Error fetching products:', error.message, error.response);
//       setLoading(false); // Also set loading to false if there's an error
//     });
// }, []);

  
//   // Filter products when filters change
//   useEffect(() => {
//     let result = [...products];
    
//     // Filter by category
//     if (activeCategory !== 'all') {
//       result = result.filter(product => product.category === activeCategory);
//     }
    
//     // Filter by price range
//     result = result.filter(product => 
//       product.price >= priceRange[0] && product.price <= priceRange[1]
//     );
    
//     // Filter by search query
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(product => 
//         product.name.toLowerCase().includes(query) || 
//         product.description.toLowerCase().includes(query)
//       );
//     }
    
//     // Sort products
//     switch(sortBy) {
//       case 'price-low':
//         result.sort((a, b) => a.price - b.price);
//         break;
//       case 'price-high':
//         result.sort((a, b) => b.price - a.price);
//         break;
//       case 'rating':
//         result.sort((a, b) => b.rating - a.rating);
//         break;
//       default:
//         // 'featured' - no specific sorting
//         break;
//     }
    
//     setFilteredProducts(result);
//   }, [activeCategory, priceRange, searchQuery, sortBy, products]);
  
//   // Toggle wishlist status
//   const toggleWishlist = (productId) => {
//     if (wishlist.includes(productId)) {
//       setWishlist(wishlist.filter(id => id !== productId));
//     } else {
//       setWishlist([...wishlist, productId]);
//     }
//   };
  
//   // Add to cart
//   const addToCart = (product) => {
//     const existingItem = cart.find(item => item.id === product.id);
    
//     if (existingItem) {
//       setCart(cart.map(item => 
//         item.id === product.id 
//           ? { ...item, quantity: item.quantity + 1 } 
//           : item
//       ));
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
//   };
  
//   // Remove from cart
//   const removeFromCart = (productId) => {
//     setCart(cart.filter(item => item.id !== productId));
//   };
  
//   // Update cart item quantity
//   const updateCartQuantity = (productId, newQuantity) => {
//     if (newQuantity < 1) return;
    
//     setCart(cart.map(item => 
//       item.id === productId 
//         ? { ...item, quantity: newQuantity } 
//         : item
//     ));
//   };
  
//   // Calculate cart total
//   const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
//   return (
//     <div className="market-page">
//       <div className="market-header">
//         <div className="container">
//           <h1>Plant Marketplace</h1>
//           <p>Discover our curated selection of plants, pots, tools, and accessories.</p>
          
//           <div className="search-bar">
//             <input 
//               type="text" 
//               placeholder="Search products..." 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <button className="search-button">Search</button>
//           </div>
//         </div>
//       </div>
      
//             {/* Main Market Content */}
//             <div className="market-content container">
//         <div className="market-layout">
//           {/* Sidebar with filters */}
//           <aside className="market-sidebar">
//             <div className="filter-section">
//               <h3>Categories</h3>
//               <ul className="category-list">
//                 <li 
//                   className={activeCategory === 'all' ? 'active' : ''}
//                   onClick={() => setActiveCategory('all')}
//                 >
//                   All Products
//                 </li>
//                 {categories.map(category => (
//                   <li 
//                     key={category}
//                     className={activeCategory === category ? 'active' : ''}
//                     onClick={() => setActiveCategory(category)}
//                   >
//                     {category.charAt(0).toUpperCase() + category.slice(1)}
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div className="filter-section">
//               <h3>Price Range</h3>
//               <div className="price-range-control">
//                 <input 
//                   type="range" 
//                   min="0" 
//                   max="100" 
//                   value={priceRange[1]} 
//                   onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                   className="price-slider"
//                 />
//                 <div className="price-inputs">
//                   <div>
//                     <span className="price-label">Min:</span>
//                     <span className="price-value">${priceRange[0]}</span>
//                   </div>
//                   <div>
//                     <span className="price-label">Max:</span>
//                     <span className="price-value">${priceRange[1]}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="filter-section">
//               <h3>Seller Rating</h3>
//               <div className="rating-filter">
//                 <label className="rating-option">
//                   <input type="checkbox" /> 4★ & above
//                 </label>
//                 <label className="rating-option">
//                   <input type="checkbox" /> 3★ & above
//                 </label>
//               </div>
//             </div>
            
//             <div className="filter-section">
//               <h3>Availability</h3>
//               <div className="availability-filter">
//                 <label className="availability-option">
//                   <input type="checkbox" /> In Stock
//                 </label>
//                 <label className="availability-option">
//                   <input type="checkbox" /> Ships in 24 Hours
//                 </label>
//               </div>
//             </div>
            
//             <button className="reset-filters-btn">Reset Filters</button>
//           </aside>
          
//           {/* Main product grid */}
//           <main className="market-main">
//             <div className="market-controls">
//               <div className="results-count">
//                 {loading ? 'Loading products...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
//               </div>
//               <div className="sort-control">
//                 <label htmlFor="sort-select">Sort by:</label>
//                 <select 
//                   id="sort-select" 
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                 >
//                   <option value="featured">Featured</option>
//                   <option value="price-low">Price: Low to High</option>
//                   <option value="price-high">Price: High to Low</option>
//                   <option value="rating">Highest Rated</option>
//                 </select>
//               </div>
//             </div>
            
//             {loading ? (
//               <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
//                 <ClipLoader color="#4CAF50" size={60} loading={loading} />
//                 <p style={{ marginLeft: '15px', fontSize: '18px' }}>Loading products...</p>
//               </div>
//             ) : filteredProducts.length > 0 ? (
//               <div className="products-grid">
//                 {filteredProducts.map(product => (
//                   <div className="product-card" key={product.id}>
//                     {product.badge && (
//                       <span className="product-badge">{product.badge}</span>
//                     )}
                    
//                     {/* Replace this placeholder div with an actual image */}
//                     <div className="product-image-container">
//                       <img 
//                         src={product.image} 
//                         alt={product.name} 
//                         className="product-image" 
//                       />
//                     </div>
                    
//                     <div className="product-info">
//                       <h3 className="product-name">{product.name}</h3>
//                       <div className="product-meta">
//                         <div className="product-category">{product.category}</div>
//                         <div className="product-rating">
//                           <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
//                           <span className="rating-value">{product.rating}</span>
//                         </div>
//                       </div>
//                       <p className="product-description">{product.description.substring(0, 80)}...</p>
//                       <div className="product-price-row">
//                         <span className="product-price">${product.price.toFixed(2)}</span>
//                         <button 
//                           className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
//                           onClick={() => toggleWishlist(product.id)}
//                         >
//                           {wishlist.includes(product.id) ? '❤️' : '♡'}
//                         </button>
//                       </div>
//                       <div className="product-actions">
//                         <button 
//                           className="add-to-cart-btn"
//                           onClick={() => addToCart(product)}
//                         >
//                           Add to Cart
//                         </button>
//                         <button className="view-details-btn">View Details</button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="no-results">
//                 <p>No products found matching your filters.</p>
//                 <button 
//                   className="reset-btn"
//                   onClick={() => {
//                     setActiveCategory('all');
//                     setPriceRange([0, 100]);
//                     setSearchQuery('');
//                   }}
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
      
      
//       {/* Shopping Cart Sidebar */}
//       <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
//         <div className="cart-header">
//           <h2>Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h2>
//           <button 
//             className="close-cart-btn"
//             onClick={() => setIsCartOpen(false)}
//           >
//             ×
//           </button>
//         </div>
        
//         {cart.length > 0 ? (
//           <>
//             <div className="cart-items">
//               {cart.map(item => (
//                 <div className="cart-item" key={item.id}>
//                   {/* Replace this placeholder div with an actual image */}
//                   <div className="cart-item-image">
//                     <img 
//                       src={item.image} 
//                       alt={item.name} 
//                       className="cart-item-img" 
//                     />
//                   </div>
//                   <div className="cart-item-details">
//                     <h4>{item.name}</h4>
//                     <div className="cart-item-price">${item.price.toFixed(2)}</div>
//                     <div className="cart-item-controls">
//                       <div className="quantity-control">
//                         <button 
//                           onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
//                           disabled={item.quantity <= 1}
//                         >
//                           -
//                         </button>
//                         <span>{item.quantity}</span>
//                         <button 
//                           onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
//                           disabled={item.quantity >= item.stock}
//                         >
//                           +
//                         </button>
//                       </div>
//                       <button 
//                         className="remove-item-btn"
//                         onClick={() => removeFromCart(item.id)}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <div className="cart-summary">
//               <div className="cart-total">
//                 <span>Total:</span>
//                 <span>${cartTotal.toFixed(2)}</span>
//               </div>
              
//               <div className="cart-actions">
//                 <button className="checkout-btn">Proceed to Checkout</button>
//                 <button 
//                   className="continue-shopping-btn"
//                   onClick={() => setIsCartOpen(false)}
//                 >
//                   Continue Shopping
//                 </button>
//               </div>
              
//               <div className="cart-promo">
//                 <input type="text" placeholder="Enter promo code" />
//                 <button>Apply</button>
//               </div>
              
//               <div className="shipping-info">
//                 <p>Free shipping on orders over $50!</p>
//                 <p>Most orders ship within 1-2 business days.</p>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="empty-cart">
//             <div className="empty-cart-icon">🛒</div>
//             <p>Your cart is empty</p>
//             <button 
//               className="continue-shopping-btn"
//               onClick={() => setIsCartOpen(false)}
//             >
//               Start Shopping
//             </button>
//           </div>
//         )}
//       </div>
      
//       {/* Cart overlay */}
//       {isCartOpen && (
//         <div 
//           className="cart-overlay"
//           onClick={() => setIsCartOpen(false)}
//         ></div>
//       )}
      
//       {/* Floating cart button */}
//       <button 
//         className="cart-floating-btn"
//         onClick={() => setIsCartOpen(true)}
//       >
//         <span className="cart-icon">🛒</span>
//         <span className="cart-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
//       </button>
      
//       {/* Promotional section */}
//       <section className="promo-section container">
//         <div className="promo-header">
//           <h2>Special Offers</h2>
//           <p>Limited time deals on select products</p>
//         </div>
        
//         <div className="promotions">
//           <div className="promo-card">
//             <div className="promo-content">
//               <h3>Summer Sale</h3>
//               <p>20% off all outdoor plants</p>
//               <span className="promo-code">SUMMER20</span>
//               <button className="promo-btn">Shop Now</button>
//             </div>
//           </div>
          
//           <div className="promo-card">
//             <div className="promo-content">
//               <h3>Bundle & Save</h3>
//               <p>Buy any 3 plants, get the 4th free</p>
//               <span className="promo-code">BUNDLE4</span>
//               <button className="promo-btn">Shop Now</button>
//             </div>
//           </div>
          
//           <div className="promo-card">
//             <div className="promo-content">
//               <h3>New Arrivals</h3>
//               <p>First-time customers get 10% off</p>
//               <span className="promo-code">WELCOME10</span>
//               <button className="promo-btn">Shop Now</button>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* Shipping policy section */}
//       <section className="shipping-section">
//         <div className="container">
//           <div className="shipping-features">
//             <div className="shipping-feature">
//               <div className="feature-icon">🚚</div>
//               <h3>Free Shipping</h3>
//               <p>On all orders over $50</p>
//             </div>
            
//             <div className="shipping-feature">
//               <div className="feature-icon">🪴</div>
//               <h3>Plant Guarantee</h3>
//               <p>30-day guarantee on all plants</p>
//             </div>
            
//             <div className="shipping-feature">
//               <div className="feature-icon">🔄</div>
//               <h3>Easy Returns</h3>
//               <p>Simple return process</p>
//             </div>
            
//             <div className="shipping-feature">
//               <div className="feature-icon">🌐</div>
//               <h3>Nationwide Delivery</h3>
//               <p>We ship to all 50 states</p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Market;
// Market.jsx
import React, { useState, useEffect } from 'react';
import './Market.css';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';  // Import the spinner component


const Market = () => {
// State for products and filters
//We need models for the products and wishlist(Link the wishlist to the user)
const [products, setProducts] = useState([]);
const [error, setError] = useState(null);
const [filteredProducts, setFilteredProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [activeCategory, setActiveCategory] = useState('all');
const [priceRange, setPriceRange] = useState([0, 100]);
const [searchQuery, setSearchQuery] = useState('');
const [sortBy, setSortBy] = useState('featured');
const [wishlist, setWishlist] = useState([]);
const [cart, setCart] = useState([]);
const [isCartOpen, setIsCartOpen] = useState(false);
const [loading, setLoading] = useState(true);  // New state for loading
const [isAddProductOpen, setIsAddProductOpen] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [newProduct, setNewProduct] = useState({
  name: '',
  category: '',
  price: '',
  description: '',
  stock: '',
  rating: 5,
  image: null,
  imageFile: null
});



// Initialize products and categories on component mount
// Update the useEffect that fetches products
useEffect(() => {
setLoading(true); // Set loading to true before fetching

// Get authentication token if available
const token = localStorage.getItem('token');
const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

axios
  .get('http://localhost:3000/api/v1/market/public', { 
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
    
    // Don't set categories here anymore, we'll get them from the dedicated endpoint
          // Extract unique categories
      // const uniqueCategories = [...new Set(productsData.map(product => product.category))];
      // setCategories(uniqueCategories);
    

    setLoading(false); // Set loading to false after fetching
  })
  .catch(error => {
    console.error('Error fetching products:', error.message, error.response);
    setLoading(false); // Also set loading to false if there's an error
  });
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

// Handle new product form changes
const handleProductChange = (e) => {
  const { name, value } = e.target;
  setNewProduct({
    ...newProduct,
    [name]: value
  });
};

//////////////////////////

// Check if user is authenticated and fetch categories on mount
useEffect(() => {
  // Check authentication
  const token = localStorage.getItem('token');
  setIsAuthenticated(!!token);
  
  // Get predefined categories from backend
  const fetchCategories = async () => {
    try {
      // const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const categoriesResponse = await axios.get(
        'http://localhost:3000/api/v1/market/categories',
        {
          // withCredentials: true,
          // headers
        }
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
        imageFile: file  // Store the original file for later upload
      });
    };
    reader.readAsDataURL(file);
  }
};

// Handle form submission
const handleSubmitProduct = async (e) => {
  e.preventDefault();
  
  try {
    // Set submitting state to true
    setIsSubmitting(true);
    
    // Get authentication token from localStorage (or wherever you store it)
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("You must be logged in to list a product. Please log in and try again.");
      setIsSubmitting(false);
      return;
    }
    
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
        'http://localhost:3000/api/v1/utils/upload-image?folder=products', 
        formData, 
        {
          headers: formDataHeaders,
          withCredentials: true
        }
      );
      
      // Get the image URL from the response
      imageUrl = imageResponse.data.imageUrl;
      console.log(imageUrl)
    }
    
    // Step 2: Create the product object with the image URL
    const productToAdd = {
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
      stock: parseInt(newProduct.stock),
      rating: parseFloat(newProduct.rating),
      image: imageUrl // Use the URL from Firebase
    };
    console.log(productToAdd)
    // Step 3: Send the product data to your MongoDB API
    const productResponse = await axios.post(
      'http://localhost:3000/api/v1/market', 
      productToAdd, 
      {
        headers: authHeaders,
        withCredentials: true
      }
    );
    
    console.log(productResponse)
    // Step 4: Add the new product to the local state
    const addedProduct = productResponse.data.product; // Assuming your API returns the created product
    
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
      rating: 5,
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
            onClick={() => {
              if (!isAuthenticated) {
                alert("You must be logged in to sell products. Please log in and try again.");
                // Optionally redirect to login page
                // window.location.href = '/login';
              } else {
                setIsAddProductOpen(true);
              }
            }}
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
                onChange={handleProductChange}
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
                  onChange={handleProductChange}
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
                  onChange={handleProductChange}
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
                onChange={handleProductChange}
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
            
            <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
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
                  onChange={handleProductChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  }}
                />
              </div>
              
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="rating" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Initial Rating (1-5)
                </label>
                <input 
                  type="number" 
                  id="rating" 
                  name="rating"
                  min="1" 
                  max="5" 
                  step="0.1"
                  value={newProduct.rating}
                  onChange={handleProductChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  }}
                />
              </div>
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