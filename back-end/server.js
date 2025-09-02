require('dotenv').config();
const express = require("express");
const connectDB = require('./db');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');

// Routes
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const bankUserRoutes = require('./routes/bank');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/bank', bankUserRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('✅ Expense Tracker Backend is running!');
});

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
app.locals.io = io;

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinRoom', (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
