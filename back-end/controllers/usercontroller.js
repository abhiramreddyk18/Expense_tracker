const UserBank = require('../models/UserLinkedBank'); 

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
