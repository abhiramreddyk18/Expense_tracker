const Message = require('../models/Message');

exports.send_message = async (req, res) => {
  try {
    const { senderId, receiverId, message, amount, category, description, type } = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      message: type === 'text' ? message : undefined,
      amount: type === 'money' ? amount : undefined,
      category: type === 'money' ? category : undefined,
      description: type === 'money' ? description : undefined,
      type
    });

    const savedMessage = await newMessage.save();

    // Emit the new message to the relevant rooms via Socket.io
    // Access io from req.app.locals
    const io = req.app.locals.io;
    if (io) {
      io.to(senderId).to(receiverId).emit('messageReceived', savedMessage);
    }

    // Respond with the saved message for frontend to emit via socket as well
    res.status(200).json(savedMessage);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
};

exports.users_messages = async (req, res) => {
  const { user1Id, user2Id } = req.params;
  try {
    const chats = await Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }
      ]
    }).sort({ timestamp: 1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chat', error: err.message });
  }
};
