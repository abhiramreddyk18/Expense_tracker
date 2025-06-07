import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const backendUrl = 'http://localhost:3000';
const socket = io(backendUrl);

const ChatWithUser = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [refresh, setRefresh] = useState(false);

  const senderId = localStorage.getItem('userId');
  const location = useLocation();
  const navigate = useNavigate();
  const receiver = location.state?.receiver;
  const receiverId = receiver?._id;

  const fetchMessages = async () => {
    if (!receiverId) return;
    try {
      const res = await axios.get(`${backendUrl}/chat/${senderId}/${receiverId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [refresh, receiverId]);

  useEffect(() => {
    if (!senderId || !receiverId) return;

    socket.emit('joinRoom', senderId);
    socket.emit('joinRoom', receiverId);

    socket.on('messageReceived', (newMessage) => {
      if (
        (newMessage.senderId === senderId && newMessage.receiverId === receiverId) ||
        (newMessage.senderId === receiverId && newMessage.receiverId === senderId)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => socket.off('messageReceived');
  }, [senderId, receiverId]);

  const sendMoneyWithDetails = async () => {
    try {
      const res = await axios.post(`${backendUrl}/chat/send`, {
        senderId,
        receiverId,
        amount: Number(input),
        category,
        description,
        type: 'money',
      });
      const sentMessage = res.data;
      socket.emit('sendMessage', sentMessage);

      setInput('');
      setCategory('');
      setDescription('');
      setShowPaymentPopup(false);
      setRefresh(!refresh);

      navigate('/confirm-pin', {
        state: {
          receiver,
          senderId,
          receiverId,
          receiverEmail: receiver.email,
          amount: input,
          category,
          description,
          returnToChat: true,
        },
      });
    } catch (err) {
      console.error('Error sending money:', err);
    }
  };

  const sendTextMessage = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(`${backendUrl}/chat/send`, {
        senderId,
        receiverId,
        message: input.trim(),
        type: 'text',
      });
      const sentMessage = res.data;
      socket.emit('sendMessage', sentMessage);

      setInput('');
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="w-screen h-screen m-0 p-0 bg-white px-4 mt-6 shadow-lg rounded-lg flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
          {receiver?.name?.charAt(0) || 'U'}
        </div>
        <h2 className="text-xl font-semibold">{receiver?.name || 'User'}</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 bg-gray-100 p-4 rounded-md max-h-[70vh]">
       {messages.map((msg, index) => {
  const time = new Date(msg.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use true if you want AM/PM format
  });

  return (
    <div
      key={index}
      className={`w-full flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`inline-block px-4 py-4 pb-6 rounded-lg text-sm break-words max-w-[80%] relative ${
          msg.type === 'money'
            ? 'bg-yellow-100 border border-yellow-400 text-gray-800'
            : msg.senderId === senderId
            ? 'bg-blue-200 text-right'
            : 'bg-gray-300 text-left'
        }`}
      >
        {/* Message Content */}
        {msg.type === 'money' ? (
          <div>
            <div className="font-semibold text-green-800">💸 ${msg.amount}</div>
            <div className="text-xs text-gray-700">Category: {msg.category}</div>
            {msg.description && (
              <div className="text-xs text-gray-600 italic">"{msg.description}"</div>
            )}
          </div>
        ) : (
          <span>{msg.message}</span>
        )}

        {/* Timestamp */}
        <div className="text-[10px] text-gray-600 absolute bottom-1 right-2">
          {time}
        </div>
      </div>
    </div>
  );
})}

      </div>

      {/* Input Section */}
      <div className="sticky bottom-0 bg-white pt-4 pb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message or amount..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm"
          />
          <button
            onClick={sendTextMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Send
          </button>
          <button
            onClick={() => setShowPaymentPopup(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            disabled={!/^\d+(\.\d+)?$/.test(input)}
          >
            Pay
          </button>
        </div>
      </div>

      {/* Payment Popup Modal */}
      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <div className="mb-3">
              <label className="block text-sm mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Travel">Travel</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Salary">Salary</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowPaymentPopup(false)}
                className="text-gray-600 border border-gray-400 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={sendMoneyWithDetails}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                disabled={!category}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWithUser;
