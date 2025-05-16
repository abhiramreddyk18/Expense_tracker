const User = require('../models/user');
const BankDetails = require('../models/bankdetails'); 
const UserBank = require('../models/UserLinkedBank');  
const Transaction=require('../models/transaction');
const mongoose=require('mongoose');  

exports.check_user = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      if (user.bankdetails) {
        return res.status(200).json({ exists: true, bankConnected: true });
      }
      return res.status(200).json({ exists: true, bankConnected: false });
    }

    return res.status(200).json({ exists: false });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.verify_bank_details = async (req, res) => {
  const { email, phoneNumber, accountNumber, bankName, ifscCode,CVV} = req.body;

  try {
   
    const fakeBank = await BankDetails.findOne({ email });

    if (!fakeBank) {
      return res.status(400).json({ success: false, message: 'Bank details not found' });
    }
    
    const isValid =
  fakeBank.accountNumber.toString().trim() === accountNumber.toString().trim() &&
  fakeBank.bankName.toLowerCase().trim() === bankName.toLowerCase().trim() &&
  fakeBank.ifsc.toLowerCase().trim() === ifscCode.toLowerCase().trim() &&
  fakeBank.cvv.toString().trim() === CVV.toString().trim() &&
  fakeBank.phonenumber.toString().trim() === phoneNumber.toString().trim();


    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Incorrect bank details' });
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const name=fakeBank.name;
    const newUserBank = new UserBank({
      userId: user._id,
      name: fakeBank.name,
      bankName: fakeBank.bankName,
      accountNumber: fakeBank.accountNumber,
      ifsc: fakeBank.ifsc,
      cvv: fakeBank.cvv,
      balance: fakeBank.balance,
      email: fakeBank.email,
      phoneNumber: fakeBank.phonenumber,
      pin:null
    });

    await newUserBank.save();

 
    user.bankdetails = newUserBank._id;
    user.isBankConnected = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Bank details connected successfully",
      name,
      user
    });

  } catch (error) {
    console.error("Bank verification error:", error);
    return res.status(500).json({ error: 'Failed to verify bank details' });
  }
};



exports.getSummaryForLastNDays = async (req, res) => {
  try {
    const { userId } = req.params;
    const n = parseInt(req.query.days, 10);

    if (!mongoose.Types.ObjectId.isValid(userId) || isNaN(n) || n < 0) {
      return res.status(400).json({ message: "Invalid userId or days" });
    }

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - n);


    const user = await  User.findById(userId);

     const userbank=await UserBank.findById(user.bankdetails);
    

    const result = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userbank._id),
          date: { $gte: fromDate },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let income = 0;
    let expense = 0;

    result.forEach((item) => {
      if (item._id === "income") income = item.total;
      if (item._id === "expense") expense = item.total;
    });

    const savings = income - expense;

    

    res.status(200).json({ income:income, expense: expense, savings: savings });

  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getcategorySum = async (req, res) => {
  try {
    const { userId } = req.params;
    const n = parseInt(req.query.days, 10);

    const endDate = new Date(); // Today
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - n); // Subtract 'n' days

    const user = await User.findById(userId);
    const userbank = await UserBank.findById(user.bankdetails);

    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userbank._id),
          date: { $gte: startDate, $lte: endDate } // Filter for transactions in the last 'n' days
        },
      },
      {
        $group: {
          _id: { category: "$category", type: "$type" },  // Group by category and type
          totalAmount: { $sum: "$amount" }
        },
      },
      {
        $sort: { "_id.category": 1, "_id.type": 1 } // Sort by category and then type
      }
    ]);

    // Format the data to send it to the frontend
    const formattedSummary = summary.map(item => ({
      category: item._id.category,
      type: item._id.type,
      totalAmount: item.totalAmount
    }));

    res.json(formattedSummary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch category summary." });
  }
};
