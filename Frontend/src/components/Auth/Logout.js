// Logout.js - A utility function for handling logout (client-side only)

/**
 * Handles user logout by:
 * 1. Removing authentication data from localStorage
 * 2. Redirecting the user to the login page
 * 
 * @param {Function} navigate - React Router's navigate function
 * @returns {void}
 */
export const logout = (navigate) => {
    // Clear all authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Any other auth-related items you might have stored
    // localStorage.removeItem('refreshToken');
    // localStorage.removeItem('expiresAt');
    
    // Redirect to login page
    if (navigate) {
      navigate('/login');
    } else {
      // Fallback if navigate function is not available
      window.location.href = '/login';
    }
  };
  
 