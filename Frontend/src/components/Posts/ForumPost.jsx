import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Comment from './Comment';
import './ForumPost.css';

const ForumPost = ({ 
  post, 
  isAuthenticated, 
  fetchForumPost, 
  addCommentToPost, 
  replyToComment, 
  likePost, 
  likeComment,
  currentUserId // Add this prop to check if the current user has liked posts/comments
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const commentInputRef = useRef(null);
  const [topLevelComments, setTopLevelComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(
    // Check if current user has liked this post
    currentUserId && post.likes && 
    Array.isArray(post.likes) && 
    post.likes.includes(currentUserId)
  );
  
  // Expand post and load comments if needed
  const handleExpandPost = async (e) => {
    e.stopPropagation();
    
    // If already expanded, just collapse
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Fetch the post with full comments
      const response = await fetchForumPost(post.id || post._id);
      
      // Extract top-level comments
      if (response && response.topLevelComments) {
        setTopLevelComments(response.topLevelComments);
      }
      
      setIsExpanded(true);
    } catch (error) {
      console.error('Error expanding post:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle adding a top-level comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!commentText.trim()) return;
    
    try {
      await addCommentToPost(post.id || post._id, commentText);
      setCommentText('');
      
      // Refresh comments after adding
      const response = await fetchForumPost(post.id || post._id);
      if (response && response.topLevelComments) {
        setTopLevelComments(response.topLevelComments);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  // Handle reply to a comment
  const handleReplyToComment = async (commentId, content) => {
    try {
      await replyToComment(post.id || post._id, commentId, content);
      
      // Refresh the post to get updated comments
      setTimeout(async () => {
        const response = await fetchForumPost(post.id || post._id);
        if (response && response.topLevelComments) {
          setTopLevelComments(response.topLevelComments);
        }
      }, 500);
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };
  
  // Handle like post button click
  const handleLikePost = (e) => {
    e.stopPropagation();
    
    // Toggle liked state in UI immediately for responsive feel
    setIsLiked(!isLiked);
    
    // Call the likePost function
    likePost(post.id || post._id);
  };
  
  // Focus comment input when Reply button is clicked
  const focusCommentInput = (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsExpanded(true);
    
    // Use setTimeout to ensure the input is in the DOM
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 100);
  };
  
  return (
    <div className={`forum-post ${isExpanded ? 'expanded' : ''}`}>
      <div className="post-header" onClick={handleExpandPost}>
        <h3 className="post-title">{post.title}</h3>
        <div className="post-meta">
          <span className="post-author">By {post.user?.name || post.author}</span>
          
          <span className="post-date">
            {post.date || (post.createdAt && typeof post.createdAt === 'string' ? 
              new Date(post.createdAt).toLocaleString() : 
              typeof post.createdAt === 'object' && post.createdAt instanceof Date ? 
              post.createdAt.toLocaleString() : 
              'Unknown date')}
          </span>


          <span className={`post-likes ${isLiked ? 'liked' : ''}`}>
            ❤️ {post.likes?.length || post.likes || 0}
          </span>
          {post.isSolved && <span className="post-solved">✓ Solved</span>}
        </div>
      </div>
      
      <div className="post-content" onClick={handleExpandPost}>
        <p>{post.content}</p>
      </div>
      
      {post.tags && post.tags.length > 0 && (
        <div className="post-tags" onClick={handleExpandPost}>
          {post.tags.map((tag, index) => (
            <span className="tag" key={index}>{tag}</span>
          ))}
        </div>
      )}
      
      {/* Always show post actions */}
      <div className="post-actions">
        <button 
          className="action-button"
          onClick={focusCommentInput}
        >
          Reply
        </button>
        <button 
          className={`action-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLikePost}
        >
          {isLiked ? 'Liked' : 'Like'}
        </button>
        <button 
          className="action-button"
          onClick={handleExpandPost}
        >
          {isExpanded ? 'Collapse' : `Comments (${post.commentCount || 0})`}
        </button>
      </div>
      
      {/* Show comments section when expanded */}
      {isExpanded && (
        <div className="post-replies" onClick={e => e.stopPropagation()}>
          <h4>{post.commentCount || 0} {post.commentCount === 1 ? 'Reply' : 'Replies'}</h4>
          
          {/* Add comment form */}
          <div className="add-reply">
            <textarea 
              ref={commentInputRef}
              placeholder="Add a reply..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              className="reply-button"
              onClick={handleAddComment}
              disabled={!isAuthenticated || !commentText.trim()}
            >
              Post Reply
            </button>
          </div>
          
          {/* Display comments */}
          {isLoading ? (
            <div className="loading-comments">Loading comments...</div>
          ) : topLevelComments.length > 0 ? (
            <div className="comments-list">
              {topLevelComments.map(comment => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  postId={post.id || post._id}
                  isAuthenticated={isAuthenticated}
                  onReply={handleReplyToComment}
                  onLike={(commentId) => likeComment(commentId)}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          ) : (
            <p className="no-replies">No replies yet. Be the first to comment!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ForumPost;