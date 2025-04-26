// Login.jsx with proper image imports
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
// Import the background image
import authBgImage from '../../assets/images/auth-bg.jpg';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Create a style object for the background image
  const authImageStyle = {
    backgroundImage: `url(${authBgImage})`
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Here you would normally make an API call to your backend
      // For demo purposes, we'll simulate a successful login
      const response = await fakeLoginRequest(formData);
      
      if (response.success) {
        // Save auth token to localStorage
        localStorage.setItem('token', response.token);
        // Redirect to home page
        navigate('/');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Simulate API request
  const fakeLoginRequest = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo, accept any email with a password longer than 5 characters
        if (data.email && data.password.length > 5) {
          resolve({
            success: true,
            token: 'fake-jwt-token-' + Math.random(),
            message: 'Login successful'
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid credentials'
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
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue your plant journey</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="Your password"
                required
              />
            </div>
            
            <div className="remember-forgot">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
        </div>
        
        {/* Apply the background image using inline style */}
        <div className="auth-image" style={authImageStyle}>
          <div className="auth-image-overlay"></div>
          <div className="auth-quote">
            <p>"In a world full of trends, become a classic like plants that never go out of style."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;