const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  subject:     { type: String, default: '' },
  description: { type: String, default: '' },
  uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl:     { type: String, required: true },
  fileName:    { type: String, default: '' },
  fileType:    { type: String, default: '' },
  downloads:   { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
