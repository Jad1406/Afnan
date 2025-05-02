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
  // .get(getAllForumPosts)
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
router.delete('/posts/:id/like', authenticateUser, unlikePost);
router.post('/posts/:id/comments', authenticateUser, addComment);
router.route('/comments/:id')
  .patch(authenticateUser, updateComment)
  .delete(authenticateUser, deleteComment);
router.post('/comments/:id/like', authenticateUser, likeComment);
router.post('/comments/:id/unlike', authenticateUser, unlikeComment);
router.post('/comments/:id/reply', authenticateUser, replyToComment);
















// Backend route handler (Express.js)
// GET /api/v1/community/forum
router.get('/forum', async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Base query to find all posts with pagination
    const posts = await Post.find({ postType:"ForumPost" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name avatar')
      .populate('comments')
      .lean();
    
    // Get total count for pagination metadata
    const totalPosts = await Post.countDocuments({ postType:"ForumPost" });
    
    // For each post, add the comment count and top-level comments
    const postsWithCommentData = await Promise.all(posts.map(async (post) => {
      // Count total comments for this post
      const commentCount = await Comment.countDocuments({ post: post._id });
      
      // Find only top-level comments for this post
      let topLevelComments = [];
      if (req.query.includeTopComments === 'true') {
        topLevelComments = await Comment.find({
          post: post._id,
          parentComment: { $exists: false }
        })
        .limit(3) // Limit to 3 top comments initially
        .sort({ createdAt: -1 })
        .populate('user', 'name avatar')
        .lean();
        
        // For each top comment, count how many replies it has
        topLevelComments = await Promise.all(topLevelComments.map(async (comment) => {
          const replyCount = await Comment.countDocuments({
            parentComment: comment._id
          });
          
          return {
            ...comment,
            replyCount
          };
        }));
      }
      
      return {
        ...post,
        commentCount,
        topLevelComments: req.query.includeTopComments === 'true' ? topLevelComments : []
      };
    }));
    
    // Return posts with pagination metadata
    res.json({
      posts: postsWithCommentData,
      pagination: {
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(totalPosts / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Helper function to build a comment tree
function buildCommentTree(comments) {
  const commentMap = {};
  const rootComments = [];
  
  // First pass: create a map of comments by ID
  comments.forEach(comment => {
    commentMap[comment._id] = {
      ...comment,
      replies: []
    };
  });
  
  // Second pass: build the tree structure
  comments.forEach(comment => {
    if (comment.parentComment) {
      // This is a reply, add it to its parent's replies
      if (commentMap[comment.parentComment]) {
        commentMap[comment.parentComment].replies.push(commentMap[comment._id]);
      }
    } else {
      // This is a root comment
      rootComments.push(commentMap[comment._id]);
    }
  });
  
  return rootComments;
}




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