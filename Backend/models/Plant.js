const mongoose = require('mongoose')

const PlantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 50,
    },
    nickname: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    image: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    acquiredDate: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    lastWatered:{

    },
    wateringFrequency:{}
    ,
    lastFertilized:{

    },
    fertilizingFrequency:{}
    ,
    location:{},
    notes:{},
    healthStatus:{},
  },
  { timestamps: true }
)

module.exports = mongoose.model('Plant', PlantSchema)
