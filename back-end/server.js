require("dotenv").config();
const express = require("express");
const connectDB = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 5000;
const paymentRoutes = require('./routes/payment');
const bank_user=require('./routes/bank');
const user=require('./routes/user');
connectDB();


app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/bank',bank_user);
app.use('/user',user);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






