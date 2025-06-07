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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        
        {/* Header Balance */}
        <h2 className="flex items-center text-3xl font-extrabold text-indigo-700 mb-3 gap-3">
          <CiBank /> Bank Balance
        </h2>
        <h1 className="text-left text-5xl text-green-600 font-bold mb-10 tracking-wide">
          ₹ {balance.toLocaleString()}
        </h1>

        {/* Filters */}
        <section className="mb-12 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          <label className="flex flex-col text-sm text-gray-700 font-medium">
            Date
            <input
              type="date"
              name="date"
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md p-3 mt-2 text-base focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              value={filters.date}
            />
          </label>
          <label className="flex flex-col text-sm text-gray-700 font-medium">
            Year
            <input
              type="number"
              name="year"
              placeholder="e.g., 2025"
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md p-3 mt-2 text-base focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              value={filters.year}
            />
          </label>
          <label className="flex flex-col text-sm text-gray-700 font-medium">
            Month
            <input
              type="number"
              name="month"
              placeholder="1-12"
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md p-3 mt-2 text-base focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              value={filters.month}
            />
          </label>
          <label className="flex flex-col text-sm text-gray-700 font-medium">
            Type
            <select
              name="type"
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md p-3 mt-2 text-base focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              value={filters.type}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label className="flex flex-col text-sm text-gray-700 font-medium">
            Category
            <select
              name="category"
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md p-3 mt-2 text-base focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
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
        </section>

        {/* Transaction History Title */}
        <h3 className="flex items-center text-xl font-semibold mb-8 gap-3 text-gray-800">
          <GrTransaction /> Transaction History
        </h3>

        {/* Transactions Grid */}
        {loading ? (
          <p className="text-left text-indigo-600 font-semibold text-lg mt-14 animate-pulse">
            Loading transactions...
          </p>
        ) : transactions.length === 0 ? (
          <p className="text-left italic text-gray-400 mt-14 text-lg">No transactions found for selected filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {transactions.map(txn => (
              <div
                key={txn._id}
                className="p-5 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow cursor-pointer"
              >
                <TransactionItem txn={txn} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
