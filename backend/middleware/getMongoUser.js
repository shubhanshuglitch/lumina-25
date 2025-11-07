const User = require('../models/user');

const getMongoUser = async (req, res, next) => {
  // This middleware MUST run *after* authMiddleware.
  // It expects 'req.user.uid' to be attached by Firebase.
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ message: 'Not authenticated (Firebase UID not found)' });
  }
  
  try {
    // Find the user in our MongoDB collection using their Firebase UID
    const user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User profile not found in database' });
    }
    
    // Attach the full MongoDB user profile (which includes the 'role')
    // to the request object.
    req.mongoUser = user; 
    next(); // Continue to the next middleware (like roleMiddleware)
  } catch (error) {
    console.error("Error in getMongoUser middleware:", error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

module.exports = getMongoUser;