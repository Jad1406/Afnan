// controllers/communityController.js
const { ForumPost, BlogPost, GalleryPost, Comment, Notification, Post } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError, UnauthenticatedError, ForbiddenError } = require('../errors');

// Helper function to check if user is authorized to modify content
const checkOwnership = async (userId, contentId, model) => {
  const content = await model.findById(contentId);
  if (!content) {
    throw new NotFoundError(`No content found with id ${contentId}`);
  }
  
  if (content.user.toString() !== userId) {
    throw new ForbiddenError('Not authorized to modify this content');
  }
  
  return content;
};

// ==== FORUM CONTROLLERS ====

// Get all forum posts with pagination and filtering
const getAllForumPosts = async (req, res) => {
  const { category, tag, solved, sort = 'latest', page = 1, limit = 10 } = req.query;
  
  // Build the query
  const queryObject = { postType: 'ForumPost' };
  
  if (category) {
    queryObject.category = category;
  }
  
  if (tag) {
    queryObject.tags = tag;
  }
  
  if (solved === 'true') {
    queryObject.isSolved = true;
  } else if (solved === 'false') {
    queryObject.isSolved = false;
  }
  
  // Sort options
  let sortOption = {};
  if (sort === 'latest') {
    sortOption = { createdAt: -1 };
  } else if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  } else if (sort === 'mostLiked') {
    sortOption = { 'likes.length': -1, createdAt: -1 };
  } else if (sort === 'mostCommented') {
    sortOption = { 'comments.length': -1, createdAt: -1 };
  }
  
  // Execute the query with pagination
  const skip = (Number(page) - 1) * Number(limit);
  
  const posts = await ForumPost.find(queryObject)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    .populate('user', 'name avatar')
    .populate({
      path: 'comments',
      options: { limit: 2, sort: { createdAt: -1 } },
      populate: { path: 'user', select: 'name avatar' }
    });
  
  // Get total count for pagination
  const totalPosts = await ForumPost.countDocuments(queryObject);
  
  res.status(StatusCodes.OK).json({
    posts,
    totalPosts,
    numOfPages: Math.ceil(totalPosts / Number(limit))
    ,postsPerPage: Number(limit)
  });
};
 //////
// Get a single forum post with full details including comments
const getForumPost = async (req, res) => {
    const { id } = req.params;
    
    try {
      const post = await ForumPost.findById(id)
        .populate('user', 'name avatar bio')
        .populate({
          path: 'comments',
          options: { sort: { createdAt: 'asc' } },
          populate: { path: 'user', select: 'name avatar' }
        })
        .populate('solutionComment');
      
      if (!post) {
        throw new NotFoundError(`No forum post found with id ${id}`);
      }
      
      // Get all comments including replies
      const allComments = await Comment.find({ post: id })
        .sort({ createdAt: 'asc' })
        .populate('user', 'name avatar')
        .lean();
      
      // Create a map for faster lookup
      const commentMap = new Map();
      allComments.forEach(comment => {
        // Initialize replies array for each comment
        comment.replies = [];
        commentMap.set(comment._id.toString(), comment);
      });
      
      // Organize into a hierarchical structure
      const commentTree = [];
      
      allComments.forEach(comment => {
        if (comment.parentComment) {
          // This is a reply - add to parent's replies array
          const parentId = comment.parentComment.toString();
          const parent = commentMap.get(parentId);
          if (parent) {
            parent.replies.push(comment);
          }
        } else {
          // This is a top-level comment
          commentTree.push(comment);
        }
      });
      
      // Add the organized comments to the response
      const result = post.toObject();
      result.commentTree = commentTree;
      
      res.status(StatusCodes.OK).json({ post: result });
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  };

// Create a new forum post
const createForumPost = async (req, res) => {
  req.body.user = req.user.userId;
  
  const post = await ForumPost.create(req.body);
  
  res.status(StatusCodes.CREATED).json({ post });
};

// Update a forum post
const updateForumPost = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags } = req.body;
  
  // Check ownership
  const post = await checkOwnership(req.user.userId, id, ForumPost);
  
  // Update fields
  post.title = title || post.title;
  post.content = content || post.content;
  post.category = category || post.category;
  post.tags = tags || post.tags;
  post.updatedAt = Date.now();
  
  await post.save();
  
  res.status(StatusCodes.OK).json({ post });
};

// Delete a forum post
const deleteForumPost = async (req, res) => {
  const { id } = req.params;
  
  // Check ownership (or admin)
  const post = await checkOwnership(req.user.userId, id, ForumPost);
  
  // Delete all comments associated with the post
  await Comment.deleteMany({ post: id });
  
  // Delete notifications related to this post
  await Notification.deleteMany({ 'references.post': id });
  
  // Delete the post
  await post.remove();
  
  res.status(StatusCodes.OK).json({ msg: 'Forum post deleted successfully' });
};

// Mark a comment as the solution to a forum post
const markAsSolution = async (req, res) => {
  const { id, commentId } = req.params;
  
  // Check if post exists and user is the owner
  const post = await checkOwnership(req.user.userId, id, ForumPost);
  
  // Check if comment exists and belongs to this post
  const comment = await Comment.findOne({ _id: commentId, post: id });
  if (!comment) {
    throw new NotFoundError(`No comment found with id ${commentId} for this post`);
  }
  
  // Update the post
  post.isSolved = true;
  post.solutionComment = commentId;
  await post.save();
  
  // Notify the comment author that their comment was marked as solution
  if (comment.user.toString() !== req.user.userId) {
    await Notification.create({
      recipient: comment.user,
      sender: req.user.userId,
      category: 'community',
      action: 'solution_marked',
      message: 'Your comment was marked as the solution!',
      references: {
        post: id,
        comment: commentId
      },
      redirectUrl: `/community/forum/${id}`
    });
  }
  
  res.status(StatusCodes.OK).json({ 
    msg: 'Solution marked successfully',
    post
  });
};

// ==== BLOG CONTROLLERS ====

// Get all blog posts with pagination and filtering
const getAllBlogPosts = async (req, res) => {
  const { category, tag, sort = 'latest', page = 1, limit = 10 } = req.query;
  
  // Build the query
  const queryObject = { 
    postType: 'BlogPost',
    isPublished: true // Only show published blog posts
  };
  
  if (category) {
    queryObject.category = category;
  }
  
  if (tag) {
    queryObject.tags = tag;
  }
  
  // Sort options
  let sortOption = {};
  if (sort === 'latest') {
    sortOption = { createdAt: -1 };
  } else if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  } else if (sort === 'mostLiked') {
    sortOption = { 'likes.length': -1, createdAt: -1 };
  } else if (sort === 'mostCommented') {
    sortOption = { 'comments.length': -1, createdAt: -1 };
  }
  
  // Execute the query with pagination
  const skip = (Number(page) - 1) * Number(limit);
  
  const posts = await BlogPost.find(queryObject)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    .populate('user', 'name avatar')
    .select('title subtitle coverImage category tags readTime likes comments createdAt');
  
  // Get total count for pagination
  const totalPosts = await BlogPost.countDocuments(queryObject);
  
  res.status(StatusCodes.OK).json({
    posts,
    totalPosts,
    numOfPages: Math.ceil(totalPosts / Number(limit))
  });
};

// Get a single blog post with full details and comment tree
const getBlogPost = async (req, res) => {
    const { id } = req.params;
    
    try {
      const post = await BlogPost.findById(id)
        .populate('user', 'name avatar bio')
        .populate({
          path: 'comments',
          options: { sort: { createdAt: 'asc' } },
          populate: { path: 'user', select: 'name avatar' }
        });
      
      if (!post) {
        throw new NotFoundError(`No blog post found with id ${id}`);
      }
      
      // If post is not published, only author can view it
      if (!post.isPublished && (!req.user || post.user._id.toString() !== req.user.userId)) {
        throw new ForbiddenError('Not authorized to view this unpublished blog post');
      }
      
      // Get all comments including replies
      const allComments = await Comment.find({ post: id })
        .sort({ createdAt: 'asc' })
        .populate('user', 'name avatar')
        .lean();
      
      // Create a map for faster lookup
      const commentMap = new Map();
      allComments.forEach(comment => {
        // Initialize replies array for each comment
        comment.replies = [];
        commentMap.set(comment._id.toString(), comment);
      });
      
      // Organize into a hierarchical structure
      const commentTree = [];
      
      allComments.forEach(comment => {
        if (comment.parentComment) {
          // This is a reply - add to parent's replies array
          const parentId = comment.parentComment.toString();
          const parent = commentMap.get(parentId);
          if (parent) {
            parent.replies.push(comment);
          }
        } else {
          // This is a top-level comment
          commentTree.push(comment);
        }
      });
      
      // Add the organized comments to the response
      const result = post.toObject();
      result.commentTree = commentTree;
      
      res.status(StatusCodes.OK).json({ post: result });
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  };
  

// Create a new blog post
const createBlogPost = async (req, res) => {
  req.body.user = req.user.userId;
  
  // If coverImage was uploaded through a middleware, add it to the request body
  if (req.fileUrl) {
    req.body.coverImage = req.fileUrl;
  }
  
  // Calculate estimated read time based on content length (average reading speed: 200 words per minute)
  if (req.body.content) {
    const wordCount = req.body.content.split(/\s+/).length;
    req.body.readTime = Math.ceil(wordCount / 200);
  }
  
  const post = await BlogPost.create(req.body);
  
  res.status(StatusCodes.CREATED).json({ post });
};

// Update a blog post
const updateBlogPost = async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, content, category, tags, isPublished } = req.body;
  
  // Check ownership
  const post = await checkOwnership(req.user.userId, id, BlogPost);
  
  // Update fields
  if (title) post.title = title;
  if (subtitle) post.subtitle = subtitle;
  if (content) {
    post.content = content;
    // Recalculate read time
    const wordCount = content.split(/\s+/).length;
    post.readTime = Math.ceil(wordCount / 200);
  }
  if (category) post.category = category;
  if (tags) post.tags = tags;
  if (isPublished !== undefined) post.isPublished = isPublished;
  
  // If new cover image was uploaded
  if (req.fileUrl) {
    post.coverImage = req.fileUrl;
  }
  
  post.updatedAt = Date.now();
  await post.save();
  
  res.status(StatusCodes.OK).json({ post });
};

// Delete a blog post
const deleteBlogPost = async (req, res) => {
  const { id } = req.params;
  
  // Check ownership (or admin)
  const post = await checkOwnership(req.user.userId, id, BlogPost);
  
  // Delete all comments associated with the post
  await Comment.deleteMany({ post: id });
  
  // Delete notifications related to this post
  await Notification.deleteMany({ 'references.post': id });
  
  // Delete the post
  await post.remove();
  
  res.status(StatusCodes.OK).json({ msg: 'Blog post deleted successfully' });
};

// ==== GALLERY CONTROLLERS ====

// Get all gallery posts with pagination and filtering
const getAllGalleryPosts = async (req, res) => {
  const { category, tag, mediaType, sort = 'latest', page = 1, limit = 20 } = req.query;
  
  // Build the query
  const queryObject = { postType: 'GalleryPost' };
  
  if (category) {
    queryObject.category = category;
  }
  
  if (tag) {
    queryObject.tags = tag;
  }
  
  if (mediaType && ['image', 'video'].includes(mediaType)) {
    queryObject.mediaType = mediaType;
  }
  
  // Sort options
  let sortOption = {};
  if (sort === 'latest') {
    sortOption = { createdAt: -1 };
  } else if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  } else if (sort === 'mostLiked') {
    sortOption = { 'likes.length': -1, createdAt: -1 };
  }
  
  // Execute the query with pagination
  const skip = (Number(page) - 1) * Number(limit);
  
  const posts = await GalleryPost.find(queryObject)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    .populate('user', 'name avatar')
    .select('title mediaType mediaUrl category likes comments createdAt');
  
  // Get total count for pagination
  const totalPosts = await GalleryPost.countDocuments(queryObject);
  
  res.status(StatusCodes.OK).json({
    posts,
    totalPosts,
    numOfPages: Math.ceil(totalPosts / Number(limit))
  });
};

/////////////////
// Get a single gallery post with full details
const getGalleryPost = async (req, res) => {
    const { id } = req.params;
    
    try {
      const post = await GalleryPost.findById(id)
        .populate('user', 'name avatar bio')
        .populate({
          path: 'comments',
          options: { sort: { createdAt: 'asc' } },
          populate: { path: 'user', select: 'name avatar' }
        });
      
      if (!post) {
        throw new NotFoundError(`No gallery post found with id ${id}`);
      }
      
      // Get all comments including replies
      const allComments = await Comment.find({ post: id })
        .sort({ createdAt: 'asc' })
        .populate('user', 'name avatar')
        .lean();
      
      // Create a map for faster lookup
      const commentMap = new Map();
      allComments.forEach(comment => {
        // Initialize replies array for each comment
        comment.replies = [];
        commentMap.set(comment._id.toString(), comment);
      });
      
      // Organize into a hierarchical structure
      const commentTree = [];
      
      allComments.forEach(comment => {
        if (comment.parentComment) {
          // This is a reply - add to parent's replies array
          const parentId = comment.parentComment.toString();
          const parent = commentMap.get(parentId);
          if (parent) {
            parent.replies.push(comment);
          }
        } else {
          // This is a top-level comment
          commentTree.push(comment);
        }
      });
      
      // Add the organized comments to the response
      const result = post.toObject();
      result.commentTree = commentTree;
      
      res.status(StatusCodes.OK).json({ post: result });
    } catch (error) {
      console.error('Error fetching gallery post:', error);
      throw error;
    }
  };

// Create a new gallery post
const createGalleryPost = async (req, res) => {
  req.body.user = req.user.userId;
  
  // If media was uploaded through a middleware, add it to the request body
  if (req.fileUrl) {
    req.body.mediaUrl = req.fileUrl;
  }
  
  const post = await GalleryPost.create(req.body);
  
  res.status(StatusCodes.CREATED).json({ post });
};

// Update a gallery post
const updateGalleryPost = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags } = req.body;
  
  // Check ownership
  const post = await checkOwnership(req.user.userId, id, GalleryPost);
  
  // Update fields
  if (title) post.title = title;
  if (content) post.content = content;
  if (category) post.category = category;
  if (tags) post.tags = tags;
  
  // If new media was uploaded
  if (req.fileUrl) {
    post.mediaUrl = req.fileUrl;
  }
  
  post.updatedAt = Date.now();
  await post.save();
  
  res.status(StatusCodes.OK).json({ post });
};

// Delete a gallery post
const deleteGalleryPost = async (req, res) => {
  const { id } = req.params;
  
  // Check ownership (or admin)
  const post = await checkOwnership(req.user.userId, id, GalleryPost);
  
  // Delete all comments associated with the post
  await Comment.deleteMany({ post: id });
  
  // Delete notifications related to this post
  await Notification.deleteMany({ 'references.post': id });
  
  // Delete the post
  await post.remove();
  
  res.status(StatusCodes.OK).json({ msg: 'Gallery post deleted successfully' });
};

// ==== COMMON INTERACTION CONTROLLERS ====

// Like a post (any type)
const likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  
  // Find the post
  const post = await Post.findById(id);
  if (!post) {
    throw new NotFoundError(`No post found with id ${id}`);
  }
  
  // Check if already liked
  if (post.likes.includes(userId)) {
    throw new BadRequestError('Post already liked');
  }
  
  // Add like
  post.likes.push(userId);
  await post.save();
  
  // Create notification if not self-liking
  if (post.user.toString() !== userId) {
    await Notification.create({
      recipient: post.user,
      sender: userId,
      category: 'social',
      action: 'like',
      message: `${req.user.name} liked your post`,
      references: {
        post: id
      },
      redirectUrl: `/community/${post.postType.toLowerCase().replace('post', '')}/${id}`
    });
  }
  
  res.status(StatusCodes.OK).json({ 
    msg: 'Post liked successfully',
    likesCount: post.likes.length
  });
};

// Unlike a post (any type)
const unlikePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  
  // Find the post
  const post = await Post.findById(id);
  if (!post) {
    throw new NotFoundError(`No post found with id ${id}`);
  }
  
  // Check if already liked
  if (!post.likes.includes(userId)) {
    throw new BadRequestError('Post not liked yet');
  }
  
  // Remove like
  post.likes = post.likes.filter(id => id.toString() !== userId);
  await post.save();
  
  res.status(StatusCodes.OK).json({ 
    msg: 'Post unliked successfully',
    likesCount: post.likes.length
  });
};

// Add a comment to any post type
const addComment = async (req, res) => {
  const { id: postId } = req.params;
  const { content, parentComment } = req.body;
  
  // Check if post exists
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new NotFoundError(`No post found with id ${postId}`);
  }
  
  // Validate parent comment if provided
  if (parentComment) {
    const parentCommentExists = await Comment.findOne({ 
      _id: parentComment,
      post: postId
    });
    
    if (!parentCommentExists) {
      throw new BadRequestError('Invalid parent comment');
    }
  }
  
  // Create the comment
  const comment = await Comment.create({
    post: postId,
    user: req.user.userId,
    content,
    parentComment: parentComment || null
  });
  
  // Add comment reference to post
  post.comments.push(comment._id);
  await post.save();
  
  // Populate user info for response
  await comment.populate('user', 'name avatar');
  
  // Create notification for post owner (if not self-commenting)
  if (post.user.toString() !== req.user.userId) {
    await Notification.create({
      recipient: post.user,
      sender: req.user.userId,
      category: 'social',
      action: 'comment',
      message: `${req.user.name} commented on your post`,
      references: {
        post: postId,
        comment: comment._id
      },
      redirectUrl: `/community/${post.postType.toLowerCase().replace('post', '')}/${postId}`
    });
  }
  
  // If it's a reply, notify the parent comment owner too
  if (parentComment) {
    const parentCommentDoc = await Comment.findById(parentComment);
    if (parentCommentDoc && parentCommentDoc.user.toString() !== req.user.userId) {
      await Notification.create({
        recipient: parentCommentDoc.user,
        sender: req.user.userId,
        category: 'social',
        action: 'reply',
        message: `${req.user.name} replied to your comment`,
        references: {
          post: postId,
          comment: comment._id
        },
        redirectUrl: `/community/${post.postType.toLowerCase().replace('post', '')}/${postId}#comment-${comment._id}`
      });
    }
  }
  
  res.status(StatusCodes.CREATED).json({ comment });
};

// Update a comment
const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  
  // Check ownership
  const comment = await checkOwnership(req.user.userId, id, Comment);
  
  // Update content
  comment.content = content;
  comment.updatedAt = Date.now();
  await comment.save();
  
  res.status(StatusCodes.OK).json({ comment });
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { id } = req.params;
  
  // Check ownership
  const comment = await checkOwnership(req.user.userId, id, Comment);
  
  // Get the post to update its comments array
  const post = await Post.findById(comment.post);
  if (post) {
    post.comments = post.comments.filter(commentId => commentId.toString() !== id);
    await post.save();
  }
  
  // Delete notifications related to this comment
  await Notification.deleteMany({ 'references.comment': id });
  
  // If the comment was marked as a solution to a forum post, update the post
  if (post.postType === 'ForumPost') {
    const forumPost = await ForumPost.findById(post._id);
    if (forumPost && forumPost.solutionComment && forumPost.solutionComment.toString() === id) {
      forumPost.isSolved = false;
      forumPost.solutionComment = null;
      await forumPost.save();
    }
  }
  
  // Delete the comment
  await comment.remove();
  
  res.status(StatusCodes.OK).json({ msg: 'Comment deleted successfully' });
};

// Like a comment
const likeComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  
  // Find the comment
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new NotFoundError(`No comment found with id ${id}`);
  }
  
  // Check if already liked
  if (comment.likes.includes(userId)) {
    throw new BadRequestError('Comment already liked');
  }
  
  // Add like
  comment.likes.push(userId);
  await comment.save();
  
  // Create notification if not self-liking
  if (comment.user.toString() !== userId) {
    // Get the post for the redirect URL
    const post = await Post.findById(comment.post);
    
    await Notification.create({
      recipient: comment.user,
      sender: userId,
      category: 'social',
      action: 'like',
      message: `${req.user.name} liked your comment`,
      references: {
        post: comment.post,
        comment: id
      },
      redirectUrl: `/community/${post.postType.toLowerCase().replace('post', '')}/${comment.post}#comment-${id}`
    });
  }
  
  res.status(StatusCodes.OK).json({ 
    msg: 'Comment liked successfully',
    likesCount: comment.likes.length
  });
};

//////////
// Unlike a comment
const unlikeComment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    
    // Find the comment
    const comment = await Comment.findById(id);
    if (!comment) {
      throw new NotFoundError(`No comment found with id ${id}`);
    }
    
    // Check if the comment is already liked by the user
    if (!comment.likes.includes(userId)) {
      throw new BadRequestError('Comment is not liked yet');
    }
    
    // Remove like
    comment.likes = comment.likes.filter(id => id.toString() !== userId);
    await comment.save();
    
    // Remove the like notification if exists
    await Notification.deleteOne({
      'sender': userId,
      'recipient': comment.user,
      'references.comment': id,
      'action': 'like'
    });
    
    res.status(StatusCodes.OK).json({ 
      msg: 'Comment unliked successfully',
      likesCount: comment.likes.length
    });
  };


  //////////////////////////
// Reply to a comment
const replyToComment = async (req, res) => {
    const { id: commentId } = req.params;
    const { content } = req.body;
    
    // Check if parent comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      throw new NotFoundError(`No comment found with id ${commentId}`);
    }
    
    // Create the reply
    const reply = await Comment.create({
      post: parentComment.post,
      user: req.user.userId,
      content,
      parentComment: commentId
    });
    
    // Populate user info for response
    await reply.populate('user', 'name email');
    
    // Get the post to update its comments array and for notification
    const post = await Post.findById(parentComment.post);
    
    // Add reply reference to post's comments array
    post.comments.push(reply._id);
    await post.save();
    
    // Create notification for comment owner (if not self-replying)
    if (parentComment.user.toString() !== req.user.userId) {
      await Notification.create({
        recipient: parentComment.user,
        sender: req.user.userId,
        category: 'social',
        action: 'reply',
        message: `${req.user.name} replied to your comment`,
        references: {
          post: parentComment.post,
          comment: reply._id
        },
        redirectUrl: `/community/${post.postType.toLowerCase().replace('post', '')}/${parentComment.post}#comment-${reply._id}`
      });
    }
    
    res.status(StatusCodes.CREATED).json({ reply });
  };



module.exports = {
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
  replyToComment
};