import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchUser = ({ onUserSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [payments, setPayments] = useState([]);
  const backendUrl = 'http://localhost:3000';

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

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      fontSize: '24px',
      marginBottom: '10px',
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      marginBottom: '20px',
    },
    card: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#fff',
      padding: '15px 20px',
      margin: '10px 0',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    cardHover: {
      transform: 'scale(1.01)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    },
    leftContent: {
      display: 'flex',
      flexDirection: 'column',
    },
    name: {
      fontWeight: 'bold',
      fontSize: '16px',
      marginBottom: '4px',
    },
    phone: {
      color: '#888',
      fontSize: '13px',
    },
    money: {
      fontWeight: 'bold',
      fontSize: '16px',
      minWidth: '70px',
      textAlign: 'right',
    },
    amountPositive: {
      color: 'green',
    },
    amountNegative: {
      color: 'red',
    },
    noResults: {
      textAlign: 'center',
      color: '#888',
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Search by Phone Number</h2>
      <input
        type="text"
        placeholder="Enter phone number"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={styles.input}
      />

      {query?.length <= 1 && payments?.length > 0 && (
        <div>
          <h3 style={{ ...styles.name, marginTop: '20px' }}>Recent Payments</h3>
          {payments.map((payment) => (
            <div key={payment._id} style={styles.card}>
              <div style={styles.leftContent}>
                <div style={styles.name}>{payment.otherUserName}</div>
                <div style={styles.phone}>{payment.otherUserPhone}</div>
              </div>
              <div
                style={{
                  ...styles.money,
                  ...(payment.type === 'received'
                    ? styles.amountPositive
                    : styles.amountNegative),
                }}
              >
                ₹{payment.amount}
              </div>
            </div>
          ))}
        </div>
      )}

      {results?.length > 0 && (
        <div>
          <h3 style={{ ...styles.name, marginTop: '20px' }}>Search Results</h3>
          {results.map((user) => (
            <div
              key={user._id}
              style={styles.card}
              onClick={() => onUserSelect(user)}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, styles.cardHover)
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, styles.card)
              }
            >
              <div style={styles.leftContent}>
                <div style={styles.name}>{user.name}</div>
                <div style={styles.phone}>{user.phoneNumber}</div>
              </div>
              <div style={{ ...styles.money, color: '#444', fontWeight: 500 }}>
                View
              </div>
            </div>
          ))}
        </div>
      )}

      {results?.length === 0 && query?.length > 1 && (
        <p style={styles.noResults}>No users found</p>
      )}
    </div>
  );
};

export default SearchUser;
