const mongoose = require('mongoose')

//For farah and aya: In this schema, check if everything you want implemented in the frontend is present. If not, please create an issue in order to add it.
const answerSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // We will reference everypost to a user to know who answered
    },
    body: {
        type: String,
        required: true, // We do not want to allow any empty replies.
    },
    questionAnswered: { 
        type: mongoose.Schema.Types.ObjectId,  // ✅ Fixed from Array to ObjectId
        ref: 'Questions', // Reference to the Questions model to know what question this answer belongs to
        required: false,
    },
    upVotes:{
        type: Number,
        default: 0,
        required: false,
    },
    downVotes:{
        type: Number,
        default: 0,
        required: false,
    },
    editted:{
        type: Boolean,
        default: false,
        required: false,
    }
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically -- Kept it in this schema to track dates.
)

const Answers = mongoose.model('Answers', answerSchema)

module.exports = Answers
