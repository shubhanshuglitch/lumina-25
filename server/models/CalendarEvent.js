const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title:       { type: String, required: true, trim: true },
  start:       { type: Date, required: true },
  end:         { type: Date, required: true },
  description: { type: String, default: '' },
  color:       { type: String, default: '#c46b4e' },
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
