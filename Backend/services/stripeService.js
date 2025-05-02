// // First, install the required packages
// // npm install @stripe/stripe-js @stripe/react-stripe-js

// // In the backend, you'll need to install the Stripe server SDK
// // npm install stripe

// // Create a new file: services/stripe.js
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// // Create a payment intent
// exports.createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // Convert to cents
//       currency,
//       metadata
//     });
    
//     return paymentIntent;
//   } catch (error) {
//     console.error('Error creating payment intent:', error);
//     throw error;
//   }
// };

// // Retrieve a payment intent
// exports.retrievePaymentIntent = async (paymentIntentId) => {
//   try {
//     return await stripe.paymentIntents.retrieve(paymentIntentId);
//   } catch (error) {
//     console.error('Error retrieving payment intent:', error);
//     throw error;
//   }
// };

// // Create a backend route for creating payment intents
// // routes/paymentRoutes.js
// const express = require('express');
// const router = express.Router();
// const { authenticateUser } = require('../middleware/authentication');
// const { createPaymentIntent, retrievePaymentIntent } = require('../services/stripe');
// const Order = require('../models/Order');
// const Cart = require('../models/Cart');

// /**
//  * @route   POST /api/v1/payments/create-payment-intent
//  * @desc    Create a payment intent for checkout
//  * @access  Private
//  */
// router.post('/create-payment-intent', authenticateUser, async (req, res) => {
//   try {
//     const userId = req.user.userId;
    
//     // Find user's active cart
//     const cart = await Cart.findOne({ user: userId, active: true });
    
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Your cart is empty'
//       });
//     }
    
//     // Calculate cart total
//     let subtotal = 0;
//     for (const item of cart.items) {
//       subtotal += item.price * item.quantity;
//     }
    
//     // Calculate tax and shipping
//     const taxRate = 0.07; // 7% tax
//     const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
//     const shippingCost = 5.99; // Fixed shipping cost
    
//     // Total amount to charge
//     const totalAmount = subtotal + taxAmount + shippingCost;
    
//     // Create payment intent
//     const paymentIntent = await createPaymentIntent(totalAmount, 'usd', {
//       userId: userId.toString(),
//       cartId: cart._id.toString()
//     });
    
//     return res.status(200).json({
//       success: true,
//       clientSecret: paymentIntent.client_secret,
//       amount: totalAmount,
//       subtotal,
//       taxAmount,
//       shippingCost
//     });
//   } catch (error) {
//     console.error('Error creating payment intent:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to process payment',
//       error: error.message
//     });
//   }
// });

// /**
//  * @route   POST /api/v1/payments/confirm
//  * @desc    Confirm payment and create order
//  * @access  Private
//  */
// router.post('/confirm', authenticateUser, async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { 
//       paymentIntentId, 
//       shippingAddress, 
//       paymentMethod = 'credit_card',
//       paymentDetails,
//       notes
//     } = req.body;
    
//     // Validate payment intent
//     const paymentIntent = await retrievePaymentIntent(paymentIntentId);
    
//     if (paymentIntent.status !== 'succeeded') {
//       return res.status(400).json({
//         success: false,
//         message: 'Payment has not been completed'
//       });
//     }
    
//     // Verify this payment is for this user
//     if (paymentIntent.metadata.userId !== userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Unauthorized payment confirmation'
//       });
//     }
    
//     // Find the cart
//     const cart = await Cart.findOne({
//       _id: paymentIntent.metadata.cartId,
//       user: userId,
//       active: true
//     });
    
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: 'Cart not found or already processed'
//       });
//     }
    
//     // Calculate totals
//     let subtotal = 0;
//     for (const item of cart.items) {
//       subtotal += item.price * item.quantity;
//     }
    
//     const taxRate = 0.07;
//     const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
//     const shippingCost = 5.99;
    
//     // Create the order
//     const order = await Order.create({
//       user: userId,
//       items: cart.items,
//       totalAmount: subtotal,
//       status: 'processing',
//       shippingAddress,
//       paymentMethod,
//       paymentDetails: {
//         ...paymentDetails,
//         paymentId: paymentIntentId
//       },
//       shippingCost,
//       taxAmount,
//       notes
//     });
    
//     // Mark the cart as inactive
//     cart.active = false;
//     await cart.save();
    
//     return res.status(201).json({
//       success: true,
//       message: 'Order created successfully',
//       order
//     });
//   } catch (error) {
//     console.error('Error confirming payment:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to process order',
//       error: error.message
//     });
//   }
// });

// module.exports = router;

// // Make sure to register this route in your main app.js or server.js file:
// // app.use('/api/v1/payments', paymentRoutes);


// services/stripeService.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create a payment intent for a given amount
 * @param {number} amount - Amount in dollars (will be converted to cents)
 * @param {string} currency - Currency code (default: 'usd')
 * @param {object} metadata - Additional metadata for the payment intent
 * @returns {Promise<object>} Stripe payment intent object
 */
exports.createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    // Validate inputs
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    
    // Convert amount to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(amount * 100);
    
    console.log(`Creating payment intent for ${currency} ${amount} (${amountInCents} cents)`);
    
    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata,
      // Payment method types can be customized based on your needs
      payment_method_types: ['card'],
    });
    
    return paymentIntent;
  } catch (error) {
    console.error('Error in createPaymentIntent:', error);
    throw error;
  }
};

/**
 * Retrieve a payment intent by ID
 * @param {string} paymentIntentId - The ID of the payment intent to retrieve
 * @returns {Promise<object>} Stripe payment intent object
 */
exports.retrievePaymentIntent = async (paymentIntentId) => {
  try {
    if (!paymentIntentId) {
      throw new Error('Payment intent ID is required');
    }
    
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Error in retrievePaymentIntent:', error);
    throw error;
  }
};

/**
 * Update a payment intent
 * @param {string} paymentIntentId - The ID of the payment intent to update
 * @param {object} updateData - The data to update
 * @returns {Promise<object>} Updated Stripe payment intent object
 */
exports.updatePaymentIntent = async (paymentIntentId, updateData) => {
  try {
    if (!paymentIntentId) {
      throw new Error('Payment intent ID is required');
    }
    
    return await stripe.paymentIntents.update(paymentIntentId, updateData);
  } catch (error) {
    console.error('Error in updatePaymentIntent:', error);
    throw error;
  }
};

/**
 * Cancel a payment intent
 * @param {string} paymentIntentId - The ID of the payment intent to cancel
 * @returns {Promise<object>} Canceled Stripe payment intent object
 */
exports.cancelPaymentIntent = async (paymentIntentId) => {
  try {
    if (!paymentIntentId) {
      throw new Error('Payment intent ID is required');
    }
    
    return await stripe.paymentIntents.cancel(paymentIntentId);
  } catch (error) {
    console.error('Error in cancelPaymentIntent:', error);
    throw error;
  }
};

/**
 * Create a refund for a charge
 * @param {string} chargeId - The ID of the charge to refund
 * @param {number} amount - Amount to refund in dollars (optional, defaults to full amount)
 * @param {string} reason - Reason for the refund
 * @returns {Promise<object>} Stripe refund object
 */
exports.createRefund = async (chargeId, amount = null, reason = 'requested_by_customer') => {
  try {
    if (!chargeId) {
      throw new Error('Charge ID is required');
    }
    
    const refundData = {
      charge: chargeId,
      reason
    };
    
    // If amount is specified, convert to cents and add to refund data
    if (amount !== null) {
      refundData.amount = Math.round(amount * 100);
    }
    
    return await stripe.refunds.create(refundData);
  } catch (error) {
    console.error('Error in createRefund:', error);
    throw error;
  }
};

/**
 * Verify a Stripe webhook signature
 * @param {object} payload - The raw request payload
 * @param {string} signature - The Stripe signature from headers
 * @returns {object} The verified Stripe event
 */
exports.verifyWebhookSignature = (payload, signature) => {
  try {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!endpointSecret) {
      throw new Error('Stripe webhook secret is not configured');
    }
    
    return stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    throw error;
  }
};

/**
 * Get a customer by ID or create a new one
 * @param {string} customerId - Existing customer ID (optional)
 * @param {object} customerData - Customer data for creation
 * @returns {Promise<object>} Stripe customer object
 */
exports.getOrCreateCustomer = async (customerId, customerData = {}) => {
  try {
    // If customer ID exists, retrieve the customer
    if (customerId) {
      return await stripe.customers.retrieve(customerId);
    }
    
    // Otherwise create a new customer
    return await stripe.customers.create(customerData);
  } catch (error) {
    console.error('Error in getOrCreateCustomer:', error);
    throw error;
  }
};

/**
 * Create a setup intent for saving payment methods
 * @param {string} customerId - The Stripe customer ID
 * @returns {Promise<object>} Stripe setup intent object
 */
exports.createSetupIntent = async (customerId) => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    return await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });
  } catch (error) {
    console.error('Error in createSetupIntent:', error);
    throw error;
  }
};

module.exports = exports;