const mongoose = require("mongoose");
const UserBank = require('./UserLinkedBank'); 
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  isBankConnected: {
    type: Boolean,
    default: false
  },
  bankdetails: {   // Link to UserBank schema
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserBank',  // This refers to the UserBank model
    required: false
  },
  transactionPin: {
    type: String, 
    required: false
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
