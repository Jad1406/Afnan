const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nickname: String,
  acquiredDate: { type: Date }, 
  lastWatered: { type: Date },  
  wateringFrequency: { type: Number, default: 7 },
  lastFertilized: { type: Date },
  fertilizingFrequency: { type: Number, default: 30 },
  location: String,
  notes: String,
  healthStatus: { type: String, enum: ['healthy', 'needsAttention', 'declining'], default: 'healthy' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional for now
});

module.exports = mongoose.model('Plant', PlantSchema);
