const mongoose = require('mongoose');
const Post = require('./Post');

const ForumPostSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Question', 'Discussion', 'Help', 'Announcement', 'Other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  isSolved: {
    type: Boolean,
    default: false
  },
  solutionComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  }
});

module.exports = Post.discriminator('ForumPost', ForumPostSchema);