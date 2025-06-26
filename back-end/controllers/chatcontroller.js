const Message = require('../models/Message');
const mongoose = require('mongoose');

// ✅ Send message (text or money)
exports.send_message = async (req, res) => {
  try {
    const {
      senderId,
      receiverId,
      message,
      amount,
      category,
      description,
      type,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: 'Invalid sender or receiver ID' });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      type,
      ...(type === 'text' && { message }),
      ...(type === 'money' && {
        amount,
        category,
        description,
      }),
    });

    const savedMessage = await newMessage.save();

    // ✅ Emit message to both sender & receiver via socket
    const io = req.app.locals.io;
    if (io) {
      io.to(senderId.toString()).emit('messageReceived', savedMessage);
      io.to(receiverId.toString()).emit('messageReceived', savedMessage);
    }

    res.status(200).json(savedMessage);
  } catch (err) {
    console.error("❌ Error saving message:", err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
};

// ✅ Get messages between two users
exports.users_messages = async (req, res) => {
  const { user1Id, user2Id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(user1Id) || !mongoose.Types.ObjectId.isValid(user2Id)) {
      return res.status(400).json({ message: 'Invalid user IDs' });
    }

    const chats = await Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ],
    }).sort({ createdAt: 1 }); // ⬆️ Oldest first

    res.status(200).json(chats);
  } catch (err) {
    console.error('❌ Error fetching messages:', err);
    res.status(500).json({ message: 'Error fetching chat', error: err.message });
  }
};
