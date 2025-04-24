const mongoose = require('mongoose')

//For farah and aya: In this schema, check if everything you want implemented in the frontend is present. If not, please create an issue in order to add it.
const questionsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    questionAsked: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['light', 'water', 'humidity', 'temperature', 'soil', 'difficulty', 'toxic', 'growth', 'propagation', 'description'], // I suggest using this as the "Title" for the question.
    },
    image: {
      type: String,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answers', // ✅ Corrected array of ObjectIds
      }
    ],
    editted: {
      type: Boolean,
      default: false,
    },
    reraised: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const Questions = mongoose.model('Questions', questionsSchema)

module.exports = Questions
