const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  date:        { type: Date, required: true },
  type:        { type: String, enum: ['hackathon', 'workshop', 'club', 'meetup', 'social', 'seminar', 'other'], default: 'other' },
  status:      { type: String, enum: ['upcoming', 'in-progress', 'completed'], default: 'upcoming' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isApproved:  { type: Boolean, default: false },
  location:    { type: String, default: 'Virtual' },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
