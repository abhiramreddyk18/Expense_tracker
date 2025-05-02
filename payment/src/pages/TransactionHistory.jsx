import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionItem from '../components/TransactionItem';

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

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`/api/transaction/history`, {
        params: {
          userId,
          ...filters,
        }
      });
      setBalance(res.data.balance);
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchHistory();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-center text-2xl font-bold">💼 Bank Balance</h2>
      <h1 className="text-center text-green-600 text-3xl font-semibold mb-6">₹ {balance}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <input
          type="date"
          name="date"
          onChange={handleFilterChange}
          className="border p-2 rounded"
          value={filters.date}
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          onChange={handleFilterChange}
          className="border p-2 rounded"
          value={filters.year}
        />
        <input
          type="number"
          name="month"
          placeholder="Month (1-12)"
          onChange={handleFilterChange}
          className="border p-2 rounded"
          value={filters.month}
        />
        <select name="type" onChange={handleFilterChange} className="border p-2 rounded" value={filters.type}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleFilterChange}
          className="border p-2 rounded"
          value={filters.category}
        />
      </div>

      <h3 className="text-xl font-semibold mb-2">📜 Transaction History</h3>
      {transactions.length === 0 ? (
        <p>No transactions found for selected filters.</p>
      ) : (
        transactions.map(txn => (
          <TransactionItem key={txn._id} txn={txn} />
        ))
      )}
    </div>
  );
};

export default TransactionHistory;
