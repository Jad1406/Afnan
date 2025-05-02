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
import { useAuth } from '../Auth/AuthContext';
import ClipLoader from 'react-spinners/ClipLoader';

// Consistent API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const ProductReviews = ({ productId, refreshFlag, onReviewAction }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  
  // Get the current user ID
  const getCurrentUserId = () => {
    if (!user) return null;
    return user.id || user._id || user.userId;
  };
  
  // Fetch reviews when component mounts or refreshFlag changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/reviews/product/${productId}`);
        
        // Sort reviews - user's review first, then by date descending
        const reviewData = response.data.reviews || [];
        const userId = getCurrentUserId();
        
        reviewData.sort((a, b) => {
          // If one is the user's review, it comes first
          const aUserId = a.user?._id || a.user?.id || a.userId || a.user;
          const bUserId = b.user?._id || b.user?.id || b.userId || b.user;
          
          if (aUserId === userId && bUserId !== userId) return -1;
          if (aUserId !== userId && bUserId === userId) return 1;
          
          // Otherwise sort by date, newest first
          const aDate = new Date(a.createdAt || a.updatedAt || 0);
          const bDate = new Date(b.createdAt || b.updatedAt || 0);
          return bDate - aDate;
        });
        
        setReviews(reviewData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Unable to load reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, [productId, refreshFlag]);
  
  const handleEditReview = (review) => {
    // Trigger edit mode in ProductRating component
    const event = new CustomEvent('editReview', { detail: review });
    document.dispatchEvent(event);
  };
  
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      await axios.delete(
        `${API_BASE_URL}/api/v1/reviews/${reviewId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Remove the review from the list
      const deletedReview = reviews.find(r => r._id === reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
      
      if (deletedReview && onReviewAction) {
        // Calculate updated product stats
        const reviewRating = deletedReview.rating || 0;
        const numReviews = reviews.length;
        
        if (numReviews > 1) {
          // Calculate new average without this review
          const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
          const newTotalRating = totalRating - reviewRating;
          const newAverage = newTotalRating / (numReviews - 1);
          
          onReviewAction({
            numRatings: numReviews - 1,
            averageRating: newAverage
          }, 'delete');
        } else {
          // This was the only review
          onReviewAction({
            numRatings: 0,
            averageRating: 0
          }, 'delete');
        }
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Failed to delete review. Please try again.');
    }
  };
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Check if a review belongs to the current user
  const isUserReview = (review) => {
    const userId = getCurrentUserId();
    if (!userId) return false;
    
    const reviewUserId = review.user?._id || review.user?.id || review.userId || review.user;
    return userId === reviewUserId;
  };
  
  // Get username from review
  const getReviewerName = (review) => {
    // Try to get user's name from different possible structures
    if (review.user?.name) return review.user.name;
    if (review.user?.firstName) {
      return review.user.lastName ? 
        `${review.user.firstName} ${review.user.lastName}` : 
        review.user.firstName;
    }
    if (review.username) return review.username;
    
    // Use email with domain hidden for privacy
    if (review.user?.email) {
      const email = review.user.email;
      const atIndex = email.indexOf('@');
      if (atIndex > 0) {
        return `${email.substring(0, atIndex)}@***`;
      }
      return email;
    }
    
    return 'Anonymous User';
  };
  
  if (isLoading) {
    return (
      <div className="reviews-loading" style={{ textAlign: 'center', padding: '20px' }}>
        <ClipLoader color="#4CAF50" size={30} />
        <p>Loading reviews...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="reviews-error" style={{ color: 'red', padding: '10px', textAlign: 'center' }}>
        {error}
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="no-reviews" style={{ textAlign: 'center', padding: '20px' }}>
        <p>No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }
  
  return (
    <div className="product-reviews">
      {reviews.map(review => (
        <div 
          key={review._id} 
          className={`review-item ${isUserReview(review) ? 'user-review' : ''}`}
          style={{
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            backgroundColor: isUserReview(review) ? '#f8fffa' : '#fff'
          }}
        >
          <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div className="reviewer-info">
              <strong>{getReviewerName(review)}</strong>
              {isUserReview(review) && <span style={{ marginLeft: '8px', color: '#4CAF50', fontSize: '12px' }}>(Your Review)</span>}
            </div>
            <div className="review-date">
              {formatDate(review.createdAt || review.updatedAt)}
            </div>
          </div>
          
          <div className="review-rating" style={{ marginBottom: '8px' }}>
            <span style={{ color: '#FFD700', fontSize: '18px' }}>
              {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </span>
          </div>
          
          {review.comment && (
            <div className="review-comment" style={{ marginBottom: '10px' }}>
              <p>{review.comment}</p>
            </div>
          )}
          
          {isUserReview(review) && (
            <div className="review-actions" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {/* <button
                onClick={() => handleEditReview(review)}
                style={{
                  background: 'none',
                  border: 'none',
                  textDecoration: 'underline',
                  color: '#4CAF50',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteReview(review._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  textDecoration: 'underline',
                  color: '#ff4d4d',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Delete
              </button> */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;