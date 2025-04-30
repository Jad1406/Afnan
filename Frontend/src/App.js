// // App.js with Auth Routes
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar/Navbar';
// import HeroSection from './components/HeroSection/HeroSection';
// import FeaturedPlants from './components/FeaturedPlants/FeaturedPlants';
// import PlantChatbot from './components/PlantChatbot/PlantChatbot';
// import { CartProvider } from './CartContext';
// import { WishlistProvider } from './WishlistContext';
// import CartSidebar from './CartSidebar';
// import WishlistSidebar from './WishlistSidebar';
// import Login from './components/Auth/Login';
// import Signup from './components/Auth/Signup';
// import './App.css';
// import './WishlistStyles.css'; // Make sure this is imported

// // Import placeholder components for other tabs
// import Community from './pages/Community';
// import Education from './pages/Education';
// import Market from './pages/Market';
// import Tracker from './pages/Tracker';

// // Protected route component
// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = localStorage.getItem('token');
  
//   if (!isAuthenticated) {
//     // Redirect to login if not authenticated
//     return <Navigate to="/login" />;
//   }
  
//   return children;
// };

// function App() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     // Check if user is authenticated
//     const token = localStorage.getItem('token');
//     setIsAuthenticated(!!token);
    
//     // Check for user preference in localStorage
//     const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
//     // Check for system preference if no saved preference
//     if (localStorage.getItem('darkMode') === null) {
//       const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
//       setDarkMode(prefersDarkMode);
//     } else {
//       setDarkMode(savedDarkMode);
//     }
//   }, []);

//   useEffect(() => {
//     // Update body class when darkMode changes
//     if (darkMode) {
//       document.body.classList.add('dark-mode');
//     } else {
//       document.body.classList.remove('dark-mode');
//     }
    
//     // Save to localStorage
//     localStorage.setItem('darkMode', darkMode);
//   }, [darkMode]);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//     // Redirect to login page will happen automatically through protected routes
//   };

//   return (
//     <CartProvider>
//       <WishlistProvider>
//         <Router>
//           <div className={`app ${darkMode ? 'dark' : 'light'}`}>
//             {/* Only show Navbar on non-auth pages */}
//             <Routes>
//               <Route path="/login" element={null} />
//               <Route path="/signup" element={null} />
//               <Route path="*" element={
//                 <Navbar 
//                   darkMode={darkMode} 
//                   toggleDarkMode={toggleDarkMode} 
//                   isAuthenticated={isAuthenticated}
//                   onLogout={handleLogout}
//                 />
//               } />
//             </Routes>
            
//             <Routes>
//               {/* Auth routes */}
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup />} />
              
//               {/* Main routes */}
//               <Route path="/" element={
//                 <main className="home-page">
//                   <HeroSection />
//                   <FeaturedPlants />
//                   {/* Add more homepage sections here */}
//                 </main>
//               } />
//               <Route path="/community" element={<Community />} />
//               <Route path="/education" element={<Education />} />
//               <Route path="/market" element={<Market />} />
              
//               {/* Protected routes */}
//               <Route path="/tracker" element={
//                 <ProtectedRoute>
//                   <Tracker />
//                 </ProtectedRoute>
//               } />
//             </Routes>
            
//             {/* Don't show cart/wishlist sidebars on auth pages */}
//             <Routes>
//               <Route path="/login" element={null} />
//               <Route path="/signup" element={null} />
//               <Route path="*" element={
//                 <>
//                   <CartSidebar />
//                   <WishlistSidebar />
//                 </>
//               } />
//             </Routes>
            
//             {/* Chatbot component - available on all pages except auth */}
//             <Routes>
//               <Route path="/login" element={null} />
//               <Route path="/signup" element={null} />
//               <Route path="*" element={<PlantChatbot />} />
//             </Routes>
//           </div>
//         </Router>
//       </WishlistProvider>
//     </CartProvider>
//   );
// }

// export default App;




// App.js with AuthProvider
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HeroSection from './components/HeroSection/HeroSection';
import FeaturedPlants from './components/FeaturedPlants/FeaturedPlants';
import PlantChatbot from './components/PlantChatbot/PlantChatbot';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { AuthProvider, useAuth } from './components/Auth/AuthContext'; // Import AuthProvider and useAuth hook
import CartSidebar from './CartSidebar';
import WishlistSidebar from './WishlistSidebar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import './App.css';
import './WishlistStyles.css';

// Import placeholder components for other tabs
import Community from './pages/Community';
import Education from './pages/Education';
import Market from './pages/Market';
import Tracker from './pages/Tracker';

// Protected route component using the useAuth hook
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Main App component without authentication logic (will be handled by AuthContext)
function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Get authentication state from AuthContext
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Check for user preference in localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Check for system preference if no saved preference
    if (localStorage.getItem('darkMode') === null) {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
    } else {
      setDarkMode(savedDarkMode);
    }
  }, []);

  useEffect(() => {
    // Update body class when darkMode changes
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Save to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      {/* Only show Navbar on non-auth pages */}
      <Routes>
        <Route path="/login" element={null} />
        <Route path="/signup" element={null} />
        <Route path="*" element={
          <Navbar 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            // No need to pass isAuthenticated or onLogout props anymore
            // as Navbar will use the AuthContext directly
          />
        } />
      </Routes>
      
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Main routes */}
        <Route path="/" element={
          <main className="home-page">
            <HeroSection />
            <FeaturedPlants />
            {/* Add more homepage sections here */}
          </main>
        } />
        <Route path="/community" element={<Community />} />
        <Route path="/education" element={<Education />} />
        <Route path="/market" element={<Market />} />
        
        {/* Protected routes */}
        <Route path="/tracker" element={
          <ProtectedRoute>
            <Tracker />
          </ProtectedRoute>
        } />
      </Routes>
      
      {/* Don't show cart/wishlist sidebars on auth pages */}
      <Routes>
        <Route path="/login" element={null} />
        <Route path="/signup" element={null} />
        <Route path="*" element={
          <>
            <CartSidebar />
            <WishlistSidebar />
          </>
        } />
      </Routes>
      
      {/* Chatbot component - available on all pages except auth */}
      <Routes>
        <Route path="/login" element={null} />
        <Route path="/signup" element={null} />
        <Route path="*" element={<PlantChatbot />} />
      </Routes>
    </div>
  );
}

// Root component that provides all context providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;