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

    const result = await chatWithTools(message, sessionId);

    console.log('=== AGENT RESULT ===');
console.log(result);

    res.status(200).json({
      success: true,
      reply: result.reply,
      paymentInfo: result.paymentInfo,
    });
  } catch (error) {
  console.error('=== AGENT CONTROLLER ERROR ===');
  console.error(error);
  console.error(error.stack);

  res.status(500).json({
    success: false,
    message: 'AI agent failed to respond',
    error: error.message,
  });
}
};

module.exports = { chatWithAgent };