// WishlistContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context for the wishlist
const WishlistContext = createContext();

// Create a provider component
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Add to wishlist function
  const addToWishlist = (product) => {
    // Check if product already exists in wishlist
    if (!wishlist.some(item => item.id === product.id)) {
      setWishlist([...wishlist, product]);
    }
  };

  // Remove from wishlist function
  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => item.id !== productId));
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Toggle wishlist item
  const toggleWishlistItem = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Toggle wishlist visibility
  const toggleWishlist = () => {
    setIsWishlistOpen(!isWishlistOpen);
  };

  // Value object to be provided to consumers
  const value = {
    wishlist,
    isWishlistOpen,
    wishlistCount: wishlist.length,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlistItem,
    toggleWishlist,
    setIsWishlistOpen
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;