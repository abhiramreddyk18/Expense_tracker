const mongoose = require("mongoose");
const bankSchema=require("./BankDetails")
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
    bankDetails: {
        type: bankSchema,
        default: undefined  
      },
      transactionPin: {
        type: String, 
        required: false
      }
  });
  

const User = mongoose.model("User", userSchema);

module.exports = User;  