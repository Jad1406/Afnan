import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';
// import ProfileInfo from './ProfileInfo';
// import OrderHistory from './OrderHistory';
import Wishlist from '../WishlistSidebar';
// import Addresses from './Addresses';
import './Profile.css';

const Profile = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the active tab from the URL or default to 'info'
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path.includes('/orders')) return 'orders';
    if (path.includes('/wishlist')) return 'wishlist';
    if (path.includes('/addresses')) return 'addresses';
    return 'info';
  });
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, loading, navigate, location]);
  
  // Update active tab when route changes
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/orders')) setActiveTab('orders');
    else if (path.includes('/wishlist')) setActiveTab('wishlist');
    else if (path.includes('/addresses')) setActiveTab('addresses');
    else setActiveTab('info');
  }, [location.pathname]);
  
  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Account</h1>
        <p>Manage your account information, orders, and preferences</p>
      </div>
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="user-info">
            <div className="avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <h3>{user?.name || 'User'}</h3>
              <p>{user?.email || 'email@example.com'}</p>
            </div>
          </div>
          
          <nav className="profile-nav">
            <NavLink 
              to="/profile" 
              end
              className={({ isActive }) => 
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              <span className="nav-icon">👤</span>
              <span>Personal Info</span>
            </NavLink>
            
            <NavLink 
              to="/orders" 
              className={({ isActive }) => 
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              <span className="nav-icon">📦</span>
              <span>Order History</span>
            </NavLink>
            
            <NavLink 
              to="/profile/wishlist" 
              className={({ isActive }) => 
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              <span className="nav-icon">❤️</span>
              <span>Wishlist</span>
            </NavLink>
            
            <NavLink 
              to="/profile/addresses" 
              className={({ isActive }) => 
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              <span className="nav-icon">📍</span>
              <span>Addresses</span>
            </NavLink>
          </nav>
        </div>
        
        <div className="profile-main">
          <Routes>
            {/* <Route path="/" element={<ProfileInfo />} /> */}
            {/* <Route path="/orders" element={<OrderHistory />} /> */}
            <Route path="/wishlist" element={<Wishlist />} />
            {/* <Route path="/addresses" element={<Addresses />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;