const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'senior', 'faculty'], // Define user roles
    default: 'student',
  },
  // Add other fields you need, like 'major', 'year', etc.
}, { timestamps: true }); // Adds createdAt and updatedAt

module.exports = mongoose.model('User', userSchema);