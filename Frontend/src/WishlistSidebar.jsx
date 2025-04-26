// WishlistSidebar.jsx
import React from 'react';
import { useWishlist } from './WishlistContext';
import { useCart } from './CartContext';
// Remove the CSS import - we'll include the styles directly in the component

const WishlistSidebar = () => {
  const { 
    wishlist, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    removeFromWishlist 
  } = useWishlist();
  
  const { addToCart } = useCart();

  // Handle image error
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite error loop
    e.target.src = "https://via.placeholder.com/80x80?text=Plant";
  };

  // Move item from wishlist to cart
  const moveToCart = (product) => {
    console.log("Moving to cart:", product); // Debug log
    addToCart(product);
    
    // Provide user feedback
    const button = document.querySelector(`[data-product-id="${product.id}"]`);
    if (button) {
      const originalText = button.textContent;
      button.textContent = "Added to Cart!";
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        // remove from wishlist after adding to cart
        removeFromWishlist(product.id);
      }, 1500);
    }
  };

  return (
    <>
      {/* Wishlist sidebar */}
      <div className={`wishlist-sidebar ${isWishlistOpen ? 'open' : ''}`}>
        <div className="wishlist-header">
          <h2>Your Wishlist ({wishlist.length})</h2>
          <button 
            className="close-wishlist-btn"
            onClick={() => setIsWishlistOpen(false)}
          >
            ×
          </button>
        </div>
        
        {wishlist.length > 0 ? (
          <>
            <div className="wishlist-items">
              {wishlist.map(item => (
                <div className="wishlist-item" key={item.id}>
                  <div className="wishlist-item-image">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="wishlist-item-img" 
                      onError={handleImageError}
                    />
                  </div>
                  <div className="wishlist-item-details">
                    <h4>{item.name}</h4>
                    <div className="wishlist-item-price">${item.price.toFixed(2)}</div>
                    <div className="wishlist-item-controls">
                      <button 
                        className="move-to-cart-btn"
                        onClick={() => moveToCart(item)}
                        data-product-id={item.id}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="remove-wishlist-btn"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="wishlist-actions">
              <button 
                className="continue-shopping-btn"
                onClick={() => setIsWishlistOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          </>
        ) : (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">❤️</div>
            <p>Your wishlist is empty</p>
            <p className="wishlist-tip">Click the heart icon on products you love to save them here!</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => setIsWishlistOpen(false)}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
      
      {/* Overlay that closes the wishlist when clicked */}
      {isWishlistOpen && (
        <div 
          className="wishlist-overlay"
          onClick={() => setIsWishlistOpen(false)}
        ></div>
      )}
    </>
  );
};

export default WishlistSidebar;