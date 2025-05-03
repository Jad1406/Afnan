import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GalleryPostDetail.css';

// Constants
const API_BASE_URL = 'http://localhost:3000';

const GalleryPostDetail = ({ isAuthenticated, currentUserId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  
  // Refs for swipe functionality
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  
  // Fetch gallery posts
  useEffect(() => {
    const fetchGalleryPosts = async () => {
      try {
        setLoading(true);
        
        // First, get the current post
        const currentPostResponse = await axios.get(`${API_BASE_URL}/api/v1/community/gallery/${id}`);
        
        // Then, get all gallery posts to enable navigation
        const allPostsResponse = await axios.get(`${API_BASE_URL}/api/v1/community/gallery`);
        
        // Find the index of the current post in all posts
        const allPosts = allPostsResponse.data.posts;
        const initialIndex = allPosts.findIndex(post => post._id === id);
        
        // If the post is found, set it as the current index
        if (initialIndex !== -1) {
          setCurrentIndex(initialIndex);
        }
        
        // Transform the data for our component
        const transformedPosts = allPosts.map(post => ({
          ...post,
          isLiked: currentUserId && Array.isArray(post.likes) && 
                   post.likes.some(likeId => 
                     String(typeof likeId === 'object' ? likeId.toString() : likeId) === String(currentUserId)
                   ),
          likeCount: post.likes?.length || 0,
          comments: post.comments || [],
          commentCount: post.comments?.length || 0
        }));
        
        setPosts(transformedPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching gallery posts:', err);
        setError('Failed to load gallery. Please try again later.');
        setLoading(false);
      }
    };

    fetchGalleryPosts();
  }, [id, currentUserId]);

  // Get current post
  const currentPost = posts[currentIndex] || null;

  // Handle navigation
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Update URL without refreshing the page
      const prevId = posts[currentIndex - 1]._id;
      window.history.pushState({}, '', `/community/gallery/${prevId}`);
    }
  };

  const goToNext = () => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // Update URL without refreshing the page
      const nextId = posts[currentIndex + 1]._id;
      window.history.pushState({}, '', `/community/gallery/${nextId}`);
    }
  };

  // Handle like button click
  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!currentPost) return;

    // Optimistic UI update
    const updatedPosts = [...posts];
    updatedPosts[currentIndex] = {
      ...updatedPosts[currentIndex],
      isLiked: !updatedPosts[currentIndex].isLiked,
      likeCount: updatedPosts[currentIndex].isLiked 
        ? updatedPosts[currentIndex].likeCount - 1 
        : updatedPosts[currentIndex].likeCount + 1
    };
    setPosts(updatedPosts);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/v1/community/posts/${currentPost._id}/like`,
        {},
        { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
    } catch (err) {
      console.error('Error liking post:', err);
      // Revert UI changes on error
      const revertedPosts = [...posts];
      revertedPosts[currentIndex] = {
        ...revertedPosts[currentIndex],
        isLiked: !revertedPosts[currentIndex].isLiked,
        likeCount: revertedPosts[currentIndex].isLiked 
          ? revertedPosts[currentIndex].likeCount - 1 
          : revertedPosts[currentIndex].likeCount + 1
      };
      setPosts(revertedPosts);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!commentText.trim() || !currentPost) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/community/posts/${currentPost._id}/comments`,
        { content: commentText },
        { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      // Add new comment to state
      const updatedPosts = [...posts];
      const newComment = response.data.comment;
      
      if (!updatedPosts[currentIndex].comments) {
        updatedPosts[currentIndex].comments = [];
      }
      
      updatedPosts[currentIndex].comments.unshift(newComment);
      updatedPosts[currentIndex].commentCount = (updatedPosts[currentIndex].commentCount || 0) + 1;
      
      setPosts(updatedPosts);
      setCommentText('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  // Touch event handlers for swipe navigation
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartY.current - touchEndY.current;
    const threshold = 100; // Minimum distance to be considered a swipe
    
    if (swipeDistance > threshold) {
      // Swiped up, go to next post
      goToNext();
    } else if (swipeDistance < -threshold) {
      // Swiped down, go to previous post
      goToPrevious();
    }
    
    // Reset values
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  if (loading) {
    return (
      <div className="gallery-detail-overlay">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="gallery-detail-overlay">
        <div className="error-message">{error || 'Post not found'}</div>
        <button className="back-button" onClick={() => navigate('/community')}>
          Back to Community
        </button>
      </div>
    );
  }

  return (
    <div 
      className="gallery-detail-overlay"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button className="back-button" onClick={() => navigate('/community')}>
        ← Back to Gallery
      </button>
      
      <div className="gallery-detail-container">
        <div className="gallery-media-side">
          {/* Navigation arrows */}
          {currentIndex > 0 && (
            <button className="nav-arrow prev-arrow" onClick={goToPrevious}>
              ▲
            </button>
          )}
          
          {/* Media display */}
          <div className="media-container">
            {currentPost.mediaType === 'video' ? (
              <video 
                src={currentPost.mediaUrl} 
                controls 
                autoPlay 
                loop 
                className="gallery-media"
              />
            ) : (
              <img 
                src={currentPost.mediaUrl} 
                alt={currentPost.title} 
                className="gallery-media"
              />
            )}
          </div>
          
          {currentIndex < posts.length - 1 && (
            <button className="nav-arrow next-arrow" onClick={goToNext}>
              ▼
            </button>
          )}
        </div>
        
        <div className={`gallery-info-side ${showComments ? 'show-comments' : ''}`}>
          <div className="gallery-post-header">
            <div className="user-info">
              {currentPost.user?.avatar ? (
                <img 
                  src={currentPost.user.avatar} 
                  alt={currentPost.user.name} 
                  className="user-avatar" 
                />
              ) : (
                <div className="user-avatar-placeholder">
                  {currentPost.user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="user-name-info">
                <span className="username">{currentPost.user?.name || currentPost.user || 'Anonymous'}</span>
                <span className="post-date">{formatDate(currentPost.createdAt)}</span>
              </div>
            </div>
            
            <div className="post-category">
              {currentPost.category && (
                <span className="category-badge">{currentPost.category}</span>
              )}
            </div>
          </div>
          
          <div className="post-content">
            <h3 className="post-title">{currentPost.title}</h3>
            <p className="post-description">{currentPost.content}</p>
            
            {currentPost.tags && currentPost.tags.length > 0 && (
              <div className="post-tags">
                {currentPost.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>
          
          <div className="interaction-buttons">
            <button 
              className={`like-button ${currentPost.isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {currentPost.isLiked ? '❤️' : '🤍'} {currentPost.likeCount}
            </button>
            
            <button 
              className={`comment-button ${showComments ? 'active' : ''}`}
              onClick={toggleComments}
            >
              💬 {currentPost.commentCount}
            </button>
            
            <button className="share-button">
              🔗 Share
            </button>
          </div>
          
          <div className={`comments-section ${showComments ? 'show' : ''}`}>
            <h3 className="comments-title">Comments ({currentPost.commentCount})</h3>
            
            {isAuthenticated ? (
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <textarea
                  className="comment-input"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  className="submit-comment-button"
                  disabled={!commentText.trim()}
                >
                  Post
                </button>
              </form>
            ) : (
              <div className="login-to-comment">
                <p>Please <button onClick={() => navigate('/login')}>login</button> to comment.</p>
              </div>
            )}
            
            {currentPost.comments && currentPost.comments.length > 0 ? (
              <div className="comments-list">
                {currentPost.comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <div className="comment-header">
                      <div className="comment-author">
                        {comment.user?.avatar ? (
                          <img 
                            src={comment.user.avatar} 
                            alt={comment.user.name} 
                            className="commenter-avatar" 
                          />
                        ) : (
                          <div className="commenter-avatar-placeholder">
                            {comment.user?.name?.charAt(0) || 'A'}
                          </div>
                        )}
                        <span>{comment.user?.name || 'Anonymous'}</span>
                      </div>
                      <span className="comment-date">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-comments">
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Post progress indicator */}
      <div className="post-progress-indicator">
        {posts.map((_, index) => (
          <div 
            key={index} 
            className={`progress-dot ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryPostDetail;