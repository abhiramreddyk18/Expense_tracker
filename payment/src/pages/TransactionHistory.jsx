import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionItem from '../components/TransactionItem';
import { CiBank } from "react-icons/ci";
import { GrTransaction } from "react-icons/gr";

const TransactionHistory = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const res = await axios.get(`${backendUrl}/payment/searchtransactions`, {
        params: {
          userId,
          ...filters,
        }
      });

      if (res.data) {
        setBalance(res.data.balance || 0);
        setTransactions(res.data.transactions || []);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
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
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h2 className="flex items-center text-2xl font-bold text-indigo-600 mb-4 gap-2">
        <CiBank /> Bank Balance
      </h2>
      <h1 className="text-center text-4xl font-semibold text-green-600 mb-6">
        ₹ {balance}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <label className="flex flex-col text-sm text-gray-700">
          Date
          <input
            type="date"
            name="date"
            onChange={handleFilterChange}
            className="mt-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={filters.date}
          />
        </label>

        <label className="flex flex-col text-sm text-gray-700">
          Year
          <input
            type="number"
            name="year"
            placeholder="e.g., 2025"
            onChange={handleFilterChange}
            className="mt-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={filters.year}
          />
        </label>

        <label className="flex flex-col text-sm text-gray-700">
          Month
          <input
            type="number"
            name="month"
            placeholder="1-12"
            onChange={handleFilterChange}
            className="mt-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={filters.month}
          />
        </label>

        <label className="flex flex-col text-sm text-gray-700">
          Type
          <select
            name="type"
            onChange={handleFilterChange}
            className="mt-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={filters.type}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label className="flex flex-col text-sm text-gray-700">
          Category
          <select
            name="category"
            onChange={handleFilterChange}
            className="mt-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
        </label>
      </div>

      <h3 className="flex items-center text-xl font-semibold mb-3 gap-2 text-gray-800">
        <GrTransaction /> Transaction History
      </h3>

      {loading ? (
        <p className="text-gray-600 text-sm">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-600 text-sm">No transactions found for selected filters.</p>
      ) : (
        transactions.map(txn => (
          <TransactionItem key={txn._id} txn={txn} />
        ))
      )}
    </div>
  );
};

export default TransactionHistory;
