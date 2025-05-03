


const express = require('express')
const router = express.Router()
const {
  getProductReviews,
  createReview,
  deleteReview,
  updateReview,
  adminDeleteReview
} = require('../controllers/reviewController') // Adjust path as needed
const authenticateUser = require('../middleware/authentication') //  auth middleware
const isAdmin = require('../middleware/admin') //  admin permissions middleware
// Public routes
router.get('/product/:productId', getProductReviews)

// Protected routes
router.post('/product/:productId', authenticateUser, createReview)
router.delete('/:reviewId', authenticateUser, deleteReview)
router.patch('/:reviewId',authenticateUser, updateReview)

// Admin routes
router.delete('/admin/:reviewId', authenticateUser, isAdmin, adminDeleteReview)

module.exports = router