const mongoose = require("mongoose");

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
  bankdetails: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserBank',  
    required: false
  },
  transactionPin: {
    type: String, 
    required: false
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
