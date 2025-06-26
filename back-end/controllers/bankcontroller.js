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
  const {email,phoneNumber, accountNumber, bankName, ifscCode,CVV} = req.body;

  try {
   
    const fakeBank = await BankDetails.findOne({ phonenumber: phoneNumber });

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
    const days = parseInt(req.query.days, 10);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    if (isNaN(days) || days <= 0) {
      return res.status(400).json({ error: 'Invalid number of days' });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const user = await User.findById(userId).select('bankdetails');
    if (!user || !user.bankdetails) {
      return res.status(404).json({ error: 'User or bank details not found' });
    }

    const userbank = await UserBank.findById(user.bankdetails);
    if (!userbank) {
      return res.status(404).json({ error: 'User bank not found' });
    }

   
    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userbank._id),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",   
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id": 1 }, 
      },
    ]);

  
    const formattedSummary = summary.map(item => ({
      category: item._id,
      totalAmount: item.totalAmount,
    }));

    return res.json(formattedSummary);
  } catch (err) {
    console.error('Error fetching category sum:', err);
    return res.status(500).json({ error: "Failed to fetch category summary." });
  }
};



const CategoryLimit = require('../models/limitSchema');


exports.getCategoryLimits = async (req, res) => {
  const { userId } = req.params;
  try {
    const limits = await CategoryLimit.find({ userId });
    res.json(limits);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch limits' });
  }
};


exports.saveOrUpdateCategoryLimit = async (req, res) => {
  const { userId } = req.params;
  const { category, limitAmount } = req.body;

  try {
    const updated = await CategoryLimit.findOneAndUpdate(
      { userId, category },
      { limitAmount },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save limit' });
  }
};





exports.deleteCategoryLimit = async (req, res) => {
  const { userId, category } = req.params;

  try {
    const deleted = await CategoryLimit.findOneAndDelete({ userId, category });

    if (!deleted) {
      return res.status(404).json({ message: 'Limit not found for the given category' });
    }

    res.status(200).json({ message: 'Limit deleted successfully' });
  } catch (error) {
    console.error('Error deleting limit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
