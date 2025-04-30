const express = require("express");
const { plantChatbot } = require("../controllers/aiChatController");

const router = express.Router();

router.post("/ai-chat", plantChatbot);

module.exports = router;
