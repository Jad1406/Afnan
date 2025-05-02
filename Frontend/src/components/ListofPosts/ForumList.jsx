import React from 'react';
import ForumPost from '../Posts/ForumPost';
import './ForumList.css';

const ForumList = ({ 
  isLoading, 
  errors, 
  forumPosts,
  isAuthenticated,
  fetchForumPost,
  addCommentToPost,
  replyToComment,
  likePost,
  likeComment
}) => {
  return (
    <div className="forum-posts">
      {isLoading ? (
        <div className="loading-indicator">Loading forum posts...</div>
      ) : errors ? (
        <div className="error-message">{errors}</div>
      ) : forumPosts.length === 0 ? (
        <div className="empty-state">No forum posts yet. Be the first to start a discussion!</div>
      ) : (
        forumPosts.map(post => (
          <ForumPost
            key={post.id}
            post={post}
            isAuthenticated={isAuthenticated}
            fetchForumPost={fetchForumPost}
            addCommentToPost={addCommentToPost}
            replyToComment={replyToComment}
            likePost={likePost}
            likeComment={likeComment}
          />
        ))
      )}
    </div>
  );
};

export default ForumList;