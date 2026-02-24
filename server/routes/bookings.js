const router = require('express').Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { mentorId, timeslot, notes } = req.body;
    if (!mentorId || !timeslot) return res.status(400).json({ error: 'Mentor and timeslot required' });

    const booking = await Booking.create({
      mentor: mentorId,
      student: req.user._id,
      timeslot: new Date(timeslot),
      notes: notes || '',
    });
    await booking.populate('mentor', 'name email avatarInitials');
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// My bookings (as student)
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate('mentor', 'name email avatarInitials expertise')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bookings for a mentor
router.get('/mentor/:id', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ mentor: req.params.id })
      .populate('student', 'name email avatarInitials')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.student.toString() !== req.user._id.toString() && booking.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
