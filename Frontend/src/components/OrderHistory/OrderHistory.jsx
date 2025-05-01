import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../CartContext';
import './OrderHistory.css';

const OrderHistory = () => {
  const { fetchOrders, orders, isLoading, error, cancelOrder, refreshCartFromServer  } = useCart();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Force a cart refresh from server when the orders page loads
    const initPage = async () => {
      setIsRefreshing(true);
      try {
        // First refresh the cart from server to ensure it's in sync
        await refreshCartFromServer();
        // Then fetch orders
        await fetchOrders();
      } catch (err) {
        console.error('Error initializing orders page:', err);
      } finally {
        setIsRefreshing(false);
      }
    };
    
    initPage();
  }, []);

    // Add a manual refresh function for the user
    const handleRefresh = async () => {
      setIsRefreshing(true);
      try {
        await refreshCartFromServer();
        await fetchOrders();
      } catch (err) {
        console.error('Error refreshing data:', err);
      } finally {
        setIsRefreshing(false);
      }
    };
  
  useEffect(() => {
    loadOrders();
  }, [currentPage, activeFilter]);
  
  const loadOrders = async () => {
    try {
      const status = activeFilter !== 'all' ? activeFilter : '';
      const result = await fetchOrders(currentPage, 10, status);
      
      if (result?.pagination) {
        setTotalPages(result.pagination.pages);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-badge pending';
      case 'processing': return 'status-badge processing';
      case 'shipped': return 'status-badge shipped';
      case 'delivered': return 'status-badge delivered';
      case 'cancelled': return 'status-badge cancelled';
      default: return 'status-badge';
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    const maxButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    // Previous button
    pages.push(
      <button 
        key="prev" 
        className={`page-btn prev ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo;
      </button>
    );
    
    // Start ellipsis
    if (startPage > 1) {
      pages.push(
        <button key="start" className="page-btn" onClick={() => handlePageChange(1)}>
          1
        </button>
      );
      
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="page-ellipsis">...</span>);
      }
    }
    
    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    // End ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="page-ellipsis">...</span>);
      }
      
      pages.push(
        <button 
          key="end" 
          className="page-btn" 
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button 
        key="next" 
        className={`page-btn next ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &raquo;
      </button>
    );
    
    return <div className="pagination">{pages}</div>;
  };
  
  if (isLoading) {
    return (
      <div className="order-history">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="order-history">
        <div className="error-message">
          <h3>Error Loading Orders</h3>
          <p>{error}</p>
          <button className="btn" onClick={handleRefresh}>Try Again</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="order-history">
      <div className="section-header">
        <h2>Your Orders</h2>
        <p>Track and manage your purchase history</p>
      </div>
      
      <div className="order-filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} 
          onClick={() => handleFilterChange('all')}
        >
          All Orders
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'processing' ? 'active' : ''}`} 
          onClick={() => handleFilterChange('processing')}
        >
          Processing
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'shipped' ? 'active' : ''}`} 
          onClick={() => handleFilterChange('shipped')}
        >
          Shipped
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'delivered' ? 'active' : ''}`} 
          onClick={() => handleFilterChange('delivered')}
        >
          Delivered
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'cancelled' ? 'active' : ''}`} 
          onClick={() => handleFilterChange('cancelled')}
        >
          Cancelled
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-message">
            <h3>No Orders Found</h3>
            {activeFilter !== 'all' ? (
              <p>You don't have any {activeFilter} orders.</p>
            ) : (
              <p>You haven't placed any orders yet.</p>
            )}
            <Link to="/market" className="btn">Shop Now</Link>
          </div>
        </div>
      ) : (
        <div className="orders-container">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-meta">
                  <div className="order-number">
                    <span className="label">Order #:</span>
                    <span className="value">{order._id}</span>
                  </div>
                  <div className="order-date">
                    <span className="label">Placed on:</span>
                    <span className="value">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
                <div className="order-status">
                  <span className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="order-items">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-meta">
                        <span className="item-price">${item.price.toFixed(2)}</span>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                      </p>
                    </div>
                  </div>
                ))}
                
                {order.items.length > 3 && (
                  <div className="more-items">
                    +{order.items.length - 3} more items
                  </div>
                )}
              </div>
              
              <div className="order-footer">
                <div className="order-total">
                  <span className="label">Total:</span>
                  <span className="value">
                    ${(order.totalAmount + order.shippingCost + order.taxAmount).toFixed(2)}
                  </span>
                </div>
                
                <div className="order-actions">
                  <Link to={`/order-success/${order._id}`} className="btn outline">
                    View Details
                  </Link>
                  
                  {order.status === 'processing' || order.status === 'pending' ? (
                    <button className="btn danger" 
                    onClick={() => cancelOrder(order._id)}
                    >Cancel Order</button>
                  ) : null}
                  
                  {order.status === 'delivered' ? (
                    <button className="btn primary">Buy Again</button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
          
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;