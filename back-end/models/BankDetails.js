const mongoose = require("mongoose");

const bankAccountSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
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
  email:{
    type:String,
    required:true 
  },
  phonenumber:{
    type:String,
    required:ture
  }
});

const BankDetails = mongoose.model("customer_bank_details", bankAccountSchema);

module.exports = BankDetails;
