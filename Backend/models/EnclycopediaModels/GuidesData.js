const mongoose = require('mongoose')

//For farah and aya: In this schema, check if everything you want implemented in the frontend is present. If not, please create an issue in order to add it.
const guidesDataSchema = new mongoose.Schema(
  {
    title: { 
        type: String,
        required: true,
        unique: true,
    },
    body: {
        type: String,
        required: true,
    },
    category: { 
        type: String, 
        required: true,
        enum: ['light', 'water', 'humidity', 'temperature', 'soil', 'difficulty', 'toxic', 'growth', 'propagation', 'description'],
    },
    image: { 
        type: String, 
        required: false 
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically -- Kept it in this schema to track dates.
)

const GuidesData = mongoose.model('GuidesData', guidesDataSchema)

module.exports = GuidesData
