// models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  // Who receives the notification
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index for performance on queries
  },
  
  // Who triggered the notification (optional - some system notifications might not have a sender)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // General notification type category
  category: {
    type: String,
    required: true,
    enum: ['social', 'purchase', 'system', 'community', 'product']
  },
  
  // Specific action that triggered notification
  action: {
    type: String,
    required: true,
    enum: [
      // Social interactions
      'like', 'comment', 'reply', 'mention', 'follow',
      
      // Purchase related
      'new_order', 'order_shipped', 'order_delivered', 'payment_received',
      
      // Product related
      'product_sold', 'low_stock', 'out_of_stock', 'price_change',
      
      // Community related
      'post_featured', 'solution_marked', 'post_removed',
      
      // System notifications
      'welcome', 'account_update', 'password_reset'
    ]
  },
  
  // Message to display in notification
  message: {
    type: String,
    required: true
  },
  
  // Reference to related objects - using mixed type to allow flexibility
  references: {
    // Each reference is optional depending on notification type
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  },
  
  // URL to navigate to when notification is clicked
  redirectUrl: {
    type: String
  },
  
  // Status tracking
  isRead: {
    type: Boolean,
    default: false,
    index: true // Add index for performance on queries
  },
  
  // Allows marking notifications as "removed" without deleting from DB
  isArchived: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Add index for sorting by date
  }
});

// Index for efficient querying of unread notifications
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// Custom method to mark notification as read
NotificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Custom method to archive notification
NotificationSchema.methods.archive = function() {
  this.isArchived = true;
  return this.save();
};

// Custom static method to get unread count for a user
NotificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    isRead: false,
    isArchived: false
  });
};

// Custom static method to mark all notifications as read for a user
NotificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true }
  );
};

module.exports = mongoose.model('Notification', NotificationSchema);