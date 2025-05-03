// import React from 'react';
// import GalleryPost from '../Posts/GalleryPost';
// import './GalleryList.css';

// const GalleryList = ({ isLoading, errors, galleryPosts, likePost }) => {
//   return (
//     <div className="gallery-grid">
//       {isLoading ? (
//         <div className="loading-indicator">Loading gallery posts...</div>
//       ) : errors ? (
//         <div className="error-message">{errors}</div>
//       ) : galleryPosts.length === 0 ? (
//         <div className="empty-state">No gallery posts yet. Be the first to share a photo!</div>
//       ) : (
//         galleryPosts.map(post => (
//           <GalleryPost key={post.id} post={post} likePost={likePost} />
//         ))
//       )}
//     </div>
//   );
// };

// export default GalleryList;


import React from 'react';
import GalleryPost from '../Posts/GalleryPost';
import './GalleryList.css';

const GalleryList = ({ 
  isLoading, 
  errors, 
  galleryPosts, 
  likePost,
  isAuthenticated,
  currentUserId 
}) => {
  return (
    <div className="gallery-grid">
      {isLoading ? (
        <div className="loading-indicator">Loading gallery posts...</div>
      ) : errors ? (
        <div className="error-message">{errors}</div>
      ) : galleryPosts.length === 0 ? (
        <div className="empty-state">No gallery posts yet. Be the first to share a photo!</div>
      ) : (
        galleryPosts.map(post => (
          <GalleryPost 
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

export default GalleryList;