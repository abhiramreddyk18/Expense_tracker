const mongoose = require("mongoose");

const userbankSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  
    required: true 
  },  
  name: {
    type: String,
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  ifsc: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phonenumber: {
    type: String,
    required: true
  }
});

const UserBank = mongoose.model("UserBank", userbankSchema); 

module.exports = UserBank;
