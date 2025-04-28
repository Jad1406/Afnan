import React from 'react';
import './BlogPost.css';

const BlogPost = ({ post, likePost }) => {
  return (
    <div className="blog-card" key={post.id}>
      <div className="blog-image-placeholder">
        <div className="blog-icon">🌿</div>
      </div>
      <div className="blog-content">
        <h3 className="blog-title">{post.title}</h3>
        <div className="blog-meta">
          <span className="blog-author">By {post.author}</span>
          <span className="blog-date">{post.date}</span>
        </div>
        <p className="blog-excerpt">{post.excerpt}</p>
        <div className="blog-actions">
          <button className="read-more">Read More</button>
          <div className="blog-stats">
            <span className="blog-likes">❤️ {post.likes}</span>
            <span className="blog-comments">💬 {post.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;