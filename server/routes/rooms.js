const router = require('express').Router();
const Room = require('../models/Room');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// List rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true })
      .populate('createdBy', 'name avatarInitials')
      .sort('-createdAt');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create room
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, type } = req.body;
    if (!name) return res.status(400).json({ error: 'Room name required' });

    const room = await Room.create({
      name, description: description || '', type: type || 'general',
      createdBy: req.user._id, members: [req.user._id],
    });
    await room.populate('createdBy', 'name avatarInitials');
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get room with recent messages
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('createdBy', 'name avatarInitials')
      .populate('members', 'name avatarInitials');
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const messages = await Message.find({ room: room._id })
      .populate('sender', 'name avatarInitials')
      .sort('createdAt')
      .limit(100);

    res.json({ room, messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Join room
router.post('/:id/join', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (!room.members.includes(req.user._id)) {
      room.members.push(req.user._id);
      await room.save();
    }
    res.json({ message: 'Joined', membersCount: room.members.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leave room
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    room.members = room.members.filter(m => m.toString() !== req.user._id.toString());
    await room.save();
    res.json({ message: 'Left', membersCount: room.members.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
