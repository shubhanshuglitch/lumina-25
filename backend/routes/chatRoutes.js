const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/user'); // To find our own MongoDB user

// Helper middleware to get our MongoDB user from Firebase UID
const getMongoUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ message: 'User profile not found' });
    req.mongoUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
}

// GET /api/chat/conversations
// Get all conversations for the currently logged-in user
router.get('/conversations', authMiddleware, getMongoUser, async (req, res) => {
  try {
    const conversations = await Conversation.find({ 
      participants: req.mongoUser._id 
    }).populate('participants', 'name email'); // Populate participant details
    
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

// GET /api/chat/conversations/:id/messages
// Get all messages for a specific conversation
router.get('/conversations/:id/messages', authMiddleware, getMongoUser, async (req, res) => {
  try {
    // 1. Check if user is part of this conversation
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation.participants.includes(req.mongoUser._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // 2. Get messages
    const messages = await Message.find({ 
      conversation: req.params.id 
    }).populate('sender', 'name email').sort({ createdAt: 'asc' }); // Oldest first
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;