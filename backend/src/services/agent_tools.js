const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const crypto = require('crypto');

const { checkCartThresholds } = require('../services/threshold_service');

const {
  checkTransactionLimit,
} = require('../services/guardrails_service');

const {
  createRazorpayOrder,
} = require('../services/razorpay_service');

const {
  logEvent,
} = require('../services/audit_service');


// ============================================================
// CHECKOUT IDEMPOTENCY SIGNATURE
// ============================================================

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


// ============================================================
// AI TOOL DEFINITIONS
// ============================================================

const toolDefinitions = [
  {
    functionDeclarations: [

      // --------------------------------------------------------
      // SEARCH PRODUCTS
      // --------------------------------------------------------

      {
        name: 'search_products',
        description:
          'Search for products in the catalog by keyword such as keyboard, mouse, headphones, monitor, or accessories.',
        parameters: {
          type: 'object',
          properties: {
            keyword: {
              type: 'string',
              description:
                'Product search keyword.',
            },
          },
          required: ['keyword'],
        },
      },


      // --------------------------------------------------------
      // GET PRODUCT DETAILS
      // --------------------------------------------------------

      {
        name: 'get_product_details',
        description:
          'Get complete details about a specific product.',
        parameters: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description:
                'MongoDB product ID.',
            },
          },
          required: ['productId'],
        },
      },


      // --------------------------------------------------------
      // GET SIMILAR PRODUCTS
      // --------------------------------------------------------

      {
        name: 'get_similar_products',
        description:
          'Find similar alternative products to a product the customer is viewing or discussing. Use this when the customer asks for similar products, alternatives, comparable products, other options, or something like the current product.',
        parameters: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description:
                'MongoDB product ID of the product for which similar alternatives should be found.',
            },
            category: {
              type: 'string',
              description:
                'Optional category of the product, such as keyboards, mouse, monitors, audio, accessories, or mousepads.',
            },
          },
          required: ['productId'],
        },
      },


      // --------------------------------------------------------
      // ADD TO CART
      // --------------------------------------------------------

      {
        name: 'add_to_cart',
        description:
          'Add a product to the customer cart when the customer explicitly wants to add or buy the product.',
        parameters: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description:
                'MongoDB product ID.',
            },
            quantity: {
              type: 'number',
              description:
                'Quantity to add. Defaults to 1.',
            },
          },
          required: ['productId'],
        },
      },


      // --------------------------------------------------------
      // REMOVE FROM CART
      // --------------------------------------------------------

      {
        name: 'remove_from_cart',
        description:
          'Remove a product from the customer cart when requested.',
        parameters: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description:
                'MongoDB product ID.',
            },
          },
          required: ['productId'],
        },
      },


      // --------------------------------------------------------
      // CHECKOUT
      // --------------------------------------------------------

      {
        name: 'checkout',
        description:
          'Start checkout when the customer explicitly wants to buy, checkout, pay, or purchase. If a previous checkout requires customer confirmation because the amount exceeds the autonomous limit, call this tool again with confirmed=true only after the customer explicitly confirms.',
        parameters: {
          type: 'object',
          properties: {
            confirmed: {
              type: 'boolean',
              description:
                'True only when the customer explicitly confirms a previously requested high-value checkout. False when starting checkout for the first time.',
            },
          },
          required: ['confirmed'],
        },
      },


      // --------------------------------------------------------
      // UPSELL RECOMMENDATIONS
      // --------------------------------------------------------

      {
        name: 'get_upsell_recommendations',
        description:
          'Recommend 1-2 relevant complementary products that are currently in stock.',
        parameters: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description:
                'Product ID the customer is interested in.',
            },
            category: {
              type: 'string',
              description:
                'Product category.',
            },
          },
          required: [
            'productId',
            'category',
          ],
        },
      },


      // --------------------------------------------------------
      // CART THRESHOLDS
      // --------------------------------------------------------

      {
        name: 'check_cart_thresholds',
        description:
          'Check the cart total against the free delivery threshold and autonomous checkout limit.',
        parameters: {
          type: 'object',
          properties: {
            cartTotal: {
              type: 'number',
              description:
                'Current cart total.',
            },
          },
          required: ['cartTotal'],
        },
      },

    ],
  },
];


// ============================================================
// SEARCH PRODUCTS
// ============================================================

const executeSearchProducts = async ({
  keyword,
}) => {
  try {

    const products =
      await Product.find({
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

    return {
      success: true,
      count: products.length,

      products: products.map(
        (product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          features: product.features,
          category: product.category,
        })
      ),
    };

  } catch (error) {

    return {
      success: false,
      error: error.message,
    };

  }
};


// ============================================================
// GET PRODUCT DETAILS
// ============================================================

const executeGetProductDetails = async ({
  productId,
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

    return {
      success: true,

      product: {
        id: product._id,
        name: product.name,
        description:
          product.description,
        price: product.price,
        stock: product.stock,
        features: product.features,
        category: product.category,
      },
    };

  } catch (error) {

    return {
      success: false,
      error: error.message,
    };

  }
};


// ============================================================
// GET SIMILAR PRODUCTS
// ============================================================

const executeGetSimilarProducts = async ({
  productId,
  category,
}) => {
  try {

    // Find the original product
    const product =
      await Product.findById(productId);

    if (!product) {
      return {
        success: false,
        error: 'Product not found.',
      };
    }

    // Use actual product category
    // instead of trusting AI supplied category
    const productCategory =
      product.category;

    // Find products from same category
    // excluding current product
    const similarProducts =
      await Product.find({
        _id: {
          $ne: product._id,
        },

        category: {
          $regex:
            `^${productCategory}$`,
          $options: 'i',
        },

        stock: {
          $gt: 0,
        },

        purchase_supported: true,
      })
        .limit(5)
        .select(
          '_id name description price stock category features'
        );

    return {
      success: true,

      originalProduct: {
        productId:
          product._id,
        name:
          product.name,
        category:
          product.category,
      },

      count:
        similarProducts.length,

      products:
        similarProducts.map(
          (item) => ({
            productId:
              item._id,
            name:
              item.name,
            description:
              item.description,
            price:
              item.price,
            stock:
              item.stock,
            category:
              item.category,
            features:
              item.features,
          })
        ),
    };

  } catch (error) {

    console.error(
      'SIMILAR PRODUCTS ERROR:',
      error
    );

    return {
      success: false,
      error: error.message,
    };

  }
};


// ============================================================
// ADD TO CART
// ============================================================

const executeAddToCart = async (
  {
    productId,
    quantity = 1,
  },
  sessionId
) => {

  try {

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return {
        success: false,
        error:
          'Product not found',
      };
    }

    const requestedQuantity =
      Number(quantity);

    if (
      !Number.isInteger(
        requestedQuantity
      ) ||
      requestedQuantity < 1
    ) {
      return {
        success: false,
        error:
          'Invalid quantity',
      };
    }

    if (
      product.stock <
      requestedQuantity
    ) {
      return {
        success: false,
        error:
          `Only ${product.stock} units of ${product.name} are available.`,
      };
    }

    let cart =
      await Cart.findOne({
        session_id:
          sessionId,
        status:
          'active',
      });

    if (!cart) {

      cart =
        await Cart.create({
          session_id:
            sessionId,
          item: [],
        });

    }

    const existingItemIndex =
      cart.item.findIndex(
        (item) =>
          item.product.toString() ===
          productId
      );

    if (
      existingItemIndex !== -1
    ) {

      const newQuantity =
        cart.item[
          existingItemIndex
        ].quantity +
        requestedQuantity;

      if (
        newQuantity >
        product.stock
      ) {
        return {
          success: false,
          error:
            `Only ${product.stock} units of ${product.name} are available.`,
        };
      }

      cart.item[
        existingItemIndex
      ].quantity =
        newQuantity;

    } else {

      cart.item.push({
        product:
          product._id,

        quantity:
          requestedQuantity,

        priceAtAdd:
          product.price,
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
        `Added ${requestedQuantity} x ${product.name} to cart.`,

      totalAmount,

      thresholdInfo,
    };

  } catch (error) {

    return {
      success: false,
      error: error.message,
    };

  }
};


// ============================================================
// REMOVE FROM CART
// ============================================================

const executeRemoveFromCart = async (
  {
    productId,
  },
  sessionId
) => {

  try {

    const cart =
      await Cart.findOne({
        session_id:
          sessionId,
        status:
          'active',
      });

    if (!cart) {
      return {
        success: false,
        error:
          'Cart not found.',
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
        success: false,
        error:
          'Item is not in the cart.',
      };
    }

    cart.item =
      cart.item.filter(
        (item) =>
          item.product.toString() !==
          productId
      );

    await cart.save();

    const totalAmount =
      cart.item.reduce(
        (total, item) =>
          total +
          item.priceAtAdd *
            item.quantity,
        0
      );

    return {

      success: true,

      message:
        'Item removed from cart.',

      totalAmount,
    };

  } catch (error) {

    return {
      success: false,
      error: error.message,
    };

  }
};


// ============================================================
// UPSELL RECOMMENDATIONS
// ============================================================

const handleGetUpsellRecommendations =
  async ({
    productId,
  }) => {

    try {

      const product =
        await Product.findById(
          productId
        );

      if (!product) {
        return {
          success: false,
          error:
            'Product not found.',
        };
      }

      const productName =
        product.name.toLowerCase();

      const productCategory =
        (
          product.category || ''
        ).toLowerCase();

      let complementaryCategories =
        [];


      // Mouse → Keyboard
      if (
        productName.includes(
          'mouse'
        ) ||
        productCategory.includes(
          'mouse'
        )
      ) {

        complementaryCategories = [
          'keyboard',
          'keyboards',
        ];

      }


      // Keyboard → Mouse
      else if (
        productName.includes(
          'keyboard'
        ) ||
        productCategory.includes(
          'keyboard'
        )
      ) {

        complementaryCategories = [
          'mouse',
          'mice',
        ];

      }


      // Headphones / Headset → Mouse + Keyboard
      else if (
        productName.includes(
          'headphone'
        ) ||
        productName.includes(
          'headset'
        )
      ) {

        complementaryCategories = [
          'mouse',
          'keyboard',
        ];

      }


      // Nothing relevant
      if (
        complementaryCategories.length ===
        0
      ) {

        return {
          success: true,
          recommendations: [],
        };

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
              (category) => ({
                category: {
                  $regex:
                    `^${category}$`,
                  $options: 'i',
                },
              })
            ),

            ...complementaryCategories.map(
              (category) => ({
                name: {
                  $regex:
                    category,
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

              productId:
                item._id,

              name:
                item.name,

              price:
                item.price,

              stock:
                item.stock,

              category:
                item.category,

              features:
                item.features,

            })
          ),

      };

    } catch (error) {

      return {
        success: false,
        error: error.message,
      };

    }
  };


// ============================================================
// CHECKOUT
// ============================================================

const executeCheckout = async (
  {
    confirmed = false,
  },
  sessionId
) => {

  try {

    const cart =
      await Cart.findOne({
        session_id:
          sessionId,

        status:
          'active',

      }).populate(
        'item.product'
      );


    // --------------------------------------------------------
    // EMPTY CART
    // --------------------------------------------------------

    if (
      !cart ||
      cart.item.length === 0
    ) {

      return {
        success: false,
        error:
          'Cart is empty. Nothing to checkout.',
      };

    }


    // --------------------------------------------------------
    // IDEMPOTENCY SIGNATURE
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // FIND EXISTING CHECKOUT
    // --------------------------------------------------------

    let existingOrder =
      await Order.findOne({

        session_Id:
          sessionId,

        checkoutSignature:
          signature,

        createdAt: {
          $gte:
            twoMinutesAgo,
        },

      });


    // --------------------------------------------------------
    // EXISTING ORDER FOUND
    // --------------------------------------------------------

    if (existingOrder) {


      // Already paid
      if (
        existingOrder.status ===
        'paid'
      ) {

        return {
          success: false,
          error:
            'This order has already been paid.',
        };

      }


      // ------------------------------------------------------
      // EXISTING HIGH VALUE ORDER
      // ------------------------------------------------------

      if (
        existingOrder.required_Approval &&
        existingOrder.status ===
          'pending_confirmation'
      ) {


        // Still waiting for confirmation
        if (!confirmed) {

          return {

            success: true,

            requiresConfirmation:
              true,

            orderId:
              existingOrder._id.toString(),

            totalAmount:
              existingOrder.total_price,

            transactionLimit:
              2000,

            message:
              `Your cart total is ₹${existingOrder.total_price}, which exceeds the autonomous checkout limit of ₹2000. Please confirm the purchase before payment can proceed.`,

          };

        }


        // ----------------------------------------------------
        // CUSTOMER CONFIRMED
        // ----------------------------------------------------

        const razorpayOrder =
          await createRazorpayOrder(
            existingOrder.total_price,
            existingOrder._id.toString()
          );


        existingOrder
          .razorpay_order_Id =
          razorpayOrder.id;

        existingOrder.status =
          'created';

        existingOrder.required_Approval =
          false;


        await existingOrder.save();


        await logEvent({

          action:
            'CUSTOMER_CONFIRMED_CHECKOUT',

          actor:
            'ai',

          amount:
            existingOrder.total_price,

          reason:
            'Customer explicitly confirmed a checkout above the autonomous transaction limit.',

          reasoningTrace:
            `Customer confirmed the ₹${existingOrder.total_price} purchase. Razorpay payment order was created after explicit confirmation.`,

          decisionType:
            'CUSTOMER_CONFIRMED',

          relatedOrder:
            existingOrder._id,

          sessionId,

          approvalStatus:
            'approved',

          result:
            'success',

        });


        return {

          success: true,

          requiresConfirmation:
            false,

          orderId:
            existingOrder._id.toString(),

          razorpayOrderId:
            razorpayOrder.id,

          razorpayKeyId:
            process.env.RAZORPAY_KEY_ID,

          totalAmount:
            existingOrder.total_price,

          message:
            'Purchase confirmed. Payment is ready.',

        };

      }


      // ------------------------------------------------------
      // EXISTING RAZORPAY ORDER
      // ------------------------------------------------------

      if (
        existingOrder.razorpay_order_Id &&
        existingOrder.status !==
          'failed' &&
        existingOrder.status !==
          'rejected'
      ) {

        return {

          success: true,

          requiresConfirmation:
            false,

          orderId:
            existingOrder._id.toString(),

          razorpayOrderId:
            existingOrder
              .razorpay_order_Id,

          razorpayKeyId:
            process.env.RAZORPAY_KEY_ID,

          totalAmount:
            existingOrder.total_price,

          message:
            'Payment is already ready.',

        };

      }

    }


    // --------------------------------------------------------
    // CALCULATE TOTAL
    // --------------------------------------------------------

    let total = 0;


    const orderItems =
      cart.item.map(
        (item) => {

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

        }
      );


    // --------------------------------------------------------
    // GUARDRAIL CHECK
    // --------------------------------------------------------

    const guardrailCheck =
      await checkTransactionLimit(
        total,
        sessionId
      );


    // --------------------------------------------------------
    // CREATE ORDER
    // --------------------------------------------------------

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
          guardrailCheck
            .requiresApproval
            ? 'pending_confirmation'
            : 'created',

        required_Approval:
          guardrailCheck
            .requiresApproval,

        checkoutSignature:
          signature,

      });


    // --------------------------------------------------------
    // AUDIT CHECKOUT
    // --------------------------------------------------------

    await logEvent({

      action:
        guardrailCheck
          .requiresApproval
          ? 'CUSTOMER_CONFIRMATION_REQUIRED'
          : 'checkout_initiated',

      actor:
        'ai',

      amount:
        total,

      reason:
        guardrailCheck
          .requiresApproval
          ? guardrailCheck.reason
          : `AI initiated checkout with ${orderItems.length} item(s).`,

      reasoningTrace:
        guardrailCheck
          .requiresApproval

          ? `Cart total ₹${total} exceeds the autonomous limit of ₹${guardrailCheck.transactionLimit}. Explicit customer confirmation is required.`

          : `Cart total ₹${total} is within the autonomous limit of ₹${guardrailCheck.transactionLimit}.`,

      decisionType:
        guardrailCheck
          .requiresApproval

          ? 'CUSTOMER_CONFIRMATION_REQUIRED'

          : 'AUTONOMOUS_APPROVED',

      relatedOrder:
        order._id,

      sessionId,

      approvalStatus:
        guardrailCheck
          .requiresApproval

          ? 'pending'

          : 'not_required',

      result:
        'success',

    });


    // --------------------------------------------------------
    // HIGH VALUE → REQUIRE CONFIRMATION
    // --------------------------------------------------------

    if (
      guardrailCheck.requiresApproval
    ) {

      return {

        success: true,

        requiresConfirmation:
          true,

        orderId:
          order._id.toString(),

        totalAmount:
          total,

        transactionLimit:
          guardrailCheck
            .transactionLimit,

        reason:
          guardrailCheck.reason,

        status:
          'PENDING_CUSTOMER_CONFIRMATION',

        message:
          `Your cart total is ₹${total}, which exceeds our ₹${guardrailCheck.transactionLimit} autonomous checkout limit. Please confirm this purchase before payment can proceed.`,

      };

    }


    // --------------------------------------------------------
    // AUTONOMOUS PAYMENT
    // --------------------------------------------------------

    const razorpayOrder =
      await createRazorpayOrder(
        total,
        order._id.toString()
      );


    order.razorpay_order_Id =
      razorpayOrder.id;


    await order.save();


    // --------------------------------------------------------
    // PAYMENT AUDIT
    // --------------------------------------------------------

    await logEvent({

      action:
        'payment_order_created',

      actor:
        'system',

      amount:
        total,

      reason:
        'Razorpay order created through autonomous AI checkout.',

      reasoningTrace:
        `Cart total ₹${total} is within the ₹${guardrailCheck.transactionLimit} autonomous spending limit.`,

      decisionType:
        'AUTONOMOUS_APPROVED',

      relatedOrder:
        order._id,

      sessionId,

      approvalStatus:
        'not_required',

      result:
        'success',

    });


    // --------------------------------------------------------
    // RETURN PAYMENT INFORMATION
    // --------------------------------------------------------

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

    console.error(
      'CHECKOUT TOOL ERROR:',
      error
    );

    return {
      success: false,
      error: error.message,
    };

  }
};


// ============================================================
// CART THRESHOLDS TOOL
// ============================================================

const checkCartThresholdsTool = (
  cartTotal
) => {

  return checkCartThresholds(
    cartTotal
  );

};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

  toolDefinitions,

  executeSearchProducts,

  executeGetProductDetails,

  // NEW
  executeGetSimilarProducts,

  executeAddToCart,

  executeRemoveFromCart,

  executeCheckout,

  handleGetUpsellRecommendations,

  checkCartThresholds:
    checkCartThresholdsTool,

};