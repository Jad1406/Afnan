const mongoose = require('mongoose');
const Post = require('./Post');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Gardening Tips', 'Plant Care', 'DIY Projects', 'Sustainability', 'Plant Stories', 'Other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  readTime: {
    type: Number,
    default: 5 // minutes
  },
  isPublished: {
    type: Boolean,
    default: true
  }
});

module.exports = Post.discriminator('BlogPost', BlogPostSchema);