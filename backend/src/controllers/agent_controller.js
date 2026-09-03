const { chatWithTools } = require('../services/gemini_service');

const chatWithAgent = async (req, res) => {
  try {
    console.log('=== CHAT REQUEST RECEIVED ===');
    console.log('BODY:', req.body);

    const { message, sessionId } = req.body;

    console.log('MESSAGE:', message);
    console.log('SESSION:', sessionId);

    if (!message || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Message and sessionId are required',
      });
    }

    console.log('=== CALLING GEMINI SERVICE ===');

    const result = await chatWithTools(
      message,
      sessionId
    );

    console.log('=== GEMINI RESULT ===');
    console.log(result);

    return res.status(200).json({
      success: true,
      reply: result.reply,
      paymentInfo: result.paymentInfo || null,
    });
  } catch (error) {
    console.error('=== AGENT CONTROLLER ERROR ===');
    console.error(error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: 'AI agent failed to respond',
      error: error.message,
    });
  }
};

module.exports = {
  chatWithAgent,
};