// CartSidebar.jsx
import React from 'react';
import { useCart } from './CartContext';
import './CartSidebar.css';

const CartSidebar = () => {
  const { 
    cart, 
    isCartOpen, 
    cartTotal, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity 
  } = useCart();

  console.log('Cart state:', { isOpen: isCartOpen, items: cart });

  return (
    <>
      {/* Cart sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h2>
          <button 
            className="close-cart-btn"
            onClick={() => setIsCartOpen(false)}
          >
            ×
          </button>
        </div>
        
        {cart.length > 0 ? (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="cart-item-img" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/80x80?text=Plant";
                      }}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <div className="cart-item-price">${item.price.toFixed(2)}</div>
                    <div className="cart-item-controls">
                      <div className="quantity-control">
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="cart-total">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="cart-actions">
                <button className="checkout-btn">Proceed to Checkout</button>
                <button 
                  className="continue-shopping-btn"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                </button>
              </div>
              
              <div className="cart-promo">
                <input type="text" placeholder="Enter promo code" />
                <button>Apply</button>
              </div>
              
              <div className="shipping-info">
                <p>Free shipping on orders over $50!</p>
                <p>Most orders ship within 1-2 business days.</p>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <p>Your cart is empty</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => setIsCartOpen(false)}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
      
      {/* Overlay that closes the cart when clicked */}
      {isCartOpen && (
        <div 
          className="cart-overlay"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}
    </>
  );
};

export default CartSidebar;