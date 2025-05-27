const mongoose = require('mongoose');

const categoryLimitSchema = new mongoose.Schema({
  userId: String,
  category: String,
  limitAmount: Number
});

module.exports = mongoose.model('CategoryLimit', categoryLimitSchema);
