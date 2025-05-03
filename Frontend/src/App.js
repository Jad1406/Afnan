// // App.js with proper Router/AuthProvider ordering
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar/Navbar';
// import HeroSection from './components/HeroSection/HeroSection';
// import FeaturedPlants from './components/FeaturedPlants/FeaturedPlants';
// import PlantChatbot from './components/PlantChatbot/PlantChatbot';
// import { CartProvider } from './CartContext';
// import { WishlistProvider } from './WishlistContext';
// import { AuthProvider, useAuth } from './components/Auth/AuthContext';


// import CartSidebar from './CartSidebar';
// import WishlistSidebar from './WishlistSidebar';
// import Login from './components/Auth/Login';
// import Signup from './components/Auth/Signup';
// import './App.css';
// import './WishlistStyles.css';

// // Import placeholder components for other tabs
// import Community from './pages/Community';
// import Education from './pages/Education';
// import Market from './pages/Market';
// import Tracker from './pages/Tracker';
// import AI from './pages/AiChat';
// import BlogPostDetail from './components/Posts/BlogPostDetail';
// import GalleryPostDetail from './components/Posts/GalleryPostDetail';


// import Profile from './pages/Profile';
// import Checkout from './pages/Checkout';
// import OrderSuccess from './pages/OrderSuccess';
// import OrderHistory from './components/OrderHistory/OrderHistory';

// // Protected route component using the useAuth hook
// const ProtectedRoute = ({ children }) => {

//   const { isAuthenticated } = useAuth();
//   if (!isAuthenticated) {
//     // Redirect to login if not authenticated
//     return <Navigate to="/login" />;
//   }
  
//   return children;
// };

// function App() {
//   const [darkMode, setDarkMode] = useState(false);
//   const { isAuthenticated, user } = useAuth();

//   useEffect(() => {
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

//   // CRITICAL CHANGE: Router MUST be outside AuthProvider if AuthProvider uses navigation hooks
//   return (
//     <Router>
//       <AuthProvider>

//         <CartProvider>
//           <WishlistProvider>
//             <div className={`app ${darkMode ? 'dark' : 'light'}`}>
//               {/* Only show Navbar on non-auth pages */}
//               <Routes>
//                 <Route path="/login" element={null} />
//                 <Route path="/signup" element={null} />
//                 <Route path="*" element={
//                   <Navbar 
//                     darkMode={darkMode} 
//                     toggleDarkMode={toggleDarkMode} 
//                   />
//                 } />
//               </Routes>
              
//               <Routes>
//                 {/* Auth routes */}
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/signup" element={<Signup />} />
                
//                 {/* Main routes */}
//                 <Route path="/" element={
//                   <main className="home-page">
//                     <HeroSection />
//                     <FeaturedPlants />
//                     {/* Add more homepage sections here */}
//                   </main>
//                 } />
//                 <Route path="/community" element={<Community />} />
//                 <Route path="/education" element={<Education />} />
//                 <Route path="/market" element={<Market />} />
//                 <Route path="/profile" element={<Profile />} />
//                 <Route path="/checkout" element={<Checkout />} />
//                 <Route path="/order-success/:orderId" element={<OrderSuccess />} />
//                 <Route path="/orders" element={<OrderHistory />} />

//                 <Route 
//           path="/community/blog/:id" 
//           element={<BlogPostDetail isAuthenticated={isAuthenticated} currentUserId={user?.userId} />} 
//         />
//         <Route 
//           path="/community/gallery/:id" 
//           element={<GalleryPostDetail isAuthenticated={isAuthenticated} currentUserId={user?.userId} />} 
//         />

                
//                 {/* Protected routes */}
//                 <Route path="/tracker" element={
//                   <ProtectedRoute>
//                     <Tracker />
//                   </ProtectedRoute>
//                 } />
                
//                 {/* AI route */}
//                 <Route path="/ai" element={<AI />} />
//               </Routes>
              
//               {/* Don't show cart/wishlist sidebars on auth pages */}
//               <Routes>
//                 <Route path="/login" element={null} />
//                 <Route path="/signup" element={null} />
//                 <Route path="*" element={
//                   <>
//                     <CartSidebar />
//                     <WishlistSidebar />
//                   </>
//                 } />
//               </Routes>
              
//               {/* Chatbot component - available on all pages except auth */}
//               <Routes>
//                 <Route path="/login" element={null} />
//                 <Route path="/signup" element={null} />
//                 <Route path="*" element={<PlantChatbot />} />
//               </Routes>
//             </div>
//           </WishlistProvider>
//         </CartProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;




// App.js with proper Router/AuthProvider ordering
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HeroSection from './components/HeroSection/HeroSection';
import FeaturedPlants from './components/FeaturedPlants/FeaturedPlants';
import PlantChatbot from './components/PlantChatbot/PlantChatbot';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { AuthProvider } from './components/Auth/AuthContext';
import Footer from './components/Footer/Footer'; // Import the Footer component

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
import AI from './pages/AiChat';
import BlogPostDetail from './components/Posts/BlogPostDetail';
import GalleryPostDetail from './components/Posts/GalleryPostDetail';

import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './components/OrderHistory/OrderHistory';
// Don't forget to import useAuth in this file
import { useAuth } from './components/Auth/AuthContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);

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
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className={`app ${darkMode ? 'dark' : 'light'}`}>
              {/* Only show Navbar on non-auth pages */}
              <Routes>
                <Route path="/login" element={null} />
                <Route path="/signup" element={null} />
                <Route path="*" element={
                  <Navbar 
                    darkMode={darkMode} 
                    toggleDarkMode={toggleDarkMode} 
                  />
                } />
              </Routes>
              
              <AppRoutes darkMode={darkMode} />
              
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
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

// Extract routes into a separate component that uses the Auth hook
const AppRoutes = () => {
  // Now useAuth is being called inside AuthProvider context
  const { isAuthenticated, user } = useAuth();
  
  // Protected route component using the useAuth hook
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return <Navigate to="/login" />;
    }
    return children;
  };
  
  return (
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
      <Route path="/profile" element={<Profile />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success/:orderId" element={<OrderSuccess />} />
      <Route path="/orders" element={<OrderHistory />} />
      
      {/* Blog and Gallery detail routes */}
      <Route 
        path="/community/blog/:id" 
        element={<BlogPostDetail isAuthenticated={isAuthenticated} currentUserId={user?.userId} />} 
      />
      <Route 
        path="/community/gallery/:id" 
        element={<GalleryPostDetail isAuthenticated={isAuthenticated} currentUserId={user?.userId} />} 
      />
      
      {/* Protected routes */}
      <Route path="/tracker" element={
        <ProtectedRoute>
          <Tracker />
        </ProtectedRoute>
      } />
      
      {/* AI route */}
      <Route path="/ai" element={<AI />} />
      {/* Footer component - available on all pages except auth */}
      <Routes>
        <Route path="/login" element={null} />
        <Route path="/signup" element={null} />
        <Route path="*" element={<Footer darkMode={darkMode} />
} />
      </Routes>

  );
};


export default App;
