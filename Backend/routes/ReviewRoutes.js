// const express = require('express')
// const router = express.Router()

// // controllers
// const {
//   getProductReviews,
//   createReview,
//   deleteReview
// } = require('../controllers/ReviewController')

// // middleware
// const auth = require('../middleware/authentication')
// const asyncWrapper = require('../middleware/async')

// // Routes
// // Public - Get reviews for a product
// router.get('/product/:productId', asyncWrapper(getProductReviews))

// // Protected - Create a review (requires authentication)
// router.post('/product/:productId', auth, asyncWrapper(createReview))


// // Protected - Delete a review (user can only delete their own review)
// router.delete('/:reviewId', auth, asyncWrapper(deleteReview))

// module.exports = router




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
router.patch('/product/:productId',authenticateUser, updateReview)

// Admin routes
router.delete('/admin/:reviewId', authenticateUser, isAdmin, adminDeleteReview)

module.exports = router