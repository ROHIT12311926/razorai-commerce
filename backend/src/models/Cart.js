const mongoose = require('mongoose');
const Product = require('./Product');

const CartItem=new mongoose.Schema({

    product:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },

    quantity:{

        type:Number,
        min:1,
        default:1,
        required:true
    },

    priceAtAdd:{

        type:Number,
        required:true
    }



},{
    id:false
});

const CartSchema=new mongoose.Schema({

    session_id:{

        type:String,
        required:true
    },

    item:{
        type:[CartItem],
        default:[]
    },

    status:{
        type:String,
        enum:["active","checkout","abondoned"],
        default:"active"
    }
},{
    timestamps:true
});

module.exports=mongoose.model('Cart',CartSchema);