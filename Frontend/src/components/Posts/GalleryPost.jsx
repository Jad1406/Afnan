// import React from 'react';
// import './GalleryPost.css';

// const GalleryPost = ({ post, likePost }) => {
//   return (
//     <div className="gallery-item" key={post.id}>
//       <div className="gallery-image-placeholder">
//         <div className="gallery-icon">🪴</div>
//       </div>
//       <div className="gallery-overlay">
//         <h3 className="plant-name">{post.plant}</h3>
//         <p className="user-name">by {post.user}</p>
//       </div>
//       <div className="gallery-details">
//         <p className="caption">{post.caption}</p>
//         <div className="gallery-stats">
//           <span className="gallery-likes">❤️ {post.likes}</span>
//           <span className="gallery-comments">💬 {post.comments}</span>
//           <span className="gallery-date">{post.date}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GalleryPost;


// GalleryPost.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GalleryPost.css';

const GalleryPost = ({ post, likePost, isAuthenticated, currentUserId }) => {
  const navigate = useNavigate();
  
  // Track post likes state locally
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
// Inside the ForumPost component:

// Update local like state when post prop changes
// Inside useEffect to check likes
useEffect(() => {
  if (!post || !currentUserId) {
    setIsLiked(false);
    setLikeCount(0);
    return;
  }
  
  // Check if post.likes exists and is an array
  if (Array.isArray(post.likes)) {
    // Convert all IDs to strings for consistent comparison
    const likesAsStrings = post.likes.map(id => 
      typeof id === 'object' ? id.toString() : String(id)
    );
    const userIdString = String(currentUserId);
    
    // Check if current user ID is in the likes array
    setIsLiked(likesAsStrings.includes(userIdString));
    setLikeCount(post.likesCount || post.likes.length);
  } else {
    // Default values if likes is not an array
    setIsLiked(false);
    setLikeCount(post.likesCount || 0);
  }
}, [post, currentUserId]);


  const handleViewDetails = () => {
    navigate(`/community/gallery/${post.id || post._id}`);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Toggle liked state immediately for responsive UI
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // Update like count optimistically
    setLikeCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);
    
    // Call the likePost function
    likePost(post.id || post._id).catch(() => {
      // Revert UI changes if API call fails
      setIsLiked(!newLikedState);
      setLikeCount(prevCount => !newLikedState ? prevCount + 1 : prevCount - 1);
    });
  };

  return (
    <div className="gallery-item" onClick={handleViewDetails}>
      {post.mediaUrl ? (
        <div className="gallery-media-container">
          {post.mediaType === 'video' ? (
            <>
              <video 
                className="gallery-media" 
                src={post.mediaUrl} 
                alt={post.title || post.plant} 
                preload="metadata"
              />
              <div className="video-indicator">VIDEO</div>
            </>
          ) : (
            <img 
              className="gallery-media" 
              src={post.mediaUrl} 
              alt={post.title || post.plant} 
            />
          )}
        </div>
      ) : (
        <div className="gallery-image-placeholder">
          <div className="gallery-icon">🪴</div>
        </div>
      )}
      
      <div className="gallery-overlay">
        <h3 className="plant-name">{post.title || post.plant}</h3>
        <p className="user-name">by {post.user?.name || post.user}</p>
      </div>
      
      <div className="gallery-details">
        <p className="caption">{post.content || post.caption}</p>
        <div className="gallery-stats">
          <button 
            className={`gallery-like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            ❤️ {likeCount}
          </button>
          <span className="gallery-comments">💬 {post.comments?.length || post.comments || 0}</span>
          <span className="gallery-date">{post.date}</span>
        </div>
      </div>
    </div>
  );
};

export default GalleryPost;