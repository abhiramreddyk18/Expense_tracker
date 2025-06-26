const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  message: { type: String },
  amount: { type: Number },
  category: { type: String },
  description: { type: String },
  type: { type: String, enum: ['text', 'money'], required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
