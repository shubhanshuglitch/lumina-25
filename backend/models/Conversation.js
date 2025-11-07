const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  name: { // For topic rooms, e.g., "C++ Beginners"
    type: String,
    trim: true,
  },
  roomType: {
    type: String,
    enum: ['DM', 'TOPIC'],
    required: true,
  },
  participants: [{ // Array of users in this chat
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);