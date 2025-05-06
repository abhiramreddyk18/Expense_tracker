require("dotenv").config();
const express = require("express");
const connectDB = require('./db'); // Assuming db.js connects to your MongoDB
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const bankUserRoutes = require('./routes/bank');
const userRoutes = require('./routes/user'); // Routes for user-related actions
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // To parse JSON
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/bank', bankUserRoutes);
app.use('/user', userRoutes); // User routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
