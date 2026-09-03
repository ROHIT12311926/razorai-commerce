const Products = require('../models/Product');
const Merchants = require('../models/Merchant');
const Product = require('../models/Product');


const catalog_for_agent=async (req,res) => {

    try {

        const products= await Product.find({purchase_supported:true});
        const merchants= await Merchants.findOne({});

        const formatted_products = products.map((product) => ({
  id: product._id,
  name: product.name,
  description: product.description,
  price: product.price,
  currency: product.currency,
  stock: product.stock,
  in_stock: product.stock > 0,
  features: product.features,
  category: product.category,
  purchase_supported: product.purchase_supported,
  agent_purchasable: product.purchase_supported && product.stock > 0,
}));

        res.status(200).json({
  success: true,

  merchant: merchants ? merchants.name : "Anonymous",

  agent_purchasable: true,

  capabilities: {
    catalog: true,
    product_search: true,
    purchase: true,
    razorpay_payment: true,
    autonomous_transaction_limit: 2000,
  },

  products: formatted_products,
});
        
    } catch (error) {

        res.status(500).json({

            error:error.message,
            success:false,
            message:"not fetched"
        }
    )
        
    }
    
}

module.exports={catalog_for_agent};