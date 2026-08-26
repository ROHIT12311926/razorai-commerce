const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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


merchantSchema.pre('save',async function (next) {

    if(!this.isModified('password')){

       return ;
    }

    const salt= await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);

 

    
    
});

merchantSchema.methods.comparePass=async function (entered_password) {

    return await bcrypt.compare(entered_password,this.password);
    
}

module.exports=mongoose.model("Merchant",merchantSchema);