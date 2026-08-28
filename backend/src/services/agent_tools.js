const Product = require('../models/Product');
const Cart = require('../models/Cart');


const toolDefinitions = [
  {
    functionDeclarations: [
      {
        name: 'search_products',
        description: 'Search for products in the catalog by keyword (name, description, or category)',
        parameters: {
          type: 'object',
          properties: {
            keyword: {
              type: 'string',
              description: 'The search term, e.g. "keyboard", "wireless mouse"',
            },
          },
          required: ['keyword'],
        },
      },
      {
        name: 'get_product_details',
        description: 'Get full details of a specific product using its ID',
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
    ],
  },
];


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

const executeGetProductDetails = async ({ productId }) => {
  const product = await Product.findById(productId);

  if (!product) {
    return { error: 'Product not found' };
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

const executeAddToCart = async ({ productId, quantity = 1 }, sessionId) => {
  const product = await Product.findById(productId);

  if (!product) {
    return { error: 'Product not found' };
  }

  if (product.stock < quantity) {
    return { error: `Only ${product.stock} units available in stock` };
  }

  let cart = await Cart.findOne({ session_id: sessionId, status: 'active' });

  if (!cart) {
    cart = await Cart.create({ session_id: sessionId, item: [] });
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

  return {
    success: true,
    message: `Added ${quantity} x ${product.name} to cart`,
  };
};

module.exports = {
  toolDefinitions,
  executeSearchProducts,
  executeGetProductDetails,
  executeAddToCart,
};