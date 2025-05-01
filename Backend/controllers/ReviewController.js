// const Review = require('../models/Review')
// const Product = require('../models/Product')
// const { StatusCodes } = require('http-status-codes')
// const { BadRequestError, NotFoundError } = require('../errors')
// const mongoose = require('mongoose')

// // Get all reviews for a product
// const getProductReviews = async (req, res) => {
//   const { productId } = req.params
  
//   const reviews = await Review.find({ product: productId })
//     .populate('user', 'email name')
//     .sort('-createdAt')
  
//   res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
// }

// // Create a review for a product
// const createReview = async (req, res) => {
//   const { productId } = req.params
//   const { rating, comment } = req.body
  
//   // Validate input
//   if (!rating || rating < 1 || rating > 5) {
//     throw new BadRequestError('Please provide a valid rating between 1 and 5')
//   }
  
//   // Check if product exists
//   const product = await Product.findById(productId)
//   if (!product) {
//     throw new NotFoundError(`No product found with id ${productId}`)
//   }
  
//   // Check if user already reviewed this product
//   const existingReview = await Review.findOne({
//     product: productId,
//     user: req.user.userId
//   })
  
//   const session = await mongoose.startSession()
//   session.startTransaction()
  
//   try {
//     let review
    
//     if (existingReview) {
//       // Update existing review
//       existingReview.rating = rating
//       existingReview.comment = comment
//       review = await existingReview.save({ session })
//     } else {
//       // Create new review
//       review = await Review.create([{
//         product: productId,
//         user: req.user.userId,
//         rating,
//         comment
//       }], { session })
      
//       // Increment numRatings on the product
//       await Product.findByIdAndUpdate(
//         productId,
//         { $inc: { numRatings: 1 } },
//         { session }
//       )
//     }
    
//     // Calculate new average rating
//     const allReviews = await Review.find({ product: productId }, null, { session })
//     const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
//     const averageRating = totalRating / allReviews.length
    
//     // Update product with new average rating
//     await Product.findByIdAndUpdate(
//       productId,
//       { averageRating },
//       { session }
//     )
    
//     await session.commitTransaction()
//     session.endSession()
    
//     res.status(StatusCodes.CREATED).json({ review: review[0] || review })
//   } catch (error) {
//     await session.abortTransaction()
//     session.endSession()
//     throw error
//   }
// }

// // Delete a review (user can delete their own review)
// const deleteReview = async (req, res) => {
//   const { reviewId } = req.params
  
//   const review = await Review.findOne({
//     _id: reviewId,
//     user: req.user.userId
//   })
  
//   if (!review) {
//     throw new NotFoundError(`No review found with id ${reviewId}`)
//   }
  
//   const productId = review.product
  
//   const session = await mongoose.startSession()
//   session.startTransaction()
  
//   try {
//     // Delete the review
//     await Review.findByIdAndDelete(reviewId, { session })
    
//     // Decrement numRatings on the product
//     await Product.findByIdAndUpdate(
//       productId,
//       { $inc: { numRatings: -1 } },
//       { session }
//     )
    
//     // Recalculate average rating
//     const remainingReviews = await Review.find({ product: productId }, null, { session })
    
//     let averageRating = 0
//     if (remainingReviews.length > 0) {
//       const totalRating = remainingReviews.reduce((sum, review) => sum + review.rating, 0)
//       averageRating = totalRating / remainingReviews.length
//     }
    
//     // Update product with new average rating
//     await Product.findByIdAndUpdate(
//       productId,
//       { averageRating },
//       { session }
//     )
    
//     await session.commitTransaction()
//     session.endSession()
    
//     res.status(StatusCodes.OK).json({ msg: 'Review deleted successfully' })
//   } catch (error) {
//     await session.abortTransaction()
//     session.endSession()
//     throw error
//   }
// }

// module.exports = {
//   getProductReviews,
//   createReview,
//   deleteReview
// }


const Review = require('../models/Review')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../errors')
const mongoose = require('mongoose')

// Get all reviews for a product
const getProductReviews = async (req, res) => {
  const { productId } = req.params
  
  const reviews = await Review.find({ product: productId })
    .populate('user', 'email name')
    .sort('-createdAt')
  
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

// Create a new review for a product
const createReview = async (req, res) => {
  const { productId } = req.params
  const { rating, comment } = req.body
  
  // Validate input
  if (!rating || rating < 1 || rating > 5) {
    throw new BadRequestError('Please provide a valid rating between 1 and 5')
  }
  
  // Check if product exists
  const product = await Product.findById(productId)
  if (!product) {
    throw new NotFoundError(`No product found with id ${productId}`)
  }
  
  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    product: productId,
    user: req.user.userId
  })
  
  if (existingReview) {
    throw new BadRequestError('You have already reviewed this product. Please edit your existing review.')
  }
  
  const session = await mongoose.startSession()
  session.startTransaction()
  
  try {
    // Create new review
    const review = await Review.create([{
      product: productId,
      user: req.user.userId,
      rating,
      comment,
      createdAt: new Date(),
      updatedAt: new Date()
    }], { session })
    
    // Increment numRatings on the product
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { numRatings: 1 } },
      { session }
    )
    
    // Calculate new average rating
    const allReviews = await Review.find({ product: productId }, null, { session })
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / allReviews.length
    
    // Update product with new average rating
    await Product.findByIdAndUpdate(
      productId,
      { averageRating },
      { session }
    )
    
    await session.commitTransaction()
    session.endSession()
    
    res.status(StatusCodes.CREATED).json({ review: review[0] })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

// Update an existing review (PATCH)
const updateReview = async (req, res) => {
  const { productId } = req.params
  const { rating, comment } = req.body
  const { reviewId } = req.params
  console.log("REviewID"+reviewId)

  // Validate input
  if (!rating || rating < 1 || rating > 5) {
    throw new BadRequestError('Please provide a valid rating between 1 and 5')
  }
  
  // Find user's existing review
  // const existingReview = await Review.findOne({
  //   product: productId,
  //   user: req.user.userId
  // })
  const existingReview = await Review.findById(reviewId)
  if (!existingReview) {
    throw new NotFoundError('No existing review found to update')
  }
  console.log("Existing Review"+existingReview)
  const session = await mongoose.startSession()
  session.startTransaction()
  
  try {
    // Store old rating for recalculation
    const oldRating = existingReview.rating
    
    // Update existing review
    existingReview.rating = rating
    existingReview.comment = comment
    existingReview.updatedAt = new Date()
    const updatedReview = await existingReview.save({ session })
    
    // Calculate new average rating
    const allReviews = await Review.find({ product: existingReview.product }, null, { session })
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / allReviews.length
    
    // Update product with new average rating
    await Product.findByIdAndUpdate(
      // productId,
      existingReview.product,
      { averageRating },
      { session }
    )
    
    await session.commitTransaction()
    session.endSession()
    
    res.status(StatusCodes.OK).json({ review: updatedReview })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

// Delete a review (user can delete their own review)
const deleteReview = async (req, res) => {
  const { reviewId } = req.params
  
  const review = await Review.findOne({
    _id: reviewId,
    user: req.user.userId
  })
  
  if (!review) {
    throw new NotFoundError(`No review found with id ${reviewId}`)
  }
  
  const productId = review.product
  const deletedRating = review.rating // Store the rating before deleting
  
  const session = await mongoose.startSession()
  session.startTransaction()
  
  try {
    // Delete the review
    await Review.findByIdAndDelete(reviewId, { session })
    
    // Decrement numRatings on the product
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { numRatings: -1 } },
      { session }
    )
    
    // Recalculate average rating
    const remainingReviews = await Review.find({ product: productId }, null, { session })
    
    let averageRating = 0
    if (remainingReviews.length > 0) {
      const totalRating = remainingReviews.reduce((sum, review) => sum + review.rating, 0)
      averageRating = totalRating / remainingReviews.length
    }
    
    // Update product with new average rating
    await Product.findByIdAndUpdate(
      productId,
      { averageRating },
      { session }
    )
    
    await session.commitTransaction()
    session.endSession()
    
    res.status(StatusCodes.OK).json({ 
      msg: 'Review deleted successfully',
      rating: deletedRating 
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

// Admin function to delete any review
const adminDeleteReview = async (req, res) => {
  // ... same as before ...
}

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  adminDeleteReview
}