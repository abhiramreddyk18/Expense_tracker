import React, { useEffect, useRef, useState } from 'react';
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
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!receiverId) return;
      const res = await axios.get(`${backendUrl}/chat/${senderId}/${receiverId}`);
      setMessages(res.data);
    };
    fetchMessages();
  }, [refresh, receiverId]);

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    if (!senderId || !receiverId) return;
    socket.emit('joinRoom', senderId);
    socket.emit('joinRoom', receiverId);
    socket.on('messageReceived', (newMsg) => {
      if (
        (newMsg.senderId === senderId && newMsg.receiverId === receiverId) ||
        (newMsg.senderId === receiverId && newMsg.receiverId === senderId)
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });
    return () => socket.off('messageReceived');
  }, [senderId, receiverId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  const sendTextMessage = async () => {
    if (!input.trim()) return;
    const res = await axios.post(`${backendUrl}/chat/send`, {
      senderId,
      receiverId,
      message: input.trim(),
      type: 'text',
    });
    socket.emit('sendMessage', res.data);
    setInput('');
    setRefresh(!refresh);
  };

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
      socket.emit('sendMessage', res.data);
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

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      <div className="fixed top-18 left-0 right-0 bg-white z-20 shadow px-4 py-3 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
          {receiver?.name?.charAt(0) || 'U'}
        </div>
        <h2 className="text-xl font-semibold">{receiver?.name || 'User'}</h2>
      </div>

      <div
        className="mt-[1px] flex-1 overflow-y-auto px-4 space-y-3 bg-gray-100"
        style={{ paddingBottom: '72px' }}
      >
        {messages.map((msg, i) => {
          const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <div
              key={i}
              className={`w-full flex ${
                msg.senderId === senderId ? 'justify-end' : 'justify-start'
              } mb-2`}
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
                <div className="text-[10px] text-gray-600 absolute bottom-1 right-2">{time}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="sticky bottom-0 bg-white px-4 py-3 border-t border-gray-200 z-10">
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Enter Payment Details</h3>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 text-sm"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 text-sm"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPaymentPopup(false)}
                className="px-4 py-2 rounded bg-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={sendMoneyWithDetails}
                className="px-4 py-2 rounded bg-green-600 text-white text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWithUser;
