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
      minlength: 10,
      maxlength: 150,
    },
    body: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      enum: ['light', 'water', 'humidity', 'temperature', 'soil', 'difficulty', 'toxic', 'growth', 'propagation', 'description'],
    },
    image: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(v);
        },
        message: props => `${props.value} is not a valid image URL!`
      },
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answers',
      }
    ],
    editted: {
      type: Boolean,
      default: false,
    },
    reraisedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reraised: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const Questions = mongoose.model('Questions', questionsSchema)

module.exports = Questions
