const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  type: { type: String, enum: ['academic', 'club'], default: 'academic' },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);