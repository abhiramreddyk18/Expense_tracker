import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionItem from '../components/TransactionItem';

const styles = {
  container: {
    padding: '24px',
    maxWidth: '768px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  },
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  balance: {
    textAlign: 'center',
    fontSize: '32px',
    color: '#38a169',
    fontWeight: '600',
    marginBottom: '24px'
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  input: {
    border: '1px solid #ccc',
    padding: '8px',
    borderRadius: '6px',
    fontSize: '14px'
  },
  select: {
    border: '1px solid #ccc',
    padding: '8px',
    borderRadius: '6px',
    fontSize: '14px'
  },
  subheading: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  message: {
    fontSize: '14px',
    color: '#4a5568'
  }
};

const TransactionHistory = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    year: '',
    month: '',
    type: '',
    category: ''
  });
  
  const userId = localStorage.getItem("userId");
  const backendUrl = 'http://localhost:3000';

  const fetchHistory = async () => {
    try {
      console.log(userId);
      const res = await axios.get(`${backendUrl}/payment/searchtransactions`, {
        params: {
          userId,
          ...filters,
        }
      });

      console.log(res.data);
      
      if (res.data) {
        setBalance(res.data.balance);
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };


  useEffect(() => {
    if (userId) {
      fetchHistory();
    }
  }, [filters, userId]);

 
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>💼 Bank Balance</h2>
      <h1 style={styles.balance}>₹ {balance}</h1>

      <div style={styles.filterGrid}>
        <input
          type="date"
          name="date"
          onChange={handleFilterChange}
          style={styles.input}
          value={filters.date}
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          onChange={handleFilterChange}
          style={styles.input}
          value={filters.year}
        />
        <input
          type="number"
          name="month"
          placeholder="Month (1-12)"
          onChange={handleFilterChange}
          style={styles.input}
          value={filters.month}
        />
        <select
          name="type"
          onChange={handleFilterChange}
          style={styles.select}
          value={filters.type}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          name="category"
          onChange={handleFilterChange}
          style={styles.input}
          value={filters.category}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Travel">Travel</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          <option value="Salary">Salary</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <h3 style={styles.subheading}>📜 Transaction History</h3>
      {transactions.length === 0 ? (
        <p style={styles.message}>No transactions found for selected filters.</p>
      ) : (
        transactions.map(txn => (
          <TransactionItem key={txn._id} txn={txn} />
        ))
      )}
    </div>
  );
};

export default TransactionHistory;
