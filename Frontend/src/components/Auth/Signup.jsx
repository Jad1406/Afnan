// Signup.jsx with AuthContext Integration
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import './Auth.css';
// Import the background image
import authBg2Image from '../../assets/images/auth-bg-2.jpg';
// Import the auth context hook
import { useAuth } from './AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get auth context
  const { isAuthenticated, login } = useAuth();
  
  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Create a style object for the background image
  const authImageStyle = {
    backgroundImage: `url(${authBg2Image})`
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Create the payload for the API request
      const signupData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      };
      
      // Using axios instead of fetch
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/v1/auth/signup`,
        signupData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // With axios, the response data is already parsed as JSON in response.data
      const data = response.data;
      
      // Auto-login after successful signup
      const loginResult = await login(formData.email, formData.password);
      
      if (loginResult.success) {
        // Redirect to home page or dashboard
        navigate('/');
      } else {
        setError(loginResult.message || 'Auto-login failed. Please try logging in manually.');
      }
    } catch (err) {
      // Axios stores the error response data in err.response.data
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>Create an Account</h1>
            <p>Join our community of plant lovers</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
              <small className="password-hint">Must be at least 6 characters</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <div className="terms-policy">
              <label>
                <input type="checkbox" required />
                <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="auth-divider">
            <span>OR</span>
          </div>
          
          <div className="social-auth">
            <button className="social-button google">
              <span className="social-icon">G</span>
              <span>Continue with Google</span>
            </button>
            <button className="social-button facebook">
              <span className="social-icon">f</span>
              <span>Continue with Facebook</span>
            </button>
          </div>
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
        
        {/* Apply the background image using inline style */}
        <div className="auth-image" style={authImageStyle}>
          <div className="auth-image-overlay"></div>
          <div className="auth-quote">
            <p>"Plant a seed today, nurture it, and watch it grow into something beautiful."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;