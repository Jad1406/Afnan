// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ClipLoader from 'react-spinners/ClipLoader';

// const ProductReviews = ({ productId, newReview }) => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isAuthenticated] = useState(!!localStorage.getItem('token'));
//   const [userInfo] = useState(() => {
//     try {
//       const userData = localStorage.getItem('user');
//       return userData ? JSON.parse(userData) : null;
//     } catch (e) {
//       console.error('Error parsing user data from localStorage', e);
//       return null;
//     }
//   });
  
//   // Fetch reviews when component mounts or productId changes
//   useEffect(() => {
//     const fetchReviews = async () => {
//       setLoading(true);
      
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/api/v1/reviews/product/${productId}`
//         );
        
//         setReviews(response.data.reviews);
//       } catch (err) {
//         console.error('Error fetching reviews:', err);
//         setError('Failed to load reviews. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (productId) {
//       fetchReviews();
//     }
//   }, [productId]);
  
//   // Update reviews when a new review is submitted
//   useEffect(() => {
//     if (newReview) {
//       // Check if this review already exists (update case)
//       const existingIndex = reviews.findIndex(r => r._id === newReview._id);
      
//       if (existingIndex >= 0) {
//         // Update existing review
//         const updatedReviews = [...reviews];
//         updatedReviews[existingIndex] = newReview;
//         setReviews(updatedReviews);
//       } else {
//         // Add new review to the top
//         setReviews([newReview, ...reviews]);
//       }
//     }
//   }, [newReview]);
  
//   const handleDeleteReview = async (reviewId) => {
//     if (!window.confirm('Are you sure you want to delete your review?')) {
//       return;
//     }
    
//     try {
//       const token = localStorage.getItem('token');
      
//       await axios.delete(
//         `http://localhost:3000/api/v1/reviews/${reviewId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           },
//           withCredentials: true
//         }
//       );
      
//       // Remove the deleted review from state
//       setReviews(reviews.filter(review => review._id !== reviewId));
      
//     } catch (err) {
//       console.error('Error deleting review:', err);
//       alert('Failed to delete review. Please try again.');
//     }
//   };
  
//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };
  
//   if (loading) {
//     return (
//       <div className="reviews-loading" style={{ textAlign: 'center', padding: '20px' }}>
//         <ClipLoader color="#4CAF50" size={30} />
//         <p>Loading reviews...</p>
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <div className="reviews-error" style={{ color: 'red', padding: '10px', textAlign: 'center' }}>
//         {error}
//       </div>
//     );
//   }
  
//   return (
//     <div className="product-reviews">
//       <h3>Customer Reviews ({reviews.length})</h3>
      
//       {reviews.length === 0 ? (
//         <p className="no-reviews">This product has no reviews yet. Be the first to share your experience!</p>
//       ) : (
//         <div className="reviews-list">
//           {reviews.map(review => (
//             <div key={review._id} className="review-item" style={{
//               border: '1px solid #eee',
//               borderRadius: '8px',
//               padding: '15px',
//               marginBottom: '15px'
//             }}>
//               <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//                 <div>
//                   <div className="reviewer-name" style={{ fontWeight: 'bold' }}>
//                     {review.user.name || review.user.email.split('@')[0]}
//                   </div>
//                   <div className="review-date" style={{ color: '#777', fontSize: '12px' }}>
//                     {formatDate(review.createdAt)}
//                   </div>
//                 </div>
                
//                 <div className="review-rating" style={{ display: 'flex', alignItems: 'center' }}>
//                   <span style={{ color: '#FFD700', marginRight: '5px' }}>
//                     {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
//                   </span>
//                   <span>{review.rating}/5</span>
//                 </div>
//               </div>
              
//               {review.comment && (
//                 <div className="review-comment" style={{ marginTop: '10px', marginBottom: '10px' }}>
//                   {review.comment}
//                 </div>
//               )}
              
//               {isAuthenticated && userInfo && userInfo.userId === review.user._id && (
//                 <div className="review-actions" style={{ marginTop: '10px', textAlign: 'right' }}>
//                   <button
//                     onClick={() => handleDeleteReview(review._id)}
//                     style={{
//                       background: 'none',
//                       border: 'none',
//                       color: '#ff6b6b',
//                       cursor: 'pointer',
//                       fontSize: '14px'
//                     }}
//                   >
//                     Delete Review
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductReviews;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../components/Auth/AuthContext';
import './ProductReviews.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const ProductReviews = ({ productId, newReview, onDeleteRating }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use the Auth context
  const { isAuthenticated, user, requireAuth } = useAuth();
  
  // Fetch reviews when component mounts or when productId changes
  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);
  
  // Refetch reviews when a new review is submitted or deleted
  useEffect(() => {
    if (newReview) {
      console.log("New review detected, refreshing reviews list:", newReview);
      fetchReviews();
    }
  }, [newReview]);
  
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/reviews/product/${productId}`);
      
      if (response.data && Array.isArray(response.data.reviews)) {
        console.log("Fetched reviews:", response.data.reviews);
        
        // Ensure each review has a unique identifier for the key prop
        const reviewsWithUniqueKeys = response.data.reviews.map(review => ({
          ...review,
          // If _id doesn't exist, generate a unique key
          uniqueKey: review._id || review.id || `review-${Math.random().toString(36).substr(2, 9)}`
        }));
        
        setReviews(reviewsWithUniqueKeys);
      } else {
        setReviews([]);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (reviewId) => {
    // Check if user is authenticated
    if (!requireAuth({
      type: 'CALLBACK',
      payload: {
        callbackName: 'deleteProductReview',
        args: [reviewId]
      }
    })) {
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this review?')) {
      onDeleteRating(reviewId);
    }
  };
  
  const renderStars = (rating) => {
    // Ensure rating is a valid number between 0 and 5
    const safeRating = !isNaN(rating) ? Math.max(0, Math.min(5, rating)) : 0;
    
    return (
      <div className="review-stars">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span 
              key={index} 
              className={`star ${safeRating >= starValue ? 'filled' : ''}`}
            >
              {safeRating >= starValue ? '★' : '☆'}
            </span>
          );
        })}
      </div>
    );
  };
  
  // Check if a review belongs to the current user
  const isUserReview = (review) => {
    if (!isAuthenticated || !user) return false;
    
    const userId = user.id || user._id;
    
    return (
      review.userId === userId || 
      (review.user && (review.user.id === userId || review.user._id === userId))
    );
  };
  
  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }
  
  if (error) {
    return <div className="reviews-error">{error}</div>;
  }
  
  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }
  
  return (
    <div className="product-reviews">
      <h3>Customer Reviews</h3>
      <div className="reviews-list">
        {reviews.map((review) => {
          // Check if this review belongs to the current user
          const belongsToUser = isUserReview(review);
          
          // Use the uniqueKey property we added, or fallback to other IDs
          const reviewKey = review.uniqueKey || review._id || review.id || `review-${Math.random().toString(36).substr(2, 9)}`;
          
          return (
            <div key={reviewKey} className={`review-item ${belongsToUser ? 'user-review' : ''}`}>
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">
                    {review.user ? review.user.name || 'Anonymous' : 'Anonymous'}
                    {belongsToUser ? ' (You)' : ''}
                  </span>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
                
                {belongsToUser && isAuthenticated && onDeleteRating && (
                  <div className="review-actions">
                    <button 
                      className="delete-review-btn"
                      onClick={() => handleDeleteClick(review._id || review.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              
              {review.comment && (
                <div className="review-comment">
                  <p>{review.comment}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductReviews;