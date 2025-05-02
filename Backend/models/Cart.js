// models/Cart.js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: String,
  category: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
}, { _id: false });

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [CartItemSchema],
  active: {
    type: Boolean,
    default: true
  },
  // When cart is completed (purchased), set this to false
  // and store the order details
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Add an index for faster lookups by user ID and active status
CartSchema.index({ user: 1, active: 1 });

module.exports = mongoose.model('Cart', CartSchema);