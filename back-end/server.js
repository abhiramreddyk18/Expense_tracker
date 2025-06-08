require("dotenv").config();
const express = require("express");
const connectDB = require('./db');  
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');             // add this
const { Server } = require('socket.io');  // add this

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const bankUserRoutes = require('./routes/bank');
const userRoutes = require('./routes/user'); 
const chatRoutes = require('./routes/chat');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);   // change this line to create server from app

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,      
}));



app.use(express.json()); 
app.use(bodyParser.json());

app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/bank', bankUserRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],
  },
});


app.locals.io = io;

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room: ${userId}`);
  });


  socket.on('sendMessage', (msgData) => {
    io.to(msgData.senderId).to(msgData.receiverId).emit('messageReceived', msgData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
