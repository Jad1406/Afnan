const PlantsData = require('../models/EnclycopediaModels/PlantsData.js');
const Questions = require('../models/EnclycopediaModels/Questions.js');
const Answers = require('../models/EnclycopediaModels/Answer.js');
const GuidesData = require('../models/EnclycopediaModels/GuidesData.js');
const { StatusCodes } = require('http-status-codes');

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
  const { name, commertialName, category, image, light, water, humidity, temperature, soil, difficulty, toxic, growth, propagation, description } = req.body
  try {
    const plantsData = await PlantsData.create({ name, commertialName, category, image, light, water, humidity, temperature, soil, difficulty, toxic, growth, propagation, description })
    res.status(StatusCodes.CREATED).json(plantsData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating plants data' })
  }
}
//Update plants data
const updatePlantsData = async (req, res) => {
  const { id } = req.params
  const { name, commertialName, category, image, light, water, humidity, temperature, soil, difficulty, toxic, growth, propagation, description } = req.body
  try {
    const plantsData = await PlantsData.findByIdAndUpdate(id, { name, commertialName, category, image, light, water, humidity, temperature, soil, difficulty, toxic, growth, propagation, description }, { new: true })
    if (!plantsData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Plants data not found' })
    }
    res.status(StatusCodes.OK).json(plantsData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error updating plants data' })
  }
}
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

//CRUDs for questions data
//Get all questions data
const getAllQuestionsData = async (req, res) => {
  try {
    const questionsData = await Questions.find({})
    res.status(StatusCodes.OK).json(questionsData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching questions data' })
  }
}

//Get questions data by id
const getQuestionsDataById = async (req, res) => {
    const { id } = req.params
    try {
        const questionsData = await Questions.findById(id)
        if (!questionsData) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Questions data not found' })
        }
        res.status(StatusCodes.OK).json(questionsData)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching questions data' })
    }
    }

//Create questions data
const createQuestionsData = async (req, res) => {
  const { title, body, category, image } = req.body
  try {
    const questionsData = await Questions.create({ title, body, category, image })
    res.status(StatusCodes.CREATED).json(questionsData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating questions data' })
  }
}
//Update questions data
//For farah and aya: If you do not want to allow a question to be editted, tell me to remove. I'll make it so that
//only if it has been created since the last 24 hours, it can be editted.
const updateQuestionsData = async (req, res) => {

  const { id } = req.params
  const { title, body, category, image } = req.body
  currentTime = new Date().getTime();
  console.log("The current time is: " + currentTime);
  
  try {
    const questionID =  await Questions.findById(id);
    if(currentTime - questionID.createdAt > 86400000) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'You cannot edit this question after 24 hours' })
    }else{
      const questionsData = await Questions.findByIdAndUpdate(id, { title, body, category, image }, { new: true })
      if (!questionsData) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Questions data not found' })
      }
      res.status(StatusCodes.OK).json(questionsData)
    }
    
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error updating questions data' })
  }
}
//Delete questions data
const deleteQuestionsData = async (req, res) => {
  const { id } = req.params
  try {
    const questionsData = await Questions.findByIdAndDelete(id)
    if (!questionsData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Questions data not found' })
    }
    res.status(StatusCodes.OK).json({ message: 'Questions data deleted successfully' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error deleting questions data' })
  }
}

const getQuestionsFromUser = async (req, res) => {
  const { userId } = req.params
  try {
    //To find the questions data by user id.
    const questionsData = await Questions.find({ userId: userId })
    if (!questionsData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Questions data not found' })
    }
    res.status(StatusCodes.OK).json(questionsData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching questions data' })
  }
}

//2 functions to upvote and downvote the questions
const reraiseQuestion = async (req, res) => {
  const { id } = req.params
  try {
    const questionsData = await Questions.findByIdAndUpdate(id, { $inc: { reraised: 1 } }, { new: true })
    if (!questionsData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Questions data not found' })
    }
    res.status(StatusCodes.OK).json(questionsData)
  }catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error upvoting questions data' })
  } 
}

const undoReraiseQuestion = async (req, res) => {
  const { id } = req.params
  try {
    const questionsData = await Questions.findByIdAndUpdate(id, { $inc: { reraised: -1 } }, { new: true })
    if (!questionsData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Questions data not found' })
    }
    res.status(StatusCodes.OK).json(questionsData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error undoing reraise' })
  }
}

//CRUDs for answers data
//Get all answers data per user id
const getAllAnswersData = async (req, res) => {
  try {
    const answersData = await Answers.find({})
    res.status(StatusCodes.OK).json(answersData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching answers data' })
  }
}

const getAnswersDataById = async (req, res) => {
  const { id } = req.params
  try {
    const answersData = await Answers.findById(id)
    if (!answersData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Answers data not found' })
    }
    res.status(StatusCodes.OK).json(answersData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching answers data' })
  }
}

//Create answers data
const createAnswersData = async (req, res) => {
  //We are getting the userId to know who answered the question.
  //We are getting the questionId to know which question was answered.
  const { user, question, body } = req.body
  try {
    const answersData = await Answers.create({ user, question, body })
    res.status(StatusCodes.CREATED).json(answersData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating answers data' })
  }
}

//Update answers data
const updateAnswersData = async (req, res) => {
  const { id } = req.params
  const { user, question, body } = req.body
  const editted = true
  try {
    const answersData = await Answers.findByIdAndUpdate(id, { user, question, body, editted }, { new: true })
    if (!answersData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Answers data not found' })
    }
    res.status(StatusCodes.OK).json(answersData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error updating answers data' })
  }
}

//Delete answers data
const deleteAnswersData = async (req, res) => {
  const { id } = req.params
  try {
    const answersData = await Answers.findByIdAndDelete(id)
    if (!answersData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Answers data not found' })
    }
    res.status(StatusCodes.OK).json({ message: 'Answers data deleted successfully' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error deleting answers data' })
  }
}
//Get answers from user
//This one, and the one for the questions are in case the users want to view all his/her questions/answers and delete/update them
const getAnswersFromUser = async (req, res) => {
  const { userId } = req.params
  try {
    //To find the answers data by user id.
    const answersData = await Answers.find({ userId: userId })
    if (!answersData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Answers data not found' })
    }
    res.status(StatusCodes.OK).json(answersData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching answers data' })
  }
}

//2 functions to upvote and downvote the answers
const upVoteAnswer = async (req, res) => {
  const { id } = req.params
  try {
    const answerData = await Answers.findByIdAndUpdate(id, { $inc: { upVotes: 1 } }, { new: true })
    if (!answerData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Answer not found' })
    }
    res.status(StatusCodes.OK).json(answerData)
  }catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error upvoting questions data' })
  } 
}


const downVoteAnswer = async (req, res) => {
  const { id } = req.params
  try {
    const answerData = await Answers.findByIdAndUpdate(id, { $inc: { downVotes: -1 } }, { new: true })
    if (!answerData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Answer not found' })
    }
    res.status(StatusCodes.OK).json(answerData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error downvoting answer' })
  }
}


//CRUDs for guides data
//Get all guides data
const getAllGuidesData = async(req,res) =>{
  try{
    const guidesData = await GuidesData.find({})
    res.status(StatusCodes.OK).json(guidesData)
  }catch(error){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching guides data' })
  } 
}

//Get guides data by id
const getGuidesDataById = async (req, res) => {
  const { id } = req.params
  try{
    const { guidesData } = await GuidesData.findById(id)
    if (!guidesData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Guides data not found' })
    }
  }catch(error){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching guides data' })
  }
}

//Create guides data
const createGuidesData = async (req, res) => {
  const { title, body, category, image } = req.body
  try {
    const guidesData = await GuidesData.create({ title, body, category, image })
    res.status(StatusCodes.CREATED).json(guidesData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating guides data' })
  }
}
//Update guides data
const updateGuidesData = async (req, res) => {
  const { title, body, category, image } = req.body
  try {
    const guidesData = await GuidesData.findByIdAndUpdate({ title, body, category, image }, { new: true })
    if (!guidesData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Guides data not found' })
    }
    res.status(StatusCodes.OK).json(guidesData)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error updating guides data' })
  }
}

//Delete guides data
const deleteGuidesData = async (req, res) => {
  const { id } = req.params
  try {
    const guidesData = await GuidesData.findByIdAndDelete(id)
    if (!guidesData) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Guides data not found' })
    }
    res.status(StatusCodes.OK).json({ message: 'Guides data deleted successfully' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error deleting guides data' })
  }
}


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