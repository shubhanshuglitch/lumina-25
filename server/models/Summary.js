const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  title:           { type: String, required: true, trim: true },
  originalFileUrl: { type: String, default: '' },
  originalFileName:{ type: String, default: '' },
  summaryText:     { type: String, default: '' },
  keyPoints:       [{ type: String }],
  flashcards:      [{ question: String, answer: String }],
  createdBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Summary', summarySchema);
