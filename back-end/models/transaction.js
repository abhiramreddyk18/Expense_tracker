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
  },
  date: {
    type: Date,
    default: Date.now,
  },
  year: {
    type: Number,
  },
  month: {
    type: Number, 
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
  },
  transactionId: {
    type: String,
    unique: true,
  },
});


transactionSchema.pre("save", function (next) {
  const date = new Date(this.date);
  this.year = date.getFullYear();
  this.month = date.getMonth()+1;
  this.day = date.getDate();
  next();
});

transactionSchema.index({ userId: 1, date: -1 }); 
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, year: 1, month: 1 });
module.exports = mongoose.model("Transaction", transactionSchema);
