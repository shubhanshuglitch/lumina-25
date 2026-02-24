const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  mentor:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timeslot: { type: Date, required: true },
  status:   { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  notes:    { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
