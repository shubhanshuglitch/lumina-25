const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/authmiddleware'); // Import the middleware

/**
 * @route   POST /api/users/register-sync
 * @desc    Create/Sync user profile in MongoDB after Firebase auth
 * @access  Private (Requires valid Firebase token)
 */
router.post('/register-sync', authMiddleware, async (req, res) => {
  // We get firebaseUid and email from the authMiddleware
  const { uid, email } = req.user;
  
  // We get the name (and any other info) from the request body
  const { name, role } = req.body; 

  try {
    // 1. Check if user already exists in MongoDB
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      // User already exists, just return their profile
      return res.status(200).json(user);
    }

    // 2. If user does NOT exist, create a new profile
    const newUser = new User({
      firebaseUid: uid,
      email: email,
      name: name,
      role: role || 'student', // Default to 'student' if no role provided
    });

    await newUser.save();
    res.status(201).json(newUser); // Send back the newly created user profile

  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).send({ message: 'Error syncing user data' });
  }
});

module.exports = router;