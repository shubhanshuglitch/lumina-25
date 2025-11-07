const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Your downloaded key

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Uncomment and set your storageBucket if needed:
    // storageBucket: 'gs://your-project-id.appspot.com',
  });
}
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send({ message: 'No token provided. Access denied.' });
  }

  try {
    // Verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach the user's Firebase UID to the request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    
    next(); // User is authenticated, proceed to the route
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).send({ message: 'Invalid token. Access denied.' });
  }
};

module.exports = authMiddleware;