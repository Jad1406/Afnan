// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ClipLoader from 'react-spinners/ClipLoader';

// const ProductRating = ({ product, isAuthenticated, onRatingSubmit }) => {
//   const [userRating, setUserRating] = useState(0);
//   const [previousRating, setPreviousRating] = useState(0); // Store previous rating for updates
//   const [hasExistingReview, setHasExistingReview] = useState(false);
//   const [existingReviewId, setExistingReviewId] = useState(null);
//   const [comment, setComment] = useState('');
//   const [hoveredStar, setHoveredStar] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showRatingForm, setShowRatingForm] = useState(false);
//   const [error, setError] = useState('');
  
//   // Check if user has already rated this product
//   useEffect(() => {
//     const checkExistingReview = async () => {
//       if (!isAuthenticated || !product?.id) return;
      
//       setIsLoading(true);
//       try {
//         const token = localStorage.getItem('token');
        
//         if (!token) {
//           setIsLoading(false);
//           return;
//         }
//         console.log(product);
//         const response = await axios.get(
//           `http://localhost:3000/api/v1/reviews/product/${product.id}`,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             },
//             withCredentials: true
//           }
//         );
        
//         const reviews = response.data.reviews;
//         const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
//         const userId = userInfo.userId;
        
//         // Find user's existing review
//         const userReview = reviews.find(review => review.user._id === userId);
        
//         if (userReview) {
//           setHasExistingReview(true);
//           setExistingReviewId(userReview._id);
//           setUserRating(userReview.rating);
//           setPreviousRating(userReview.rating);
//           setComment(userReview.comment || '');
//         }
        
//       } catch (error) {
//         console.error('Error checking existing review:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     if (isAuthenticated && product?.id) {
//       checkExistingReview();
//     }
//   }, [isAuthenticated, product?.id]);
  
//   const handleStarClick = (rating) => {
//     setUserRating(rating);
//   };
  
//   const handleStarHover = (rating) => {
//     setHoveredStar(rating);
//   };
  
//   const handleStarLeave = () => {
//     setHoveredStar(0);
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (userRating === 0) {
//       setError('Please select a star rating');
//       return;
//     }
    
//     if (!isAuthenticated) {
//       setError('You must be logged in to leave a rating');
//       window.location.href = '/login';
//       return;
//     }
    
//     setIsSubmitting(true);
//     setError('');
    
//     try {
//       const token = localStorage.getItem('token');
      
//       if (!token) {
//         setError('Authentication token not found. Please log in again.');
//         setIsSubmitting(false);
//         return;
//       }
      
//       const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       };
      
//       const response = await axios.post(
//         `http://localhost:3000/api/v1/reviews/product/${product.id}`,
//         { rating: userRating, comment },
//         {
//           headers,
//           withCredentials: true
//         }
//       );
      
//       // Add metadata for parent component
//       const reviewWithMeta = {
//         ...response.data.review,
//         isUpdate: hasExistingReview,
//         oldRating: previousRating
//       };
      
//       // Call the callback to update parent component
//       if (onRatingSubmit) {
//         onRatingSubmit(reviewWithMeta);
//       }
      
//       // Update local state for existing review
//       setHasExistingReview(true);
//       if (response.data.review._id) {
//         setExistingReviewId(response.data.review._id);
//       }
//       setPreviousRating(userRating);
      
//       // Reset form visibility
//       setShowRatingForm(false);
      
//     } catch (error) {
//       console.error('Error submitting review:', error);
//       setError(error.response?.data?.msg || 'Failed to submit review. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   const renderStars = () => {
//     return [1, 2, 3, 4, 5].map(star => (
//       <span
//         key={star}
//         className={`star ${
//           star <= (hoveredStar || userRating) ? 'filled' : 'empty'
//         }`}
//         onClick={() => handleStarClick(star)}
//         onMouseEnter={() => handleStarHover(star)}
//         onMouseLeave={handleStarLeave}
//         style={{
//           cursor: 'pointer',
//           fontSize: '24px',
//           color: star <= (hoveredStar || userRating) ? '#FFD700' : '#ccc',
//           marginRight: '5px'
//         }}
//       >
//         ★
//       </span>
//     ));
//   };
  
//   // Display average rating or "No ratings"
//   const renderAverageRating = () => {
//     if (!product || product.numRatings === 0) {
//       return <span className="no-ratings">No ratings yet</span>;
//     }
    
//     return (
//       <div className="rating-display">
//         <span className="stars" style={{ color: '#FFD700' }}>
//           {'★'.repeat(Math.floor(product.averageRating))}
//           {product.averageRating % 1 >= 0.5 ? '½' : ''}
//           {'☆'.repeat(5 - Math.ceil(product.averageRating))}
//         </span>
//         <span className="rating-value">
//           {product.averageRating.toFixed(1)} ({product.numRatings} {product.numRatings === 1 ? 'review' : 'reviews'})
//         </span>
//       </div>
//     );
//   };
  
//   if (isLoading) {
//     return <div className="loading-rating"><ClipLoader color="#4CAF50" size={20} /></div>;
//   }
  
//   return (
//     <div className="product-rating-component">
//       <div className="current-rating">
//         {renderAverageRating()}
        
//         {isAuthenticated && !showRatingForm && (
//           <button
//             onClick={() => setShowRatingForm(true)}
//             style={{
//               background: 'none',
//               border: 'none',
//               textDecoration: 'underline',
//               color: '#4CAF50',
//               cursor: 'pointer',
//               marginLeft: '10px',
//               fontSize: '14px'
//             }}
//           >
//             {hasExistingReview ? 'Update your rating' : 'Rate this product'}
//           </button>
//         )}
//       </div>
      
//       {showRatingForm && (
//         <form onSubmit={handleSubmit} className="rating-form">
//           <div className="star-rating">
//             {renderStars()}
//           </div>
          
//           <textarea
//             placeholder="Share your experience with this product (optional)"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             style={{
//               width: '100%',
//               padding: '8px',
//               margin: '10px 0',
//               borderRadius: '4px',
//               border: '1px solid #ddd'
//             }}
//           />
          
//           {error && (
//             <div className="error-message" style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
//               {error}
//             </div>
//           )}
          
//           <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
//             <button
//               type="button"
//               onClick={() => {
//                 setShowRatingForm(false);
//                 // Reset to previous values if canceling
//                 if (hasExistingReview) {
//                   setUserRating(previousRating);
//                 }
//                 setError('');
//               }}
//               style={{
//                 padding: '8px 12px',
//                 borderRadius: '4px',
//                 border: '1px solid #ddd',
//                 background: '#f5f5f5',
//                 cursor: 'pointer'
//               }}
//             >
//               Cancel
//             </button>
            
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               style={{
//                 padding: '8px 12px',
//                 borderRadius: '4px',
//                 border: 'none',
//                 background: '#4CAF50',
//                 color: 'white',
//                 cursor: isSubmitting ? 'not-allowed' : 'pointer',
//                 display: 'flex',
//                 alignItems: 'center'
//               }}
//             >
//               {isSubmitting ? (
//                 <>
//                   <ClipLoader color="#ffffff" size={14} loading={true} style={{ marginRight: '5px' }} />
//                   <span>Submitting...</span>
//                 </>
//               ) : (
//                 hasExistingReview ? 'Update Rating' : 'Submit Rating'
//               )}
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default ProductRating;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ClipLoader from 'react-spinners/ClipLoader';

// const ProductRating = ({ product, isAuthenticated, onRatingSubmit }) => {
//   const [userRating, setUserRating] = useState(0);
//   const [previousRating, setPreviousRating] = useState(0); // Store previous rating for updates
//   const [hasExistingReview, setHasExistingReview] = useState(false);
//   const [existingReviewId, setExistingReviewId] = useState(null);
//   const [comment, setComment] = useState('');
//   const [hoveredStar, setHoveredStar] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showRatingForm, setShowRatingForm] = useState(false);
//   const [error, setError] = useState('');
  
//   // Get the product ID (support both id and _id for MongoDB)
//   const getProductId = () => product?.id || product?._id;
  
//   // Check if user has already rated this product
//   useEffect(() => {
//     const checkExistingReview = async () => {
//       const productId = getProductId();
//       if (!isAuthenticated || !productId) return;
      
//       setIsLoading(true);
//       try {
//         const token = localStorage.getItem('token');
        
//         if (!token) {
//           setIsLoading(false);
//           return;
//         }
//         console.log('Product in Rating component:', product);
        
//         const response = await axios.get(
//           `http://localhost:3000/api/v1/reviews/product/${productId}`,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             },
//             withCredentials: true
//           }
//         );
        
//         const reviews = response.data.reviews;
//         const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
//         const userId = userInfo.userId;
        
//         // Find user's existing review
//         const userReview = reviews.find(review => review.user._id === userId);
        
//         if (userReview) {
//           setHasExistingReview(true);
//           setExistingReviewId(userReview._id);
//           setUserRating(userReview.rating);
//           setPreviousRating(userReview.rating);
//           setComment(userReview.comment || '');
//         }
        
//       } catch (error) {
//         console.error('Error checking existing review:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     if (isAuthenticated && getProductId()) {
//       checkExistingReview();
//     }
//   }, [isAuthenticated, product]); // Changed dependency to track the whole product object
  
//   const handleStarClick = (rating) => {
//     setUserRating(rating);
//   };
  
//   const handleStarHover = (rating) => {
//     setHoveredStar(rating);
//   };
  
//   const handleStarLeave = () => {
//     setHoveredStar(0);
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (userRating === 0) {
//       setError('Please select a star rating');
//       return;
//     }
    
//     if (!isAuthenticated) {
//       setError('You must be logged in to leave a rating');
//       window.location.href = '/login';
//       return;
//     }
    
//     const productId = getProductId();
//     if (!productId) {
//       setError('Product ID is missing. Cannot submit review.');
//       return;
//     }
    
//     setIsSubmitting(true);
//     setError('');
    
//     try {
//       const token = localStorage.getItem('token');
      
//       if (!token) {
//         setError('Authentication token not found. Please log in again.');
//         setIsSubmitting(false);
//         return;
//       }
      
//       const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       };
      
//       const response = await axios.post(
//         `http://localhost:3000/api/v1/reviews/product/${productId}`,
//         { rating: userRating, comment },
//         {
//           headers,
//           withCredentials: true
//         }
//       );
      
//       // Add metadata for parent component
//       const reviewWithMeta = {
//         ...response.data.review,
//         isUpdate: hasExistingReview,
//         oldRating: previousRating
//       };
      
//       // Call the callback to update parent component
//       if (onRatingSubmit) {
//         onRatingSubmit(reviewWithMeta);
//       }
      
//       // Update local state for existing review
//       setHasExistingReview(true);
//       if (response.data.review._id) {
//         setExistingReviewId(response.data.review._id);
//       }
//       setPreviousRating(userRating);
      
//       // Reset form visibility
//       setShowRatingForm(false);
      
//     } catch (error) {
//       console.error('Error submitting review:', error);
//       setError(error.response?.data?.msg || 'Failed to submit review. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   const renderStars = () => {
//     return [1, 2, 3, 4, 5].map(star => (
//       <span
//         key={star}
//         className={`star ${
//           star <= (hoveredStar || userRating) ? 'filled' : 'empty'
//         }`}
//         onClick={() => handleStarClick(star)}
//         onMouseEnter={() => handleStarHover(star)}
//         onMouseLeave={handleStarLeave}
//         style={{
//           cursor: 'pointer',
//           fontSize: '24px',
//           color: star <= (hoveredStar || userRating) ? '#FFD700' : '#ccc',
//           marginRight: '5px'
//         }}
//       >
//         ★
//       </span>
//     ));
//   };
  
//   // Display average rating or "No ratings"
//   const renderAverageRating = () => {
//     if (!product || product.numRatings === 0) {
//       return <span className="no-ratings">No ratings yet</span>;
//     }
    
//     return (
//       <div className="rating-display">
//         <span className="stars" style={{ color: '#FFD700' }}>
//           {'★'.repeat(Math.floor(product.averageRating))}
//           {product.averageRating % 1 >= 0.5 ? '½' : ''}
//           {'☆'.repeat(5 - Math.ceil(product.averageRating))}
//         </span>
//         <span className="rating-value">
//           {product.averageRating.toFixed(1)} ({product.numRatings} {product.numRatings === 1 ? 'review' : 'reviews'})
//         </span>
//       </div>
//     );
//   };
  
//   if (isLoading) {
//     return <div className="loading-rating"><ClipLoader color="#4CAF50" size={20} /></div>;
//   }
  
//   return (
//     <div className="product-rating-component">
//       <div className="current-rating">
//         {renderAverageRating()}
        
//         {isAuthenticated && !showRatingForm && (
//           <button
//             onClick={() => setShowRatingForm(true)}
//             style={{
//               background: 'none',
//               border: 'none',
//               textDecoration: 'underline',
//               color: '#4CAF50',
//               cursor: 'pointer',
//               marginLeft: '10px',
//               fontSize: '14px'
//             }}
//           >
//             {hasExistingReview ? 'Update your rating' : 'Rate this product'}
//           </button>
//         )}
//       </div>
      
//       {showRatingForm && (
//         <form onSubmit={handleSubmit} className="rating-form">
//           <div className="star-rating">
//             {renderStars()}
//           </div>
          
//           <textarea
//             placeholder="Share your experience with this product (optional)"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             style={{
//               width: '100%',
//               padding: '8px',
//               margin: '10px 0',
//               borderRadius: '4px',
//               border: '1px solid #ddd'
//             }}
//           />
          
//           {error && (
//             <div className="error-message" style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
//               {error}
//             </div>
//           )}
          
//           <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
//             <button
//               type="button"
//               onClick={() => {
//                 setShowRatingForm(false);
//                 // Reset to previous values if canceling
//                 if (hasExistingReview) {
//                   setUserRating(previousRating);
//                 }
//                 setError('');
//               }}
//               style={{
//                 padding: '8px 12px',
//                 borderRadius: '4px',
//                 border: '1px solid #ddd',
//                 background: '#f5f5f5',
//                 cursor: 'pointer'
//               }}
//             >
//               Cancel
//             </button>
            
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               style={{
//                 padding: '8px 12px',
//                 borderRadius: '4px',
//                 border: 'none',
//                 background: '#4CAF50',
//                 color: 'white',
//                 cursor: isSubmitting ? 'not-allowed' : 'pointer',
//                 display: 'flex',
//                 alignItems: 'center'
//               }}
//             >
//               {isSubmitting ? (
//                 <>
//                   <ClipLoader color="#ffffff" size={14} loading={true} style={{ marginRight: '5px' }} />
//                   <span>Submitting...</span>
//                 </>
//               ) : (
//                 hasExistingReview ? 'Update Rating' : 'Submit Rating'
//               )}
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default ProductRating;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '..//Auth/AuthContext';
import ClipLoader from 'react-spinners/ClipLoader';

// Consistent API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const ProductRating = ({ product, onRatingSubmit }) => {
  const [userRating, setUserRating] = useState(0);
  const [previousRating, setPreviousRating] = useState(0); // Store previous rating for updates
  const [hasExistingReview, setHasExistingReview] = useState(false);
  const [existingReviewId, setExistingReviewId] = useState(null);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [error, setError] = useState('');
  
  // Get auth context
  const { isAuthenticated, requireAuth, registerCallback } = useAuth();
  
  // Get the product ID (support both id and _id for MongoDB)
  const getProductId = () => product?.id || product?._id;
  
  // Register the rating callback
  useEffect(() => {
    const productId = getProductId();
    if (productId) {
      registerCallback('submitProductRating', submitRating);
    }
  }, [product, userRating, comment]);
  
  // Check if user has already rated this product
  useEffect(() => {
    const checkExistingReview = async () => {
      const productId = getProductId();
      if (!isAuthenticated || !productId) return;
      
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/reviews/product/${productId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            withCredentials: true
          }
        );
        
        const reviews = response.data.reviews;
        const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = userInfo.userId;
        
        // Find user's existing review
        const userReview = reviews.find(review => review.user._id === userId);
        
        if (userReview) {
          setHasExistingReview(true);
          setExistingReviewId(userReview._id);
          setUserRating(userReview.rating);
          setPreviousRating(userReview.rating);
          setComment(userReview.comment || '');
        }
        
      } catch (error) {
        console.error('Error checking existing review:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated && getProductId()) {
      checkExistingReview();
    }
  }, [isAuthenticated, product]); // Track the whole product object
  
  const handleStarClick = (rating) => {
    setUserRating(rating);
  };
  
  const handleStarHover = (rating) => {
    setHoveredStar(rating);
  };
  
  const handleStarLeave = () => {
    setHoveredStar(0);
  };
  
  // Submit rating function
  const submitRating = async (review = null) => {
    let ratingToSubmit = review ? review.rating : userRating;
    let commentToSubmit = review ? review.comment : comment;
    
    if (ratingToSubmit === 0) {
      setError('Please select a star rating');
      return;
    }
    
    const productId = getProductId();
    if (!productId) {
      setError('Product ID is missing. Cannot submit review.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsSubmitting(false);
        return;
      }
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/reviews/product/${productId}`,
        { rating: ratingToSubmit, comment: commentToSubmit },
        {
          headers,
          withCredentials: true
        }
      );
      
      // Add metadata for parent component
      const reviewWithMeta = {
        ...response.data.review,
        isUpdate: hasExistingReview,
        oldRating: previousRating
      };
      
      // Call the callback to update parent component
      if (onRatingSubmit) {
        onRatingSubmit(reviewWithMeta);
      }
      
      // Update local state for existing review
      setHasExistingReview(true);
      if (response.data.review._id) {
        setExistingReviewId(response.data.review._id);
      }
      setPreviousRating(ratingToSubmit);
      
      // Reset form visibility
      setShowRatingForm(false);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.msg || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated before allowing review submission
    if (!requireAuth({
      type: 'CALLBACK',
      payload: {
        callbackName: 'submitProductRating',
        args: [{ rating: userRating, comment }]
      }
    })) {
      return;
    }
    
    await submitRating();
  };
  
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        className={`star ${
          star <= (hoveredStar || userRating) ? 'filled' : 'empty'
        }`}
        onClick={() => handleStarClick(star)}
        onMouseEnter={() => handleStarHover(star)}
        onMouseLeave={handleStarLeave}
        style={{
          cursor: 'pointer',
          fontSize: '24px',
          color: star <= (hoveredStar || userRating) ? '#FFD700' : '#ccc',
          marginRight: '5px'
        }}
      >
        ★
      </span>
    ));
  };
  
  // Display average rating or "No ratings"
  const renderAverageRating = () => {
    if (!product || !product.numRatings || product.numRatings === 0) {
      return <span className="no-ratings">No ratings yet</span>;
    }
    
    return (
      <div className="rating-display">
        <span className="stars" style={{ color: '#FFD700' }}>
          {'★'.repeat(Math.floor(product.averageRating))}
          {product.averageRating % 1 >= 0.5 ? '½' : ''}
          {'☆'.repeat(5 - Math.ceil(product.averageRating))}
        </span>
        <span className="rating-value">
          {product.averageRating.toFixed(1)} ({product.numRatings} {product.numRatings === 1 ? 'review' : 'reviews'})
        </span>
      </div>
    );
  };
  
  if (isLoading) {
    return <div className="loading-rating"><ClipLoader color="#4CAF50" size={20} /></div>;
  }
  
  return (
    <div className="product-rating-component">
      <div className="current-rating">
        {renderAverageRating()}
        
        {!showRatingForm && (
          <button
            onClick={() => {
              // Check if user is authenticated before showing form
              if (requireAuth({
                type: 'REDIRECT',
                payload: {
                  path: window.location.pathname
                }
              })) {
                setShowRatingForm(true);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              textDecoration: 'underline',
              color: '#4CAF50',
              cursor: 'pointer',
              marginLeft: '10px',
              fontSize: '14px'
            }}
          >
            {hasExistingReview ? 'Update your rating' : 'Rate this product'}
          </button>
        )}
      </div>
      
      {showRatingForm && (
        <form onSubmit={handleSubmit} className="rating-form">
          <div className="star-rating">
            {renderStars()}
          </div>
          
          <textarea
            placeholder="Share your experience with this product (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              margin: '10px 0',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
          
          {error && (
            <div className="error-message" style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
              {error}
            </div>
          )}
          
          <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                setShowRatingForm(false);
                // Reset to previous values if canceling
                if (hasExistingReview) {
                  setUserRating(previousRating);
                }
                setError('');
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                background: '#f5f5f5',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: 'none',
                background: '#4CAF50',
                color: 'white',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {isSubmitting ? (
                <>
                  <ClipLoader color="#ffffff" size={14} loading={true} style={{ marginRight: '5px' }} />
                  <span>Submitting...</span>
                </>
              ) : (
                hasExistingReview ? 'Update Rating' : 'Submit Rating'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductRating;