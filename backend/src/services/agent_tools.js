const Product = require('../models/Product');
const Cart = require('../models/Cart');
const crypto = require('crypto');

const Order = require('../models/Order');
const { checkTransactionLimit } = require('../services/guardrails_service');
const { createRazorpayOrder } = require('../services/razorpay_service');
const { logEvent } = require('../services/audit_service');

const generateCheckoutSignature = (sessionId, cartItems) => {
  const sortedItems = cartItems
    .map((item) => `${item.product._id}:${item.quantity}`)
    .sort()
    .join('|');

    const rawString = `${sessionId}|${sortedItems}`;

    return crypto.createHash('sha256').update(rawString).digest('hex');
};

const toolDefinitions = [
  {
    functionDeclarations: [
      {
        name: 'search_products',
        description:
          'Search for products in the catalog by keyword (name, description, or category)',
        parameters: {
          type: 'object',
          properties: {
            keyword: {
              type: 'string',
              description:
                'The search term, e.g. "keyboard", "wireless mouse"',
            },
          },
          required: ['keyword'],
        },
      },

      {
        name: 'get_product_details',
        description:
          'Get full details of a specific product using its ID',
        parameters: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description: 'The MongoDB ID of the product',
            },
          },
          required: ['productId'],
        },
      },

      {
        name: 'add_to_cart',
        description: 'Add a product to the customer cart',
        parameters: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description: 'The MongoDB ID of the product to add',
            },
            quantity: {
              type: 'number',
              description: 'How many units to add, default is 1',
            },
          },
          required: ['productId'],
        },
      },

      {
  name: 'remove_from_cart',
  description: 'Remove a product from the customer cart',
  parameters: {
    type: 'object',
    properties: {
      productId: {
        type: 'string',
        description: 'The MongoDB ID of the product to remove',
      },
    },
    required: ['productId'],
  },
},

{
  name: 'checkout',
  description:
    'Initiate checkout and payment for the current cart. ONLY call this when the customer explicitly says things like "buy this", "checkout", "pay now", or "purchase everything in my cart". Do not call this just because items were added to cart.',
  parameters: {
    type: 'object',
    properties: {},
  },
},
    ],
  },
];

// ==================== SEARCH PRODUCTS ====================

const executeSearchProducts = async ({ keyword }) => {
  const products = await Product.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } },
    ],
  });

  return products.map((p) => ({
    id: p._id,
    name: p.name,
    price: p.price,
    stock: p.stock,
    features: p.features,
  }));
};

// ==================== GET PRODUCT DETAILS ====================

const executeGetProductDetails = async ({ productId }) => {
  const product = await Product.findById(productId);

  if (!product) {
    return {
      error: 'Product not found',
    };
  }

  return {
    id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    features: product.features,
  };
};

// ==================== ADD TO CART ====================

const executeAddToCart = async (
  { productId, quantity = 1 },
  sessionId
) => {
  const product = await Product.findById(productId);

  if (!product) {
    return {
      error: 'Product not found',
    };
  }

  if (product.stock < quantity) {
    return {
      error: `Only ${product.stock} units available in stock`,
    };
  }

  let cart = await Cart.findOne({
    session_id: sessionId,
    status: 'active',
  });

  if (!cart) {
    cart = await Cart.create({
      session_id: sessionId,
      item: [],
    });
  }

  const existingItemIndex = cart.item.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    cart.item[existingItemIndex].quantity += quantity;
  } else {
    cart.item.push({
      product: product._id,
      quantity: quantity,
      priceAtAdd: product.price,
    });
  }

  await cart.save();

  // Calculate current cart total
  const totalAmount = cart.item.reduce(
    (total, item) =>
      total + item.priceAtAdd * item.quantity,
    0
  );

  return {
    success: true,
    message: `Added ${quantity} x ${product.name} to cart`,
    totalAmount: totalAmount,
  };
};

const executeRemoveFromCart = async ({ productId }, sessionId) => {
  try {
    console.log('=== REMOVE CART ===');
    console.log('productId:', productId);
    console.log('sessionId:', sessionId);

    const cart = await Cart.findOne({
      session_id: sessionId,
      status: 'active',
    });

    console.log('cart:', cart);

    if (!cart) {
      return {
        error: 'Cart not found',
      };
    }

    const itemExists = cart.item.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return {
        error: 'Item not found in cart',
      };
    }

    cart.item = cart.item.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    return {
      success: true,
      message: 'Item removed from cart',
    };

  } catch (error) {
    console.log('REMOVE CART ERROR:', error);

    return {
      success: false,
      error: error.message,
    };
  }
};

// ==================== CHECKOUT ====================

const executeCheckout = async (args, sessionId) => {
  try {
    const cart = await Cart.findOne({
      session_id: sessionId,
      status: 'active',
    }).populate('item.product');

    if (!cart || cart.item.length === 0) {
      return { error: 'Cart is empty, nothing to checkout' };
    }

     const signature = generateCheckoutSignature(sessionId, cart.item);
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    const existingOrder = await Order.findOne({
      session_Id: sessionId,
      checkoutSignature: signature,
      createdAt: { $gte: twoMinutesAgo },
    });

    if (existingOrder) {
      console.log('=== DUPLICATE CHECKOUT DETECTED, RETURNING EXISTING ORDER ===');

      if (existingOrder.required_Approval) {
        return {
          success: true,
          requiresApproval: true,
          totalAmount: existingOrder.total_price,
          message: 'This checkout is already pending approval. Please check the Checkout page.',
        };
      }

      return {
        success: true,
        requiresApproval: false,
        orderId: existingOrder._id.toString(),
        razorpayOrderId: existingOrder.razorpay_order_Id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        totalAmount: existingOrder.total_price,
        message: 'Payment is already ready. Opening secure Razorpay Checkout.',
      };
    }

    let total = 0;
    const orderItems = cart.item.map((item) => {
      total += item.priceAtAdd * item.quantity;
      return {
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.priceAtAdd,
      };
    });

    const guardrailCheck = await checkTransactionLimit(total, sessionId);

    const order = await Order.create({
      session_Id: sessionId,
      item: orderItems,
      total_price: total,
      razorpay_order_Id: `pending_${Date.now()}`,
      status: 'created',
      required_Approval: guardrailCheck.requiresApproval,
       checkoutSignature: signature,
    });

    await logEvent({
      action: 'checkout_initiated',
      actor: 'ai',
      amount: total,
      reason: `AI-initiated checkout with ${orderItems.length} item(s)`,
      relatedOrder: order._id,
      sessionId: sessionId,
      approvalStatus: guardrailCheck.requiresApproval ? 'pending' : 'not_required',
      result: 'success',
    });

    if (guardrailCheck.requiresApproval) {
      return {
        success: true,
        requiresApproval: true,
        totalAmount: total,
        reason: guardrailCheck.reason,
        message:
          'This amount exceeds the autonomous limit and requires human approval. Please go to the Checkout page to approve.',
      };
    }

    const razorpayOrder = await createRazorpayOrder(total, order._id.toString());
    order.razorpay_order_Id = razorpayOrder.id;
    await order.save();

    await logEvent({
      action: 'payment_order_created',
      actor: 'system',
      amount: total,
      reason: 'Razorpay order created via AI checkout, within autonomous limit',
      relatedOrder: order._id,
      sessionId: sessionId,
      result: 'success',
    });

    return {
      success: true,
      requiresApproval: false,
      orderId: order._id.toString(),
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      totalAmount: total,
      message: 'Payment is ready. Opening secure Razorpay Checkout.',
    };
  } catch (error) {
    console.log('CHECKOUT TOOL ERROR:', error);
    return { error: error.message };
  }
};

module.exports = {
  toolDefinitions,
  executeSearchProducts,
  executeGetProductDetails,
  executeAddToCart,
  executeRemoveFromCart,
  executeCheckout,
};