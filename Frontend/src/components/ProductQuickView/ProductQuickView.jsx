
// // // ///////////////////////
// // // ///////////new
// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import { useCart } from '../../CartContext';
// // // import { useWishlist } from '../../WishlistContext';
// // // import ProductRating from '../ProductRating/ProductRating';
// // // import ProductReviews from '../ProductRating/ProductReviews';
// // // import './ProductQuickView.css';

// // // // You might want to define this elsewhere and import it
// // // const API_BASE_URL = process.env.backned || 'http://localhost:3000';

// // // const ProductQuickView = ({ product, isOpen, onClose, onProductUpdate }) => {
// // //   const [quantity, setQuantity] = useState(1);
// // //   const [activeTab, setActiveTab] = useState('description');
// // //   const [newReview, setNewReview] = useState(null);
// // //   const [isAuthenticated, setIsAuthenticated] = useState(false);
  
// // //   const { addToCart } = useCart();
// // //   const { toggleWishlistItem, isInWishlist } = useWishlist();
  
// // //   // Check authentication status
// // //   useEffect(() => {
// // //     const checkAuth = async () => {
// // //       try {
// // //         // Example: Check if auth token exists in local storage
// // //         const token = localStorage.getItem('token');
        
// // //         if (token) {
// // //           // Verify token with backend
// // //           const response = await axios.get(`${API_BASE_URL}/api/v1/auth/verify`, {
// // //             headers: {
// // //               Authorization: `Bearer ${token}`
// // //             }
// // //           });
// // //           console.log('Auth response:', response);
// // //           if (response.status === 200) {
// // //             setIsAuthenticated(true);
// // //           } else {
// // //             setIsAuthenticated(false);
// // //             // If token is invalid, remove it from localStorage
// // //             localStorage.removeItem('token');
// // //           }
// // //         } else {
// // //           setIsAuthenticated(false);
// // //         }
// // //       } catch (error) {
// // //         console.error('Error checking authentication status:', error);
// // //         setIsAuthenticated(false);
// // //         // If verification fails, remove the token from localStorage
// // //         localStorage.removeItem('token');
// // //       }
// // //     };
    
// // //     checkAuth();
// // //   }, []);
  
// // //   // Simply return null when modal is closed or no product
// // //   if (!isOpen || !product) {
// // //     return null;
// // //   }
  
// // //   // Get product ID (support both id and _id for MongoDB)
// // //   const productId = product.id || product._id;
  
// // //   const handleQuantityChange = (e) => {
// // //     const value = parseInt(e.target.value);
// // //     if (value > 0 && value <= product.stock) {
// // //       setQuantity(value);
// // //     }
// // //   };
  
// // //   const incrementQuantity = () => {
// // //     if (quantity < product.stock) {
// // //       setQuantity(quantity + 1);
// // //     }
// // //   };
  
// // //   const decrementQuantity = () => {
// // //     if (quantity > 1) {
// // //       setQuantity(quantity - 1);
// // //     }
// // //   };
  
// // //   const handleAddToCart = () => {
// // //     addToCart({ ...product, quantity });
// // //     onClose();
// // //   };
  
// // //   const handleWishlistToggle = () => {
// // //     toggleWishlistItem(product);
// // //   };
  
// // //   const handleRatingSubmit = async (review) => {
// // //     // Check if user is authenticated before allowing review submission
// // //     if (!isAuthenticated) {
// // //       // You could redirect to login or show a modal here
// // //       alert('Please login to submit a review');
// // //       return;
// // //     }
    
// // //     try {
// // //       // Get the JWT token
// // //       const token = localStorage.getItem('token');
      
// // //       // Submit the review to your backend API
// // //       const response = await axios.post(
// // //         `${API_BASE_URL}/api/v1/reviews/product/${productId}`, 
// // //         { 
// // //           rating: review.rating,
// // //           comment: review.comment,
// // //           isUpdate: review.isUpdate,
// // //           oldRating: review.oldRating
// // //         },
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${token}`
// // //           }
// // //         }
// // //       );
      
// // //       // If submission was successful, update the local state
// // //       if (response.status === 201 || response.status === 200) {
// // //         setNewReview(review);
        
// // //         // Update the product rating in the parent component
// // //         if (product && product.numRatings !== undefined && onProductUpdate) {
// // //           // Create a copy of the product to update
// // //           const updatedProduct = { ...product };
          
// // //           // If this is a new review, increment the review count
// // //           if (!review.isUpdate) {
// // //             updatedProduct.numRatings += 1;
// // //           }
          
// // //           // Calculate the new average rating
// // //           let newAverageRating;
          
// // //           if (review.isUpdate) {
// // //             // For updated reviews, we need to remove the old rating's impact and add the new one
// // //             const oldTotalPoints = updatedProduct.averageRating * updatedProduct.numRatings;
// // //             const newTotalPoints = oldTotalPoints - review.oldRating + review.rating;
// // //             newAverageRating = newTotalPoints / updatedProduct.numRatings;
// // //           } else {
// // //             // For new reviews, just add the new rating to the total
// // //             const oldTotalPoints = updatedProduct.averageRating * updatedProduct.numRatings;
// // //             const newTotalPoints = oldTotalPoints + review.rating;
// // //             newAverageRating = newTotalPoints / updatedProduct.numRatings;
// // //           }
          
// // //           updatedProduct.averageRating = newAverageRating;
          
// // //           // Update the product in the parent component
// // //           onProductUpdate(updatedProduct);
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.error('Error submitting review:', error);
// // //       alert('Failed to submit review. Please try again.');
// // //     }
// // //   };
  
// // //   const handleImageError = (e) => {
// // //     e.target.onerror = null;
// // //     e.target.src = "https://via.placeholder.com/300x300?text=Product+Image";
// // //   };
  
// // //   return (
// // //     <div className="quick-view-modal-overlay" onClick={onClose}>
// // //       <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
// // //         <button className="close-modal-btn" onClick={onClose}>×</button>
        
// // //         <div className="quick-view-content">
// // //           <div className="quick-view-image-container">
// // //             <img 
// // //               src={product.image} 
// // //               alt={product.name} 
// // //               className="quick-view-image"
// // //               onError={handleImageError}
// // //             />
// // //             {product.badge && (
// // //               <span className="quick-view-badge">{product.badge}</span>
// // //             )}
// // //           </div>
          
// // //           <div className="quick-view-details">
// // //             <h2 className="quick-view-name">{product.name}</h2>
            
// // //             <div className="quick-view-category">
// // //               <span className="category-icon">
// // //                 {product.category === 'indoor' ? '🏠' : 
// // //                  product.category === 'outdoor' ? '🌳' : 
// // //                  product.category === 'hanging' ? '🌵' : '🌿'}
// // //               </span>
// // //               <span className="category-name">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
// // //             </div>
            
// // //             <div className="quick-view-rating">
// // //               <ProductRating 
// // //                 product={product} 
// // //                 isAuthenticated={isAuthenticated}
// // //                 onRatingSubmit={handleRatingSubmit}
// // //               />
// // //             </div>
            
// // //             <div className="quick-view-price">
// // //               <span className="price-label">Price:</span>
// // //               <span className="price-value">${product.price.toFixed(2)}</span>
// // //             </div>
            
// // //             <div className="quick-view-description">
// // //               <h3>Description</h3>
// // //               <p>{product.description}</p>
// // //             </div>
            
// // //             <div className="product-availability">
// // //               {product.stock > 0 ? (
// // //                 <span className="in-stock">In Stock ({product.stock} available)</span>
// // //               ) : (
// // //                 <span className="out-of-stock">Out of Stock</span>
// // //               )}
// // //             </div>
            
// // //             <div className="quantity-selector">
// // //               <button 
// // //                 className="quantity-btn"
// // //                 onClick={decrementQuantity}
// // //                 disabled={quantity <= 1}
// // //               >
// // //                 -
// // //               </button>
// // //               <input
// // //                 type="number"
// // //                 value={quantity}
// // //                 onChange={handleQuantityChange}
// // //                 min="1"
// // //                 max={product.stock}
// // //               />
// // //               <button 
// // //                 className="quantity-btn"
// // //                 onClick={incrementQuantity}
// // //                 disabled={quantity >= product.stock}
// // //               >
// // //                 +
// // //               </button>
// // //             </div>
            
// // //             <div className="quick-view-actions">
// // //               <button 
// // //                 className="quick-view-add-btn" 
// // //                 onClick={handleAddToCart}
// // //                 disabled={product.stock <= 0}
// // //               >
// // //                 Add to Cart
// // //               </button>
// // //               <button 
// // //                 className={`quick-view-wishlist-btn ${isInWishlist(productId) ? 'active' : ''}`}
// // //                 onClick={handleWishlistToggle}
// // //               >
// // //                 {isInWishlist(productId) ? '❤️ Remove from Wishlist' : '♡ Add to Wishlist'}
// // //               </button>
// // //             </div>
            
// // //             <div className="product-tabs">
// // //               <div className="tab-buttons">
// // //                 <button 
// // //                   className={activeTab === 'description' ? 'active' : ''}
// // //                   onClick={() => setActiveTab('description')}
// // //                 >
// // //                   Description
// // //                 </button>
// // //                 <button 
// // //                   className={activeTab === 'reviews' ? 'active' : ''}
// // //                   onClick={() => setActiveTab('reviews')}
// // //                 >
// // //                   Reviews ({product.numRatings || 0})
// // //                 </button>
// // //               </div>
              
// // //               <div className="tab-content">
// // //                 {activeTab === 'description' ? (
// // //                   <div className="description-tab">
// // //                     <p>{product.description}</p>
// // //                   </div>
// // //                 ) : (
// // //                   <div className="reviews-tab">
// // //                     <ProductReviews 
// // //                       productId={productId} 
// // //                       newReview={newReview}
// // //                     />
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default ProductQuickView;


// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useCart } from '../../CartContext';
// // import { useWishlist } from '../../WishlistContext';
// // import { useAuth } from '../Auth/AuthContext';
// // import ProductRating from '../ProductRating/ProductRating';
// // import ProductReviews from '../ProductRating/ProductReviews';
// // import './ProductQuickView.css';

// // // Consistent API base URL
// // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// // const ProductQuickView = ({ product, isOpen, onClose, onProductUpdate }) => {
// //   const [quantity, setQuantity] = useState(1);
// //   const [activeTab, setActiveTab] = useState('description');
// //   const [newReview, setNewReview] = useState(null);
  
// //   const { addToCart } = useCart();
// //   const { toggleWishlistItem, isInWishlist } = useWishlist();
// //   const { isAuthenticated, requireAuth, registerCallback } = useAuth();
  
// //   // Register callback function for adding review after login
// //   useEffect(() => {
// //     if (product) {
// //       registerCallback('submitProductReview', handleRatingSubmit);
      
// //       // Register wishlist toggle callback - moved inside this useEffect
// //       registerCallback('toggleProductWishlist', (product) => {
// //         toggleWishlistItem(product);
// //       });
// //     }
// //   }, [product]);
  
// //   // Simply return null when modal is closed or no product
// //   if (!isOpen || !product) {
// //     return null;
// //   }
  
// //   // Get product ID (support both id and _id for MongoDB)
// //   const productId = product.id || product._id;
  
// //   const handleQuantityChange = (e) => {
// //     const value = parseInt(e.target.value);
// //     if (value > 0 && value <= product.stock) {
// //       setQuantity(value);
// //     }
// //   };
  
// //   const incrementQuantity = () => {
// //     if (quantity < product.stock) {
// //       setQuantity(quantity + 1);
// //     }
// //   };
  
// //   const decrementQuantity = () => {
// //     if (quantity > 1) {
// //       setQuantity(quantity - 1);
// //     }
// //   };
  
// //   const handleAddToCart = () => {
// //     addToCart({ ...product, quantity });
// //     onClose();
// //   };
  
// //   const handleWishlistToggle = () => {
// //     // Check if user is authenticated before allowing wishlist action
// //     if (requireAuth({
// //       type: 'CALLBACK',
// //       payload: {
// //         callbackName: 'toggleProductWishlist',
// //         args: [product]
// //       }
// //     })) {
// //       toggleWishlistItem(product);
// //     }
// //   };
  
// //   const handleRatingSubmit = async (review) => {
// //     // Check if user is authenticated before allowing review submission
// //     if (!requireAuth({
// //       type: 'CALLBACK',
// //       payload: {
// //         callbackName: 'submitProductReview',
// //         args: [review]
// //       }
// //     })) {
// //       return;
// //     }
    
// //     try {
// //       // Get the JWT token
// //       const token = localStorage.getItem('token');
      
// //       // Submit the review to your backend API
// //       const response = await axios.post(
// //         `${API_BASE_URL}/api/v1/reviews/product/${productId}`, 
// //         { 
// //           rating: review.rating,
// //           comment: review.comment,
// //           isUpdate: review.isUpdate,
// //           oldRating: review.oldRating
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`
// //           }
// //         }
// //       );
      
// //       // If submission was successful, update the local state
// //       if (response.status === 201 || response.status === 200) {
// //         setNewReview(review);
        
// //         // Update the product rating in the parent component
// //         if (product && product.numRatings !== undefined && onProductUpdate) {
// //           // Create a copy of the product to update
// //           const updatedProduct = { ...product };
          
// //           // If this is a new review, increment the review count
// //           if (!review.isUpdate) {
// //             updatedProduct.numRatings += 1;
// //           }
          
// //           // Calculate the new average rating
// //           let newAverageRating;
          
// //           if (review.isUpdate) {
// //             // For updated reviews, we need to remove the old rating's impact and add the new one
// //             const oldTotalPoints = updatedProduct.averageRating * updatedProduct.numRatings;
// //             const newTotalPoints = oldTotalPoints - review.oldRating + review.rating;
// //             newAverageRating = newTotalPoints / updatedProduct.numRatings;
// //           } else {
// //             // For new reviews, just add the new rating to the total
// //             const oldTotalPoints = (updatedProduct.averageRating || 0) * updatedProduct.numRatings;
// //             const newTotalPoints = oldTotalPoints + review.rating;
// //             newAverageRating = newTotalPoints / updatedProduct.numRatings;
// //           }
          
// //           updatedProduct.averageRating = newAverageRating;
          
// //           // Update the product in the parent component
// //           onProductUpdate(updatedProduct);
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error submitting review:', error);
// //       alert('Failed to submit review. Please try again.');
// //     }
// //   };
  
// //   const handleImageError = (e) => {
// //     e.target.onerror = null;
// //     e.target.src = "https://via.placeholder.com/300x300?text=Product+Image";
// //   };
  
// //   return (
// //     <div className="quick-view-modal-overlay" onClick={onClose}>
// //       <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
// //         <button className="close-modal-btn" onClick={onClose}>×</button>
        
// //         <div className="quick-view-content">
// //           <div className="quick-view-image-container">
// //             <img 
// //               src={product.image} 
// //               alt={product.name} 
// //               className="quick-view-image"
// //               onError={handleImageError}
// //             />
// //             {product.badge && (
// //               <span className="quick-view-badge">{product.badge}</span>
// //             )}
// //           </div>
          
// //           <div className="quick-view-details">
// //             <h2 className="quick-view-name">{product.name}</h2>
            
// //             <div className="quick-view-category">
// //               <span className="category-icon">
// //                 {product.category === 'indoor' ? '🏠' : 
// //                  product.category === 'outdoor' ? '🌳' : 
// //                  product.category === 'hanging' ? '🌵' : '🌿'}
// //               </span>
// //               <span className="category-name">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
// //             </div>
            
// //             <div className="quick-view-rating">
// //               <ProductRating 
// //                 product={product} 
// //                 isAuthenticated={isAuthenticated}
// //                 onRatingSubmit={handleRatingSubmit}
// //               />
// //             </div>
            
// //             <div className="quick-view-price">
// //               <span className="price-label">Price:</span>
// //               <span className="price-value">${product.price.toFixed(2)}</span>
// //             </div>
            
// //             <div className="quick-view-description">
// //               <h3>Description</h3>
// //               <p>{product.description}</p>
// //             </div>
            
// //             <div className="product-availability">
// //               {product.stock > 0 ? (
// //                 <span className="in-stock">In Stock ({product.stock} available)</span>
// //               ) : (
// //                 <span className="out-of-stock">Out of Stock</span>
// //               )}
// //             </div>
            
// //             <div className="quantity-selector">
// //               <button 
// //                 className="quantity-btn"
// //                 onClick={decrementQuantity}
// //                 disabled={quantity <= 1}
// //               >
// //                 -
// //               </button>
// //               <input
// //                 type="number"
// //                 value={quantity}
// //                 onChange={handleQuantityChange}
// //                 min="1"
// //                 max={product.stock}
// //               />
// //               <button 
// //                 className="quantity-btn"
// //                 onClick={incrementQuantity}
// //                 disabled={quantity >= product.stock}
// //               >
// //                 +
// //               </button>
// //             </div>
            
// //             <div className="quick-view-actions">
// //               <button 
// //                 className="quick-view-add-btn" 
// //                 onClick={handleAddToCart}
// //                 disabled={product.stock <= 0}
// //               >
// //                 Add to Cart
// //               </button>
// //               <button 
// //                 className={`quick-view-wishlist-btn ${isInWishlist(productId) ? 'active' : ''}`}
// //                 onClick={handleWishlistToggle}
// //               >
// //                 {isInWishlist(productId) ? '❤️ Remove from Wishlist' : '♡ Add to Wishlist'}
// //               </button>
// //             </div>
            
// //             <div className="product-tabs">
// //               <div className="tab-buttons">
// //                 <button 
// //                   className={activeTab === 'description' ? 'active' : ''}
// //                   onClick={() => setActiveTab('description')}
// //                 >
// //                   Description
// //                 </button>
// //                 <button 
// //                   className={activeTab === 'reviews' ? 'active' : ''}
// //                   onClick={() => setActiveTab('reviews')}
// //                 >
// //                   Reviews ({product.numRatings || 0})
// //                 </button>
// //               </div>
              
// //               <div className="tab-content">
// //                 {activeTab === 'description' ? (
// //                   <div className="description-tab">
// //                     <p>{product.description}</p>
// //                   </div>
// //                 ) : (
// //                   <div className="reviews-tab">
// //                     <ProductReviews 
// //                       productId={productId} 
// //                       newReview={newReview}
// //                     />
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductQuickView;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useCart } from '../../CartContext';
// import { useWishlist } from '../../WishlistContext';
// import { useAuth } from '../../components/Auth/AuthContext';
// import ProductRating from '../ProductRating/ProductRating';
// import ProductReviews from '../ProductRating/ProductReviews';
// import './ProductQuickView.css';

// // Consistent API base URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// const ProductQuickView = ({ product, isOpen, onClose, onProductUpdate }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState('description');
//   const [newReview, setNewReview] = useState(null);
  
//   const { addToCart } = useCart();
//   const { toggleWishlistItem, isInWishlist } = useWishlist();
//   const { isAuthenticated, requireAuth, registerCallback } = useAuth();
  
//   // Reset quantity when product changes or modal opens
//   useEffect(() => {
//     if (product && isOpen) {
//       setQuantity(1);
//     }
//   }, [product, isOpen]);
  
//   // Register callback functions for actions after login
//   useEffect(() => {
//     if (product) {
//       registerCallback('submitProductReview', handleRatingSubmit);
//       registerCallback('deleteProductReview', handleDeleteRating);
//       registerCallback('toggleProductWishlist', (product) => {
//         toggleWishlistItem(product);
//       });
//     }
    
//     // Clean up callbacks when component unmounts
//     return () => {
//       // Ideally you would have an unregisterCallback function in your AuthContext
//       // unregisterCallback('submitProductReview');
//       // unregisterCallback('deleteProductReview');
//       // unregisterCallback('toggleProductWishlist');
//     };
//   }, [product, registerCallback]);
  
//   // Simply return null when modal is closed or no product
//   if (!isOpen || !product) {
//     return null;
//   }
  
//   // Get product ID (support both id and _id for MongoDB)
//   const productId = product.id || product._id;
  
//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value);
//     if (value > 0 && value <= product.stock) {
//       setQuantity(value);
//     }
//   };
  
//   const incrementQuantity = () => {
//     if (quantity < product.stock) {
//       setQuantity(quantity + 1);
//     }
//   };
  
//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       setQuantity(quantity - 1);
//     }
//   };
  
//   const handleAddToCart = () => {
//     addToCart({ ...product, quantity });
//     onClose();
//   };
  
//   const handleWishlistToggle = () => {
//     // Check if user is authenticated before allowing wishlist action
//     if (requireAuth({
//       type: 'CALLBACK',
//       payload: {
//         callbackName: 'toggleProductWishlist',
//         args: [product]
//       }
//     })) {
//       toggleWishlistItem(product);
//     }
//   };
  
//   const handleRatingSubmit = async (review) => {
//     // Authentication check is now handled in the ProductRating component
//     try {
//       // Get the JWT token
//       const token = localStorage.getItem('token');
      
//       // Submit the review to your backend API
//       const response = await axios.post(
//         `${API_BASE_URL}/api/v1/reviews/product/${productId}`, 
//         { 
//           rating: review.rating,
//           comment: review.comment,
//           isUpdate: review.isUpdate || false,
//           oldRating: review.oldRating || 0
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
      
//       // If submission was successful, update the local state
//       if (response.status === 201 || response.status === 200) {
//         setNewReview(review);
        
//         // Update the product rating in the parent component
//         if (product && onProductUpdate) {
//           // Create a copy of the product to update
//           const updatedProduct = { ...product };
          
//           // Make sure numRatings exists and is a number
//           updatedProduct.numRatings = updatedProduct.numRatings || 0;
          
//           // If this is a new review, increment the review count
//           if (!review.isUpdate) {
//             updatedProduct.numRatings += 1;
//           }
          
//           // Calculate the new average rating
//           let newAverageRating = 0;
          
//           if (review.isUpdate) {
//             // For updated reviews, we need to remove the old rating's impact and add the new one
//             const oldTotalPoints = (updatedProduct.averageRating || 0) * updatedProduct.numRatings;
//             const newTotalPoints = oldTotalPoints - review.oldRating + review.rating;
//             newAverageRating = updatedProduct.numRatings > 0 ? newTotalPoints / updatedProduct.numRatings : 0;
//           } else {
//             // For new reviews, just add the new rating to the total
//             const oldTotalPoints = (updatedProduct.averageRating || 0) * updatedProduct.numRatings;
//             const newTotalPoints = oldTotalPoints + review.rating;
//             newAverageRating = updatedProduct.numRatings > 0 ? newTotalPoints / updatedProduct.numRatings : review.rating;
//           }
          
//           updatedProduct.averageRating = newAverageRating;
          
//           // Update the product in the parent component
//           onProductUpdate(updatedProduct);
//         }
//       }
//     } catch (error) {
//       console.error('Error submitting review:', error);
//       alert('Failed to submit review. Please try again.');
//     }
//   };

//   const handleDeleteRating = async (reviewId) => {
//     // Authentication check is now handled in the ProductRating/ProductReviews components
//     try {
//       // Get the JWT token
//       const token = localStorage.getItem('token');
      
//       console.log("Deleting review with ID:", reviewId);
      
//       // Delete the review via your backend API
//       const response = await axios.delete(
//         `${API_BASE_URL}/api/v1/reviews/${reviewId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
      
//       console.log("Delete response:", response);
      
//       // If deletion was successful, update the local state
//       if (response.status === 200 || response.status === 204) {
//         // Create a copy of the product to update
//         const updatedProduct = { ...product };
        
//         // Get the deleted review's rating to subtract from total
//         // If the rating is included in the response, use that, otherwise default to 0
//         const deletedRating = response.data?.rating || 0;
        
//         // Decrement the review count
//         updatedProduct.numRatings = Math.max(0, (updatedProduct.numRatings || 0) - 1);
        
//         // Recalculate the average rating
//         if (updatedProduct.numRatings > 0) {
//           const oldTotalPoints = (updatedProduct.averageRating || 0) * (updatedProduct.numRatings + 1);
//           const newTotalPoints = oldTotalPoints - deletedRating;
//           updatedProduct.averageRating = newTotalPoints / updatedProduct.numRatings;
//         } else {
//           updatedProduct.averageRating = 0;
//         }
        
//         // Update the product in the parent component
//         onProductUpdate(updatedProduct);
        
//         // Set newReview to trigger a refresh in ProductReviews
//         setNewReview({ deleted: true, reviewId });
        
//         // Show success message
//         console.log("Review deleted successfully");
//       }
//     } catch (error) {
//       console.error('Error deleting review:', error);
      
//       // Check for specific error types
//       if (error.response) {
//         if (error.response.status === 401) {
//           alert("Authentication failed. Please log in again.");
//         } else if (error.response.status === 403) {
//           alert("You don't have permission to delete this review.");
//         } else {
//           alert(`Failed to delete review: ${error.response.data?.message || 'Server error'}`);
//         }
//       } else {
//         alert("Failed to delete review. Please try again.");
//       }
//     }
//   };
  
//   const handleImageError = (e) => {
//     e.target.onerror = null;
//     e.target.src = "https://via.placeholder.com/300x300?text=Product+Image";
//   };
  
//   return (
//     <div className="quick-view-modal-overlay" onClick={onClose}>
//       <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
//         <button className="close-modal-btn" onClick={onClose}>×</button>
        
//         <div className="quick-view-content">
//           <div className="quick-view-image-container">
//             <img 
//               src={product.image} 
//               alt={product.name} 
//               className="quick-view-image"
//               onError={handleImageError}
//             />
//             {product.badge && (
//               <span className="quick-view-badge">{product.badge}</span>
//             )}
//           </div>
          
//           <div className="quick-view-details">
//             <h2 className="quick-view-name">{product.name}</h2>
            
//             <div className="quick-view-category">
//               <span className="category-icon">
//                 {product.category === 'indoor' ? '🏠' : 
//                  product.category === 'outdoor' ? '🌳' : 
//                  product.category === 'hanging' ? '🌵' : '🌿'}
//               </span>
//               <span className="category-name">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
//             </div>
            
//             <div className="quick-view-rating">
//               <ProductRating 
//                 product={product}
//                 onRatingSubmit={handleRatingSubmit}
//                 onDeleteRating={handleDeleteRating}
//               />
//             </div>
            
//             <div className="quick-view-price">
//               <span className="price-label">Price:</span>
//               <span className="price-value">${product.price.toFixed(2)}</span>
//             </div>
            
//             <div className="quick-view-description">
//               <h3>Description</h3>
//               <p>{product.description}</p>
//             </div>
            
//             <div className="product-availability">
//               {product.stock > 0 ? (
//                 <span className="in-stock">In Stock ({product.stock} available)</span>
//               ) : (
//                 <span className="out-of-stock">Out of Stock</span>
//               )}
//             </div>
            
//             <div className="quantity-selector">
//               <button 
//                 className="quantity-btn"
//                 onClick={decrementQuantity}
//                 disabled={quantity <= 1}
//               >
//                 -
//               </button>
//               <input
//                 type="number"
//                 value={quantity}
//                 onChange={handleQuantityChange}
//                 min="1"
//                 max={product.stock}
//               />
//               <button 
//                 className="quantity-btn"
//                 onClick={incrementQuantity}
//                 disabled={quantity >= product.stock}
//               >
//                 +
//               </button>
//             </div>
            
//             <div className="quick-view-actions">
//               <button 
//                 className="quick-view-add-btn" 
//                 onClick={handleAddToCart}
//                 disabled={product.stock <= 0}
//               >
//                 Add to Cart
//               </button>
//               <button 
//                 className={`quick-view-wishlist-btn ${isInWishlist(productId) ? 'active' : ''}`}
//                 onClick={handleWishlistToggle}
//               >
//                 {isInWishlist(productId) ? '❤️ Remove from Wishlist' : '♡ Add to Wishlist'}
//               </button>
//             </div>
            
//             <div className="product-tabs">
//               <div className="tab-buttons">
//                 <button 
//                   className={activeTab === 'description' ? 'active' : ''}
//                   onClick={() => setActiveTab('description')}
//                 >
//                   Description
//                 </button>
//                 <button 
//                   className={activeTab === 'reviews' ? 'active' : ''}
//                   onClick={() => setActiveTab('reviews')}
//                 >
//                   Reviews ({product.numRatings || 0})
//                 </button>
//               </div>
              
//               <div className="tab-content">
//                 {activeTab === 'description' ? (
//                   <div className="description-tab">
//                     <p>{product.description}</p>
//                   </div>
//                 ) : (
//                   <div className="reviews-tab">
//                     <ProductReviews 
//                       productId={productId} 
//                       newReview={newReview}
//                       onDeleteRating={handleDeleteRating}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductQuickView;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../../CartContext';
import { useWishlist } from '../../WishlistContext';
import { useAuth } from '../../components/Auth/AuthContext';
import ProductRating from '../ProductRating/ProductRating';
import ProductReviews from '../ProductRating/ProductReviews';
import './ProductQuickView.css';

// Consistent API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const ProductQuickView = ({ product, isOpen, onClose, onProductUpdate }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [newReview, setNewReview] = useState(null);
  
  const { addToCart } = useCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const { isAuthenticated, requireAuth, registerCallback } = useAuth();
  
  // Reset quantity when product changes or modal opens
  useEffect(() => {
    if (product && isOpen) {
      setQuantity(1);
    }
  }, [product, isOpen]);
  
  // Register callback functions for actions after login
  useEffect(() => {
    if (product) {
      registerCallback('submitProductReview', handleRatingSubmit);
      registerCallback('deleteProductReview', handleDeleteRating);
      registerCallback('toggleProductWishlist', (product) => {
        toggleWishlistItem(product);
      });
    }
    
    // Clean up callbacks when component unmounts
    return () => {
      // Ideally you would have an unregisterCallback function in your AuthContext
      // unregisterCallback('submitProductReview');
      // unregisterCallback('deleteProductReview');
      // unregisterCallback('toggleProductWishlist');
    };
  }, [product, registerCallback]);
  
  // Simply return null when modal is closed or no product
  if (!isOpen || !product) {
    return null;
  }
  
  // Get product ID (support both id and _id for MongoDB)
  const productId = product.id || product._id;
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    onClose();
  };
  
  const handleWishlistToggle = () => {
    // Check if user is authenticated before allowing wishlist action
    if (requireAuth({
      type: 'CALLBACK',
      payload: {
        callbackName: 'toggleProductWishlist',
        args: [product]
      }
    })) {
      toggleWishlistItem(product);
    }
  };
  
  const handleRatingSubmit = async (review) => {
    try {
      // Get the JWT token
      const token = localStorage.getItem('token');
      
      // Submit the review to your backend API
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/reviews/product/${productId}`, 
        { 
          rating: review.rating,
          comment: review.comment,
          isUpdate: review.isUpdate || false,
          oldRating: review.oldRating || 0
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log("Review submission response:", response.data);
      
      // If submission was successful, update the local state
      if (response.status === 201 || response.status === 200) {
        // Set the new review to trigger a refresh in the reviews list
        setNewReview({
          ...review,
          timestamp: new Date().getTime() // Add a timestamp to ensure uniqueness
        });
        
        // Update the product rating in the parent component
        if (product && onProductUpdate) {
          // Create a copy of the product to update
          const updatedProduct = { ...product };
          
          // Make sure numRatings exists and is a number
          updatedProduct.numRatings = updatedProduct.numRatings || 0;
          
          // If this is a new review (not an update), increment the review count
          if (!review.isUpdate) {
            updatedProduct.numRatings += 1;
          }
          
          // Calculate the new average rating
          let newAverageRating = 0;
          
          if (review.isUpdate) {
            // For updated reviews, we need to remove the old rating's impact and add the new one
            const oldTotalPoints = (updatedProduct.averageRating || 0) * updatedProduct.numRatings;
            const newTotalPoints = oldTotalPoints - review.oldRating + review.rating;
            newAverageRating = updatedProduct.numRatings > 0 ? newTotalPoints / updatedProduct.numRatings : 0;
          } else {
            // For new reviews, just add the new rating to the total
            const oldTotalPoints = (updatedProduct.averageRating || 0) * updatedProduct.numRatings;
            const newTotalPoints = oldTotalPoints + review.rating;
            newAverageRating = updatedProduct.numRatings > 0 ? newTotalPoints / updatedProduct.numRatings : review.rating;
          }
          
          updatedProduct.averageRating = newAverageRating;
          
          console.log("Updating product with new rating:", newAverageRating);
          
          // Update the product in the parent component
          onProductUpdate(updatedProduct);
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      
      // Check for specific error types
      if (error.response) {
        if (error.response.status === 401) {
          alert("Authentication failed. Please log in again.");
        } else if (error.response.status === 400 && error.response.data?.message?.includes('already reviewed')) {
          alert("You have already reviewed this product. Please edit your existing review instead.");
        } else {
          alert(`Failed to submit review: ${error.response.data?.message || 'Server error'}`);
        }
      } else {
        alert("Failed to submit review. Please try again.");
      }
    }
  };

  const handleDeleteRating = async (reviewId) => {
    try {
      // Get the JWT token
      const token = localStorage.getItem('token');
      
      console.log("Deleting review with ID:", reviewId);
      
      // Delete the review via your backend API
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log("Delete response:", response);
      
      // If deletion was successful, update the local state
      if (response.status === 200 || response.status === 204) {
        // Create a copy of the product to update
        const updatedProduct = { ...product };
        
        // Get the deleted review's rating to subtract from total
        // If the rating is included in the response, use that, otherwise default to 0
        const deletedRating = response.data?.rating || 0;
        
        // Decrement the review count
        updatedProduct.numRatings = Math.max(0, (updatedProduct.numRatings || 0) - 1);
        
        // Recalculate the average rating
        if (updatedProduct.numRatings > 0) {
          const oldTotalPoints = (updatedProduct.averageRating || 0) * (updatedProduct.numRatings + 1);
          const newTotalPoints = oldTotalPoints - deletedRating;
          updatedProduct.averageRating = newTotalPoints / updatedProduct.numRatings;
        } else {
          updatedProduct.averageRating = 0;
        }
        
        // Update the product in the parent component
        onProductUpdate(updatedProduct);
        
        // Set newReview to trigger a refresh in ProductReviews
        setNewReview({ 
          deleted: true, 
          reviewId,
          timestamp: new Date().getTime() // Add a timestamp to ensure uniqueness
        });
        
        // Show success message
        console.log("Review deleted successfully");
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      
      // Check for specific error types
      if (error.response) {
        if (error.response.status === 401) {
          alert("Authentication failed. Please log in again.");
        } else if (error.response.status === 403) {
          alert("You don't have permission to delete this review.");
        } else if (error.response.status === 404) {
          alert("Review not found. It may have already been deleted.");
          // Refresh the reviews list anyway
          setNewReview({ 
            deleted: true, 
            reviewId: 'unknown',
            timestamp: new Date().getTime()
          });
        } else {
          alert(`Failed to delete review: ${error.response.data?.message || 'Server error'}`);
        }
      } else {
        alert("Failed to delete review. Please try again.");
      }
    }
  };
  
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/300x300?text=Product+Image";
  };
  
  return (
    <div className="quick-view-modal-overlay" onClick={onClose}>
      <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>×</button>
        
        <div className="quick-view-content">
          <div className="quick-view-image-container">
            <img 
              src={product.image} 
              alt={product.name} 
              className="quick-view-image"
              onError={handleImageError}
            />
            {product.badge && (
              <span className="quick-view-badge">{product.badge}</span>
            )}
          </div>
          
          <div className="quick-view-details">
            <h2 className="quick-view-name">{product.name}</h2>
            
            <div className="quick-view-category">
              <span className="category-icon">
                {product.category === 'indoor' ? '🏠' : 
                 product.category === 'outdoor' ? '🌳' : 
                 product.category === 'hanging' ? '🌵' : '🌿'}
              </span>
              <span className="category-name">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
            </div>
            
            <div className="quick-view-rating">
              <ProductRating 
                product={product}
                onRatingSubmit={handleRatingSubmit}
                onDeleteRating={handleDeleteRating}
              />
            </div>
            
            <div className="quick-view-price">
              <span className="price-label">Price:</span>
              <span className="price-value">${product.price.toFixed(2)}</span>
            </div>
            
            <div className="quick-view-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="product-availability">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>
            
            <div className="quantity-selector">
              <button 
                className="quantity-btn"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={product.stock}
              />
              <button 
                className="quantity-btn"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            
            <div className="quick-view-actions">
              <button 
                className="quick-view-add-btn" 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                Add to Cart
              </button>
              <button 
                className={`quick-view-wishlist-btn ${isInWishlist(productId) ? 'active' : ''}`}
                onClick={handleWishlistToggle}
              >
                {isInWishlist(productId) ? '❤️ Remove from Wishlist' : '♡ Add to Wishlist'}
              </button>
            </div>
            
            <div className="product-tabs">
              <div className="tab-buttons">
                <button 
                  className={activeTab === 'description' ? 'active' : ''}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button 
                  className={activeTab === 'reviews' ? 'active' : ''}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({product.numRatings || 0})
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'description' ? (
                  <div className="description-tab">
                    <p>{product.description}</p>
                  </div>
                ) : (
                  <div className="reviews-tab">
                    <ProductReviews 
                      productId={productId} 
                      newReview={newReview}
                      onDeleteRating={handleDeleteRating}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;