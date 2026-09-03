require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');

const Conversation = require('../models/Conversations');

const {
  toolDefinitions,
  executeSearchProducts,
  executeGetProductDetails,
  executeAddToCart,
  executeRemoveFromCart,
  executeCheckout,
  handleGetUpsellRecommendations,
  checkCartThresholds
} = require('./agent_tools');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_INSTRUCTION = `You are RazorAI, a helpful shopping assistant for TechStore, an electronics retailer.

Your job is to:
- Help customers find products that match their needs using the search_products tool
- Use get_product_details when you need more info about a specific product
- Use add_to_cart when the customer confirms they want to buy something
- Use remove_from_cart when the customer asks to remove an item from their cart
- Use checkout when the customer explicitly asks to buy, checkout, pay, or purchase the items in the cart
- Never call checkout automatically just because items are added to the cart
- If checkout requires approval, clearly tell the customer that human approval is required
- Recommend the best products within their budget
- After a customer adds a product to the cart, consider using get_upsell_recommendations to suggest 1-2 relevant complementary products
- Only suggest products returned by the get_upsell_recommendations tool
- Never invent products, prices, stock, or discounts
- Do not repeatedly suggest upsells after the customer declines
- Be friendly, concise, and helpful
- When add_to_cart returns thresholdInfo, pay attention to thresholdInfo.nudge and naturally communicate that nudge to the customer.
- If the nudge suggests adding more items, do not automatically add anything. Let the customer decide.
- Never claim Free Delivery or autonomous checkout is available unless the thresholdInfo confirms it.

Always be honest about product availability and pricing. Do not make up products or prices that don't exist.`;

const executeToolCall = async (functionCall, sessionId) => {
  const { name, args } = functionCall;

  if (name === 'search_products') {
    return await executeSearchProducts(args);
  }

  if (name === 'get_product_details') {
    return await executeGetProductDetails(args);
  }

  if (name === 'add_to_cart') {
    return await executeAddToCart(args, sessionId);
  }

  if (name === 'remove_from_cart') {
    return await executeRemoveFromCart(args, sessionId);
  }

  if (name === 'checkout') {
    return await executeCheckout(args, sessionId);
  }

  if (name === 'get_upsell_recommendations') {
    return await handleGetUpsellRecommendations(args);
  }

  if (name === 'check_cart_thresholds') {
    return checkCartThresholds(args.cartTotal);
  }

  return { error: 'Unknown tool' };
};


const chatWithTools = async (userMessage, sessionId) => {

  let paymentInfo = null;

  // ==========================================
  // 1. GET OR CREATE CONVERSATION
  // ==========================================

  let conversation = await Conversation.findOne({ sessionId });

  if (!conversation) {
    conversation = await Conversation.create({
      sessionId,
      messages: [],
    });
  }

  // ==========================================
  // 2. ADD USER MESSAGE TO HISTORY
  // ==========================================

  conversation.messages.push({
    role: 'user',
    parts: [
      {
        text: userMessage,
      },
    ],
  });

  await conversation.save();

  // ==========================================
  // 3. CONVERT DB HISTORY TO GEMINI CONTENTS
  // ==========================================

  const contents = conversation.messages.map((message) => ({
    role: message.role,
    parts: message.parts,
  }));

  // ==========================================
  // 4. FIRST GEMINI REQUEST
  // ==========================================

  let response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',

    contents,

    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: toolDefinitions,
    },
  });

  let parts = response.candidates[0].content.parts;

  // ==========================================
  // 5. TOOL CALL LOOP
  // ==========================================

  while (true) {

    const functionCallPart = parts.find(
      (part) => part.functionCall
    );

    // ========================================
    // NO TOOL CALL → FINAL RESPONSE
    // ========================================

    if (!functionCallPart) {

      const assistantText = response.text;

      // Save final assistant response
      conversation.messages.push({
        role: 'model',
        parts: parts,
      });

      await conversation.save();

      return {
        reply: assistantText,
        paymentInfo,
      };
    }

    // ========================================
    // GEMINI TOOL CALL
    // ========================================

    const functionCall = functionCallPart.functionCall;

    console.log('=== FUNCTION CALL ===');
    console.log(functionCall);

    // ========================================
    // EXECUTE TOOL
    // ========================================

    const toolResult = await executeToolCall(
      functionCall,
      sessionId
    );

    console.log('=== TOOL RESULT ===');
    console.log(toolResult);

    // ========================================
    // CHECKOUT PAYMENT INFO
    // ========================================

    if (
      functionCall.name === 'checkout' &&
      toolResult.success
    ) {
      paymentInfo = toolResult;
    }

    // ========================================
    // ADD GEMINI TOOL CALL TO DB HISTORY
    // ========================================

    conversation.messages.push({
      role: 'model',
      parts: parts,
    });

    // ========================================
    // ADD TOOL RESULT TO DB HISTORY
    // ========================================

    const functionResponsePart = {
      functionResponse: {
        name: functionCall.name,
        response: {
          result: toolResult,
        },
      },
    };

    conversation.messages.push({
      role: 'user',
      parts: [
        functionResponsePart,
      ],
    });

    await conversation.save();

    // ========================================
    // ADD TO CURRENT GEMINI CONTEXT
    // ========================================

    contents.push({
      role: 'model',
      parts: parts,
    });

    contents.push({
      role: 'user',
      parts: [
        functionResponsePart,
      ],
    });

    // ========================================
    // ASK GEMINI AGAIN
    // ========================================

    response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',

      contents,

      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: toolDefinitions,
      },
    });

    parts = response.candidates[0].content.parts;
  }
};


module.exports = {
  chatWithTools,
};