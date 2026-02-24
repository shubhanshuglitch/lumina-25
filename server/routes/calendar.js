const router = require('express').Router();
const CalendarEvent = require('../models/CalendarEvent');
const auth = require('../middleware/auth');

// List user's calendar events
router.get('/', auth, async (req, res) => {
  try {
    const events = await CalendarEvent.find({ user: req.user._id }).sort('start');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create calendar event
router.post('/', auth, async (req, res) => {
  try {
    const { title, start, end, description, color } = req.body;
    if (!title || !start || !end) return res.status(400).json({ error: 'Title, start and end required' });

    const event = await CalendarEvent.create({
      user: req.user._id, title,
      start: new Date(start), end: new Date(end),
      description: description || '', color: color || '#c46b4e',
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update calendar event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await CalendarEvent.findOne({ _id: req.params.id, user: req.user._id });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const { title, start, end, description, color } = req.body;
    if (title) event.title = title;
    if (start) event.start = new Date(start);
    if (end) event.end = new Date(end);
    if (description !== undefined) event.description = description;
    if (color) event.color = color;
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete calendar event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await CalendarEvent.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
