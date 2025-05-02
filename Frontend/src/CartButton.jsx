// CartButton.jsx
import React from 'react';
import { useCart } from './CartContext';

const CartButton = () => {
  const { cartItemCount, toggleCart } = useCart();

  return (
    <button 
      className="cart-floating-btn"
      onClick={toggleCart}
      aria-label="Open shopping cart"
    >
      <span className="cart-icon">🛒</span>
      {cartItemCount > 0 && (
        <span className="cart-count">{cartItemCount}</span>
      )}
    </button>
  );
};

export default CartButton;