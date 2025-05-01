
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import ClipLoader from 'react-spinners/ClipLoader';

// Consistent API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const ProductRating = ({ product, onReviewAction }) => {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userReview, setUserReview] = useState(null);
  
  const { isAuthenticated, user, requireAuth } = useAuth();
  
  // Get the product ID (support both id and _id for MongoDB)
  const productId = product?._id;
  
  // Check if user has already rated this product
  useEffect(() => {
    const fetchUserReview = async () => {
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
            }
          }
        );
        
        const reviews = response.data.reviews || [];
        const userId = user?.userId || user?._id;
        // Find user's existing review
        const existingReview = reviews.find(review => review.user._id === userId);
        // console.log("userId: ", userId);
        // console.log("existingReview: ",existingReview);
        if (existingReview) {
          setUserReview(existingReview);
          setUserRating(existingReview.rating);
          setComment(existingReview.comment || '');
        } else {
          setUserReview(null);
          setUserRating(0);
          setComment('');
        }
      } catch (error) {
        console.error('Error fetching user review:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserReview();
  }, [isAuthenticated, productId, user]);
  
  const handleStarClick = (rating) => {
    setUserRating(rating);
  };
  
  const handleStarHover = (rating) => {
    setHoveredStar(rating);
  };
  
  const handleStarLeave = () => {
    setHoveredStar(0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (userRating === 0) {
      setError('Please select a star rating');
      return;
    }
    
    if (!isAuthenticated) {
      requireAuth({
        type: 'REDIRECT',
        payload: { path: window.location.pathname }
      });
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      const isUpdate = !!userReview;
      const oldRating = userReview?.rating || 0;
      let response;
      
      if (isUpdate) {
        // Update existing review
        response = await axios.patch(
          `${API_BASE_URL}/api/v1/reviews/${userReview._id}`,
          { rating: userRating, comment },
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
      } else {
        // Create new review
        response = await axios.post(
          `${API_BASE_URL}/api/v1/reviews/product/${productId}`,
          { rating: userRating, comment },
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
      }
      
      // Update the user's review in local state
      setUserReview(response.data.review);
      
      // Calculate updated product stats
      const updatedProduct = { ...product };
      
      if (isUpdate) {
        // Adjust the average rating for updated review
        const totalPoints = (updatedProduct.averageRating || 0) * updatedProduct.numRatings;
        const newTotalPoints = totalPoints - oldRating + userRating;
        updatedProduct.averageRating = updatedProduct.numRatings > 0 ? 
          newTotalPoints / updatedProduct.numRatings : userRating;
      } else {
        // Adjust for new review
        updatedProduct.numRatings = (updatedProduct.numRatings || 0) + 1;
        const totalPoints = (updatedProduct.averageRating || 0) * (updatedProduct.numRatings - 1);
        const newTotalPoints = totalPoints + userRating;
        updatedProduct.averageRating = newTotalPoints / updatedProduct.numRatings;
      }
      
      // Notify parent component
      if (onReviewAction) {
        onReviewAction(updatedProduct, isUpdate ? 'update' : 'create');
      }
      
      // Hide the form
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.msg || 'Failed to submit review.';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteReview = async () => {
    if (!userReview) return;
    
    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      await axios.delete(
        `${API_BASE_URL}/api/v1/reviews/${userReview._id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Calculate updated product stats
      const updatedProduct = { ...product };
      const deletedRating = userReview.rating;
      
      updatedProduct.numRatings = Math.max(0, (updatedProduct.numRatings || 0) - 1);
      
      if (updatedProduct.numRatings > 0) {
        const totalPoints = (updatedProduct.averageRating || 0) * (updatedProduct.numRatings + 1);
        const newTotalPoints = totalPoints - deletedRating;
        updatedProduct.averageRating = newTotalPoints / updatedProduct.numRatings;
      } else {
        updatedProduct.averageRating = 0;
      }
      
      // Reset local state
      setUserReview(null);
      setUserRating(0);
      setComment('');
      setShowForm(false);
      
      // Notify parent component
      if (onReviewAction) {
        onReviewAction(updatedProduct, 'delete');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.msg || 'Failed to delete review.';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        className={`star ${star <= (hoveredStar || userRating) ? 'filled' : 'empty'}`}
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
  
  // Display average rating
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
        
        {isAuthenticated ? (
          <>
            {!showForm && !userReview && (
              <button
                onClick={() => setShowForm(true)}
                className="add-review-button"
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
                Rate this product
              </button>
            )}
            
            {!showForm && userReview && (
              <div className="user-review-actions" style={{ display: 'inline-block', marginLeft: '10px' }}>
                <button
                  onClick={() => setShowForm(true)}
                  className="edit-review-button"
                  style={{
                    background: 'none',
                    border: 'none',
                    textDecoration: 'underline',
                    color: '#4CAF50',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginRight: '10px'
                  }}
                >
                  Edit your review
                </button>
                <button
                  onClick={handleDeleteReview}
                  className="delete-review-button"
                  style={{
                    background: 'none',
                    border: 'none',
                    textDecoration: 'underline',
                    color: '#ff4d4d',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Delete review
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => {
              requireAuth({
                type: 'REDIRECT',
                payload: { path: window.location.pathname }
              });
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
            Login to rate
          </button>
        )}
      </div>
      
      {showForm && (
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
                setShowForm(false);
                // Reset to previous values if canceling
                if (userReview) {
                  setUserRating(userReview.rating);
                  setComment(userReview.comment || '');
                } else {
                  setUserRating(0);
                  setComment('');
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
                userReview ? 'Update Rating' : 'Submit Rating'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductRating;