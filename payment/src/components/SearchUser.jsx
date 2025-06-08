import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchUser = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [payments, setPayments] = useState([]);
  const backendUrl = 'http://localhost:3000';
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchUserPayments();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query && query.length > 1) {
        searchUsers();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchUsers = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${backendUrl}/user/searchuser?phoneNumber=${query}&userId=${userId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResults(data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setResults([]);
    }
  };

  const goToChat = (receiverObj) => {
    navigate('/chat', { state: { receiver: receiverObj } });
  };

  const fetchUserPayments = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const res = await axios.get(`${backendUrl}/payment/user-payments/${userId}`);
      setPayments(res.data.payments);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200 via-indigo-100 to-white flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-9xl w-full bg-white rounded-2xl shadow-xl p-8 font-sans">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 text-center">Search by Phone Number</h2>
        <input
          type="text"
          placeholder="Enter phone number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 text-lg rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          autoFocus
        />

        {query?.length <= 1 && payments?.length > 0 && (
          <div>
            <h3 className="font-semibold text-xl text-indigo-800 mt-8 mb-4 border-b border-indigo-200 pb-2">Recent Payments</h3>
            {payments.map((payment) => (
              <div
                key={payment._id}
                onClick={() => goToChat(payment)}
                onMouseEnter={() => setHoveredCard(payment._id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`flex justify-between items-center bg-indigo-50 p-4 my-2 rounded-lg shadow cursor-pointer transform transition duration-200 ${
                  hoveredCard === payment._id ? 'scale-[1.03] shadow-lg bg-indigo-100' : 'shadow-sm'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-indigo-900 text-lg">{payment.otherUserName}</span>
                  <span className="text-indigo-600 text-sm">{payment.otherUserPhone}</span>
                </div>
                <div
                  className={`font-bold text-lg min-w-[70px] text-right ${
                    payment.type === 'received' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  ₹{payment.amount}
                </div>
              </div>
            ))}
          </div>
        )}

        {results?.length > 0 && (
          <div>
            <h3 className="font-semibold text-xl text-indigo-800 mt-8 mb-4 border-b border-indigo-200 pb-2">Search Results</h3>
            {results.map((user) => (
              <div
                key={user._id}
                onClick={() => goToChat(user)}
                onMouseEnter={() => setHoveredCard(user._id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`flex justify-between items-center bg-indigo-50 p-4 my-2 rounded-lg shadow cursor-pointer transform transition duration-200 ${
                  hoveredCard === user._id ? 'scale-[1.03] shadow-lg bg-indigo-100' : 'shadow-sm'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-indigo-900 text-lg">{user.name}</span>
                  <span className="text-indigo-600 text-sm">{user.phoneNumber}</span>
                </div>
                <div className="font-semibold text-indigo-700 text-lg">View</div>
              </div>
            ))}
          </div>
        )}

        {results?.length === 0 && query?.length > 1 && (
          <p className="text-center text-indigo-600 mt-6 font-medium">No users found</p>
        )}
      </div>
    </div>
  );
};

export default SearchUser;
