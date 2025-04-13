const express = require('express')

const router = express.Router()

// controllers
const {
  getPublicProducts,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAnyProduct,
  getProductCategories
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

// getting product categories to use in the frontend
router.get('/categories', auth, asyncWrapper(getProductCategories));

module.exports = router
