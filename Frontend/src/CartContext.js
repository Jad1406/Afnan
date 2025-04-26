// CartContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context for the cart
const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Add to cart function
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // If item already exists in cart, increase quantity
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // If item is new, add it with quantity 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    // Optionally open the cart when adding an item
    // setIsCartOpen(true);
  };

  // Remove from cart function
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Update cart item quantity
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  // Calculate total items in cart
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate cart total price
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Toggle cart visibility
  const toggleCart = () => {
    console.log('Toggling cart, current state:', isCartOpen);
    setIsCartOpen(!isCartOpen);
  };

  // Value object to be provided to consumers
  const value = {
    cart,
    isCartOpen,
    cartItemCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleCart,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;