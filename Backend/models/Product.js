const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { 
      type: String,
      required: true,
      enum: ['plant','indoor', 'pots', 'supplies', 'outdoor', 'tools', 'accessories','other']
    },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    // Remove rating as a required field since it will be calculated
    averageRating: { 
      type: Number, 
      default: 0 
    },
    numRatings: { 
      type: Number, 
      default: 0 
    },
    badge: { type: String, default: null },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product