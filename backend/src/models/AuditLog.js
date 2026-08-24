const mongoose = require('mongoose');

const AuditLog_Schema=new mongoose.Schema({

    action:{

        type:String,
        required:true
    },

    actor:{

        type:String,
        enum:["ai","customer",'merchant', 'system'],
        required:true
    },
    amount:{

        type:String,
        default:null
    },

    reason: {
      type: String,
      default: '',
      
    },

    relatedProduct:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        default:null

    },

    relatedOrder:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'Order',
        default:null
    },

    sessionId: {
      type: String,
      default: null,
      // Kis customer session se ye action related hai
    },

    approvalStatus: {
      type: String,
      enum: ['not_required', 'pending', 'approved', 'rejected'],
      default: 'not_required',
    },
    result: {
      type: String,
      enum: ['success', 'failure'],
      required: true,
    }
},{
    timestamps:true
});

module.exports=mongoose.model("AuditLog",AuditLog_Schema);