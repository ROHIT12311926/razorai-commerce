const { chatWithTools } = require('../services/gemini_service');

const chatWithAgent = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Message and sessionId are required',
      });
    }

    const aiReply = await chatWithTools(message, sessionId);

    res.status(200).json({
      success: true,
      reply: aiReply,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'AI agent failed to respond',
      error: error.message,
    });
  }
};

module.exports = { chatWithAgent };