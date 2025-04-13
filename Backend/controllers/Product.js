const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

// ✅ Public: browse products
const getPublicProducts = async (req, res) => {
  const { category, search } = req.query
  let query = {}

  if (category) query.category = category
  if (search) query.name = { $regex: search, $options: 'i' }

  const products = await Product.find(query).populate('seller', 'email')
  res.status(StatusCodes.OK).json({ products })
}

// 🔒 Seller: create product
const createProduct = async (req, res) => {
    // Add the current user as the seller
    req.body.seller = req.user.userId;
    
    // Create the product with data from req.body (including image URL)
    const product = await Product.create(req.body);
    
    res.status(StatusCodes.CREATED).json({ product });

};

// 🔒 Seller: get their products
const getSellerProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ products })
}

// 🔒 Seller: update their product
const updateProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOneAndUpdate(
    { _id: productId, seller: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!product) throw new NotFoundError(`No product with id ${productId}`)
  res.status(StatusCodes.OK).json({ product })
}

// 🔒 Seller: delete their product
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOneAndDelete({
    _id: productId,
    seller: req.user.userId,
  })
  if (!product) throw new NotFoundError(`No product with id ${productId}`)
  res.status(StatusCodes.OK).send()
}

// 🔐 Admin: delete any product
const deleteAnyProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findByIdAndDelete(productId)
  if (!product) throw new NotFoundError(`No product with id ${productId}`)
  res.status(StatusCodes.OK).json({ msg: 'Product deleted by admin' })
}



const getProductCategories = async (req, res) => {
  try {
    // Get all possible categories from the schema enum
    const categories = Product.schema.path('category').enumValues;
    
    // Return the categories array
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ msg: 'Server error fetching categories' });
  }
};

module.exports = {
  getPublicProducts,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAnyProduct,
  getProductCategories
}
