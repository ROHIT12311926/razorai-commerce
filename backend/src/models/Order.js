const mongoose = require('mongoose');
const Product = require('./Product');

const orderItemSchema=new mongoose.Schema({

    product:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },

    name:{
        type:String,
        required:true
    },

    quantity:{

        type:Number,
        required:true,
        min:1
    },

    price:{

        type:String,
        required:true
    }


},{
    id:false
})

const orderSchema=new mongoose.Schema({

    session_Id:{

        type:String,
        required:true
    },

    item:{

        type:[orderItemSchema],
        required:true
    },

    total_price:{

        type:Number,
        required:true,
        min:0
    },

    razorpay_order_Id:{

        type:String,
        required:true
    },

    razorpay_payment_id:{

        type:String,
        default:null
    },

    status:{

        type:String,
        enum:["created","paid","failed","approved"],
        default:"created"
    },

    required_Approval:{

        type:Boolean,
        default:false
    }


},{
    timestamps:true
})

module.exports=mongoose.model('Order',orderSchema);