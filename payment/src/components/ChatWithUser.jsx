import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';  // <-- import socket.io-client

const backendUrl = 'http://localhost:3000'; // Move outside component for reuse
const socket = io(backendUrl);               // Create socket connection once

const ChatWithUser = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [refresh, setRefresh] = useState(false);

  const senderId = localStorage.getItem('userId');
  const location = useLocation();
  const navigate = useNavigate();
  const receiver = location.state?.receiver;
  const receiverId = receiver?._id;

  // Fetch messages from backend (same as before)
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

  // --- New: Setup socket listeners ---
  useEffect(() => {
    if (!senderId || !receiverId) return;

    // Join rooms (using user IDs)
    socket.emit('joinRoom', senderId);
    socket.emit('joinRoom', receiverId);

    // Listen for real-time messages sent to this user
    socket.on('messageReceived', (newMessage) => {
      // Only add message if it belongs to this chat (sender/receiver matches)
      if (
        (newMessage.senderId === senderId && newMessage.receiverId === receiverId) ||
        (newMessage.senderId === receiverId && newMessage.receiverId === senderId)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off('messageReceived');
    };
  }, [senderId, receiverId]);

  // Your existing sendMoneyWithDetails and handleSend remain unchanged
  // except we add socket emit after axios POST success

  // Send money message with category & description
  const sendMoneyWithDetails = async () => {
    if (!category) return alert('Please select a category');
    try {
      const res = await axios.post(`${backendUrl}/chat/send`, {
        senderId,
        receiverId,
        amount: Number(input),
        category,
        description,
        type: 'money',
      });
      const sentMessage = res.data; // assume backend returns the saved message

      // Emit message to socket for real-time update
      socket.emit('sendMessage', sentMessage);

      setInput('');
      setCategory('');
      setDescription('');
      setShowPaymentDetails(false);
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
      alert('Failed to send money.');
    }
  };

  // Send either text or direct money if input is a number
  const handleSend = async () => {
    if (!input.trim()) return;

    if (/^\d+(\.\d+)?$/.test(input.trim())) {
      // Input is a number
      if (showPaymentDetails) {
        sendMoneyWithDetails();
      } else {
        try {
          const res = await axios.post(`${backendUrl}/chat/send`, {
            senderId,
            receiverId,
            amount: Number(input),
            category: 'Other',
            description: '',
            type: 'money',
          });
          const sentMessage = res.data; // assume backend returns the saved message
          socket.emit('sendMessage', sentMessage);

          setInput('');
          setRefresh(!refresh);
        } catch (err) {
          console.error('Error sending money:', err);
          alert('Failed to send money.');
        }
      }
    } else {
      // Input is text
      try {
        const res = await axios.post(`${backendUrl}/chat/send`, {
          senderId,
          receiverId,
          message: input,
          type: 'text',
        });
        const sentMessage = res.data; // assume backend returns the saved message
        socket.emit('sendMessage', sentMessage);

        setInput('');
        setRefresh(!refresh);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  // ... rest of your return JSX stays the same ...
  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded-lg bg-white shadow-md font-sans">
      <h3 className="text-center text-xl font-semibold mb-6">Chat with {receiver?.name || 'User'}</h3>

      <div className="flex flex-col gap-3 mb-6 max-h-96 overflow-y-auto bg-gray-100 p-4 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-3/4 px-4 py-2 rounded-lg text-sm ${
              msg.senderId === senderId ? 'self-end bg-blue-200' : 'self-start bg-gray-300'
            } ${msg.type === 'money' ? 'bg-yellow-200' : ''}`}
          >
            {msg.type === 'money'
              ? `💸 Sent $${msg.amount} (${msg.category})${msg.description ? ` - ${msg.description}` : ''}`
              : msg.message}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message or enter amount"
          className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <button
          onClick={() => {
            if (/^\d+(\.\d+)?$/.test(input.trim()) && !showPaymentDetails) {
              setShowPaymentDetails(true);
            } else {
              handleSend();
            }
          }}
          disabled={!input.trim()}
          className={`px-4 py-2 rounded-md text-white ${
            input.trim()
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              : 'bg-blue-300 cursor-not-allowed'
          }`}
        >
          Send
        </button>
      </div>

      {showPaymentDetails && (
        <>
          <div className="mb-3">
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
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={sendMoneyWithDetails}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
            disabled={!category}
          >
            Confirm Payment
          </button>
        </>
      )}
    </div>
  );
};

export default ChatWithUser;
