const mongoose = require('mongoose');
const { type } = require('os');
const { features } = require('process');

const productSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },

    description:{

        type:String
    },

    price:{

        type:Number,
        required:true,
        min:0


    },

    currency:{

        type:String,
        default:'INR'
    },

    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },

    features:{

        type:[String],
        default:[]

    },

    category:{

        type:String,
        default:'genearl'
    },

    imageUrl: {
      type: String,
      default: '',
    },
    
    purchase_supported: {
      type: Boolean,
      default: true,
    }

},

    {
    timestamps: true
  }


);

module.exports=mongoose.model('Product',productSchema);