// import React from 'react';
// import './BlogPost.css';

// const BlogPost = ({ post, likePost }) => {
//   return (
//     <div className="blog-card" key={post.id}>
//       <div className="blog-image-placeholder">
//         <div className="blog-icon">🌿</div>
//       </div>
//       <div className="blog-content">
//         <h3 className="blog-title">{post.title}</h3>
//         <div className="blog-meta">
//           <span className="blog-author">By {post.author}</span>
//           <span className="blog-date">{post.date}</span>
//         </div>
//         <p className="blog-excerpt">{post.excerpt}</p>
//         <div className="blog-actions">
//           <button className="read-more">Read More</button>
//           <div className="blog-stats">
//             <span className="blog-likes">❤️ {post.likes}</span>
//             <span className="blog-comments">💬 {post.comments}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogPost;

// BlogPost.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogPost.css';

const BlogPost = ({ post, likePost, isAuthenticated, currentUserId }) => {
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


  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const handleReadMore = (e) => {
    e.preventDefault();
    navigate(`/community/blog/${post.id || post._id}`);
  };

  return (
    <div className="blog-card" key={post.id || post._id}>
      <div className="blog-image-container">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className="blog-image" />
        ) : (
          <div className="blog-image-placeholder">
            <div className="blog-icon">🌿</div>
          </div>
        )}
      </div>
      <div className="blog-content">
        <h3 className="blog-title">{post.title}</h3>
        <div className="blog-meta">
          <span className="blog-author">By {post.author || post.user?.name}</span>
          <span className="blog-date">{post.date}</span>
        </div>
        <p className="blog-excerpt">
          {post.excerpt || (post.content && post.content.length > 150 
            ? `${post.content.substring(0, 150)}...` 
            : post.content)}
        </p>
        <div className="blog-actions">
          <button className="read-more" onClick={handleReadMore}>Read More</button>
          <div className="blog-stats">
            <button 
              className={`blog-like-button ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              ❤️ {likeCount}
            </button>
            <span className="blog-comments">💬 {post.comments?.length || post.comments || 0}</span>
            {post.readTime && <span className="blog-read-time">⏱️ {post.readTime} min read</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;