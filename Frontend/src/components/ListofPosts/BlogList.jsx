

import React from 'react';
import BlogPost from '../Posts/BlogPost';
import './BlogList.css';

const BlogList = ({ 
  isLoading, 
  errors, 
  blogPosts, 
  likePost, 
  isAuthenticated,
  currentUserId 
}) => {
  return (
    <div className="blog-posts">
      {isLoading ? (
        <div className="loading-indicator">Loading blog posts...</div>
      ) : errors ? (
        <div className="error-message">{errors}</div>
      ) : blogPosts.length === 0 ? (
        <div className="empty-state">No blog posts yet. Be the first to write a blog!</div>
      ) : (
        blogPosts.map(post => (
          <BlogPost 
            key={post.id || post._id} 
            post={post} 
            likePost={likePost} 
            isAuthenticated={isAuthenticated}
            currentUserId={currentUserId}
          />
        ))
      )}
    </div>
  );
};

export default BlogList;