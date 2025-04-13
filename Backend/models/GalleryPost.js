const mongoose = require('mongoose');
const Post = require('./Post');

const GalleryPostSchema = new mongoose.Schema({
  // mediaType will be determined automatically based on the URL
  mediaType: {
    type: String,
    enum: ['image', 'video']
  },
  mediaUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Plants', 'Garden Design', 'Flowers', 'Indoor', 'Outdoor', 'Before/After', 'Other']
  },
  tags: [{
    type: String,
    trim: true
  }]
});

// Pre-save middleware to ensure mediaType is set correctly
GalleryPostSchema.pre('save', function(next) {
  if (this.mediaUrl) {
    const extension = this.mediaUrl.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const videoExtensions = ['mp4', 'mov', 'webm', 'avi'];
    
    if (imageExtensions.includes(extension)) {
      this.mediaType = 'image';
    } else if (videoExtensions.includes(extension)) {
      this.mediaType = 'video';
    }
  }
  next();
});

module.exports = Post.discriminator('GalleryPost', GalleryPostSchema);