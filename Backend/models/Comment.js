// const mongoose = require('mongoose');

// const CommentSchema = new mongoose.Schema({
//   post: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Post',
//     required: true
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   content: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   likes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }],
//   // For nested comments (replies)
//   parentComment: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Comment',
//     default: null
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Pre-save hook to update the updatedAt field
// CommentSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();

// CommentSchema.virtual('replies', {
//     ref: 'Comment',
//     localField: '_id',
//     foreignField: 'parentComment'
//   });
  
//   // Make sure virtuals are included in JSON
//   CommentSchema.set('toJSON', { virtuals: true });
//   CommentSchema.set('toObject', { virtuals: true });
// });

// module.exports = mongoose.model('Comment', CommentSchema);


const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // For nested comments (replies)
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save hook to update the updatedAt field
CommentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for replies - points to other comments where parentComment is this comment's ID
CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment'
});

module.exports = mongoose.model('Comment', CommentSchema);