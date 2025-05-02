// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const  auth  = require('../middleware/authentication'); 
const Cart = require('../models/Cart'); // Use the Cart model
const Product = require('../models/Product'); // Adjust path as needed


router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find user's active cart
    let cart = await Cart.findOne({ 
      user: userId,
      active: true
    });
    
    // If no active cart exists, create one
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: []
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      cart: cart.items || []
    });
    
  } catch (error) {
    console.error('Error fetching user cart:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching cart',
      error: error.message
    });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cart } = req.body;
    
    if (!Array.isArray(cart)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart items must be an array' 
      });
    }
    
    // Find or create user's active cart
    let userCart = await Cart.findOne({ user: userId, active: true });
    
    if (!userCart) {
      userCart = new Cart({
        user: userId,
        items: cart
      });
    } else {
      userCart.items = cart;
      userCart.modifiedAt = Date.now();
    }
    
    // Save the cart
    await userCart.save();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Cart updated successfully',
      cart: userCart.items
    });
    
  } catch (error) {
    console.error('Error updating user cart:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while updating cart',
      error: error.message
    });
  }
});


router.post('/add', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID is required'
      });
    }
    
    // Verify the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found'
      });
    }
    
    // Find or create user's active cart
    let cart = await Cart.findOne({ user: userId, active: true });
    
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: []
      });
    }
    
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId.toString()
    );
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const newQuantity = cart.items[existingItemIndex].quantity + parseInt(quantity);
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more. Only ${product.stock - cart.items[existingItemIndex].quantity} more in stock`
        });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    }
    else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: parseInt(quantity)
      });
    }
    
    cart.modifiedAt = Date.now();
    await cart.save();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Item added to cart',
      cart: cart.items
    });
    
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while adding to cart',
      error: error.message
    });
  }
});


router.put('/item/:productId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;
    const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found'
        });
      }
    // Validate quantity
    const newQuantity = parseInt(quantity);
    if (isNaN(newQuantity) || newQuantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be a positive number' 
      });
    }
    else if (newQuantity > product.stock) {
        return res.status(400).json({ 
          success: false, 
          message: `Only ${product.stock} items available in stock`
        });
      }
      
    
    
    // Find user's active cart
    const cart = await Cart.findOne({ user: userId, active: true });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Active cart not found' 
      });
    }
    
    // Find the product in the cart
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId.toString()
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }
    
    // Update the quantity
    cart.items[itemIndex].quantity = newQuantity;
    cart.modifiedAt = Date.now();
    
    // Save the updated cart
    await cart.save();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Item quantity updated',
      cart: cart.items
    });
    
  } catch (error) {
    console.error('Error updating item quantity:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while updating quantity',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/v1/cart/item/:productId
 * @desc    Remove an item from the cart
 * @access  Private
 */
router.delete('/item/:productId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    
    // Find user's active cart
    const cart = await Cart.findOne({ user: userId, active: true });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Active cart not found' 
      });
    }
    
    // Remove the item from cart
    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId.toString()
    );
    
    cart.modifiedAt = Date.now();
    await cart.save();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Item removed from cart',
      cart: cart.items
    });
    
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while removing from cart',
      error: error.message
    });
  }
});



router.delete('/clear', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find user's active cart
    const cart = await Cart.findOne({ user: userId, active: true });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Active cart not found' 
      });
    }
    
    // Clear the items
    cart.items = [];
    cart.modifiedAt = Date.now();
    await cart.save();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Cart cleared successfully',
      cart: []
    });
    
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while clearing cart',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/cart/history
 * @desc    Get the user's cart history (completed/inactive carts)
 * @access  Private
 */
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Find user's inactive carts (completed/archived)
    const carts = await Cart.find({ 
      user: userId,
      active: false
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Cart.countDocuments({ 
      user: userId,
      active: false
    });
    
    return res.status(200).json({ 
      success: true, 
      carts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Error fetching cart history:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching cart history',
      error: error.message
    });
  }
});

module.exports = router;