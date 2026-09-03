require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');

const {
  toolDefinitions,
  executeSearchProducts,
  executeGetProductDetails,
  executeAddToCart,
  executeRemoveFromCart,
  executeCheckout
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
- Suggest relevant add-on products when appropriate
- Be friendly, concise, and helpful

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

  return { error: 'Unknown tool' };
};

const chatWithTools = async (userMessage, sessionId) => {

  let paymentInfo = null;


  // 1. User ka message
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: userMessage,
        },
      ],
    },
  ];

  // 2. Gemini ko request
  let response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',

    contents,

    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: toolDefinitions,
    },
  });

  // 3. Gemini ke response ke parts
  let parts = response.candidates[0].content.parts;

  // 4. Jab tak Gemini tool call karta rahe
  while (true) {

    const functionCallPart = parts.find(
      (part) => part.functionCall
    );

    // Agar function call nahi hai,
    // iska matlab final text mil gaya
    if (!functionCallPart) {
      return {

        reply: response.text,
    paymentInfo: paymentInfo,
      };
    }

    // 5. Gemini ne kaunsa function call kiya?
    const functionCall = functionCallPart.functionCall;

    console.log('=== FUNCTION CALL ===');
    console.log(functionCall);

    // 6. Apna actual backend function execute karo
    const toolResult = await executeToolCall(
      functionCall,
      sessionId
    );

    console.log('=== TOOL RESULT ===');
    console.log(toolResult);

    if (functionCall.name === 'checkout' && toolResult.success) {
  paymentInfo = toolResult;
}

    // 7. Gemini ke previous response ko conversation mein add karo
    contents.push({
      role: 'model',
      parts: parts,
    });

    // 8. Tool ka result Gemini ko do
    contents.push({
      role: 'user',
      parts: [
        {
          functionResponse: {
            name: functionCall.name,
            response: {
              result: toolResult,
            },
          },
        },
      ],
    });

    // 9. Gemini ko dobara call karo
    response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents,

      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: toolDefinitions,
      },
    });

    // 10. New response ke parts nikalo
    parts = response.candidates[0].content.parts;
  }
};

module.exports = { chatWithTools };