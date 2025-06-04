import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchUser = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [payments, setPayments] = useState([]);
  const backendUrl = 'http://localhost:3000';
  const navigate = useNavigate();

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
      const response = await fetch(`${backendUrl}/user/searchuser?phoneNumber=${query}`);
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

  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="max-w-xl mx-auto p-5 font-sans">
      <h2 className="text-2xl mb-2 font-semibold">Search by Phone Number</h2>
      <input
        type="text"
        placeholder="Enter phone number"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 text-base rounded-md border border-gray-300 mb-5"
      />

      {query?.length <= 1 && payments?.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mt-5 mb-3">Recent Payments</h3>
          {payments.map((payment) => (
            <div
              key={payment._id}
              onClick={() => goToChat(payment)}
              onMouseEnter={() => setHoveredCard(payment._id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`flex justify-between items-center bg-white p-4 my-2 rounded-lg shadow transition-transform duration-200 cursor-pointer ${
                hoveredCard === payment._id ? 'scale-[1.01] shadow-lg' : 'shadow-sm'
              }`}
            >
              <div className="flex flex-col">
                <div className="font-bold text-base mb-1">{payment.otherUserName}</div>
                <div className="text-gray-500 text-xs">{payment.otherUserPhone}</div>
              </div>
              <div
                className={`font-bold text-base min-w-[70px] text-right ${
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
          <h3 className="font-bold text-lg mt-5 mb-3">Search Results</h3>
          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => goToChat(user)}
              onMouseEnter={() => setHoveredCard(user._id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`flex justify-between items-center bg-white p-4 my-2 rounded-lg shadow transition-transform duration-200 cursor-pointer ${
                hoveredCard === user._id ? 'scale-[1.01] shadow-lg' : 'shadow-sm'
              }`}
            >
              <div className="flex flex-col">
                <div className="font-bold text-base mb-1">{user.name}</div>
                <div className="text-gray-500 text-xs">{user.phoneNumber}</div>
              </div>
              <div className="font-semibold text-base text-gray-700">View</div>
            </div>
          ))}
        </div>
      )}

      {results?.length === 0 && query?.length > 1 && (
        <p className="text-center text-gray-500 mt-5">No users found</p>
      )}
    </div>
  );
};

export default SearchUser;
