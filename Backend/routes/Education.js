const express = require('express')

const router = express.Router()

// controllers
const {
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

    //These should only be available to admins
    getAllGuidesData,
    getGuidesDataById,
    createGuidesData,
    updateGuidesData,
    deleteGuidesData
} = require('../controllers/educationController')

// middleware
const auth = require('../middleware/authentication')
const isAdmin = require('../middleware/admin')
const asyncWrapper = require('../middleware/async')

//Routes for the plants data
router.get('/plants', asyncWrapper(getAllPlantsData))
router.get('/plants/:id', asyncWrapper(getPlantsDataById))
router.post('/plants', isAdmin, asyncWrapper(createPlantsData))
router.patch('/plants/:id', auth, asyncWrapper(updatePlantsData))
router.delete('/plants/:id', auth, asyncWrapper(deletePlantsData))

//Routes for the questions data
router.get('/questions', asyncWrapper(getAllQuestionsData))
router.get('/questions/:id', asyncWrapper(getQuestionsDataById))
router.post('/questions', auth, asyncWrapper(createQuestionsData))
router.patch('/questions/:id', auth, asyncWrapper(updateQuestionsData))
router.delete('/questions/:id', auth, asyncWrapper(deleteQuestionsData))
router.get('/questions/user/:id', auth, asyncWrapper(getQuestionsFromUser))
router.post('/questions/reraise/:id', auth, asyncWrapper(reraiseQuestion))
router.post('/questions/undoreraise/:id', auth, asyncWrapper(undoReraiseQuestion))

//Routes for the answers data
router.get('/answers', asyncWrapper(getAllAnswersData))
router.get('/answers/:id', asyncWrapper(getAnswersDataById))
router.post('/answers', auth, asyncWrapper(createAnswersData))
router.patch('/answers/:id', auth, asyncWrapper(updateAnswersData))
router.delete('/answers/:id', auth, asyncWrapper(deleteAnswersData))
router.get('/answers/user/:id', auth, asyncWrapper(getAnswersFromUser))
router.post('/answers/upvote/:id', auth, asyncWrapper(upVoteAnswer))
router.post('/answers/downvote/:id', auth, asyncWrapper(downVoteAnswer))

//Routes for the guides data -- Made mutable only by admins, but can be searched for by all users.
router.get('/guides', asyncWrapper(getAllGuidesData))
router.get('/guides/:id', asyncWrapper(getGuidesDataById))
router.post('/guides', auth, isAdmin, asyncWrapper(createGuidesData))
router.patch('/guides/:id', auth, isAdmin, asyncWrapper(updateGuidesData))
router.delete('/guides/:id', auth, isAdmin, asyncWrapper(deleteGuidesData))

module.exports = router