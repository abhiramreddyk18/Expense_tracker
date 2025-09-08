import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionItem from '../components/TransactionItem';
import { CiBank } from "react-icons/ci";
import { GrTransaction } from "react-icons/gr";
import { useTheme } from '../context/ThemeContext'; // ✅ Import theme context

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

  const { darkMode } = useTheme();
  const userId = localStorage.getItem("userId");
  const backendUrl = import.meta.env.VITE_BACKEND_URL

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
    <div className={`min-h-screen p-8 transition-colors duration-300 ${
      darkMode
        ? 'bg-gray-900 text-white'
        : 'bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-gray-900'
    }`}>
      <div className={`max-w-6xl mx-auto rounded-lg shadow-lg p-8 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>

        {/* Header Balance */}
        <h2 className={`flex items-center text-3xl font-extrabold mb-3 gap-3 ${
          darkMode ? 'text-indigo-300' : 'text-indigo-700'
        }`}>
          <CiBank /> Bank Balance
        </h2>
        <h1 className={`text-left text-5xl font-bold mb-10 tracking-wide ${
          darkMode ? 'text-green-400' : 'text-green-600'
        }`}>
          ₹ {balance.toLocaleString()}
        </h1>

        {/* Filters */}
        <section className="mb-12 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          {['date', 'year', 'month'].map((field) => (
            <label key={field} className="flex flex-col text-sm font-medium">
              {field.charAt(0).toUpperCase() + field.slice(1)}
              <input
                type={field === 'date' ? 'date' : 'number'}
                name={field}
                placeholder={field === 'year' ? 'e.g., 2025' : field === 'month' ? '1-12' : ''}
                onChange={handleFilterChange}
                value={filters[field]}
                className={`border rounded-md p-3 mt-2 text-base focus:ring-2 focus:outline-none transition ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                }`}
              />
            </label>
          ))}

          <label className="flex flex-col text-sm font-medium">
            Type
            <select
              name="type"
              onChange={handleFilterChange}
              value={filters.type}
              className={`border rounded-md p-3 mt-2 text-base focus:ring-2 focus:outline-none transition ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
              }`}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium">
            Category
            <select
              name="category"
              onChange={handleFilterChange}
              value={filters.category}
              className={`border rounded-md p-3 mt-2 text-base focus:ring-2 focus:outline-none transition ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
              }`}
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
        <h3 className={`flex items-center text-xl font-semibold mb-8 gap-3 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          <GrTransaction /> Transaction History
        </h3>

        {/* Transactions Grid */}
        {loading ? (
          <p className="text-left font-semibold text-lg mt-14 animate-pulse text-indigo-500">
            Loading transactions...
          </p>
        ) : transactions.length === 0 ? (
          <p className="text-left italic mt-14 text-lg text-gray-400">
            No transactions found for selected filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {transactions.map(txn => (
              <div
                key={txn._id}
                className={`p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer ${
                  darkMode ? 'bg-gray-700' : 'bg-white'
                }`}
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
