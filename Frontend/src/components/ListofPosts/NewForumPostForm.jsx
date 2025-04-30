import React from 'react';
import './NewForumPostForm.css';

const NewForumPostForm = ({ 
  isVisible, 
  newPostTitle, 
  setNewPostTitle, 
  newPostContent, 
  setNewPostContent, 
  handleForumSubmit 
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="new-post-form">
      <h3>Create a New Post</h3>
      <form onSubmit={handleForumSubmit}>
        <div className="form-group">
          <label htmlFor="postTitle">Title</label>
          <input 
            type="text" 
            id="postTitle"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            placeholder="What's your question or topic?"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="postContent">Content</label>
          <textarea 
            id="postContent"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Share your question or thoughts in detail..."
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit" className="primary-button">Post</button>
      </form>
    </div>
  );
};

export default NewForumPostForm;