
const User = require('../models/user');

const BankDetails = require('../models/BankDetails');



exports.check_user = async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (user) { 
      if (user.bankDetails.accountNumber) {
        return res.status(200).json({ exists: true, bankConnected: true });
      }
      return res.status(200).json({ exists: true, bankConnected: false });
    }
    
    return res.status(200).json({ exists: false });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}


exports.verify_bank_details = async (req, res) => {
  const { email, phoneNumber, accountNumber, bankName, ifscCode } = req.body;

  try {
  
    const fakeBankDetails = await BankDetails.findOne({ email });

    if (!fakeBankDetails) {
      return res.status(400).json({ success: false, message: 'Bank details not found' });
    }

  
    const isValid =
      fakeBankDetails.accountNumber === accountNumber &&
      fakeBankDetails.bankName === bankName &&
      fakeBankDetails.ifscCode === ifscCode &&
      fakeBankDetails. phoneNumber === phoneNumber;

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Incorrect bank details' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        isBankConnected: true,
        bankDetails: fakeBankDetails
      },
      { new: true } 
    );
    

    return res.status(200).json({ success: true, message: "Bank details connected successfully",User:  updatedUser });

  } catch (error) {
    console.error("Bank verification error:", error);
    return res.status(500).json({ error: 'Failed to verify bank details' });
  }
};