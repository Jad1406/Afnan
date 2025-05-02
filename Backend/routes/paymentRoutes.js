// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const  auth  = require('../middleware/authentication');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

/**
 * @route   POST /api/v1/payments/create-payment-intent
 * @desc    Create a payment intent for checkout
 * @access  Private
 */
router.post('/create-payment-intent', auth,async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(`Creating payment intent for user: ${userId}`);
    
    // Find user's active cart
    const cart = await Cart.findOne({ user: userId, active: true });
    
    if (!cart || !cart.items || cart.items.length === 0) {
      console.log('No active cart found or cart is empty');
      return res.status(400).json({ 
        success: false, 
        message: 'Your cart is empty' 
      });
    }
    
    console.log(`Found active cart with ${cart.items.length} items`);
    
    // Calculate cart total
    let subtotal = 0;
    for (const item of cart.items) {
      subtotal += item.price * item.quantity;
    }
    
    // Calculate tax and shipping
    const taxRate = 0.07; // 7% tax
    const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
    const shippingCost = 5.99; // Fixed shipping cost
    
    // Total amount to charge
    const totalAmount = subtotal + taxAmount + shippingCost;
    
    console.log(`Payment details - Subtotal: $${subtotal}, Tax: $${taxAmount}, Shipping: $${shippingCost}, Total: $${totalAmount}`);
    
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: userId.toString(),
        cartId: cart._id.toString()
      }
    });
    
    console.log(`Created payment intent with ID: ${paymentIntent.id}`);
    
    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount,
      subtotal,
      taxAmount,
      shippingCost
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/v1/payments/confirm
 * @desc    Confirm payment and create order
 * @access  Private
 */
// router.post('/confirm', auth,async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { 
//       paymentIntentId, 
//       shippingAddress, 
//       paymentMethod = 'credit_card',
//       paymentDetails = {},
//       notes = ''
//     } = req.body;
    
//     console.log(`Confirming payment for intent: ${paymentIntentId}`);
    
//     if (!paymentIntentId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Payment intent ID is required'
//       });
//     }
    
//     if (!shippingAddress) {
//       return res.status(400).json({
//         success: false,
//         message: 'Shipping address is required'
//       });
//     }
    
//     // Retrieve payment intent from Stripe to verify payment
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
//     console.log(`Payment intent status: ${paymentIntent.status}`);
    
//     if (paymentIntent.status !== 'succeeded') {
//       return res.status(400).json({
//         success: false,
//         message: `Payment has not been completed. Status: ${paymentIntent.status}`
//       });
//     }
    
//     // Verify this payment is for this user
//     if (paymentIntent.metadata.userId !== userId.toString()) {
//       console.log(`User ID mismatch. Payment user: ${paymentIntent.metadata.userId}, Request user: ${userId}`);
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
//       console.log(`Cart not found or already processed. Cart ID: ${paymentIntent.metadata.cartId}`);
//       return res.status(404).json({
//         success: false,
//         message: 'Cart not found or already processed'
//       });
//     }
    
//     console.log(`Found cart with ${cart.items.length} items`);
    
//     // Calculate totals
//     let subtotal = 0;
//     for (const item of cart.items) {
//       subtotal += item.price * item.quantity;
//     }
    
//     const taxRate = 0.07;
//     const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
//     const shippingCost = 5.99;
    
//     // Extract card information for storing if available
//     let cardDetails = {};
//     if (paymentIntent.charges && paymentIntent.charges.data.length > 0) {
//       const charge = paymentIntent.charges.data[0];
//       if (charge.payment_method_details && charge.payment_method_details.card) {
//         const card = charge.payment_method_details.card;
//         cardDetails = {
//           lastFour: card.last4,
//           cardType: card.brand,
//         };
//       }
//     }
    
//     // Merge provided payment details with extracted card details
//     const finalPaymentDetails = {
//       ...paymentDetails,
//       ...cardDetails,
//       paymentId: paymentIntentId
//     };
    
//     console.log('Creating order with payment details:', {
//       paymentMethod,
//       paymentId: paymentIntentId,
//       cardType: finalPaymentDetails.cardType,
//       lastFour: finalPaymentDetails.lastFour ? '****' : 'none' // Mask for logs
//     });
    
//     // Create the order
//     const order = await Order.create({
//       user: userId,
//       items: cart.items,
//       totalAmount: subtotal,
//       status: 'processing',
//       shippingAddress,
//       paymentMethod,
//       paymentDetails: finalPaymentDetails,
//       shippingCost,
//       taxAmount,
//       notes
//     });
    
//     console.log(`Order created successfully with ID: ${order._id}`);
    
//     // Mark the cart as inactive
//     cart.active = false;
//     await cart.save();
//     console.log(`Cart marked as inactive: ${cart._id}`);
    
//     // Update product inventory (optional)
//     // This could be handled here or with a separate inventory management system
    
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

router.post('/confirm', auth,async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      paymentIntentId, 
      shippingAddress, 
      paymentMethod = 'credit_card',
      paymentDetails = {},
      notes = '',
      checkoutSummary,
    } = req.body;
    console.log("recieved req:",req.body);
    console.log(`Confirming payment for intent: ${paymentIntentId}`);
    
    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }
    
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }
    
    // Retrieve payment intent from Stripe to verify payment
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    console.log(`Payment intent status: ${paymentIntent.status}`);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: `Payment has not been completed. Status: ${paymentIntent.status}`
      });
    }
    
    // Verify this payment is for this user
    if (paymentIntent.metadata.userId !== userId.toString()) {
      console.log(`User ID mismatch. Payment user: ${paymentIntent.metadata.userId}, Request user: ${userId}`);
      return res.status(403).json({
        success: false,
        message: 'Unauthorized payment confirmation'
      });
    }
    
    // Find the cart
    const cart = await Cart.findOne({
      _id: paymentIntent.metadata.cartId,
      active: true
    });
    console.log("CARTTTTTTT: ",  cart);

    if (!cart) {
      console.log(`Cart not found or already processed. Cart ID: ${paymentIntent.metadata.cartId}`);
      return res.status(404).json({
        success: false,
        message: 'Cart not found or already processed'
      });
    }
    
    // // Calculate totals
    // let subtotal = 0;
    // for (const item of cart.items) {
    //   subtotal += item.price * item.quantity;
    // }
    
    // const taxRate = 0.07;
    // const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
    // const shippingCost = 5.99;
    
    // const taxRate = checkoutSummary.taxRate; // Assuming taxRate is provided in the checkout summary
    const taxAmount = checkoutSummary.taxAmount;
    const shippingCost = checkoutSummary.shippingCost;
    const subtotal = checkoutSummary.subtotal;
    const total = checkoutSummary.total;
    // Extract card information for storing if available
    let cardDetails = {};
    if (paymentIntent.charges && paymentIntent.charges.data.length > 0) {
      const charge = paymentIntent.charges.data[0];
      if (charge.payment_method_details && charge.payment_method_details.card) {
        const card = charge.payment_method_details.card;
        cardDetails = {
          lastFour: card.last4,
          cardType: card.brand,
        };
      }
    }
    
    // Merge provided payment details with extracted card details
    const finalPaymentDetails = {
      ...paymentDetails,
      ...cardDetails,
      paymentId: paymentIntentId
    };
    
    console.log('Creating order with payment details:', {
      paymentMethod,
      paymentId: paymentIntentId,
      cardType: finalPaymentDetails.cardType,
      lastFour: finalPaymentDetails.lastFour ? '****' : 'none' // Mask for logs
    });
    
    // Create the order
    const order = await Order.create({
      user: userId,
      items: cart.items,
      totalAmount: total,
      status: 'processing',
      shippingAddress,
      paymentMethod,
      paymentDetails: finalPaymentDetails,
      shippingCost,
      taxAmount,
      notes
    });
    
    // After successfully creating the order:
    console.log(`Order created successfully with ID: ${order._id}`);
    console.log(`Order created successfully lllllllllll: ${order}`);
    
    // Mark the cart as inactive
    cart.active = false;
    await cart.save();
    console.log(`Cart marked as inactive: ${cart._id}`);
    
    // Update product inventory for each item in the order
    const Product = require('../models/Product'); // Import Product model
    
    const stockUpdatePromises = order.items.map(async (item) => {
      try {
        // Get the product ID (handle both id and _id formats)
        const productId = item.product || item._id || item.id;
        
        if (!productId) {
          console.warn(`Cannot update stock: No product ID found for item ${item.name}`);
          return;
        }
        
        // Find the product
        const product = await Product.findById(productId);
        
        if (!product) {
          console.warn(`Product not found for stock update: ${productId}`);
          return;
        }
        
        // Calculate new stock level
        const newStock = Math.max(0, product.stock - item.quantity);
        console.log(`Updating stock for ${product.name} (${productId}): ${product.stock} → ${newStock}`);
        
        // Update the product stock
        await Product.findByIdAndUpdate(productId, { stock: newStock });
      } catch (err) {
        console.error(`Error updating stock for item: ${item.name}`, err);
        // We don't throw here to allow the order to complete even if stock updates fail
      }
    });
    
    // Wait for all stock updates to complete (but don't block the response)
    Promise.all(stockUpdatePromises)
      .then(() => console.log('All product stock levels updated successfully'))
      .catch(err => console.error('Error updating some product stock levels:', err));
    
    // Return success response immediately
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
   
  } catch (error) {
    console.error('Error confirming payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process order',
      error: error.message
    });
  }
});














/**
 * @route   GET /api/v1/payments/intent/:intentId
 * @desc    Get payment intent details
 * @access  Private
 */
router.get('/intent/:intentId', auth,async (req, res) => {
  try {
    const { intentId } = req.params;
    const userId = req.user.userId;
    
    if (!intentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }
    
    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(intentId);
    
    // Verify this payment belongs to the user
    if (paymentIntent.metadata.userId !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to payment intent'
      });
    }
    
    return res.status(200).json({
      success: true,
      intent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        created: paymentIntent.created
      }
    });
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment intent',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/v1/payments/webhook
 * @desc    Handle Stripe webhooks
 * @access  Public (but secured with Stripe signature)
 */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    // Verify webhook signature
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // For development without webhook signature verification
      event = JSON.parse(req.body.toString());
    }
    
    console.log(`Webhook received: ${event.type}`);
    
    // Handle the event based on type
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        // You could automatically capture payments, update order status, etc.
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log(`Payment failed: ${failedPayment.id}`);
        // Handle failed payment - notify user, update order status, etc.
        break;
        
      // Add more cases as needed
        
      default:
        // Unexpected event type
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({received: true});
  } catch (err) {
    console.error(`Webhook error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;