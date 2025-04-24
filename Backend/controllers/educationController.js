const PlantsData = require('../models/EnclycopediaModels/PlantsData.js');
const Questions = require('../models/EnclycopediaModels/Questions.js');
const Answers = require('../models/EnclycopediaModels/Answer.js');
const GuidesData = require('../models/EnclycopediaModels/GuidesData.js');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');

//CRUDs for plants data
//Get all plants data
const getAllPlantsData = async (req, res) => {
  try {
    const plantsData = await PlantsData.find({})
    res.status(StatusCodes.OK).json(plantsData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching plants data' })
  }
}

//Get plants data by id
const getPlantsDataById = async (req, res) => {
    const { id } = req.params
    try {
        const plantsData = await PlantsData.findById(id)
        if (!plantsData) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Plants data not found' })
        }
        res.status(StatusCodes.OK).json(plantsData)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching plants data' })
    }
}

//Create plants data
const createPlantsData = async (req, res) => {
  const { name, commercialName, category, image, light, water, humidity, temperature, soil, difficulty, toxic, growth, propagation, description } = req.body
  try {
        // Check if required fields are present
        if (
          !name || !category || !light || !water || !humidity ||
          !temperature || !soil || !difficulty || toxic === undefined ||
          !growth || !propagation || !description
        ) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Missing required fields' });
        }
        // Check for duplicate plant name
        const existingPlant = await PlantsData.findOne({ name });
        if (existingPlant) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Plant with this name already exists' });
        }
    
        // Enum validations
        const validCategories = ['foliage', 'flowering', 'succulent', 'cactus', 'herb', 'tree', 'vine', 'fern'];
        const validLight = ['low', 'medium', 'high'];
        const validDifficulty = ['easy', 'medium', 'hard'];
    
        if (!validCategories.includes(category)) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: `Invalid category. Valid options: ${validCategories.join(', ')}` });
        }
    
        if (!validLight.includes(light)) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: `Invalid light level. Valid options: ${validLight.join(', ')}` });
        }
    
        if (!validDifficulty.includes(difficulty)) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: `Invalid difficulty. Valid options: ${validDifficulty.join(', ')}` });
        }
    
        // Boolean check
        if (typeof toxic !== 'boolean') {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Toxic field must be a boolean (true or false)' });
        }
    
    const plantsData = await PlantsData.create({ name, commercialName, category, image, light, water, humidity, temperature, soil, difficulty, toxic, growth, propagation, description })
    res.status(StatusCodes.CREATED).json(plantsData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating plants data' })
  }
}

//Update plants data
const updatePlantsData = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid ID format' });
    }

    // Check if the plant exists
    const plant = await PlantsData.findById(id);
    if (!plant) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Plant not found' });
    }

    // Update only provided fields
    const updatedPlant = await PlantsData.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(StatusCodes.OK).json(updatedPlant);
  } catch (error) {
    console.error('Update error:', error); // 🔍 LOGGING ERROR
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error updating plant data' });
  }
};

//Delete plants data
const deletePlantsData = async (req, res) => {
  const { id } = req.params
  try {
    const plantsData = await PlantsData.findByIdAndDelete(id)
    if (!plantsData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Plants data not found' })
    }
    res.status(StatusCodes.OK).json({ message: 'Plants data deleted successfully' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error deleting plants data' })
  }
}

// Get all questions
const getAllQuestionsData = async (req, res) => {
  try {
    const questionsData = await Questions.find({})
    res.status(StatusCodes.OK).json(questionsData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching questions data' })
  }
}

// Get question by ID
const getQuestionsDataById = async (req, res) => {
  const { id } = req.params
  const userId = req.user._id; // Assuming req.user contains the authenticated user's details

  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid ID format' });
    }

    // Fetch question from the database
    const questionsData = await Questions.findById(id)
    if (!questionsData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Question not found' });
    }

    // Respond with the question data
    res.status(StatusCodes.OK).json(questionsData);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching question' });
  }
}


// Create question
const createQuestionsData = async (req, res) => {
  const { questionAsked, body, category, image, user } = req.body;

  // Validate required fields
  if (!questionAsked || questionAsked.trim().length < 5) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Question title is required and must be at least 5 characters long' })
  }

  if (!body || body.trim().length < 10) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Question body is required and must be at least 10 characters long' })
  }

  if (!category || category.trim() === '') {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Category is required' })
  }

  try {
    const questionsData = await Questions.create({
      // user: req.user._id,
      user,
      questionAsked: questionAsked.trim(),
      body: body.trim(),
      category: category.trim().toLowerCase(),
      image: image || null
    })
    res.status(StatusCodes.CREATED).json(questionsData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating question' })
  }
}

// Update question (if within 24 hours)
const updateQuestionsData = async (req, res) => {
  const { id } = req.params
  const { body, image } = req.body // Only allow editing the body and image

  try {
    const question = await Questions.findById(id)
    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Question not found' })
    }

    // Check if the question was created less than 24 hours ago
    const createdTime = new Date(question.createdAt).getTime()
    const currentTime = Date.now()

    if (currentTime - createdTime > 24 * 60 * 60 * 1000) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Cannot edit question after 24 hours' })
    }

    // Prepare updates, allowing only the body and image to be edited
    const updates = {}

    if (body) {
      if (body.trim().length >= 10) {
        updates.body = body.trim()
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Body must be at least 10 characters long' })
      }
    }

    if (image !== undefined) {
      updates.image = image || null // Allow removing the image by passing null or empty
    }

    if (Object.keys(updates).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No valid fields to update' })
    }

    // Apply the updates
    const updatedQuestion = await Questions.findByIdAndUpdate(
      id,
      { ...updates, editted: true },
      { new: true }
    )

    res.status(StatusCodes.OK).json(updatedQuestion)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error updating question' })
  }
}

// Delete question
const deleteQuestionsData = async (req, res) => {
  const { id } = req.params
  try {
    const deletedQuestion = await Questions.findByIdAndDelete(id)
    if (!deletedQuestion) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Question not found' })
    }
    res.status(StatusCodes.OK).json({ message: 'Question deleted successfully' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error deleting question' })
  }
}

// Get all questions by a specific user
const getQuestionsFromUser = async (req, res) => {
  const { userId } = req.params
  try {
    const userQuestions = await Questions.find({ user: userId })
    res.status(StatusCodes.OK).json(userQuestions)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching user questions' })
  }
}

// Reraise question (increment)
// Reraise question (increment and track users who reraised)
const reraiseQuestion = async (req, res) => {
  const { id } = req.params
  const userId = req.user._id // Assuming req.user contains the logged-in user's details

  try {
    const question = await Questions.findById(id)
    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Question not found' })
    }

    // Check if the user has already reraised the question
    if (question.reraisedBy.includes(userId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'You have already reraised this question' })
    }

    // Add the user to the reraisedBy array and increment reraised count
    question.reraisedBy.push(userId)
    question.reraised += 1

    const updatedQuestion = await question.save()
    res.status(StatusCodes.OK).json(updatedQuestion)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error reraising question' })
  }
}


// Undo reraise (decrement and remove user)
const undoReraiseQuestion = async (req, res) => {
  const { id } = req.params
  const userId = req.user._id // Assuming req.user contains the logged-in user's details

  try {
    const question = await Questions.findById(id)
    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Question not found' })
    }

    // Check if the user has already reraised the question
    if (!question.reraisedBy.includes(userId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'You have not reraised this question' })
    }

    // Remove the user from the reraisedBy array and decrement the reraised count
    question.reraisedBy = question.reraisedBy.filter(user => user.toString() !== userId.toString())
    question.reraised -= 1

    const updatedQuestion = await question.save()
    res.status(StatusCodes.OK).json(updatedQuestion)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error undoing reraise' })
  }
}

//CRUDS for answers data
// Get all answers
const getAllAnswersData = async (req, res) => {
  try {
    const answers = await Answers.find({});
    res.status(StatusCodes.OK).json(answers);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching answers' });
  }
};

// Get answer by ID
const getAnswersDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const answer = await Answers.findById(id);
    if (!answer) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Answer not found' });
    }
    res.status(StatusCodes.OK).json(answer);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching answer' });
  }
};

// Create a new answer
const createAnswersData = async (req, res) => {
  const { user, question, body } = req.body;

  // Check for missing required fields
  if (!user || !question || !body) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'User, question, and body are required' });
  }

  try {
    // Check if the question exists
    const foundQuestion = await Questions.findById(question);
    if (!foundQuestion) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Question not found' });
    }

    // Create a new answer
    const newAnswer = await Answers.create({ user, question, body });
    res.status(StatusCodes.CREATED).json(newAnswer);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating answer' });
  }
};

// Update an existing answer
const updateAnswersData = async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;

  // Check for missing body field
  if (!body) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Body is required to update the answer' });
  }

  const updatedFields = { body, edited: true };

  try {
    // Check if the answer exists
    const existingAnswer = await Answers.findById(id);
    if (!existingAnswer) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Answer not found' });
    }

    // Optional: Implement time-based editing logic (24 hours)
    const createdTime = new Date(existingAnswer.createdAt).getTime();
    const currentTime = Date.now();

    // Check if more than 24 hours have passed since the answer was created
    if (currentTime - createdTime > 24 * 60 * 60 * 1000) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Cannot edit answer after 24 hours' });
    }

    // Update the answer
    const updatedAnswer = await Answers.findByIdAndUpdate(id, updatedFields, { new: true });
    res.status(StatusCodes.OK).json(updatedAnswer);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error updating answer' });
  }
};


// Delete answer
const deleteAnswersData = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Answers.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Answer not found' });
    }
    res.status(StatusCodes.OK).json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error deleting answer' });
  }
};

// Get all answers from a specific user
const getAnswersFromUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const answers = await Answers.find({ user: userId });
    if (answers.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'No answers found for this user' });
    }
    res.status(StatusCodes.OK).json(answers);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching user answers' });
  }
};

// Upvote an answer
const upVoteAnswer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id // Assuming req.user contains the logged-in user's details

  try {
    const answer = await Answers.findById(id);
    if (!answer) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Answer not found' });
    }

    // Check if the user has already upvoted the answer
    if (answer.upVotedBy.includes(userId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'You have already upvoted this answer' });
    }

    // If the user previously downvoted, remove them from the downvoted list
    if (answer.downVotedBy.includes(userId)) {
      answer.downVotedBy = answer.downVotedBy.filter(user => user.toString() !== userId.toString());
      answer.downVotes -= 1; // Decrement downvotes
    }

    // Add the user to the upvoted list and increment the upvote count
    answer.upVotedBy.push(userId);
    answer.upVotes += 1;

    const updatedAnswer = await answer.save();
    res.status(StatusCodes.OK).json(updatedAnswer);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error upvoting answer' });
  }
};

// Downvote an answer
const downVoteAnswer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id // Assuming req.user contains the logged-in user's details

  try {
    const answer = await Answers.findById(id);
    if (!answer) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Answer not found' });
    }

    // Check if the user has already downvoted the answer
    if (answer.downVotedBy.includes(userId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'You have already downvoted this answer' });
    }

    // If the user previously upvoted, remove them from the upvoted list
    if (answer.upVotedBy.includes(userId)) {
      answer.upVotedBy = answer.upVotedBy.filter(user => user.toString() !== userId.toString());
      answer.upVotes -= 1; // Decrement upvotes
    }

    // Add the user to the downvoted list and increment the downvote count
    answer.downVotedBy.push(userId);
    answer.downVotes += 1;

    const updatedAnswer = await answer.save();
    res.status(StatusCodes.OK).json(updatedAnswer);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error downvoting answer' });
  }
};
// Get all guides data
const getAllGuidesData = async (req, res) => {
  try {
    const guidesData = await GuidesData.find({});
    res.status(StatusCodes.OK).json(guidesData);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching guides data' });
  }
};

// Get guides data by id
const getGuidesDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const guidesData = await GuidesData.findById(id);
    if (!guidesData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Guides data not found' });
    }
    res.status(StatusCodes.OK).json(guidesData);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching guides data' });
  }
};

// Create guides data
const createGuidesData = async (req, res) => {
  const { title, body, category, image } = req.body;

  // Input validation
  if (!title || !body || !category) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Title, body, and category are required' });
  }

  // Optional: Check if category is valid (you can add your own categories)
  const validCategories = ['General', 'Tutorial', 'FAQ', 'Advanced']; // Example categories
  if (!validCategories.includes(category)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid category' });
  }

  try {
    const guidesData = await GuidesData.create({ title, body, category, image });
    res.status(StatusCodes.CREATED).json(guidesData);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating guides data' });
  }
};

// Update guides data
const updateGuidesData = async (req, res) => {
  const { title, body, category, image } = req.body;

  // Input validation
  if (!title || !body || !category) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Title, body, and category are required to update' });
  }

  // Optional: Check if category is valid
  const validCategories = ['General', 'Tutorial', 'FAQ', 'Advanced'];
  if (!validCategories.includes(category)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid category' });
  }

  try {
    const guidesData = await GuidesData.findByIdAndUpdate(
      req.params.id,
      { title, body, category, image },
      { new: true }
    );
    if (!guidesData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Guides data not found' });
    }
    res.status(StatusCodes.OK).json(guidesData);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error updating guides data' });
  }
};

// Delete guides data
const deleteGuidesData = async (req, res) => {
  const { id } = req.params;
  try {
    const guidesData = await GuidesData.findByIdAndDelete(id);
    if (!guidesData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Guides data not found' });
    }
    res.status(StatusCodes.OK).json({ message: 'Guides data deleted successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error deleting guides data' });
  }
};



module.exports = {
  getAllPlantsData,
  getPlantsDataById,
  createPlantsData,
  updatePlantsData,
  deletePlantsData,

  getAllQuestionsData,
  getQuestionsDataById,
  createQuestionsData,
  updateQuestionsData,
  deleteQuestionsData,
  getQuestionsFromUser,
  reraiseQuestion,
  undoReraiseQuestion,

  getAllAnswersData,
  getAnswersDataById,
  createAnswersData,
  updateAnswersData,
  deleteAnswersData,
  getAnswersFromUser,
  upVoteAnswer,
  downVoteAnswer,


  getAllGuidesData,
  getGuidesDataById,
  createGuidesData,
  updateGuidesData,
  deleteGuidesData
}