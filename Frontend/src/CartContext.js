

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './components/Auth/AuthContext'; // Adjust path as needed

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Local storage keys
const CART_STORAGE_KEY = 'plant_marketplace_cart';
const CART_OPEN_KEY = 'plant_marketplace_cart_open';

// Create a context for the cart
const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartHistory, setCartHistory] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Get auth context
  const { isAuthenticated, getUserFromToken } = useAuth();
  
  // Get user ID from token directly when needed
  const getUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedUser = getUserFromToken(token);
        return decodedUser?.id || decodedUser?.userId || decodedUser?.sub;
      }
    } catch (error) {
      console.error('Error getting user ID from token:', error);
    }
    
    return null;
  };
  
  // Initialize cart based on auth status
  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (isAuthenticated) {
          // User is logged in - fetch cart from API
          await fetchUserCart();
        } else {
          // User is not logged in - use localStorage
          const storedCart = localStorage.getItem(CART_STORAGE_KEY);
          if (storedCart) {
            setCart(JSON.parse(storedCart));
          }
          
          const storedCartOpen = localStorage.getItem(CART_OPEN_KEY);
          if (storedCartOpen) {
            setIsCartOpen(JSON.parse(storedCartOpen));
          }
        }
      } catch (err) {
        console.error('Error initializing cart:', err);
        setError('Failed to load your cart. Please try again.');
        
        // Fall back to localStorage if API fails
        try {
          const storedCart = localStorage.getItem(CART_STORAGE_KEY);
          if (storedCart) {
            setCart(JSON.parse(storedCart));
          }
        } catch (localErr) {
          // If all else fails, start with empty cart
          setCart([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeCart();
  }, [isAuthenticated]);
  
  // Sync cart to localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      localStorage.setItem(CART_OPEN_KEY, JSON.stringify(isCartOpen));
    }
  }, [cart, isCartOpen, isAuthenticated]);
  
  // When user logs in, merge their server cart with local cart
  useEffect(() => {
    const mergeCartsOnLogin = async () => {
      if (isAuthenticated && getUserId()) {
        // Get local cart
        const localCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        
        // If local cart has items, sync them to the server
        if (localCart.length > 0) {
          try {
            setIsLoading(true);
            
            // First get the user's server cart
            const userCart = await fetchUserCart(false); // Don't update state yet
            
            // Merge carts (prefer local quantities if item exists in both)
            const mergedCart = mergeLocalAndServerCarts(localCart, userCart);
            
            // Update server with merged cart
            if (mergedCart.length > 0) {
              await syncCartToServer(mergedCart);
            }
            
            // Clear local storage cart after sync
            localStorage.removeItem(CART_STORAGE_KEY);
            
            // Finally update local state with merged cart
            setCart(mergedCart);
          } catch (err) {
            console.error('Error merging carts on login:', err);
            setError('Failed to sync your cart. Some items may be missing.');
          } finally {
            setIsLoading(false);
          }
        } else {
          // No local cart, just fetch user's cart from server
          await fetchUserCart();
        }
      }
    };
    
    mergeCartsOnLogin();
  }, [isAuthenticated]);
  
  // Helper function to merge local and server carts
  const mergeLocalAndServerCarts = (localCart, serverCart) => {
    const mergedCart = [...serverCart];
    
    // Add or update items from local cart
    localCart.forEach(localItem => {
      const productId = localItem.product || localItem._id || localItem.id;
      const existingIndex = mergedCart.findIndex(item => {
        const itemProductId = item.product || item._id || item.id;
        return itemProductId === productId;
      });
      
      if (existingIndex >= 0) {
        // Item exists in both carts - merge (keep higher quantity)
        mergedCart[existingIndex] = {
          ...mergedCart[existingIndex],
          quantity: Math.max(mergedCart[existingIndex].quantity, localItem.quantity)
        };
      } else {
        // Item only in local cart - add to merged cart
        mergedCart.push(localItem);
      }
    });
    
    return mergedCart;
  };
  
  // Fetch user's active cart from server
  const fetchUserCart = async (updateState = true) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/cart`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // The API now returns the items array directly
      const userCart = response.data.cart || [];
      
      if (updateState) {
        setCart(userCart);
      }
      
      return userCart;
    } catch (err) {
      console.error('Error fetching user cart:', err);
      if (updateState) {
        setError('Failed to load your cart from the server');
      }
      return [];
    }
  };
  
  // Sync cart to server (for logged in users)
  const syncCartToServer = async (cartToSync = cart) => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/cart`,
        { cart: cartToSync },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.cart;
    } catch (err) {
      console.error('Error syncing cart to server:', err);
      setError('Failed to save your cart to the server');
      return null;
    }
  };
  
  // Add to cart function
  const addToCart = async (product, quantity = 1) => {
    if (!product) {
      console.error('Attempted to add invalid product to cart');
      return;
    }
    
    // Make sure quantity is a positive number
    const safeQuantity = Math.max(1, parseInt(quantity) || 1);
    
    // Get a consistent product ID
    const productId = product._id || product.id;
    
    if (!productId) {
      console.error('Cannot add product without an ID to cart:', product);
      return;
    }
    
    // console.log(`Adding ${safeQuantity} of product ${productId} to cart`);
    
    if (isAuthenticated) {
      // For authenticated users, use the API
      try {
        setIsLoading(true);
        
        const token = localStorage.getItem('token');
        
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/cart/add`,
          { 
            productId,
            quantity: safeQuantity
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Update cart with server response
            // Only update cart state if server responds with success
    if (response.status === 200 || response.status === 201) {
      setCart(response.data.cart);
    } else {
      setError("Unexpected response when adding to cart:", response);
    }
        
      } catch (err) {
        console.error('Error adding item to cart:', err);
        setError('Failed to add item to cart');
        
        // Fall back to local update if API fails
        // updateLocalCart(product, productId, safeQuantity);
      } finally {
        setIsLoading(false);
      }
    } else {
      // For non-authenticated users, update locally
      updateLocalCart(product, productId, safeQuantity);
    }
  };
  
  // Helper function for local cart updates
  const updateLocalCart = (product, productId, quantity) => {
    setCart(prevCart => {
      // Find if product already exists in cart
      const existingItemIndex = prevCart.findIndex(item => {
        const itemId = item.product || item._id || item.id;
        return itemId === productId;
      });
      
      // Create a new cart array to avoid mutation
      const newCart = [...prevCart];
      
      if (existingItemIndex >= 0) {
        // If item exists, update its quantity
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + quantity
        };
      } else {
        // If item is new, add it with the specified quantity
        newCart.push({
          ...product,
          product: productId, // Ensure consistent structure
          quantity: quantity
        });
      }
      
      return newCart;
    });
  };
  
  // Remove from cart function
  const removeFromCart = async (productId) => {
    if (!productId) return;
    
    if (isAuthenticated) {
      // For authenticated users, use the API
      try {
        setIsLoading(true);
        
        const token = localStorage.getItem('token');
        
        const response = await axios.delete(
          `${API_BASE_URL}/api/v1/cart/item/${productId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Update cart with server response
        setCart(response.data.cart);
        
      } catch (err) {
        console.error('Error removing item from cart:', err);
        setError('Failed to remove item from cart');
        
        // Fall back to local update if API fails
        removeLocalCartItem(productId);
      } finally {
        setIsLoading(false);
      }
    } else {
      // For non-authenticated users, update locally
      removeLocalCartItem(productId);
    }
  };
  
  // Helper function for local cart item removal
  const removeLocalCartItem = (productId) => {
    setCart(prevCart => {
      return prevCart.filter(item => {
        const itemId = item.product || item._id || item.id;
        return itemId !== productId;
      });
    });
  };
  
  // Update cart item quantity
  const updateCartQuantity = async (productId, newQuantity) => {
    // console.log("What is the issue?????", productId, newQuantity);
    if (!productId) return;
    
    // Ensure quantity is a positive integer
    const safeQuantity = Math.max(1, parseInt(newQuantity) || 1);

    if (isAuthenticated) {
      // For authenticated users, use the API
      try {
        setIsLoading(true);
        
        const token = localStorage.getItem('token');
        
        const response = await axios.put(
          `${API_BASE_URL}/api/v1/cart/item/${productId}`,
          { quantity: safeQuantity },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        // Update cart with server response
        setCart(response.data.cart);
        
      } catch (err) {
        console.error('Error updating cart quantity:', err);
        setError('Failed to update item quantity');
        
        // Fall back to local update if API fails
        updateLocalCartQuantity(productId, safeQuantity);
      } finally {
        setIsLoading(false);
      }
    } else {
      // For non-authenticated users, update locally
      updateLocalCartQuantity(productId, safeQuantity);
    }
  };
  
  // Helper function for local cart quantity updates
  const updateLocalCartQuantity = (productId, quantity) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        const itemId = item._id 
        return itemId === productId ? { ...item, quantity } : item;
      });
    });
  };
  
  // Clear the entire cart

// Update the clearCart function for better error handling and logging
const clearCart = async () => {
  if (isAuthenticated) {
    // For authenticated users, use the API
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log('Clearing cart: making API request...');
      
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/cart/clear`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Cart clear API response:', response.status, response.data);
      
      // Check if response indicates success
      if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Server returned ${response.status}: ${JSON.stringify(response.data)}`);
      }
      
      // Empty the cart in state
      console.log('Setting cart to empty array in state');
      setCart([]);
      
      return true;
      
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart: ' + (err.message || 'Unknown error'));
      
      // Don't automatically fall back to clearing the cart state
      // This helps diagnose the issue better
      // Only clear local state if it's a 404 (cart not found) or similar
      if (err.response && (err.response.status === 404 || err.response.status === 400)) {
        console.log('Clearing client-side cart state due to 404/400 error');
        setCart([]);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  } else {
    // For non-authenticated users, simply clear local cart
    console.log('User not authenticated, clearing local cart state');
    setCart([]);
    return Promise.resolve(true);
  }
};

// Add a new function to force cart refresh from server
const refreshCartFromServer = async () => {
  if (!isAuthenticated) return;
  
  try {
    console.log('Refreshing cart from server...');
    await fetchUserCart(); // This will update the cart state with server data
    return true;
  } catch (err) {
    console.error('Error refreshing cart from server:', err);
    return false;
  }
};

  
  // Fetch user's cart history
  const fetchCartHistory = async (page = 1, limit = 10) => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/cart/history?page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setCartHistory(response.data.carts);
      return response.data;
    } catch (err) {
      console.error('Error fetching cart history:', err);
      setError('Failed to load cart history');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch user's order history
  const fetchOrders = async (page = 1, limit = 10, status = '') => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // const endpoint = status 
      //   ? `${API_BASE_URL}/api/v1/orders/status/${status}?page=${page}&limit=${limit}`
      //   : `${API_BASE_URL}/api/v1/orders?page=${page}&limit=${limit}`;
      const endpoint = `${API_BASE_URL}/api/v1/orders?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`;
      
      const response = await axios.get(
        endpoint,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setOrders(response.data.orders);
      return response.data;
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load order history');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get a specific order details
  const fetchOrderDetails = async (orderId) => {
    if (!isAuthenticated || !orderId) return null;
    
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return response.data.order;
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create an order from the current cart
  const createOrder = async (orderDetails) => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/orders`,
        orderDetails,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // After successful order creation, the cart will be empty
      setCart([]);
      
      return response.data.order;
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create order');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancel an order
  const cancelOrder = async (orderId) => {
    if (!isAuthenticated || !orderId) return false;
    
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update orders list
      await fetchOrders();
      
      return true;
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Failed to cancel order');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate total items in cart
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate cart total price
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(prevState => !prevState);
  };
  
  // Value object to be provided to consumers
  const value = {
    cart,
    isCartOpen,
    isLoading,
    error,
    cartItemCount,
    cartTotal,
    cartHistory,
    orders,
    
    // Cart actions
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleCart,
    setIsCartOpen,
    clearCart,
    refreshCartFromServer,
    
    // History and order actions
    fetchCartHistory,
    fetchOrders,
    fetchOrderDetails,
    createOrder,
    cancelOrder
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