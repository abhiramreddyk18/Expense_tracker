import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchUser = ({ loggedInUserId, onUserSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchUserPayments();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query && query.length > 1) {  // Safe check for query
        searchUsers();
      } else {
        setResults([]);
      }
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchUsers = async () => {
    try {
      const res = await axios.get(`/api/transaction/search-user?query=${query}`);
      setResults(res.data.users); 
    } catch (err) {
      setResults([]);
    }
  };

  const fetchUserPayments = async () => {
    try {
      const res = await axios.get(`/api/transaction/user-payments/${loggedInUserId}`);
      setPayments(res.data.payments);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Search by Phone Number</h2>
      <input
        type="text"
        placeholder="Enter phone number"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Show recent payments if no search */}
      {query?.length <= 1 && payments?.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-semibold mb-2">Recent Payments</h3>
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="flex items-center bg-white p-4 rounded-lg shadow"
            >
              <img
                src={payment.otherUserPhoto || '/default-user.png'}
                alt="User"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{payment.otherUserName}</h4>
                <p className="text-gray-500">{payment.otherUserPhone}</p>
                <p className="text-gray-600">
                  {payment.type === 'received' ? 'Received' : 'Sent'} ₹{payment.amount}
                </p>
              </div>
              <div className={`font-bold ${payment.type === 'received' ? 'text-green-600' : 'text-red-500'}`}>
                ₹{payment.amount}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* When searching show filtered users */}
      {results?.length > 0 && (
        <div className="user-results">
          {results.map((user) => (
            <div
              key={user._id}
              className="user-card"
              onClick={() => onUserSelect(user)}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <p>{user.phoneNumber}</p>
            </div>
          ))}
        </div>
      )}
     
      {results?.length === 0 && query?.length > 1 && (
        <p>No users found</p>
      )}
    </div>
  );
};

export default SearchUser;
