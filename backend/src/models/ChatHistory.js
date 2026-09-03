const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'model'],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const chatHistorySchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    lastProduct: {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null,
      },
      name: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ChatHistory', chatHistorySchema);