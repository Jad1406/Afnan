



import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Add this package: npm install jwt-decode

// Create context
const AuthContext = createContext();

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Function to extract user info from JWT token
  const getUserFromToken = (token) => {
    try {
      const user = jwtDecode(token);
      // Extract relevant user data from token
      return  user;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          try {
            // Get user info directly from the token
            const userInfo = getUserFromToken(token);

            // Optionally verify token validity with backend
            const response = await axios.get(`${API_BASE_URL}/api/v1/auth/verify`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            if (response.status === 200) {
              setIsAuthenticated(true);
              setUserInfo(userInfo);
              
              // Check for pending actions
              const savedAction = localStorage.getItem('pendingAction');
              if (savedAction) {
                const action = JSON.parse(savedAction);
                setPendingAction(action);
                localStorage.removeItem('pendingAction');
                
                // Execute the pending action if it exists
                if (action.type === 'REDIRECT') {
                  navigate(action.payload.path);
                } else if (action.type === 'CALLBACK' && window[action.payload.callbackName]) {
                  window[action.payload.callbackName](...action.payload.args);
                }
              }
            } else {
              handleLogout();
            }
          } catch (error) {
            console.error('Token verification error:', error);
            handleLogout();
          }
        } else {
          setIsAuthenticated(false);
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Handle login
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
        email,
        password
      });
      
      const { token } = response.data;
      
      // Only store the token, not the user data
      localStorage.setItem('token', token);
      
      // Extract user info directly from token
      const userInfo = getUserFromToken(token);
      
      setIsAuthenticated(true);
      setUserInfo(userInfo);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.msg || 'Login failed. Please try again.' 
      };
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('pendingAction');
    setIsAuthenticated(false);
    setUserInfo(null);
    navigate('/login');
  };

  // Save a pending action before redirecting to login
  const requireAuth = (action) => {
    if (!isAuthenticated) {
      // Save the current action
      localStorage.setItem('pendingAction', JSON.stringify(action));
      
      // Also store the current URL if it's a redirect action
      if (action.type === 'REDIRECT') {
        localStorage.setItem('redirectUrl', action.payload.path);
      }
      
      // Redirect to login
      navigate('/login', { state: { from: location.pathname } });
      return false;
    }
    return true;
  };

  // Register callback functions globally so they can be accessed after redirect
  const registerCallback = (name, callback) => {
    window[name] = callback;
  };

  // Value object to be provided to consumers
  const authContextValue = {
    isAuthenticated,
    user,
    loading,
    pendingAction,
    login,
    logout: handleLogout,
    requireAuth,
    registerCallback,
    getUserFromToken
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;