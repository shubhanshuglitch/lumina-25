const router = require('express').Router();
const User = require('../models/User');

// List mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password');
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search mentors
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const mentors = await User.find({
      role: 'mentor',
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { expertise: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } },
      ],
    }).select('-password');
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single mentor
router.get('/:id', async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id).select('-password');
    if (!mentor || mentor.role !== 'mentor') return res.status(404).json({ error: 'Mentor not found' });
    res.json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
