require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

// CORS — allow Vercel frontend + localhost dev
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin === o) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(null, true); // Allow all for now — tighten after confirming it works
  },
  credentials: true,
}));

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'], credentials: true },
});

// Middleware
app.set('trust proxy', 1);
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mentors', require('./routes/mentors'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/events', require('./routes/events'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/summaries', require('./routes/summaries'));
app.use('/api/calendar', require('./routes/calendar'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', name: 'Nexus API' }));

// Socket.IO — real-time chat
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
  });

  socket.on('send-message', async (data) => {
    try {
      const { roomId, senderId, content } = data;
      const message = await Message.create({
        room: roomId, sender: senderId, content,
      });
      const populated = await message.populate('sender', 'name avatarInitials');
      io.to(roomId).emit('receive-message', populated);
    } catch (err) {
      console.error('Message error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Connect to MongoDB & start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => console.log(`Nexus server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
