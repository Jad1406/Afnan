// routes/communityRoutes.js
const express = require('express');
const router = express.Router();
const  authenticateUser  = require('../middleware/authentication');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
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
  // .get(getForumPost)
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
router.post('/posts/:id/comments', authenticateUser, addComment);
router.route('/comments/:id')
  .patch(authenticateUser, updateComment)
  .delete(authenticateUser, deleteComment);
router.post('/comments/:id/like', authenticateUser, likeComment);
router.post('/comments/:id/reply', authenticateUser, replyToComment);
















// Backend route handler (Express.js)





// GET /api/v1/community/forum/:postId
router.get('/forum/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    
    // Find the post
    const post = await Post.findById(postId)
      .populate('user', 'name avatar')
      .lean();
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Find all comments for this post
    const allComments = await Comment.find({ post: postId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();
    
    // Count total comments
    const commentCount = allComments.length;
    
    // Find top-level comments (those without parentComment)
    const topLevelComments = allComments.filter(comment => !comment.parentComment);
    
    // For each top-level comment, add a replyCount property
    const commentsWithReplyCounts = await Promise.all(topLevelComments.map(async (comment) => {
      // Count replies to this comment
      const replyCount = await Comment.countDocuments({ 
        post: postId,
        parentComment: comment._id 
      });
      
      return {
        ...comment,
        replyCount
      };
    }));
    
    res.json({
      post: {
        ...post,
        topLevelComments: commentsWithReplyCounts,
        commentCount
      }
    });
  } catch (error) {
    console.error(`Error fetching forum post ${req.params.postId}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/v1/community/comments/:commentId/replies
router.get('/comments/:commentId/replies', async (req, res) => {
  try {
    const commentId = req.params.commentId;
    
    // Find the direct replies to this comment
    const replies = await Comment.find({ parentComment: commentId })
      .populate('user', 'name avatar')
      .sort({ createdAt: 1 }) // Oldest first for conversations
      .lean();
    
    // For each reply, check if it has further replies
    const repliesWithNestedCounts = await Promise.all(replies.map(async (reply) => {
      // Count replies to this reply
      const replyCount = await Comment.countDocuments({ parentComment: reply._id });
      
      return {
        ...reply,
        replyCount
      };
    }));
    
    
    res.json({ replies: repliesWithNestedCounts });
  } catch (error) {
    console.error(`Error fetching replies for comment ${req.params.commentId}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;