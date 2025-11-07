const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const getMongoUser = require('../middleware/getMongoUser'); // We'll create this
const roleMiddleware = require('../middleware/roleMiddleware');
const Announcement = require('../models/announcement');

// GET /api/announcements - Get all announcements
router.get('/', authMiddleware, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements' });
  }
});

// POST /api/announcements - Create a new announcement (Faculty only)
router.post('/', authMiddleware, getMongoUser, roleMiddleware(['faculty']), async (req, res) => {
  try {
    const { title, content } = req.body;
    const newAnnouncement = new Announcement({
      title,
      content,
      author: req.mongoUser._id,
    });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement' });
  }
});

module.exports = router;