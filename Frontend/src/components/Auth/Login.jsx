// // File: Login.jsx
// // Login.jsx with proper image imports and improved auth flow
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from './AuthContext';
// import './Auth.css';
// // Import the background image
// import authBgImage from '../../assets/images/auth-bg.jpg';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [redirectMessage, setRedirectMessage] = useState('');
  
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Get auth context
//   const { login, isAuthenticated, pendingAction } = useAuth();

//   // Create a style object for the background image
//   const authImageStyle = {
//     backgroundImage: `url(${authBgImage})`
//   };

//   // Check if user was redirected from another page
//   useEffect(() => {
//     if (location.state?.from) {
//       setRedirectMessage(`You need to log in to access ${location.state.from}`);
//     }
    
//     // Read the pending action from localStorage
//     const savedAction = localStorage.getItem('pendingAction');
//     if (savedAction) {
//       try {
//         const action = JSON.parse(savedAction);
        
//         // Show appropriate message based on action type
//         if (action.type === 'REDIRECT') {
//           setRedirectMessage(`Please log in to continue to ${action.payload.path.split('/').pop()}`);
//         } else if (action.type === 'CALLBACK') {
//           setRedirectMessage('Please log in to continue your previous action');
//         }
//       } catch (e) {
//         console.error('Error parsing pending action:', e);
//       }
//     }
//   }, [location.state]);
  
//   // Redirect if user is already authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       // Check if there's a redirect URL in localStorage
//       const redirectUrl = localStorage.getItem('redirectUrl');
      
//       if (redirectUrl) {
//         localStorage.removeItem('redirectUrl');
//         navigate(redirectUrl);
//       } else if (pendingAction) {
//         // Execute pending action if it exists
//         if (pendingAction.type === 'REDIRECT') {
//           navigate(pendingAction.payload.path);
//         }
//         // Callbacks are handled in AuthContext
//       } else {
//         // Default redirect to home page
//         navigate('/');
//       }
//     }
//   }, [isAuthenticated, navigate, pendingAction]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       // Use the new login function from AuthContext
//       const result = await login(formData.email, formData.password);
      
//       if (!result.success) {
//         setError(result.message);
//       }
//       // Successful login will trigger the useEffect above for redirection
//     } catch (err) {
//       setError('Login failed. Please check your credentials and try again.');
//       console.error('Login error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-container">
//         <div className="auth-content">
//           <div className="auth-header">
//             <h1>Welcome Back</h1>
//             <p>Sign in to your account to continue your plant journey</p>
//           </div>
          
//           {redirectMessage && (
//             <div className="auth-redirect-message">
//               <p>{redirectMessage}</p>
//             </div>
//           )}
          
//           {error && <div className="auth-error">{error}</div>}
          
//           <form className="auth-form" onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="your@email.com"
//                 required
//                 disabled={loading}
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Your password"
//                 required
//                 disabled={loading}
//               />
//             </div>
            
//             <div className="remember-forgot">
//               <label className="remember-me">
//                 <input type="checkbox" /> Remember me
//               </label>
//               <Link to="/forgot-password" className="forgot-password">
//                 Forgot password?
//               </Link>
//             </div>
            
//             <button 
//               type="submit" 
//               className="auth-button"
//               disabled={loading}
//             >
//               {loading ? 'Signing in...' : 'Sign In'}
//             </button>
//           </form>
          
//           <div className="auth-divider">
//             <span>OR</span>
//           </div>
          
//           <div className="social-auth">
//             <button className="social-button google">
//               <span className="social-icon">G</span>
//               <span>Continue with Google</span>
//             </button>
//             <button className="social-button facebook">
//               <span className="social-icon">f</span>
//               <span>Continue with Facebook</span>
//             </button>
//           </div>
          
//           <div className="auth-footer">
//             <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
//           </div>
//         </div>
        
//         {/* Apply the background image using inline style */}
//         <div className="auth-image" style={authImageStyle}>
//           <div className="auth-image-overlay"></div>
//           <div className="auth-quote">
//             <p>"In a world full of trends, become a classic like plants that never go out of style."</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// Login.jsx with fixed redirect and backend integration
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
// Import the background image
import authBgImage from '../../assets/images/auth-bg.jpg';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState('');
  const [redirectPath, setRedirectPath] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Create a style object for the background image
  const authImageStyle = {
    backgroundImage: `url(${authBgImage})`
  };

  // Check if user was redirected from another page - on component mount
  useEffect(() => {
    // First check for state passed through react-router
    if (location.state?.from) {
      setRedirectMessage(`You need to log in to access ${location.state.from}`);
      setRedirectPath(location.state.from);
    }
    
    // Then check for saved redirect URL in localStorage
    const savedRedirectUrl = localStorage.getItem('redirectUrl');
    if (savedRedirectUrl && !redirectPath) {
      setRedirectPath(savedRedirectUrl);
    }
    
    // Finally check for pending action
    const savedAction = localStorage.getItem('pendingAction');
    if (savedAction) {
      try {
        const action = JSON.parse(savedAction);
        
        // Show appropriate message based on action type
        if (action.type === 'REDIRECT') {
          setRedirectMessage(`Please log in to continue to ${action.payload.path.split('/').pop()}`);
          // Set redirect path if not already set
          if (!redirectPath) {
            setRedirectPath(action.payload.path);
          }
        } else if (action.type === 'CALLBACK') {
          setRedirectMessage('Please log in to continue your previous action');
        }
      } catch (e) {
        console.error('Error parsing pending action:', e);
      }
    }
  }, [location.state]);
  
  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      handleSuccessfulLogin();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSuccessfulLogin = () => {
    // Clear any saved redirect URL from localStorage
    localStorage.removeItem('redirectUrl');
    
    // Determine where to redirect
    if (redirectPath) {
      navigate(redirectPath);
    } else {
      // If there's a pendingAction that's a REDIRECT
      const savedAction = localStorage.getItem('pendingAction');
      if (savedAction) {
        try {
          const action = JSON.parse(savedAction);
          if (action.type === 'REDIRECT') {
            navigate(action.payload.path);
            return;
          }
          // Note: CALLBACK actions are handled by AuthContext
        } catch (e) {
          console.error('Error parsing pending action for redirect:', e);
        }
      }
      
      // Default redirect to home page if no specific target
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Make API call to your backend login endpoint
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
        email: formData.email,
        password: formData.password
      });
      
      // Check if the request was successful
      if (response.status === 200) {
        const { token, user } = response.data;
        
        // Store token and user data in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to the appropriate page
        handleSuccessfulLogin();
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        // The request was made and the server responded with an error status
        if (err.response.status === 401) {
          setError('Invalid email or password. Please try again.');
        } else if (err.response.data && err.response.data.msg) {
          setError(err.response.data.msg);
        } else {
          setError('Login failed. Please try again later.');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue your plant journey</p>
          </div>
          
          {redirectMessage && (
            <div className="auth-redirect-message">
              <p>{redirectMessage}</p>
            </div>
          )}
          
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
                disabled={loading}
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
                disabled={loading}
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