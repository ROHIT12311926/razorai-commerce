const mongoose = require('mongoose');

const merchantSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },

    password:{

        type:String,
        required:true
    },

    transaction_limit:{

        type:Number,
        default:2000,
        min:0
    },
    max_Discount_percent:{

        type:Number,
        min:0,
        max:100,
        default:10
    }

},{

    timestamps:true
});

module.exports=mongoose.model("Merchant",merchantSchema);