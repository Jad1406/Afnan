// models/Order.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
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
    min: 1
  }
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'USA'
  }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [OrderItemSchema],
  subtotal: Number,
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: AddressSchema,
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'paypal', 'stripe']
  },
  paymentDetails: {
    // Store masked payment information
    lastFour: String,
    cardType: String,
    paymentId: String
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  notes: String,
  // For order tracking
  trackingNumber: String,
  carrier: String
}, { timestamps: true });

// Add indices for common queries
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

// Virtual for calculating full amount (including tax and shipping)
OrderSchema.virtual('finalAmount').get(function() {
  return this.totalAmount + this.shippingCost + this.taxAmount;
});

module.exports = mongoose.model('Order', OrderSchema);