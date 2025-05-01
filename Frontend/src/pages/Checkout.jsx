

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../CartContext';
import { useAuth } from '../components/Auth/AuthContext';
import './Checkout.css';

// Load Stripe outside of the component to avoid recreating the Stripe object
const stripePromise = loadStripe('pk_test_51RJHxeE7qQTPukxFCP3X2fS6OPdMh3peAOQ1WZwwU57hHZAQg2aoLVNPgKlhEQ5IcYY4aeJjJozKpTPIMLYsgB5700i13DEgLz');

// Main Checkout Component
const Checkout = () => {
  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

// Checkout Form Component (inside Elements)
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, cartTotal,clearCart, isLoading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [checkoutSummary, setCheckoutSummary] = useState({
    subtotal: 0,
    taxAmount: 0,
    shippingCost: 0,
    total: 0
  });
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'LBN'
  });
  const [notes, setNotes] = useState('');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cart.length === 0) {
      navigate('/market');
    }
  }, [cart, cartLoading, navigate]);
  
  // Create payment intent when component mounts
  useEffect(() => {
    if (isAuthenticated && cart.length > 0) {
      createPaymentIntent();
    }
  }, [isAuthenticated, cart]);
  
  // Create a payment intent
  const createPaymentIntent = async () => {
    try {
      setIsLoading(true);
      setPaymentError(null);
      
      console.log('Creating payment intent...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';
      
      // Log request details (for debugging)
      console.log('Payment request URL:', `${API_URL}/payments/create-payment-intent`);
      console.log('Auth token exists:', !!token);
      
      const response = await fetch(`${API_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      
      // Log response status (for debugging)
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Log response data (for debugging)
      console.log('Payment intent created:', {
        success: data.success,
        hasClientSecret: !!data.clientSecret,
        amount: data.amount
      });
      
      if (!data.success || !data.clientSecret) {
        throw new Error(data.message || 'Failed to create payment intent');
      }
      
      setClientSecret(data.clientSecret);
      setCheckoutSummary({
        subtotal: data.subtotal || 0,
        taxAmount: data.taxAmount || 0,
        shippingCost: data.shippingCost || 0,
        total: data.amount || 0
      });
      
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setPaymentError(`Payment setup failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle shipping address changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      setPaymentError("Payment system is still loading. Please try again in a moment.");
      return;
    }
    
    // Validate form
    const requiredFields = ['name', 'street', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        setPaymentError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return;
      }
    }
    
    if (!clientSecret) {
      setPaymentError("Payment setup failed. Please try again or contact support.");
      return;
    }
    
    // Process payment
    try {
      setIsLoading(true);
      setPaymentError(null);
      
      // Log for debugging (mask most of the secret)
      const secretStart = clientSecret.substring(0, 10);
      const secretEnd = clientSecret.substring(clientSecret.length - 5);
      console.log(`Processing payment with client secret: ${secretStart}...${secretEnd}`);
      
      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: shippingAddress.name
          }
        }
      });
      
      console.log('Payment result:', result);
      
      if (result.error) {
        setPaymentError(`Payment failed: ${result.error.message}`);
        setIsLoading(false);
        return;
      }
      
      // Payment succeeded
      console.log(`Payment succeeded! PaymentIntent ID: ${result.paymentIntent.id}`);
      setSucceeded(true);
      setIsLoading(false);
      clearCart(); // Clear cart after successful payment
      // Create order
      await createOrder(result.paymentIntent.id);
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(`Payment failed: ${error.message}`);
      setIsLoading(false);
    }
  };
  
  // Create order after successful payment
  const createOrder = async (paymentIntentId) => {
    try {
      setOrderProcessing(true);
      
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';
      const token = localStorage.getItem('token');
      
      console.log(`Creating order for payment intent: ${paymentIntentId}`);
      
      const response = await fetch(`${API_URL}/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentIntentId,
          shippingAddress,
          paymentMethod: 'credit_card',
          paymentDetails: {
            // These will be overridden by the server with actual card details
            lastFour: '****', 
            cardType: 'card'
          },
          notes
        })
      });
      
      // Handle non-success status
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }
      
      console.log('Order created successfully:', data.order._id);
      
      // Navigate to success page
      navigate(`/order-success/${data.order._id}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setPaymentError(`Order creation failed: ${error.message}`);
    } finally {
      setOrderProcessing(false);
    }
  };
  
  // Card element options
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true, // We collect this in our form
  };
  
  return (
    <div className="checkout-form-container">
      <div className="checkout-sections">
        <div className="checkout-form-section">
          <h2>Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={shippingAddress.name}
                onChange={handleAddressChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                name="street"
                value={shippingAddress.street}
                onChange={handleAddressChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  required
                >
                  <option value="LBN">Lebanon</option>
                  <option value="SYR">Syria</option>
                  <option value="JDN">Jordan</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Order Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special delivery instructions or other notes"
                rows="3"
              ></textarea>
            </div>
            
            <h2>Payment Information</h2>
            <div className="payment-section">
              <div className="card-element-container">
                <CardElement options={cardElementOptions} />
              </div>
              
              {paymentError && (
                <div className="payment-error">
                  {paymentError}
                </div>
              )}
              
              <button
                type="submit"
                className="payment-button"
                disabled={isLoading || !stripe || succeeded || orderProcessing || !clientSecret}
              >
                {isLoading ? (
                  'Processing...'
                ) : orderProcessing ? (
                  'Creating Order...'
                ) : succeeded ? (
                  'Payment Successful!'
                ) : !clientSecret ? (
                  'Loading Payment...'
                ) : (
                  `Pay ${checkoutSummary.total.toFixed(2)}`
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="checkout-summary-section">
          <h2>Order Summary</h2>
          <div className="cart-items">
            {cart.map((item) => {
              const itemId = item.product || item._id || item.id;
              return (
                <div key={itemId} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="price-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${checkoutSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (7%):</span>
              <span>${checkoutSummary.taxAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>${checkoutSummary.shippingCost.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${checkoutSummary.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;