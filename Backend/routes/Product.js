const express = require('express')
const router = express.Router()
const {
  getPublicProducts,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAnyProduct,
} = require('../controllers/Product')

// middleware
const auth = require('../middleware/authentication')
const isAdmin = require('../middleware/admin')
const asyncWrapper = require('../middleware/async')

// ✅ Public route
router.get('/public', asyncWrapper(getPublicProducts))

// 🔒 Seller-only routes
router.get('/', auth, asyncWrapper(getSellerProducts))
router.post('/', auth, asyncWrapper(createProduct))
router.patch('/:id', auth, asyncWrapper(updateProduct))
router.delete('/:id', auth, asyncWrapper(deleteProduct))

// 🔐 Admin-only
router.delete('/admin/:id', auth, isAdmin, asyncWrapper(deleteAnyProduct))

module.exports = router
