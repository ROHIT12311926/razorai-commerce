const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product.js');
const Merchant = require('./models/Merchant.js');

const Cart = require('./models/Cart.js');
const Order = require('./models/Order.js');

const AuditLog = require('./models/AuditLog.js');

const sampleProducts = [

  // ==================== KEYBOARDS ====================

  {
    name: 'K2 Mechanical Keyboard',
    description: 'Wireless mechanical keyboard with RGB lighting',
    price: 1799,
    stock: 18,
    features: ['Wireless', 'Mechanical', 'RGB'],
    category: 'keyboards',
  },

  {
    name: 'K8 Wireless Mechanical Keyboard',
    description: 'Premium wireless mechanical keyboard for gaming and productivity',
    price: 2299,
    stock: 15,
    features: ['Wireless', 'Mechanical', 'RGB', 'Premium'],
    category: 'keyboards',
  },

  {
    name: 'Mini RGB Mechanical Keyboard',
    description: 'Compact mechanical keyboard with customizable RGB lighting',
    price: 1499,
    stock: 20,
    features: ['Mechanical', 'RGB', 'Compact'],
    category: 'keyboards',
  },

  {
    name: 'Pro Gaming Keyboard',
    description: 'Full-size gaming keyboard with RGB backlighting and mechanical switches',
    price: 2799,
    stock: 10,
    features: ['Gaming', 'Mechanical', 'RGB', 'Full Size'],
    category: 'keyboards',
  },

  {
    name: 'Compact Wireless Keyboard',
    description: 'Slim wireless keyboard designed for work and everyday use',
    price: 1199,
    stock: 25,
    features: ['Wireless', 'Compact', 'Slim'],
    category: 'keyboards',
  },


  // ==================== MICE ====================

  {
    name: 'Silent Wireless Mouse',
    description: 'Quiet ergonomic wireless mouse for office and everyday use',
    price: 899,
    stock: 30,
    features: ['Wireless', 'Silent', 'Ergonomic'],
    category: 'mouse',
  },

  {
    name: 'RGB Gaming Mouse',
    description: 'High precision gaming mouse with customizable RGB lighting',
    price: 1499,
    stock: 22,
    features: ['Gaming', 'RGB', 'High DPI'],
    category: 'mouse',
  },

  {
    name: 'Ergonomic Wireless Mouse',
    description: 'Comfortable wireless mouse designed for long working sessions',
    price: 1299,
    stock: 18,
    features: ['Wireless', 'Ergonomic', 'Comfortable'],
    category: 'mouse',
  },

  {
    name: 'Ultra-Light Gaming Mouse',
    description: 'Lightweight gaming mouse designed for fast competitive gameplay',
    price: 1999,
    stock: 14,
    features: ['Gaming', 'Ultra-Light', 'High DPI'],
    category: 'mouse',
  },


  // ==================== MOUSEPADS ====================

  {
    name: 'RGB Gaming Mousepad',
    description: 'Large gaming mousepad with RGB edge lighting',
    price: 999,
    stock: 25,
    features: ['RGB', 'Gaming', 'Large'],
    category: 'mousepads',
  },

  {
    name: 'Extended Desk Mousepad',
    description: 'Extra-large desk mat suitable for keyboard and mouse',
    price: 699,
    stock: 35,
    features: ['Extended', 'Desk Mat', 'Water Resistant'],
    category: 'mousepads',
  },

  {
    name: 'Speed Gaming Mousepad',
    description: 'Smooth surface mousepad optimized for fast gaming movements',
    price: 499,
    stock: 40,
    features: ['Gaming', 'Speed', 'Smooth Surface'],
    category: 'mousepads',
  },


  // ==================== MONITORS ====================

  {
    name: '24" FHD Gaming Monitor',
    description: '24-inch Full HD gaming monitor with high refresh rate',
    price: 8999,
    stock: 8,
    features: ['24 Inch', 'Full HD', 'Gaming', 'High Refresh Rate'],
    category: 'monitors',
  },

  {
    name: '27" QHD Gaming Monitor',
    description: '27-inch QHD gaming monitor with sharp resolution and immersive visuals',
    price: 14999,
    stock: 6,
    features: ['27 Inch', 'QHD', 'Gaming', 'High Refresh Rate'],
    category: 'monitors',
  },


  // ==================== ACCESSORIES ====================

  {
    name: 'USB-C Hub',
    description: 'Multi-port USB-C hub for laptops and modern devices',
    price: 1299,
    stock: 25,
    features: ['USB-C', 'Multi-Port', 'Portable'],
    category: 'accessories',
  },

  {
    name: 'Wireless Headphones',
    description: 'Comfortable wireless headphones with immersive audio',
    price: 2499,
    stock: 16,
    features: ['Wireless', 'Over-Ear', 'Noise Isolation'],
    category: 'audio',
  },

  {
    name: 'Gaming Headset',
    description: 'Gaming headset with microphone and immersive surround sound',
    price: 3499,
    stock: 12,
    features: ['Gaming', 'Microphone', 'Surround Sound'],
    category: 'audio',
  },

  {
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand for comfortable desk setups',
    price: 1499,
    stock: 20,
    features: ['Adjustable', 'Aluminum', 'Ergonomic'],
    category: 'accessories',
  },

  {
    name: 'Wireless Charger',
    description: 'Fast wireless charging pad for compatible smartphones and devices',
    price: 999,
    stock: 28,
    features: ['Wireless', 'Fast Charging', 'Compact'],
    category: 'accessories',
  },

  {
    name: 'USB Microphone',
    description: 'Plug-and-play USB microphone for streaming, gaming and calls',
    price: 1899,
    stock: 15,
    features: ['USB', 'Streaming', 'Noise Reduction'],
    category: 'audio',
  },

];

const sampleMerchant={

  name: 'TechStore',
  email: 'techstore@example.com',
  password: 'temporary_plain_password', // Phase 5 mein isko hash karenge
  transactionLimit: 2000,
  maxDiscountPercent: 10,
}


const seedDB= async()=>{

try {

   await connectDB();

   await Product.deleteMany({});

   await Product.insertMany(sampleProducts);
    console.log("Products added");

    await Merchant.deleteMany({});

    await Merchant.create(sampleMerchant);

    console.log("Merchant also added");

    await Cart.deleteMany({});

    const x= await Product.findOne({name:"K3 Mechanical Keyboard"});
    const add_in_cart= await Cart.create({

      session_id:"technicalmaster123",

      item:[{

        product:x._id,
        quantity:1,
        priceAtAdd:x.price


      }]

    });

    await Order.deleteMany({});

    const Order_placed= await Order.create({

      session_Id:"technicalmaster123",

      item:[

        {
          product:x._id,
          name:x.name,
          quantity:1,
          price:x.price


        }
      ],

      total_price:x.price,

      razorpay_order_Id: 'order_test_12345', 
  status: 'created',
  required_Approval: false

    });

    await AuditLog.deleteMany({});
    const y=await Order.findOne({session_Id:"technicalmaster123"});

    await AuditLog.create({


      action: 'order_created',
  actor: 'system',
  amount: y.totalAmount,
  reason: 'Payment verified successfully, order created',
  relatedProduct: x._id,
  relatedOrder: y._id,
  sessionId: 'technicalmaster123',
  approvalStatus: 'not_required',
  result: 'success'
    })




    console.log("added cart");

    const populated_cart=await Cart.find({session_id:"technicalmaster123"}).populate("item.product");

    console.log(populated_cart);



    

    

    process.exit(0);
    
} catch (error) {

    console.error(error.message);

    process.exit(1);
    
}
};

seedDB();