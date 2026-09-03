const Product = require('../models/Product');
const Cart = require('../models/Cart');
const crypto = require('crypto');

const { checkCartThresholds } = require('../services/threshold_service');
const Order = require('../models/Order');

const {
  checkTransactionLimit,
} = require('../services/guardrails_service');

const {
  createRazorpayOrder,
} = require('../services/razorpay_service');

const {
  logEvent,
} = require('../services/audit_service');


// ======================================================
// CHECKOUT SIGNATURE
// ======================================================

const generateCheckoutSignature = (
  sessionId,
  cartItems
) => {
  const sortedItems = cartItems
    .map(
      (item) =>
        `${item.product._id}:${item.quantity}`
    )
    .sort()
    .join('|');

  const rawString =
    `${sessionId}|${sortedItems}`;

  return crypto
    .createHash('sha256')
    .update(rawString)
    .digest('hex');
};


// ======================================================
// TOOL DEFINITIONS
// ======================================================

const toolDefinitions = [
  {
    functionDeclarations: [

      // ================= SEARCH =================

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


      // ================= PRODUCT DETAILS =================

      {
        name: 'get_product_details',

        description:
          'Get full details of a specific product using its ID',

        parameters: {
          type: 'object',

          properties: {
            productId: {
              type: 'string',
              description:
                'The MongoDB ID of the product',
            },
          },

          required: ['productId'],
        },
      },


      // ================= ADD TO CART =================

      {
        name: 'add_to_cart',

        description:
          'Add a product to the customer cart',

        parameters: {
          type: 'object',

          properties: {
            productId: {
              type: 'string',
              description:
                'The MongoDB ID of the product to add',
            },

            quantity: {
              type: 'number',
              description:
                'How many units to add, default is 1',
            },
          },

          required: ['productId'],
        },
      },


      // ================= REMOVE FROM CART =================

      {
        name: 'remove_from_cart',

        description:
          'Remove a product from the customer cart',

        parameters: {
          type: 'object',

          properties: {
            productId: {
              type: 'string',
              description:
                'The MongoDB ID of the product to remove',
            },
          },

          required: ['productId'],
        },
      },


      // ================= CHECKOUT =================

      {
        name: 'checkout',

        description:
          'Initiate checkout for the current cart. ONLY call this when the customer explicitly says things like "buy this", "checkout", "pay now", or "purchase everything in my cart". Do not call this just because items were added to cart. If the cart exceeds the autonomous limit, customer confirmation will be required before payment can proceed.',

        parameters: {
          type: 'object',

          properties: {},
        },
      },


      // ================= UPSELL =================

      {
        name: 'get_upsell_recommendations',

        description:
          'Recommend 1-2 relevant complementary products that are in stock based on the product the customer is interested in.',

        parameters: {
          type: 'object',

          properties: {
            productId: {
              type: 'string',
              description:
                'The MongoDB ID of the product the customer is interested in',
            },

            category: {
              type: 'string',
              description:
                'The category of the product',
            },
          },

          required: [
            'productId',
            'category',
          ],
        },
      },


      // ================= THRESHOLDS =================

      {
        name: 'check_cart_thresholds',

        description:
          'Check the current cart total against the Free Delivery threshold of ₹1500 and the autonomous checkout limit of ₹2000. Use this after cart changes to provide useful spending nudges.',

        parameters: {
          type: 'object',

          properties: {
            cartTotal: {
              type: 'number',
              description:
                'The current total amount of the customer cart',
            },
          },

          required: ['cartTotal'],
        },
      },
    ],
  },
];


// ======================================================
// SEARCH PRODUCTS
// ======================================================

const executeSearchProducts = async ({
  keyword,
}) => {
  const products = await Product.find({
    $or: [
      {
        name: {
          $regex: keyword,
          $options: 'i',
        },
      },

      {
        description: {
          $regex: keyword,
          $options: 'i',
        },
      },

      {
        category: {
          $regex: keyword,
          $options: 'i',
        },
      },
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


// ======================================================
// GET PRODUCT DETAILS
// ======================================================

const executeGetProductDetails = async ({
  productId,
}) => {
  const product =
    await Product.findById(productId);

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


// ======================================================
// ADD TO CART
// ======================================================

const executeAddToCart = async (
  { productId, quantity = 1 },
  sessionId
) => {
  const product =
    await Product.findById(productId);

  if (!product) {
    return {
      error: 'Product not found',
    };
  }

  if (product.stock < quantity) {
    return {
      error:
        `Only ${product.stock} units available in stock`,
    };
  }

  let cart =
    await Cart.findOne({
      session_id: sessionId,
      status: 'active',
    });

  if (!cart) {
    cart = await Cart.create({
      session_id: sessionId,
      item: [],
    });
  }

  const existingItemIndex =
    cart.item.findIndex(
      (item) =>
        item.product.toString() === productId
    );

  if (existingItemIndex > -1) {
    cart.item[
      existingItemIndex
    ].quantity += quantity;
  } else {
    cart.item.push({
      product: product._id,
      quantity,
      priceAtAdd: product.price,
    });
  }

  await cart.save();

  const totalAmount =
    cart.item.reduce(
      (total, item) =>
        total +
        item.priceAtAdd *
          item.quantity,
      0
    );

  const thresholdInfo =
    checkCartThresholds(
      totalAmount
    );

  return {
    success: true,

    message:
      `Added ${quantity} x ${product.name} to cart`,

    totalAmount,

    thresholdInfo,
  };
};


// ======================================================
// REMOVE FROM CART
// ======================================================

const executeRemoveFromCart = async (
  { productId },
  sessionId
) => {
  try {
    const cart =
      await Cart.findOne({
        session_id: sessionId,
        status: 'active',
      });

    if (!cart) {
      return {
        error: 'Cart not found',
      };
    }

    const itemExists =
      cart.item.some(
        (item) =>
          item.product.toString() ===
          productId
      );

    if (!itemExists) {
      return {
        error: 'Item not found in cart',
      };
    }

    cart.item =
      cart.item.filter(
        (item) =>
          item.product.toString() !==
          productId
      );

    await cart.save();

    return {
      success: true,
      message: 'Item removed from cart',
    };

  } catch (error) {

    console.log(
      'REMOVE CART ERROR:',
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};


// ======================================================
// UPSELL RECOMMENDATIONS
// ======================================================

const handleGetUpsellRecommendations = async ({
  productId,
  category,
}) => {
  try {
    const product =
      await Product.findById(productId);

    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      };
    }

    let complementaryCategories = [];

    const productName =
      product.name.toLowerCase();

    const productCategory =
      (product.category || '')
        .toLowerCase();

    if (
      productName.includes('mouse') ||
      productCategory.includes('mouse')
    ) {
      complementaryCategories = [
        'keyboard',
        'keyboards',
      ];
    }

    else if (
      productName.includes('keyboard') ||
      productCategory.includes('keyboard')
    ) {
      complementaryCategories = [
        'mouse',
        'mice',
      ];
    }

    const recommendations =
      await Product.find({
        _id: {
          $ne: productId,
        },

        stock: {
          $gt: 0,
        },

        $or: [
          ...complementaryCategories.map(
            (cat) => ({
              category: {
                $regex: `^${cat}$`,
                $options: 'i',
              },
            })
          ),

          ...complementaryCategories.map(
            (cat) => ({
              name: {
                $regex: cat,
                $options: 'i',
              },
            })
          ),
        ],
      })
        .limit(2)
        .select(
          '_id name price stock category features'
        );

    return {
      success: true,

      recommendations:
        recommendations.map(
          (item) => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            stock: item.stock,
            category: item.category,
            features: item.features,
          })
        ),
    };

  } catch (error) {

    console.log(
      'UPSELL RECOMMENDATION ERROR:',
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};


// ======================================================
// CHECKOUT
// ======================================================

const executeCheckout = async (
  args,
  sessionId
) => {
  try {

    const cart =
      await Cart.findOne({
        session_id: sessionId,
        status: 'active',
      }).populate(
        'item.product'
      );


    if (
      !cart ||
      cart.item.length === 0
    ) {
      return {
        error:
          'Cart is empty, nothing to checkout',
      };
    }


    // ==================================================
    // DUPLICATE CHECKOUT PROTECTION
    // ==================================================

    const signature =
      generateCheckoutSignature(
        sessionId,
        cart.item
      );

    const twoMinutesAgo =
      new Date(
        Date.now() -
          2 * 60 * 1000
      );


    const existingOrder =
      await Order.findOne({
        session_Id: sessionId,

        checkoutSignature:
          signature,

        createdAt: {
          $gte: twoMinutesAgo,
        },
      });


    if (existingOrder) {

      console.log(
        '=== DUPLICATE CHECKOUT DETECTED ==='
      );


      // ----------------------------------------------
      // CUSTOMER CONFIRMATION STILL REQUIRED
      // ----------------------------------------------

      if (
        existingOrder.required_Approval &&
        existingOrder.status ===
          'pending_confirmation'
      ) {

        return {
          success: true,

          requiresConfirmation: true,

          orderId:
            existingOrder._id.toString(),

          totalAmount:
            existingOrder.total_price,

          transactionLimit: 2000,

          message:
            'Customer confirmation is required before payment can proceed.',
        };
      }


      // ----------------------------------------------
      // PAYMENT ALREADY READY
      // ----------------------------------------------

      if (
        existingOrder.razorpay_order_Id &&
        existingOrder.status !==
          'failed' &&
        existingOrder.status !==
          'rejected'
      ) {

        return {
          success: true,

          requiresConfirmation: false,

          orderId:
            existingOrder._id.toString(),

          razorpayOrderId:
            existingOrder.razorpay_order_Id,

          razorpayKeyId:
            process.env.RAZORPAY_KEY_ID,

          totalAmount:
            existingOrder.total_price,

          message:
            'Payment is already ready. Opening secure Razorpay Checkout.',
        };
      }
    }


    // ==================================================
    // CALCULATE TOTAL
    // ==================================================

    let total = 0;

    const orderItems =
      cart.item.map((item) => {

        total +=
          item.priceAtAdd *
          item.quantity;

        return {
          product:
            item.product._id,

          name:
            item.product.name,

          quantity:
            item.quantity,

          price:
            item.priceAtAdd,
        };
      });


    // ==================================================
    // GUARDRAIL CHECK
    // ==================================================

    const guardrailCheck =
      await checkTransactionLimit(
        total,
        sessionId
      );


    // ==================================================
    // CREATE ORDER
    // ==================================================

    const order =
      await Order.create({

        session_Id:
          sessionId,

        item:
          orderItems,

        total_price:
          total,

        razorpay_order_Id:
          null,

        status:
          guardrailCheck.requiresApproval
            ? 'pending_confirmation'
            : 'created',

        required_Approval:
          guardrailCheck.requiresApproval,

        checkoutSignature:
          signature,
      });


    // ==================================================
    // AUDIT LOG
    // ==================================================

    await logEvent({

      action:
        guardrailCheck.requiresApproval
          ? 'CUSTOMER_CONFIRMATION_REQUIRED'
          : 'checkout_initiated',

      actor: 'ai',

      amount: total,

      reason:
        guardrailCheck.requiresApproval
          ? guardrailCheck.reason
          : `AI-initiated checkout with ${orderItems.length} item(s)`,

      reasoningTrace:
        guardrailCheck.requiresApproval
          ? `Cart total ₹${total} exceeds the autonomous limit of ₹${guardrailCheck.transactionLimit}. Customer confirmation is required before payment can proceed.`
          : `Cart total ₹${total} is within the autonomous limit of ₹${guardrailCheck.transactionLimit}. AI can proceed with Razorpay payment.`,

      decisionType:
        guardrailCheck.requiresApproval
          ? 'CUSTOMER_CONFIRMATION_REQUIRED'
          : 'AUTONOMOUS_APPROVED',

      relatedOrder:
        order._id,

      sessionId,

      approvalStatus:
        guardrailCheck.requiresApproval
          ? 'pending'
          : 'not_required',

      result: 'success',
    });


    // ==================================================
    // HIGH VALUE
    // CUSTOMER CONFIRMATION REQUIRED
    // ==================================================

    if (
      guardrailCheck.requiresApproval
    ) {

      return {

        success: true,

        requiresConfirmation: true,

        orderId:
          order._id.toString(),

        totalAmount:
          total,

        transactionLimit:
          guardrailCheck.transactionLimit,

        reason:
          guardrailCheck.reason,

        status:
          'PENDING_CUSTOMER_CONFIRMATION',

        message:
          `Your cart total is ₹${total}, which exceeds the autonomous checkout limit of ₹${guardrailCheck.transactionLimit}. Would you like to confirm this purchase?`,
      };
    }


    // ==================================================
    // AUTONOMOUS PAYMENT
    // ==================================================

    const razorpayOrder =
      await createRazorpayOrder(
        total,
        order._id.toString()
      );


    order.razorpay_order_Id =
      razorpayOrder.id;

    await order.save();


    await logEvent({

      action:
        'payment_order_created',

      actor:
        'system',

      amount:
        total,

      reason:
        'Razorpay order created via AI checkout within autonomous limit',

      reasoningTrace:
        `Cart total ₹${total} was verified against the ₹${guardrailCheck.transactionLimit} autonomous spending limit. Payment order was created automatically.`,

      decisionType:
        'AUTONOMOUS_APPROVED',

      relatedOrder:
        order._id,

      sessionId,

      result:
        'success',
    });


    return {

      success: true,

      requiresConfirmation:
        false,

      orderId:
        order._id.toString(),

      razorpayOrderId:
        razorpayOrder.id,

      razorpayKeyId:
        process.env.RAZORPAY_KEY_ID,

      totalAmount:
        total,

      message:
        'Payment is ready. Opening secure Razorpay Checkout.',
    };


  } catch (error) {

    console.log(
      'CHECKOUT TOOL ERROR:',
      error
    );

    return {
      error: error.message,
    };
  }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  toolDefinitions,

  executeSearchProducts,

  executeGetProductDetails,

  executeAddToCart,

  executeRemoveFromCart,

  executeCheckout,

  handleGetUpsellRecommendations,

};