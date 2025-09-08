import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { logout } from '../auth';
import { useTheme } from '../context/ThemeContext';

const ProfilePage = () => {
  const { darkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [Income, setIncome] = useState(null);
  const [Expense, setExpense] = useState(null);
  const [Savings, setSavings] = useState(null);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user', err);
      }
    };

    const fetchTransactionSummary = async () => {
      try {
        let n = 30;
        const res = await axios.get(
          `${backendUrl}/bank/summary/${userId}?days=${n}`
        );

        setIncome(res.data.income);
        setExpense(res.data.expense);
        setSavings(res.data.savings);
      } catch (err) {
        console.error('Error fetching summary', err);
      }
    };

    fetchUser();
    fetchTransactionSummary();
  }, [backendUrl, userId]);

  if (user == null)
    return (
      <p
        className={`text-center mt-10 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        Loading...
      </p>
    );

  return (
    <div
      className={`max-w-3xl mx-auto mt-10 p-8 rounded-xl shadow-lg font-sans select-none
        ${
          darkMode
            ? 'bg-gray-900 text-gray-100 border border-gray-700'
            : 'bg-gray-50 text-gray-800 border border-gray-200'
        }`}
    >
      <div
        className={`text-center text-3xl font-bold mb-8 border-b-2 pb-4 ${
          darkMode ? 'border-gray-600' : 'border-gray-300'
        }`}
      >
        👤 Profile
      </div>

      <div className="space-y-4">
        <div>
          <div
            className={`font-semibold mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Name:
          </div>
          <div className="text-lg">{user.name}</div>
        </div>

        <div>
          <div
            className={`font-semibold mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Email:
          </div>
          <div className="text-lg">{user.email}</div>
        </div>

        <div>
          <div
            className={`font-semibold mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Phone:
          </div>
          <div className="text-lg">{user.phoneNumber || 'Not provided'}</div>
        </div>

        <div>
          <div
            className={`font-semibold mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Account Number:
          </div>
          <div className="text-lg">
            **** **** {user.accountNumber?.slice(-4) || 'XXXX'}
          </div>
        </div>

        <div>
          <div
            className={`font-semibold mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            💰 Balance:
          </div>
          <div className="text-xl font-bold text-green-500">₹ {user.balance}</div>
        </div>
      </div>

      <div className="mt-10">
        <h3
          className={`text-2xl font-semibold mb-6 pb-2 select-text border-b ${
            darkMode ? 'border-blue-600' : 'border-blue-400'
          }`}
        >
          📊 Insights
        </h3>

        <div className="grid grid-cols-3 gap-6">
          <div
            className={`p-6 rounded-lg shadow text-center ${
              darkMode ? 'bg-indigo-800' : 'bg-indigo-100'
            }`}
          >
            <strong className="block mb-2">Total Income</strong>
            <p className="text-lg">₹ {Income || 0}</p>
          </div>
          <div
            className={`p-6 rounded-lg shadow text-center ${
              darkMode ? 'bg-indigo-800' : 'bg-indigo-100'
            }`}
          >
            <strong className="block mb-2">Total Expense</strong>
            <p className="text-lg text-red-400">₹ {Expense || 0}</p>
          </div>
          <div
            className={`p-6 rounded-lg shadow text-center ${
              darkMode ? 'bg-indigo-800' : 'bg-indigo-100'
            }`}
          >
            <strong className="block mb-2">Monthly Savings</strong>
            <p className="text-lg">₹ {Savings || 0}</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3
          className={`text-2xl font-semibold mb-4 pb-2 border-b ${
            darkMode ? 'border-blue-600' : 'border-blue-400'
          }`}
        >
          ⚙️ Actions
        </h3>

        <div className="flex gap-4 flex-wrap">
          <button
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300 select-none"
            onClick={() => alert('Edit Profile clicked!')} 
          >
            Edit Profile
          </button>

          <button
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition duration-300 select-none"
            onClick={() => {
              navigate('/resetpin');
            }}
          >
            Reset PIN
          </button>

          <button
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition duration-300 select-none"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
