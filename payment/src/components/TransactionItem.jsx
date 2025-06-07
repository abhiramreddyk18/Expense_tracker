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
    <div className="min-h-screen px-8 py-10 bg-[#eef3f7] font-sans">

      {/* Balance Section */}
      <div className="mb-10 text-center">
        <h2 className="flex justify-center items-center text-2xl font-bold text-indigo-700 gap-2 mb-2">
          <CiBank size={28} /> Bank Balance
        </h2>
        <p className="text-4xl text-green-600 font-semibold">₹ {balance.toLocaleString()}</p>
      </div>

      {/* Filter Section (No Card) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10 border p-4 bg-white">
        <label className="flex flex-col text-sm text-gray-800">
          Date
          <input
            type="date"
            name="date"
            onChange={handleFilterChange}
            className="border border-gray-300 p-2 mt-1 text-sm"
            value={filters.date}
          />
        </label>
        <label className="flex flex-col text-sm text-gray-800">
          Year
          <input
            type="number"
            name="year"
            placeholder="e.g., 2025"
            onChange={handleFilterChange}
            className="border border-gray-300 p-2 mt-1 text-sm"
            value={filters.year}
          />
        </label>
        <label className="flex flex-col text-sm text-gray-800">
          Month
          <input
            type="number"
            name="month"
            placeholder="1-12"
            onChange={handleFilterChange}
            className="border border-gray-300 p-2 mt-1 text-sm"
            value={filters.month}
          />
        </label>
        <label className="flex flex-col text-sm text-gray-800">
          Type
          <select
            name="type"
            onChange={handleFilterChange}
            className="border border-gray-300 p-2 mt-1 text-sm"
            value={filters.type}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label className="flex flex-col text-sm text-gray-800">
          Category
          <select
            name="category"
            onChange={handleFilterChange}
            className="border border-gray-300 p-2 mt-1 text-sm"
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

      {/* Transaction Header */}
      <h3 className="flex items-center text-xl font-bold mb-4 gap-2 text-gray-800">
        <GrTransaction /> Transaction History
      </h3>

      {/* Transactions */}
      {loading ? (
        <p className="text-sm text-gray-600">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-sm text-gray-600">No transactions found for selected filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions.map(txn => (
            <TransactionItem key={txn._id} txn={txn} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
