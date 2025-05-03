const openai = require("../utils/openaiClient");

const plantChatbot = async (req, res) => {
  const { message } = req.body;

  try {
    // Very simple plant-topic check
    const isPlantRelated = /plant|leaf|leaves|soil|water|pot|sunlight|yellow|green|root|flower/i.test(message);

    if (!isPlantRelated) {
      return res.status(200).json({ response: "Sorry, I can only help with plants." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "You are a helpful plant care assistant. Only respond to plant-related issues. If not plant-related, say 'Sorry I can only help with plants.'",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.status(200).json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("AI Chatbot Error:", error.message);
    res.status(500).json({ error: "Something went wrong while processing your message." });
  }
};

module.exports = { plantChatbot };
