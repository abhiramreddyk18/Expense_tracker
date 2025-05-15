const Transaction=require('../models/transaction');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const UserBank = require('../models/UserLinkedBank');
const mongoose = require("mongoose");
const { verify } = require('crypto');
const generateTransactionId = () => {
  return "TXN" + Date.now() + Math.floor(Math.random() * 1000);
};

const generateUniqueUTR = async () => {
  let unique = false;
  let utr;

  while (!unique) {
    utr = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const existing = await Transaction.findOne({ utr });
    if (!existing) {
      unique = true;
    }
  }

  return utr;
};

exports.sending_money = async (req, res) => {
  const { senderId, receiverId, amount, category, description,pin } = req.body;
     
  try {
    if (!senderId || !receiverId || !amount || !pin) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const sender = await UserBank.findById(senderId);
    const receiver = await UserBank.findById(receiverId);
 
    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or Receiver not found" });
    }
    let p=pin.toString()



   
   const isPinCorrect = (p==sender.pin);


    if (!isPinCorrect) {
      return res.status(401).json({ message: "Incorrect PIN" });
    }
    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    const utrId1 =await generateUniqueUTR();
    const utrId2 =await generateUniqueUTR();

   
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    const senderTransaction = await Transaction.create({
      userId: senderId,
      type: "expense",
      amount,
      category,
      description,
      relatedUser: receiverId,
      transactionId: generateTransactionId(),
      utr:utrId1, 
      date: now,
      year,
      month,
      day
    });
    
    const receiverTransaction = await Transaction.create({
      userId: receiverId,
      type: "income",
      amount,
      category,
      description,
      relatedUser: senderId,
      transactionId: generateTransactionId(),
      utr:utrId2,
      date: now,
      year,
      month,
      day
    });
    
    res.status(200).json({
      message: "Transaction successful",
      senderTransactionId: senderTransaction.transactionId,
      receiverTransactionId: receiverTransaction.transactionId,
      utrId1,
      utrId2
    });

  } catch (err) {
    console.error("Error sending money:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.setTransactionPin = async (req, res) => {
  const { userId, userpin } = req.body;

  if (!userpin || userpin.length !== 4) {
    return res.status(400).json({ message: "PIN must be 4 digits" });
  }

  const hashedPin = await bcrypt.hash(userpin, 10);
  await BankDetails.findByIdAndUpdate(userId, { pin: hashedPin });

  res.status(200).json({ message: "Transaction PIN set successfully" });
};




// exports.recent_payments = async (req, res) => {

//   const { userId } = req.params;

//   try {
    
//     const recentPayments = await Transaction.find({
//       $or: [{ userId: userId }, { relatedUser: userId }] 
//     })
//       .populate('userId', 'name') 
//       .populate('relatedUser', 'name') 
//       .sort({ date: -1 }) 
//       .select('userId relatedUser type amount date'); 


//     res.json({ payments: recentPayments });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching recent payments' });
//   }
// }


exports.searchTransactions = async (req, res) => {
  try {
    const {
      type,
      category,
      year,
      month,
      date,
      userId
    } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

   
    const bankUser = await UserBank.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (!bankUser) {
      return res.status(404).json({ message: "Bank account not found for user" });
    }

    
    const query = { userId: new mongoose.Types.ObjectId(bankUser._id) };

    
    if (type) query.type = type;
    if (category) query.category = category;
    if (year) query.year = Number(year);
    if (month) query.month = Number(month);

    if (date) {
      const specificDate = new Date(date);
      specificDate.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: specificDate, $lte: endOfDay };
    }

    
    const transactions = await Transaction.find(query);

    let balance = 0;
    for (const txn of transactions) {
      if (txn.type === "income") balance += txn.amount;
      else if (txn.type === "expense") balance -= txn.amount;
    }

    return res.status(200).json({ transactions, balance });
  } catch (error) {
    console.error("Error searching transactions:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



exports.setPin = async (req, res) => {
  const { userId, pin } = req.body;


  if (!userId || !pin) {
    return res.status(400).json({ message: 'User ID and PIN are required' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: 'PIN must be a 4-digit number' });
    }

    const userbank=await UserBank.findById(user.bankdetails);

    userbank.pin=pin;
    await userbank.save();

    res.status(200).json({ message: 'PIN set successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}



exports.recent_payments=async (req, res) => {

  const { userId } = req.params;
  


  try {
   
    const user = await User.findById(userId);

    if (!user || !user.bankdetails) {
      return res.status(404).json({ error: 'User or bank details not found' });
    }

    const userBankId = user.bankdetails;

    
    const transactions = await Transaction.find({
      $or: [
        { userId: userBankId },
      ]
    })
      .sort({ date: -1 })
      .limit(10);

    const payments = await Promise.all(
      transactions.map(async (tx) => {
        const isSender = String(tx.userId) === String(userBankId);
        const otherBankId = isSender ? tx.relatedUser : tx.userId;

        let otherUser = null;
        let otherUserBank = null;

        if (otherBankId) {
          otherUser = await User.findOne({ bankdetails: otherBankId });
          otherUserBank = await UserBank.findById(otherBankId);
        }

        return {
          _id: tx._id,
          amount: tx.amount,
          category: tx.category,
          type: isSender ? 'sent' : 'received',
          otherUserName: otherUserBank?.name || 'Unknown',
          otherUserPhone: otherUserBank?.phoneNumber || 'N/A',
          date: tx.date
        };
      })
    );

    return res.status(200).json({ payments });

  } catch (err) {
    console.error('Error fetching transactions:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

