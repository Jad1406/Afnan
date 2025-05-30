// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useCart } from '../CartContext';
// import './OrderSuccess.css';

// const OrderSuccess = () => {
//   const { orderId } = useParams();
//   const { fetchOrderDetails } = useCart();
  
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     const getOrderDetails = async () => {
//       try {
//         setLoading(true);
//         const orderData = await fetchOrderDetails(orderId);
//         setOrder(orderData);
//       } catch (err) {
//         console.error('Error fetching order details:', err);
//         setError('Could not load your order details. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (orderId) {
//       getOrderDetails();
//     }
//   }, [orderId, fetchOrderDetails]);
  
//   if (loading) {
//     return (
//       <div className="order-success-container">
//         <div className="loading-spinner">
//           <div className="spinner"></div>
//           <p>Loading your order details...</p>
//         </div>
//       </div>
//     );
//   }
  
//   if (error || !order) {
//     return (
//       <div className="order-success-container">
//         <div className="error-message">
//           <h2>Something went wrong</h2>
//           <p>{error || 'Order not found.'}</p>
//           <Link to="/orders" className="button">View All Orders</Link>
//         </div>
//       </div>
//     );
//   }
  
//   // Calculate order totals
//   const subtotal = order.totalAmount;
//   const total = subtotal + order.shippingCost + order.taxAmount;
  
//   return (
//     <div className="order-success-container">
//       <div className="order-success-content">
//         <div className="order-success-header">
//           <div className="success-icon">
//             <svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4CAF50" strokeWidth="2"/>
//               <path d="M8 12L11 15L16 9" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <h1>Thank You for Your Order!</h1>
//           <p className="confirmation-message">
//             Your order has been successfully placed and is being processed.
//           </p>
//         </div>
        
//         <div className="order-details-card">
//           <div className="order-info-section">
//             <h2>Order Information</h2>
//             <div className="order-info-grid">
//               <div className="info-item">
//                 <span className="info-label">Order Number:</span>
//                 <span className="info-value">{order._id}</span>
//               </div>
//               <div className="info-item">
//                 <span className="info-label">Order Date:</span>
//                 <span className="info-value">{new Date(order.createdAt).toLocaleDateString()}</span>
//               </div>
//               <div className="info-item">
//                 <span className="info-label">Order Status:</span>
//                 <span className="info-value status">
//                   <span className={`status-badge ${order.status}`}>{order.status}</span>
//                 </span>
//               </div>
//               <div className="info-item">
//                 <span className="info-label">Payment Method:</span>
//                 <span className="info-value">{order.paymentMethod === 'credit_card' ? 'Credit Card' : order.paymentMethod}</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="order-address-section">
//             <div className="shipping-address">
//               <h3>Shipping Address</h3>
//               <p>{order.shippingAddress.name}</p>
//               <p>{order.shippingAddress.street}</p>
//               <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
//               <p>{order.shippingAddress.country}</p>
//             </div>
            
//             {order.notes && (
//               <div className="order-notes">
//                 <h3>Order Notes</h3>
//                 <p>{order.notes}</p>
//               </div>
//             )}
//           </div>
          
//           <div className="order-items-section">
//             <h3>Order Items</h3>
//             <div className="order-items-list">
//               {order.items.map((item, index) => (
//                 <div key={index} className="order-item">
//                   <div className="item-image">
//                     <img src={item.image} alt={item.name} />
//                   </div>
//                   <div className="item-details">
//                     <h4>{item.name}</h4>
//                     <div className="item-meta">
//                       <span className="item-price">${item.price.toFixed(2)}</span>
//                       <span className="item-quantity">Qty: {item.quantity}</span>
//                     </div>
//                   </div>
//                   <div className="item-total">
//                     ${(item.price * item.quantity).toFixed(2)}
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <div className="order-summary">
//               <div className="summary-row">
//                 <span>Subtotal:</span>
//                 <span>${subtotal.toFixed(2)}</span>
//               </div>
//               <div className="summary-row">
//                 <span>Shipping:</span>
//                 <span>${order.shippingCost.toFixed(2)}</span>
//               </div>
//               <div className="summary-row">
//                 <span>Tax:</span>
//                 <span>${order.taxAmount.toFixed(2)}</span>
//               </div>
//               <div className="summary-row total">
//                 <span>Total:</span>
//                 <span>${total.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="order-actions">
//           <Link to="/orders" className="button secondary">View All Orders</Link>
//           <Link to="/market" className="button primary">Continue Shopping</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderSuccess;



import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/order-success/${orderId}` } });
    }
  }, [isAuthenticated, navigate, orderId]);
  
  // Fetch the order directly without using CartContext
  useEffect(() => {
    let isMounted = true;
    
    const fetchOrder = async () => {
      if (!orderId || !isAuthenticated) return;
      
      try {
        // Begin with loading state
        if (isMounted) setLoading(true);
        
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');
        
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';
        
        console.log(`Fetching order: ${orderId}`);
        
        // Use Promise with timeout to prevent endless loading
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 10-second timeout
        
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Failed to load order (${response.status})`);
        }
        
        const data = await response.json();
        
        // Ensure we have valid order data
        if (!data.order) throw new Error('No order data received');
        
        // Update state only if still mounted
        if (isMounted) {
          console.log('Order loaded successfully');
          setOrder(data.order);
          setError(null);
          // Set loading to false only after order is set
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        // Update error state only if still mounted
        if (isMounted) {
          setError(err.message || 'Failed to load order');
          setLoading(false);
        }
      }
    };
    
    fetchOrder();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [orderId, isAuthenticated]);
  
  if (loading) {
    return (
      <div className="order-success-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your order details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="order-success-container">
        <div className="error-message">
          <h2>Something went wrong</h2>
          <p>{error || 'Order not found.'}</p>
          <Link to="/orders" className="button">View All Orders</Link>
        </div>
      </div>
    );
  }
  
  // Calculate order totals
  const subtotal = order.totalAmount || 0;
  const shippingCost = order.shippingCost || 0;
  const taxAmount = order.taxAmount || 0;
  const total = subtotal + shippingCost + taxAmount;
  
  return (
    <div className="order-success-container">
      <div className="order-success-content">
        <div className="order-success-header">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4CAF50" strokeWidth="2"/>
              <path d="M8 12L11 15L16 9" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1>Thank You for Your Order!</h1>
          <p className="confirmation-message">
            Your order has been successfully placed and is being processed.
          </p>
        </div>
        
        <div className="order-details-card">
          <div className="order-info-section">
            <h2>Order Information</h2>
            <div className="order-info-grid">
              <div className="info-item">
                <span className="info-label">Order Number:</span>
                <span className="info-value">{order._id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Order Date:</span>
                <span className="info-value">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Order Status:</span>
                <span className="info-value status">
                  <span className={`status-badge ${order.status}`}>{order.status}</span>
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Payment Method:</span>
                <span className="info-value">{order.paymentMethod === 'credit_card' ? 'Credit Card' : order.paymentMethod}</span>
              </div>
            </div>
          </div>
          
          <div className="order-address-section">
            <div className="shipping-address">
              <h3>Shipping Address</h3>
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
            
            {order.notes && (
              <div className="order-notes">
                <h3>Order Notes</h3>
                <p>{order.notes}</p>
              </div>
            )}
          </div>
          
          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/80x80?text=Product";
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <div className="item-meta">
                      <span className="item-price">${item.price.toFixed(2)}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="order-actions">
          <Link to="/orders" className="button secondary">View All Orders</Link>
          <Link to="/market" className="button primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;