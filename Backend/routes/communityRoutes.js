// routes/communityRoutes.js
const express = require('express');
const router = express.Router();
const  authenticateUser  = require('../middleware/authentication');

// Import controllers
const {
  // Forum controllers
  getAllForumPosts,
  getForumPost,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  markAsSolution,
  
  // Blog controllers
  getAllBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  
  // Gallery controllers
  getAllGalleryPosts,
  getGalleryPost,
  createGalleryPost,
  updateGalleryPost,
  deleteGalleryPost,
  
  // Common controllers for interactions
  likePost,
  unlikePost,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
  replyToComment,
} = require('../controllers/communityController.js');

// Forum routes
router.route('/forum')
  .get(getAllForumPosts)
  .post(authenticateUser, createForumPost);

router.route('/forum/:id')
  .get(getForumPost)
  .patch(authenticateUser, updateForumPost)
  .delete(authenticateUser, deleteForumPost);

router.patch('/forum/:id/solution/:commentId', authenticateUser, markAsSolution);

// Blog routes
router.route('/blog')
  .get(getAllBlogPosts)
  .post(authenticateUser, createBlogPost);

router.route('/blog/:id')
  .get(getBlogPost)
  .patch(authenticateUser, updateBlogPost)
  .delete(authenticateUser, deleteBlogPost);

// Gallery routes
router.route('/gallery')
  .get(getAllGalleryPosts)
  .post(authenticateUser, createGalleryPost);

router.route('/gallery/:id')
  .get(getGalleryPost)
  .patch(authenticateUser, updateGalleryPost)
  .delete(authenticateUser, deleteGalleryPost);




// Interaction routes (common for all post types)
router.post('/posts/:id/like', authenticateUser, likePost);
router.delete('/posts/:id/like', authenticateUser, unlikePost);
router.post('/posts/:id/comments', authenticateUser, addComment);
router.route('/comments/:id')
  .patch(authenticateUser, updateComment)
  .delete(authenticateUser, deleteComment);
router.post('/comments/:id/like', authenticateUser, likeComment);
router.delete('/comments/:id/like', authenticateUser, unlikeComment);
router.post('/comments/:id/reply', authenticateUser, replyToComment);

module.exports = router;