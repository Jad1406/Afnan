import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForumPost.css';

const ForumPost = ({ 
  post, 
  isAuthenticated, 
  fetchForumPost, 
  addCommentToPost, 
  replyToComment, 
  likePost, 
  likeComment 
}) => {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  return (
    <div className="forum-post" key={post.id} onClick={() => fetchForumPost(post.id)}>
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>
        <div className="post-meta">
          <span className="post-author">By {post.author}</span>
          <span className="post-date">{post.date}</span>
          <span className="post-likes">❤️ {post.likes}</span>
          {post.isSolved && <span className="post-solved">✓ Solved</span>}
        </div>
      </div>
      
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      
      <div className="post-tags">
        {post.tags.map((tag, index) => (
          <span className="tag" key={index}>{tag}</span>
        ))}
      </div>
      
      <div className="post-replies">
        <h4>{post.replies.length} Replies</h4>
        {post.replies.length > 0 ? (
          post.replies.map(reply => (
            <div 
              className="reply" 
              key={reply.id}
              style={{ marginLeft: `${reply.depth * 20}px` }} // Indent based on nesting level
            >
              <div className="reply-header">
                <span className="reply-author">{reply.author}</span>
                <span className="reply-date">{reply.date}</span>
              </div>
              <p className="reply-content">{reply.content}</p>
              
              {/* Reply to comment button */}
              <div className="reply-actions">
                <button 
                  className="reply-action-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAuthenticated) {
                      setReplyingTo(reply.id);
                    } else {
                      navigate('/login');
                    }
                  }}
                >
                  Reply
                </button>
                <button 
                  className="like-action-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    likeComment(reply.id);
                  }}
                >
                  Like
                </button>
              </div>
              
              {/* Reply to specific comment form */}
              {replyingTo === reply.id && (
                <div className="nested-reply-form">
                  <textarea 
                    placeholder={`Reply to ${reply.author}...`} 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="reply-form-buttons">
                    <button 
                      className="cancel-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReplyingTo(null);
                        setCommentText('');
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="submit-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (commentText.trim()) {
                          replyToComment(post.id, reply.id, commentText);
                          setCommentText('');
                          setReplyingTo(null);
                        }
                      }}
                    >
                      Submit Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-replies">No replies yet. Be the first to comment!</p>
        )}
        
        {/* Main comment form */}
        {/* {isAuthenticated ?  */}
        {(
          <div className="add-reply">
            <textarea 
              placeholder="Add a reply..." 
              value={replyingTo ? '' : commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              className="reply-button"
              onClick={(e) => {
                e.stopPropagation();
                if (commentText.trim()) {
                  addCommentToPost(post.id, commentText);
                  setCommentText('');
                }
              }}
            >
              Post Reply
            </button>
          </div>)
        //  : (
        //   <div className="auth-prompt">
        //     <p className="auth-prompt-text">Please log in to join the conversation</p>
        //     <button 
        //       className="login-button"
        //       onClick={(e) => {
        //         e.stopPropagation();
        //         navigate('/login');
        //       }}
        //     >
        //       Log In
        //     </button>
        //   </div>
        // )}
            }
      </div>
      
      <div className="post-actions">
        <button 
          className="action-button"
          onClick={(e) => {
            e.stopPropagation();
            if (isAuthenticated) {
              setCommentText('');
              const replyBox = e.target.closest('.forum-post').querySelector('textarea');
              if (replyBox) replyBox.focus();
            } else {
              navigate('/login');
            }
          }}
        >
          Reply
        </button>
        <button 
          className="action-button"
          onClick={(e) => {
            e.stopPropagation();
            likePost(post.id);
          }}
        >
          Like
        </button>
        <button className="action-button">Share</button>
      </div>
    </div>
  );
};

export default ForumPost;

