const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const getMongoUser = require('../middleware/getMongoUser');
const roleMiddleware = require('../middleware/roleMiddleware');
const Event = require('../models/Event');

// GET /api/events - Get all events
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find().populate('author', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// POST /api/events - Create a new event (Faculty or Senior)
router.post('/', authMiddleware, getMongoUser, roleMiddleware(['faculty', 'senior']), async (req, res) => {
  try {
    const { title, description, startTime, endTime, type } = req.body;
    const newEvent = new Event({
      title,
      description,
      startTime,
      endTime,
      type,
      author: req.mongoUser._id,
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
});

module.exports = router;