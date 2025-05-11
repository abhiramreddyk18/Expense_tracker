const User = require('../models/user');
const BankDetails = require('../models/bankdetails'); 
const UserBank = require('../models/UserLinkedBank');    

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
    console.log(fakeBank);
    console.log(email);
    console.log(phoneNumber);
    console.log(accountNumber);
    console.log(CVV);
    console.log(bankName);
    console.log(ifscCode);
    
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
      user
    });

  } catch (error) {
    console.error("Bank verification error:", error);
    return res.status(500).json({ error: 'Failed to verify bank details' });
  }
};
