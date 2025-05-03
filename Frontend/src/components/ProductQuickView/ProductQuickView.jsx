import React, { useState, useEffect } from 'react';
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
  const [reviewChangeFlag, setReviewChangeFlag] = useState(0);
  
  const { addToCart } = useCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const { isAuthenticated, requireAuth } = useAuth();
  
  // Reset quantity when product changes or modal opens
  useEffect(() => {
    if (product && isOpen) {
      setQuantity(1);
    }
  }, [product, isOpen]);
  
  // If modal is closed or no product, don't render anything
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
    // console.log(`Adding ${quantity} of product ${productId} to cart`);
    addToCart(product, quantity );
    onClose();
  };
  
  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      requireAuth({
        type: 'REDIRECT',
        payload: { path: window.location.pathname }
      });
      return;
    }
    toggleWishlistItem(product);
  };

  // Unified handler for all review actions
  const handleReviewAction = (updatedProduct, action) => {
    // Update the product data
    if (updatedProduct && onProductUpdate) {
      onProductUpdate(updatedProduct);
    }
    
    // Trigger review list refresh
    setReviewChangeFlag(prev => prev + 1);
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
                onReviewAction={handleReviewAction}
              />
            </div>
            
            <div className="quick-view-price">
              <span className="price-label">Price:</span>
              <span className="price-value">${product.price.toFixed(2)}</span>
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
                      refreshFlag={reviewChangeFlag}
                      onReviewAction={handleReviewAction}
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