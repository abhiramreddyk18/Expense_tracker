import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchUser = ({ onUserSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [payments, setPayments] = useState([]);
  const backendUrl = 'http://localhost:3000';
  const [hoveredId, setHoveredId] = useState(null);

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
    <div className="max-w-xl mx-auto p-5 font-sans">
      <h2 className="text-2xl mb-3 font-semibold">Search by Phone Number</h2>
      <input
        type="text"
        placeholder="Enter phone number"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 mb-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      {query.length <= 1 && payments.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mt-5 mb-2">Recent Payments</h3>
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="flex justify-between items-center bg-white p-4 mb-3 rounded-lg shadow cursor-default"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-base">{payment.otherUserName}</span>
                <span className="text-sm text-gray-500">{payment.otherUserPhone}</span>
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

      {results.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mt-5 mb-2">Search Results</h3>
          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => onUserSelect(user)}
              onMouseEnter={() => setHoveredId(user._id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                flex justify-between items-center bg-white p-5 mb-3 rounded-lg shadow cursor-pointer
                transition-transform duration-200
                ${hoveredId === user._id ? 'scale-105 shadow-lg' : ''}
              `}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-base">{user.name}</span>
                <span className="text-sm text-gray-500">{user.phoneNumber}</span>
              </div>
              <div className="font-medium text-gray-700">View</div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && query.length > 1 && (
        <p className="text-center text-gray-500 mt-5">No users found</p>
      )}
    </div>
  );
};

export default SearchUser;
