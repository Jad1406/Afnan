import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../WishlistContext';
import { useCart } from '../../CartContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, toggleWishlistItem } = useWishlist();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleAddToCart = (product) => {
    addToCart(product);
  };
  
  const handleRemove = (productId) => {
    toggleWishlistItem({ id: productId });
  };
  
  if (isLoading) {
    return (
      <div className="wishlist">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your wishlist...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="wishlist">
      <div className="section-header">
        <h2>Your Wishlist</h2>
        <p>Items you've saved for later</p>
      </div>
      
      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-wishlist-message">
            <h3>Your Wishlist is Empty</h3>
            <p>Save items you like for future reference.</p>
            <Link to="/market" className="btn primary">Browse Products</Link>
          </div>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishlist.map(product => (
            <div key={product.id || product._id} className="wishlist-item">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-description">
                  {product.description?.substring(0, 100)}
                  {product.description?.length > 100 ? '...' : ''}
                </p>
                
                <div className="product-actions">
                  <button 
                    className="btn primary" 
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="btn outline" 
                    onClick={() => handleRemove(product.id || product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;