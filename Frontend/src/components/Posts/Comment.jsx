// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Comment.css';

// const API_BASE_URL = 'http://localhost:3000';

// const Comment = ({ 
//   comment, 
//   postId, 
//   isAuthenticated,
//   onReply,
//   onLike,
//   currentUserId // Add this prop to check if the current user has liked the comment
// }) => {
//   const navigate = useNavigate();
//   const [replyText, setReplyText] = useState('');
//   const [isReplying, setIsReplying] = useState(false);
//   const [showReplies, setShowReplies] = useState(false);
//   const [replies, setReplies] = useState([]);
//   const [isLoadingReplies, setIsLoadingReplies] = useState(false);
//   const [isLiked, setIsLiked] = useState(
//     // Check if current user has liked this comment
//     currentUserId && comment.likes && 
//     Array.isArray(comment.likes) && 
//     comment.likes.includes(currentUserId)
//   );
  
//   // Load replies when "View replies" is clicked
//   const handleViewReplies = async () => {
//     if (!showReplies && comment.replyCount > 0) {
//       setIsLoadingReplies(true);
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(
//           `${API_BASE_URL}/api/v1/community/comments/${comment._id}/replies`,
//           { 
//             headers: token ? { Authorization: `Bearer ${token}` } : {},
//             withCredentials: true
//           }
//         );
        
//         setReplies(response.data.replies);
//         setShowReplies(true);
//       } catch (error) {
//         console.error('Error loading replies:', error);
//       } finally {
//         setIsLoadingReplies(false);
//       }
//     } else {
//       setShowReplies(!showReplies);
//     }
//   };
  
//   // Handle submitting a reply
//   const handleSubmitReply = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!replyText.trim()) return;
    
//     onReply(comment._id, replyText);
//     setReplyText('');
//     setIsReplying(false);
//     setShowReplies(true); // Show replies after replying
//   };
  
//   // Handle like button click
//   const handleLike = (e) => {
//     e.stopPropagation();
    
//     // Toggle liked state in UI immediately for responsive feel
//     setIsLiked(!isLiked);
    
//     // Call the onLike callback
//     onLike(comment._id);
//   };
  
//   return (
// <div className={`reply ${comment.depth === 0 ? 'depth-0' : 
//                          (comment.depth || 0) % 2 === 1 ? 'depth-odd' : 'depth-even'}`} 
//      style={{ marginLeft: `${(comment.depth || 0) * 20}px` }}>      <div className="reply-header">
//         <span className="reply-author">{comment.user?.name}</span>
//         <span className="reply-date">
//             {comment.date || (comment.createdAt && typeof comment.createdAt === 'string' ? 
//                 new Date(comment.createdAt).toLocaleString() : 
//                 typeof comment.createdAt === 'object' && comment.createdAt instanceof Date ? 
//                 comment.createdAt.toLocaleString() : 
//                 'Unknown date')}
//             </span>      </div>
      
//       <p className="reply-content">{comment.content}</p>
      
//       <div className="reply-actions">
//         <button 
//           className="reply-action-button"
//           onClick={(e) => {
//             e.stopPropagation();
//             if (isAuthenticated) {
//               setIsReplying(!isReplying);
//             } else {
//               navigate('/login');
//             }
//           }}
//         >
//           Reply
//         </button>
//         <button 
//           className={`like-action-button ${isLiked ? 'liked' : ''}`}
//           onClick={handleLike}
//         >
//           {isLiked ? 'Liked' : 'Like'} ({comment.likes?.length || 0})
//         </button>
//       </div>
      
//       {/* Reply form */}
//       {isReplying && (
//         <div className="nested-reply-form">
//           <textarea 
//             placeholder={`Reply to ${comment.user?.name}...`}
//             value={replyText}
//             onChange={(e) => setReplyText(e.target.value)}
//             onClick={(e) => e.stopPropagation()}
//           />
//           <div className="reply-form-buttons">
//             <button 
//               className="cancel-button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setIsReplying(false);
//                 setReplyText('');
//               }}
//             >
//               Cancel
//             </button>
//             <button 
//               className="submit-button"
//               onClick={handleSubmitReply}
//               disabled={!replyText.trim()}
//             >
//               Submit Reply
//             </button>
//           </div>
//         </div>
//       )}
      
//       {/* Show "View replies" button if the comment has replies */}
//       {comment.replyCount > 0 && (
//         <button 
//           className="view-replies-button"
//           onClick={(e) => {
//             e.stopPropagation();
//             handleViewReplies();
//           }}
//         >
//           {showReplies 
//             ? `Hide ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`
//             : `View ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`
//           }
//         </button>
//       )}
      
//       {/* Loading indicator */}
//       {isLoadingReplies && (
//         <div className="loading-replies">Loading replies...</div>
//       )}
      
//       {/* Render loaded replies */}
//       {showReplies && replies.length > 0 && (
//         <div className="nested-replies">
//           {replies.map(reply => (
//             <Comment
//   key={reply._id}
//   comment={{
//     ...reply,
//     depth: (comment.depth || 0) + 1,
//     // Ensure date is properly passed down to nested comments
//     date: reply.date || (reply.createdAt ? 
//       typeof reply.createdAt === 'string' ? 
//         new Date(reply.createdAt).toLocaleString() : 
//         reply.createdAt instanceof Date ? 
//           reply.createdAt.toLocaleString() : 
//           'Unknown date' 
//       : 'Recently')
//   }}
//   postId={postId}
//   isAuthenticated={isAuthenticated}
//   onReply={onReply}
//   onLike={onLike}
//   currentUserId={currentUserId}
// />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Comment;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Comment.css';

const API_BASE_URL = 'http://localhost:3000';

const Comment = ({ 
  comment, 
  postId, 
  isAuthenticated,
  onReply,
  onLike,
  currentUserId
}) => {
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  
  // Track comment likes state locally
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  // Update local like state when comment prop changes
// In Comment.jsx, update the useEffect that manages like state:

useEffect(() => {
  if (!comment || !currentUserId) {
    setIsLiked(false);
    setLikeCount(0);
    return;
  }
  
  // Check if comment.likes exists and is an array
  if (Array.isArray(comment.likes)) {
    // Convert all IDs to strings for consistent comparison
    const likesAsStrings = comment.likes.map(id => 
      typeof id === 'object' ? id.toString() : String(id)
    );
    const userIdString = String(currentUserId);
    
    // Check if current user ID is in the likes array
    setIsLiked(likesAsStrings.includes(userIdString));
    setLikeCount(comment.likesCount || comment.likes.length);
  } else {
    // Default values if likes is not an array
    setIsLiked(false);
    setLikeCount(comment.likesCount || 0);
  }
}, [comment, currentUserId]);

// Also need to update the handleLike function 

const handleLike = (e) => {
  e.stopPropagation();
  
  if (!isAuthenticated) {
    navigate('/login');
    return;
  }
  
  // Toggle liked state immediately for responsive UI
  const newLikedState = !isLiked;
  setIsLiked(newLikedState);
  
  // Update like count optimistically
  setLikeCount(prevCount => newLikedState ? prevCount + 1 : Math.max(0, prevCount - 1));
  
  // Call the onLike callback
  onLike(comment._id).catch(() => {
    // Revert UI changes if API call fails
    setIsLiked(!newLikedState);
    setLikeCount(prevCount => !newLikedState ? prevCount + 1 : Math.max(0, prevCount - 1));
  });
};
  
  // Load replies when "View replies" is clicked
  const handleViewReplies = async () => {
    if (!showReplies && comment.replyCount > 0) {
      setIsLoadingReplies(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/community/comments/${comment._id}/replies`,
          { 
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: true
          }
        );
        
        setReplies(response.data.replies);
        setShowReplies(true);
      } catch (error) {
        console.error('Error loading replies:', error);
      } finally {
        setIsLoadingReplies(false);
      }
    } else {
      setShowReplies(!showReplies);
    }
  };
  
  // Handle submitting a reply
  const handleSubmitReply = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!replyText.trim()) return;
    
    onReply(comment._id, replyText);
    setReplyText('');
    setIsReplying(false);
    setShowReplies(true); // Show replies after replying
  };
  
  
  
  return (
    <div className={`reply ${comment.depth === 0 ? 'depth-0' : 
                         (comment.depth || 0) % 2 === 1 ? 'depth-odd' : 'depth-even'}`} 
         style={{ marginLeft: `${(comment.depth || 0) * 20}px` }}>
      <div className="reply-header">
        <span className="reply-author">{comment.user?.name}</span>
        <span className="reply-date">
            {comment.date || (comment.createdAt && typeof comment.createdAt === 'string' ? 
                new Date(comment.createdAt).toLocaleString() : 
                typeof comment.createdAt === 'object' && comment.createdAt instanceof Date ? 
                comment.createdAt.toLocaleString() : 
                'Unknown date')}
        </span>
      </div>
      
      <p className="reply-content">{comment.content}</p>
      
      <div className="reply-actions">
        <button 
          className="reply-action-button"
          onClick={(e) => {
            e.stopPropagation();
            if (isAuthenticated) {
              setIsReplying(!isReplying);
            } else {
              navigate('/login');
            }
          }}
        >
          Reply
        </button>
        <button 
          className={`like-action-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {isLiked ? 'Liked' : 'Like'} ({likeCount})
        </button>
      </div>
      
      {/* Reply form */}
      {isReplying && (
        <div className="nested-reply-form">
          <textarea 
            placeholder={`Reply to ${comment.user?.name}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="reply-form-buttons">
            <button 
              className="cancel-button"
              onClick={(e) => {
                e.stopPropagation();
                setIsReplying(false);
                setReplyText('');
              }}
            >
              Cancel
            </button>
            <button 
              className="submit-button"
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
            >
              Submit Reply
            </button>
          </div>
        </div>
      )}
      
      {/* Show "View replies" button if the comment has replies */}
      {comment.replyCount > 0 && (
        <button 
          className="view-replies-button"
          onClick={(e) => {
            e.stopPropagation();
            handleViewReplies();
          }}
        >
          {showReplies 
            ? `Hide ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`
            : `View ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`
          }
        </button>
      )}
      
      {/* Loading indicator */}
      {isLoadingReplies && (
        <div className="loading-replies">Loading replies...</div>
      )}
      
      {/* Render loaded replies */}
      {showReplies && replies.length > 0 && (
        <div className="nested-replies">
          {replies.map(reply => (
            <Comment
              key={reply._id}
              comment={{
                ...reply,
                depth: (comment.depth || 0) + 1,
                // Ensure date is properly passed down to nested comments
                date: reply.date || (reply.createdAt ? 
                  typeof reply.createdAt === 'string' ? 
                    new Date(reply.createdAt).toLocaleString() : 
                    reply.createdAt instanceof Date ? 
                      reply.createdAt.toLocaleString() : 
                      'Unknown date' 
                  : 'Recently')
              }}
              postId={postId}
              isAuthenticated={isAuthenticated}
              onReply={onReply}
              onLike={onLike}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;