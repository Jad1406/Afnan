// ProductQuickView.jsx with Wishlist integration
import React from 'react';
import './ProductQuickView.css';
import { useCart } from '../../CartContext';
import { useWishlist } from '../../WishlistContext'; // Import useWishlist

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist(); // Get wishlist functions

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    // Optionally provide feedback that item was added
    const button = document.querySelector('.quick-view-add-btn');
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Added to Cart!';
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1500);
    }
  };
  
  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    toggleWishlistItem(product);
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite error loop
    e.target.src = "https://via.placeholder.com/400x400?text=Plant+Image"; 
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
              <div className="stars">
                {'★'.repeat(Math.floor(product.rating))}
                {product.rating % 1 !== 0 ? '⯨' : ''}
                {'☆'.repeat(5 - Math.ceil(product.rating))}
              </div>
              <span className="rating-value">{product.rating}</span>
            </div>
            
            <div className="quick-view-price">
              <span className="price-label">Price:</span>
              <span className="price-value">${product.price.toFixed(2)}</span>
            </div>
            
            <div className="quick-view-description">
              <h3>Description</h3>
              <p>{product.description || `The ${product.name} is a beautiful ${product.category} plant known for its ${product.tags ? product.tags.join(' and ') : 'unique characteristics'}. This plant is a great addition to any collection.`}</p>
            </div>
            
            <div className="quick-view-tags">
              {product.tags && product.tags.map((tag, idx) => (
                <span className="quick-view-tag" key={idx}>{tag}</span>
              ))}
            </div>
            
            <div className="quick-view-care">
              <h3>Care Tips</h3>
              <ul className="care-tips-list">
                <li>
                  <span className="care-icon">☀️</span>
                  <span className="care-text">{
                    product.tags && product.tags.includes('low light') 
                      ? 'Thrives in low to medium light conditions'
                      : product.tags && product.tags.includes('bright light')
                        ? 'Requires bright, indirect light'
                        : 'Place in moderate indirect light'
                  }</span>
                </li>
                <li>
                  <span className="care-icon">💧</span>
                  <span className="care-text">{
                    product.tags && product.tags.includes('drought tolerant')
                      ? 'Allow soil to dry completely between waterings'
                      : 'Water when top inch of soil is dry'
                  }</span>
                </li>
                <li>
                  <span className="care-icon">🌡️</span>
                  <span className="care-text">Keep in temperatures between 65-80°F (18-27°C)</span>
                </li>
              </ul>
            </div>
            
            <div className="quick-view-actions">
              <button 
                className="quick-view-add-btn" 
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button 
                className={`quick-view-wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                onClick={handleWishlistToggle}
              >
                {isInWishlist(product.id) ? 'Remove from Wishlist ❤️' : 'Add to Wishlist ♡'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;