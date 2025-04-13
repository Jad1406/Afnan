const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String,
              required: true,
              enum: ['Plant','Indoor', 'Pots', 'Supplies', 'Outdoor', 'Tools', 'Accessories','Other'], // Enum for specific types
              // default:"Other"
       },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    badge: { type: String, default: null }, // Badge can be null
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true
    }
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product
