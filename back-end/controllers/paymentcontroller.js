
const bcrypt = require("bcrypt");
const Transaction=require('../models/transaction')
const User = require('../models/user')

const BankDetails = require('../models/UserLinkedBank');

const generateTransactionId = () => {
  return "TXN" + Date.now() + Math.floor(Math.random() * 1000);
};

const generateUTRId = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

exports.send_money = async (req, res) => {
  const { senderId, receiverEmail, amount, category, description } = req.body;

  try {
   
    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or Receiver not found" });
    }

    const isValidPin = await bcrypt.compare(pin, sender.transactionPin);
  if (!isValidPin) return res.status(401).json({ message: "Invalid transaction PIN" });

    if (sender.bankdetails.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    
    sender.bankdetails.balance -= amount;
    receiver.bankdetails.balance += amount;

    await sender.save();
    await receiver.save();

    const utrId = generateUTRId();

   
    const senderTransaction = await Transaction.create({
      userId: sender._id,
      type: "expense",
      amount,
      category,
      description,
      relatedUser: receiver._id,
      transactionId: generateTransactionId(),
      utrId
    });

  
    const receiverTransaction = await Transaction.create({
      userId: receiver._id,
      type: "income",
      amount,
      category,
      description,
      relatedUser: sender._id,
      transactionId: generateTransactionId(),
      utrId
    });

    res.status(200).json({
      message: "Transaction successful",
      senderTransactionId: senderTransaction.transactionId,
      receiverTransactionId: receiverTransaction.transactionId,
      utrId
    });

  } catch (err) {
    console.error("Error sending money:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.setTransactionPin = async (req, res) => {
  const { userId, pin } = req.body;

  if (!pin || pin.length !== 4) {
    return res.status(400).json({ message: "PIN must be 4 digits" });
  }

  const hashedPin = await bcrypt.hash(pin, 10);
  await User.findByIdAndUpdate(userId, { transactionPin: hashedPin });

  res.status(200).json({ message: "Transaction PIN set successfully" });
};




exports.recent_payments = async (req, res) => {

  const { userId } = req.params;

  try {
    
    const recentPayments = await Transaction.find({
      $or: [{ userId: userId }, { relatedUser: userId }] 
    })
      .populate('userId', 'name') 
      .populate('relatedUser', 'name') 
      .sort({ date: -1 }) 
      .select('userId relatedUser type amount date'); 


    res.json({ payments: recentPayments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching recent payments' });
  }
}

