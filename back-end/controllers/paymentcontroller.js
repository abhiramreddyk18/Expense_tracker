const Transaction=require('../models/transaction');
const User = require('../models/user');

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

    const query = { userId };

    if (type) query.type = type;
    if (category) query.category = category;
    if (year) query.year = Number(year);
    if (month) query.month = Number(month);

    if (date) {
      const specificDate = new Date(date);
      specificDate.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: specificDate, $lt: endOfDay };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    // Calculate balance
    let balance = 0;
    for (const txn of transactions) {
      if (txn.type === "income") balance += txn.amount;
      else if (txn.type === "expense") balance -= txn.amount;
    }

    res.status(200).json({ transactions, balance });
  } catch (error) {
    console.error("Error searching transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

