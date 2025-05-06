const Otp = require('../models/otp');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
       
const UserBank = require('../models/UserLinkedBank'); 
const generateToken = require('../utils/generateToken');
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
   
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

   
    const now = new Date();
    const otpAge = (now - otpRecord.createdAt) / 1000;
    if (otpAge > 300) {
      return res.status(400).json({ message: 'OTP expired' });
    }

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isNewUser = !user.isBankConnected;
    const token = generateToken(email, user._id);
    return res.status(200).json({
      verified: true,
      isNewUser,
      token,
      userId: user._id,
      email: user.email,
    });

  } catch (error) {
    console.error('OTP Verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.SendingOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    let existingUser = await User.findOne({ email });

    
    if (!existingUser) {
      existingUser = await User.create({
        email,
        transactionPin: null,
        bankdetails: null
      });
      
      await existingUser.save();
    }

    
    const otp = generateOtp();
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    
    await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`);

    
   

    res.status(200).json({success:true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
