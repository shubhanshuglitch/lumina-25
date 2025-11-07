const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  // --- Original Fields ---
  title: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Public URL from Firebase Storage
  fileName: { type: String, required: true }, // Name in the storage bucket
  uploader: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['notes', 'ppt', 'pdf'], required: true },

  // --- New AI-generated Fields ---
  summary: {
    type: String,
    trim: true,
  },
  keyPoints: {
    type: [String], // An array of strings
  },
  quiz: [{ // An array of quiz question objects
    question: String,
    options: [String],
    answer: String,
  }],

}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

module.exports = mongoose.model('Resource', resourceSchema);