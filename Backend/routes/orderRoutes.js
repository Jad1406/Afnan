// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const  authenticateUser  = require('../middleware/authentication'); // Adjust path as needed
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Adjust path as needed

/**
 * @route   POST /api/v1/orders
 * @desc    Create a new order from the active cart
 * @access  Private
 */
router.post('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      shippingAddress, 
      paymentMethod, 
      paymentDetails,
      notes 
    } = req.body;
    
    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address and payment method are required'
      });
    }
    
    // Find user's active cart
    const cart = await Cart.findOne({ user: userId, active: true });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create order: cart is empty'
      });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    for (const item of cart.items) {
      totalAmount += item.price * item.quantity;
    }
    
    // Calculate tax (example: 7% tax)
    const taxRate = 0.07;
    const taxAmount = parseFloat((totalAmount * taxRate).toFixed(2));
    
    // Calculate shipping (example: $5.99 flat rate)
    const shippingCost = 5.99;
    
    // Create the order
    const order = await Order.create({
      user: userId,
      items: cart.items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentDetails: {
        lastFour: paymentDetails?.lastFour,
        cardType: paymentDetails?.cardType,
        paymentId: paymentDetails?.paymentId
      },
      shippingCost,
      taxAmount,
      notes
    });
    
    // Mark the cart as inactive (archived)
    cart.active = false;
    await cart.save();
    
    // Update product stock (decrease by purchased quantity)
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }
    
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/orders
 * @desc    Get user's order history
 * @access  Private
 */
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;
    
    // Build query
    const query = { user: userId };
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Order.countDocuments(query);
    
    return res.status(200).json({
      success: true,
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/orders/:orderId
 * @desc    Get a specific order by ID
 * @access  Private
 */
router.get('/:orderId', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;
    
    // Find the order
    const order = await Order.findOne({
      _id: orderId,
      user: userId
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/v1/orders/:orderId/cancel
 * @desc    Cancel an order
 * @access  Private
 */
router.put('/:orderId/cancel', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;
    
    // Find the order
    const order = await Order.findOne({
      _id: orderId,
      user: userId
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if the order can be cancelled
    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order in '${order.status}' status`
      });
    }
    
    // Update the order status
    order.status = 'cancelled';
    await order.save();
    
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
    
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while cancelling order',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/orders/status/:status
 * @desc    Get orders by status
 * @access  Private
 */
router.get('/status/:status', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get orders with the specified status
    const orders = await Order.find({
      user: userId,
      status
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Order.countDocuments({
      user: userId,
      status
    });
    
    return res.status(200).json({
      success: true,
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
});

// Add this route to your express app
module.exports = router;