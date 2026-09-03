const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    session_Id: {
      type: String,
      required: true,
    },

    item: {
      type: [orderItemSchema],
      required: true,
    },

    total_price: {
      type: Number,
      required: true,
      min: 0,
    },

    razorpay_order_Id: {
      type: String,
      default: null,
    },

    razorpay_payment_id: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        'created',
        'pending_confirmation',
        'approved',
        'paid',
        'failed',
        'rejected',
      ],
      default: 'created',
    },

    required_Approval: {
      type: Boolean,
      default: false,
    },

    checkoutSignature: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);