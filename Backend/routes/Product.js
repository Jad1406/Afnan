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
const Product = require('../models/Product');


// middleware
const auth = require('../middleware/authentication')
const isAdmin = require('../middleware/admin')
const asyncWrapper = require('../middleware/async')

// ✅ Public route
// router.get('/public', asyncWrapper(getPublicProducts))


// 🔒 Seller-only routes
// router.get('/', auth, asyncWrapper(getSellerProducts))
router.post('/', auth, asyncWrapper(createProduct))
router.patch('/:id', auth, asyncWrapper(updateProduct))
router.delete('/:id', auth, asyncWrapper(deleteProduct))

// 🔐 Admin-only
router.delete('/admin/:id', auth, isAdmin, asyncWrapper(deleteAnyProduct))

// getting product categories to use in the frontend
router.get('/categories', asyncWrapper(getProductCategories));












// GET /api/v1/products
// Handles pagination, filtering, and sorting
router.get('/public', async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Build filter query
    const filterQuery = {};
    
    // Category filter
    if (req.query.category) {
      filterQuery.category = req.query.category;
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filterQuery.price = {};
      if (req.query.minPrice) {
        filterQuery.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filterQuery.price.$lte = parseFloat(req.query.maxPrice);
      }
    }
    
    // Search query (search in name and description)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filterQuery.$or = [
        { name: searchRegex },
        { description: searchRegex }
      ];
    }

    // Rating filter
    if (req.query.minRating) {
      // Use averageRating instead of rating to match your product schema
      filterQuery.averageRating = { $gte: parseFloat(req.query.minRating) };
      
      // Only include products that have been rated at least once
      filterQuery.numRatings = { $gt: 0 };
    }

  //  // in stock filter
    if (req.query.stock) {  //when clicked it will be false
      filterQuery.stock = { $gt: 0 };
    }


    // Build sort options
    let sortOptions = { createdAt: -1 }; // Default: newest first
    
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sortOptions = { price: 1 };
          break;
        case 'price_desc':
          sortOptions = { price: -1 };
          break;
        case 'name_asc':
          sortOptions = { name: 1 };
          break;
        case 'name_desc':
          sortOptions = { name: -1 };
          break;
        case 'popularity':
          sortOptions = { salesCount: -1 };
          break;
        // Default is already set (newest)
      }
    }
    
    console.log('Filter Query:', filterQuery);
    // Execute query with pagination
    const products = await Product.find(filterQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalItems = await Product.countDocuments(filterQuery);
    console.log('Total Items:', totalItems);
    // Send response
    res.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit
      }
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

module.exports = router
