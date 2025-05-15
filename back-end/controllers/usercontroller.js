const mongoose = require('mongoose');
const UserBank = require('../models/UserLinkedBank'); 
const User=require('../models/user');


exports.search_user_by_phone = async (req, res) => {
  const { phoneNumber } = req.query;


  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
   
    const users = await UserBank.find({
      phoneNumber: { $regex: `^${phoneNumber}`, $options: 'i' }
    });
  
 

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

   
    res.status(200).json({ users });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.search_user_by_id = async (req, res) => {

  const userId = req.params.id;
      
  try {

    const user = await  User.findById(userId);


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userbank=await UserBank.findById(user.bankdetails);

    
    res.json(userbank);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }}
