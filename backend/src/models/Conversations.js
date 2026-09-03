const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'model'],
      required: true,
    },

    parts: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const conversationSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Conversation', conversationSchema);