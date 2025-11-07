const roleMiddleware = (roles = []) => {
  return (req, res, next) => {
    // Assumes getMongoUser middleware has run and attached req.mongoUser
    if (!req.mongoUser) {
      return res.status(401).json({ message: 'User profile not found' });
    }
    
    if (!roles.includes(req.mongoUser.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient role.' });
    }
    next();
  };
};

module.exports = roleMiddleware;