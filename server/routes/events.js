const router = require('express').Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// List events (approved only for public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isApproved: true })
      .populate('submittedBy', 'name avatarInitials')
      .sort('-date');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search events
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const events = await Event.find({
      isApproved: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { type: { $regex: q, $options: 'i' } },
      ],
    }).populate('submittedBy', 'name avatarInitials').sort('-date');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('submittedBy', 'name avatarInitials');
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit event
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, type, location } = req.body;
    if (!title || !date) return res.status(400).json({ error: 'Title and date required' });

    const event = await Event.create({
      title, description: description || '', date: new Date(date),
      type: type || 'other', location: location || 'Virtual',
      submittedBy: req.user._id,
      isApproved: true, // auto-approve for demo
    });
    await event.populate('submittedBy', 'name avatarInitials');
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
