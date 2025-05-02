import React from 'react';
import './GalleryPost.css';

const GalleryPost = ({ post, likePost }) => {
  return (
    <div className="gallery-item" key={post.id}>
      <div className="gallery-image-placeholder">
        <div className="gallery-icon">🪴</div>
      </div>
      <div className="gallery-overlay">
        <h3 className="plant-name">{post.plant}</h3>
        <p className="user-name">by {post.user}</p>
      </div>
      <div className="gallery-details">
        <p className="caption">{post.caption}</p>
        <div className="gallery-stats">
          <span className="gallery-likes">❤️ {post.likes}</span>
          <span className="gallery-comments">💬 {post.comments}</span>
          <span className="gallery-date">{post.date}</span>
        </div>
      </div>
    </div>
  );
};

export default GalleryPost;