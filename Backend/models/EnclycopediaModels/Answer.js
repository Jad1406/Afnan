const mongoose = require('mongoose')

//For farah and aya: In this schema, check if everything you want implemented in the frontend is present. If not, please create an issue in order to add it.
const answerSchema = new mongoose.Schema(
    {
      user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
      },
      body: {
          type: String,
          required: true,
          minlength: 10,
          maxlength: 2000,
      },
      questionAnswered: { 
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Questions',
          required: true,
      },
      upVotes: {
          type: Number,
          default: 0,
      },
      downVotes: {
          type: Number,
          default: 0,
      },
      editted: {
          type: Boolean,
          default: false,
      },
      upVotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
      downVotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
    },
    { timestamps: true }
  )
  
const Answers = mongoose.model('Answers', answerSchema)

module.exports = Answers
