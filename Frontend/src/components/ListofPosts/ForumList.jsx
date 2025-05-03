// // import React from 'react';
// // import ForumPost from '../Posts/ForumPost';
// // import './ForumList.css';

// // const ForumList = ({ 
// //   isLoading, 
// //   errors, 
// //   forumPosts,
// //   isAuthenticated,
// //   fetchForumPost,
// //   addCommentToPost,
// //   replyToComment,
// //   likePost,
// //   likeComment
// // }) => {
// //   return (
// //     <div className="forum-posts">
// //       {isLoading ? (
// //         <div className="loading-indicator">Loading forum posts...</div>
// //       ) : errors ? (
// //         <div className="error-message">{errors}</div>
// //       ) : forumPosts.length === 0 ? (
// //         <div className="empty-state">No forum posts yet. Be the first to start a discussion!</div>
// //       ) : (
// //         forumPosts.map(post => (
// //           <ForumPost
// //             key={post.id}
// //             post={post}
// //             isAuthenticated={isAuthenticated}
// //             fetchForumPost={fetchForumPost}
// //             addCommentToPost={addCommentToPost}
// //             replyToComment={replyToComment}
// //             likePost={likePost}
// //             likeComment={likeComment}
// //           />
// //         ))
// //       )}
// //     </div>
// //   );
// // };

// // export default ForumList;





// import React, { useState } from 'react';
// import ForumPost from '../Posts/ForumPost';
// import './ForumList.css';

// const ForumList = ({ 
//   isLoading, 
//   errors, 
//   forumPosts,
//   isAuthenticated,
//   fetchForumPost,
//   addCommentToPost,
//   replyToComment,
//   likePost,
//   likeComment,
//   loadMorePosts
// }) => {
//   const [loadingMore, setLoadingMore] = useState(false);

//   // Handle loading more posts
//   const handleLoadMore = async () => {
//     if (loadingMore) return;
    
//     setLoadingMore(true);
//     try {
//       await loadMorePosts();
//     } catch (error) {
//       console.error('Error loading more posts:', error);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   if (isLoading && forumPosts.length === 0) {
//     return <div className="loading-indicator">Loading forum posts...</div>;
//   }

//   if (errors && forumPosts.length === 0) {
//     return <div className="error-message">{errors}</div>;
//   }

//   if (forumPosts.length === 0) {
//     return <div className="empty-state">No forum posts yet. Be the first to start a discussion!</div>;
//   }

//   return (
//     <div className="forum-posts">
//       {/* Render all posts */}
//       {forumPosts.map(post => (
//         <ForumPost
//           key={post.id}
//           post={post}
//           isAuthenticated={isAuthenticated}
//           fetchForumPost={fetchForumPost}
//           addCommentToPost={addCommentToPost}
//           replyToComment={replyToComment}
//           likePost={likePost}
//           likeComment={likeComment}
//         />
//       ))}
      
//       {/* Load more button */}
//       <div className="load-more-container">
//         <button 
//           className="load-more-button"
//           onClick={handleLoadMore}
//           disabled={loadingMore || isLoading}
//         >
//           {loadingMore ? 'Loading more posts...' : 'Load More Posts'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ForumList;


import React, { useState } from 'react';
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
  likeComment,
  loadMorePosts,
  currentUserId
}) => {
  const [loadingMore, setLoadingMore] = useState(false);

  // Handle loading more posts
  const handleLoadMore = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      await loadMorePosts();
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (isLoading && forumPosts.length === 0) {
    return <div className="loading-indicator">Loading forum posts...</div>;
  }

  if (errors && forumPosts.length === 0) {
    return <div className="error-message">{errors}</div>;
  }

  if (forumPosts.length === 0) {
    return <div className="empty-state">No forum posts yet. Be the first to start a discussion!</div>;
  }

  return (
    <div className="forum-posts">
      {/* Render all posts */}
      {forumPosts.map(post => (
        <ForumPost
          key={post.id || post._id}
          post={post}
          isAuthenticated={isAuthenticated}
          fetchForumPost={fetchForumPost}
          addCommentToPost={addCommentToPost}
          replyToComment={replyToComment}
          likePost={likePost}
          likeComment={likeComment}
          currentUserId={currentUserId}
        />
      ))}
      
      {/* Load more button */}
      <div className="load-more-container">
        <button 
          className="load-more-button"
          onClick={handleLoadMore}
          disabled={loadingMore || isLoading}
        >
          {loadingMore ? 'Loading more posts...' : 'Load More Posts'}
        </button>
      </div>
    </div>
  );
};

export default ForumList;