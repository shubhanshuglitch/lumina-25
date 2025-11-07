// --- IMPORTS ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');
// ...existing code...
// --- DOTENV CONFIG ---
// Load environment variables with explicit path
const envPath = path.resolve(__dirname, '.env');
console.log('Loading .env file from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
}

// Debug: Check if environment variables are loaded
console.log('Environment variables loaded:', {
    MONGODB_URI: process.env.MONGODB_URI ? 'Defined' : 'Not defined',
    PORT: process.env.PORT
});

// --- FIREBASE ADMIN INIT ---
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // Add other Firebase config if needed
});

// --- ROUTE AND MODEL IMPORTS ---
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const eventRoutes = require('./routes/eventRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

const User = require('./models/user');
const Message = require('./models/Message');
const authMiddleware = require('./middleware/authmiddleware');

// --- APP INITIALIZATION ---
const app = express();
const PORT = process.env.PORT || 5001;

// --- MONGODB CONNECTION ---
// Verify MongoDB URI is available
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Initial connection attempt
connectWithRetry();

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// --- HTTP SERVER & SOCKET.IO SETUP ---
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // Your React app's URL
    methods: ['GET', 'POST'],
  },
});

// --- EXPRESS MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- EXPRESS (REST API) ROUTES ---
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/resources', resourceRoutes);

// Test route to check authentication
app.get('/api/test', authMiddleware, (req, res) => {
  res.json({ message: `Hello from the backend! Your user ID is ${req.user.uid}` });
});

// --- SOCKET.IO AUTHENTICATION MIDDLEWARE ---
// This runs for EVERY new socket connection
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token; // Get token from client
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }
  try {
    // 1. Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    // 2. Find the user in *our* MongoDB
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return next(new Error('Authentication error: User not found in DB'));
    }
    // 3. Attach MongoDB user object to the socket
    socket.user = user; 
    next();
  } catch (error) {
    return next(new Error('Authentication error: Invalid token'));
  }
});

// --- SOCKET.IO CONNECTION HANDLER ---
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}, User: ${socket.user.name}`);

  // Handler for joining a room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`${socket.user.name} joined room ${roomId}`);
  });

  // Handler for leaving a room
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`${socket.user.name} left room ${roomId}`);
  });

  // Handler for a new message
  socket.on('sendMessage', async (data) => {
    const { conversationId, content } = data;
    if (!content || !conversationId) return;

    try {
      // 1. Create and save the message to MongoDB
      const newMessage = new Message({
        conversation: conversationId,
        sender: socket.user._id, // From our auth middleware
        content: content,
      });
      await newMessage.save();

      // 2. Populate sender info (name, etc.) to send to clients
      const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender', 'name email'); // Only send name and email

      // 3. Emit the new message to everyone *in that room*
      io.to(conversationId).emit('newMessage', populatedMessage);
      
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// --- START SERVER ---
// Start server only after MongoDB is connected
mongoose.connection.once('connected', () => {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});