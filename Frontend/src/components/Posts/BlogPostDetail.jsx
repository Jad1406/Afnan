import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BlogPostDetail.css';

// Constants
const API_BASE_URL = 'http://localhost:3000';

const BlogPostDetail = ({ isAuthenticated, currentUserId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Fetch blog post
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/v1/community/blog/${id}`);
        setPost(response.data.post);
        setComments(response.data.post.comments || []);
        
        // Set initial like state
        if (currentUserId && response.data.post.likes) {
          const likesAsStrings = response.data.post.likes.map(likeId => 
            typeof likeId === 'object' ? likeId.toString() : String(likeId)
          );
          setIsLiked(likesAsStrings.includes(String(currentUserId)));
          setLikeCount(response.data.post.likes.length);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again later.');
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id, currentUserId]);

  // Handle like button click
  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Optimistic UI update
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/v1/community/posts/${id}/like`,
        {},
        { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
    } catch (err) {
      console.error('Error liking post:', err);
      // Revert UI changes on error
      setIsLiked(!newLikedState);
      setLikeCount(prevCount => !newLikedState ? prevCount + 1 : prevCount - 1);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/community/posts/${id}/comments`,
        { content: commentText },
        { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      // Add new comment to state
      setComments(prevComments => [response.data.comment, ...prevComments]);
      setCommentText('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
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

  // Calculate reading time
  const getReadingTime = (content) => {
    if (!content) return '1 min read';
    
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    
    return `${readingTime} min read`;
  };

  if (loading) {
    return (
      <div className="blog-post-detail-overlay">
        <div className="blog-post-detail-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-detail-overlay">
        <div className="blog-post-detail-container">
          <div className="error-message">{error || 'Post not found'}</div>
          <button className="back-button" onClick={() => navigate('/community')}>
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-detail-overlay">
      <div className="blog-post-detail-container">
        <button className="back-button" onClick={() => navigate('/community')}>
          ← Back to Blogs
        </button>
        
        {post.coverImage && (
          <div className="blog-cover-image">
            <img src={post.coverImage} alt={post.title} />
          </div>
        )}
        
        <div className="blog-post-header">
          <h1 className="blog-post-title">{post.title}</h1>
          
          <div className="blog-post-meta">
            <div className="blog-post-author">
              {post.user?.avatar && (
                <img 
                  src={post.user.avatar} 
                  alt={post.user.name} 
                  className="author-avatar" 
                />
              )}
              <span>By {post.user?.name || 'Unknown Author'}</span>
            </div>
            
            <div className="blog-post-date-time">
              <span className="blog-post-date">{formatDate(post.createdAt)}</span>
              <span className="blog-post-read-time">{post.readTime ? `${post.readTime} min read` : getReadingTime(post.content)}</span>
            </div>
          </div>
          
          {post.category && (
            <div className="blog-post-category">
              <span className="category-label">{post.category}</span>
            </div>
          )}
          
          {post.tags && post.tags.length > 0 && (
            <div className="blog-post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
        
        <div className="blog-post-content">
          {/* Render content with proper paragraphs */}
          {post.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
        
        <div className="blog-post-actions">
          <button 
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            {isLiked ? '❤️ Liked' : '🤍 Like'} ({likeCount})
          </button>
          
          <div className="share-buttons">
            <button className="share-button" title="Share on Facebook">
              <span className="share-icon">📘</span>
            </button>
            <button className="share-button" title="Share on Twitter">
              <span className="share-icon">📱</span>
            </button>
            <button className="share-button" title="Copy Link">
              <span className="share-icon">🔗</span>
            </button>
          </div>
        </div>
        
        <div className="blog-post-comments-section">
          <h3 className="comments-title">Comments ({comments.length})</h3>
          
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
                Post Comment
              </button>
            </form>
          ) : (
            <div className="login-to-comment">
              <p>Please <button onClick={() => navigate('/login')}>login</button> to comment.</p>
            </div>
          )}
          
          {comments.length > 0 ? (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <div className="comment-header">
                    <div className="comment-author">
                      {comment.user?.avatar && (
                        <img 
                          src={comment.user.avatar} 
                          alt={comment.user.name} 
                          className="commenter-avatar" 
                        />
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
  );
};

export default BlogPostDetail;