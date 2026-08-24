const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product.js');
const Merchant = require('./models/Merchant.js');

const Cart = require('./models/Cart.js');
const Order = require('./models/Order.js');

const AuditLog = require('./models/AuditLog.js');

const sampleProducts=[
    {

         name: 'K2 Mechanical Keyboard',
    description: 'Wireless mechanical keyboard with RGB lighting',
    price: 1799,
    stock: 18,
    features: ['Wireless', 'Mechanical', 'RGB'],
    category: 'accessories',


},
 {
    name: 'K3 Mechanical Keyboard',
    description: 'Compact wireless mechanical keyboard',
    price: 1899,
    stock: 12,
    features: ['Wireless', 'Mechanical', 'Compact'],
    category: 'accessories',
  },

  {
    name: 'Wireless Mouse M1',
    description: 'Ergonomic wireless mouse',
    price: 499,
    stock: 30,
    features: ['Wireless', 'Ergonomic'],
    category: 'accessories',
  }
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