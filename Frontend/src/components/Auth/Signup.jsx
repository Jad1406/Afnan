// Signup.jsx with proper image imports
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
// Import the background image
import authBg2Image from '../../assets/images/auth-bg-2.jpg';

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
      // Here you would normally make an API call to your backend
      // For demo purposes, we'll simulate a successful signup
      const response = await fakeSignupRequest(formData);
      
      if (response.success) {
        // Save auth token to localStorage
        localStorage.setItem('token', response.token);
        // Redirect to home page
        navigate('/');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Simulate API request
  const fakeSignupRequest = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (data.email && data.password && data.firstName && data.lastName) {
          resolve({
            success: true,
            token: 'fake-jwt-token-' + Math.random(),
            message: 'Signup successful'
          });
        } else {
          resolve({
            success: false,
            message: 'Please fill all required fields'
          });
        }
      }, 1000);
    });
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