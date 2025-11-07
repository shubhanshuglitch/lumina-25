const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User', // The user who sent the message
    required: true,
  },
  content: {
    type: String,
    trim: true,
    required: true,
  },
}, { timestamps: true }); // Automatically adds createdAt

module.exports = mongoose.model('Message', messageSchema);