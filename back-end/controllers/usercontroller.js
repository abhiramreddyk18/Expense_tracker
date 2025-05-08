const mongoose = require('mongoose');
const UserBank = require('../models/UserLinkedBank'); 
const User=require('../models/user');
exports.search_user_by_phone = async (req, res) => {
  const { phoneNumber } = req.query;
  console.log("Phone query:", phoneNumber); // Log the phone number to verify the input

  // If no phone number is provided, return a 400 error
  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    // Search users whose phone number starts with the query value (case-insensitive)
    const users = await UserBank.find({
      phoneNumber: { $regex: `^${phoneNumber}`, $options: 'i' }
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the found users
    res.status(200).json({ users });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.search_user_by_id = async (req, res) => {

  const userId = req.params.id;
      console.log("idljdas: "+userId)
  try {
    const user = await User.findById(new mongoose.Types.ObjectId(userId));

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }}
