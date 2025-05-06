const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Food",
      "Bills",
      "Entertainment",
      "Shopping",
      "Travel",
      "Education",
      "Health",
      "Salary",
      "Other"
    ],
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  year: {
    type: Number,
  },
  month: {
    type: Number, // 1-based (1 = Jan, 12 = Dec)
  },
  day: {
    type: Number,
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  utr: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
});

transactionSchema.pre("save", function (next) {
  const date = new Date(this.date);
  this.year = date.getFullYear();
  this.month = date.getMonth() + 1; 
  this.day = date.getDate();
  next();
});



const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
