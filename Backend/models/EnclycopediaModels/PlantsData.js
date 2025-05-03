const mongoose = require('mongoose')

const plantsDataSchema = new mongoose.Schema(
  {
    name: { 
        type: String,
        required: true, // Name of the plant
        unique: true, // Ensure each plant has a unique name
    },
    commercialName: { 
        type: String, 
        required: false 
    }, //FIxed typo
    category: { 
        type: String, 
        required: true,
        enum: ['foliage', 'flowering', 'succulent', 'cactus', 'herb', 'tree', 'vine', 'fern'], // Example categories
    },
    image: {
        type: String,
        validate: {
          validator: function (v) {
            return v === null || typeof v === 'string';
          },
          message: props => `${props.value} is not a valid image URL`
        },
        required: false
      },
    light: { 
        type: String, 
        required: true,
        enum: ['low', 'medium', 'high'], // 3 levels of light requirement
     },
    water: { 
        type: String, 
        required: true 
    }, // Watering instructions
    humidity: { 
        type: String, 
        required: true 
    }, // Humidity requirements
    temperature: { 
        type: String, 
        required: true 
    }, // Temperature range
    soil: { 
        type: String, 
        required: true 
    }, // Soil type
    difficulty: { 
        type: String, 
        required: true,
        enum: ['easy', 'medium', 'hard'], // Difficulty levels
     },
    toxic: { 
        type: Boolean, // ✅ Fixed incorrect casing
        required: true 
    }, // Toxicity information
    growth: { 
        type: String, 
        required: true 
    }, // Growth rate
    propagation: { 
        type: String, 
        required: true 
    }, // Propagation methods
    description: { 
        type: String, 
        required: true 
    }, // Description of the plant
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically -- Kept it in this schema to track dates.
)
const PlantsData = mongoose.model('plants', plantsDataSchema)

module.exports = PlantsData
