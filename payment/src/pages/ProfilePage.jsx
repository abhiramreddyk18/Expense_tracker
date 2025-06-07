import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { logout } from '../auth';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [Income, setIncome] = useState(null);
  const [Expense, setExpense] = useState(null);
  const [Savings, setSavings] = useState(null);

  const navigate = useNavigate();

  const backendUrl = 'http://localhost:3000';

  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user", err);
      }
    };

    fetchUser();

    const fetchTransactionSummary = async () => {
      try {
        let n = 30;
        const res = await axios.get(`${backendUrl}/bank/summary/${userId}?days=${n}`);

        console.log(res.data);

        setIncome(res.data.income);
        setExpense(res.data.expense);
        setSavings(res.data.savings);

      } catch (err) {
        console.error("Error fetching summary", err);
      }
    };

    fetchTransactionSummary();
  }, [backendUrl, userId]);

  if (user == null) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-gray-50 rounded-xl shadow-lg font-sans text-gray-800 select-none">
      <div className="text-center text-3xl font-bold mb-8 border-b-2 border-gray-300 pb-4">
        👤 Profile
      </div>

      <div className="space-y-4">
        <div>
          <div className="font-semibold text-gray-700 mb-1">Name:</div>
          <div className="text-lg">{user.name}</div>
        </div>

        <div>
          <div className="font-semibold text-gray-700 mb-1">Email:</div>
          <div className="text-lg">{user.email}</div>
        </div>

        <div>
          <div className="font-semibold text-gray-700 mb-1">Phone:</div>
          <div className="text-lg">{user.phoneNumber || "Not provided"}</div>
        </div>

        <div>
          <div className="font-semibold text-gray-700 mb-1">Account Number:</div>
          <div className="text-lg">**** **** {user.accountNumber?.slice(-4) || "XXXX"}</div>
        </div>

        <div>
          <div className="font-semibold text-gray-700 mb-1">💰 Balance:</div>
          <div className="text-xl font-bold text-green-600">₹ {user.balance}</div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-6 border-b border-blue-400 pb-2 select-text">📊 Insights</h3>

        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-indigo-100 rounded-lg shadow text-center">
            <strong className="block mb-2">Total Income</strong>
            <p className="text-lg">₹ {Income || 0}</p>
          </div>
          <div className="p-6 bg-indigo-100 rounded-lg shadow text-center">
            <strong className="block mb-2">Total Expense</strong>
            <p className="text-lg text-red-600">₹ {Expense || 0}</p>
          </div>
          <div className="p-6 bg-indigo-100 rounded-lg shadow text-center">
            <strong className="block mb-2">Monthly Savings</strong>
            <p className="text-lg">₹ {Savings || 0}</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4 border-b border-blue-400 pb-2">⚙️ Actions</h3>

        <div className="flex gap-4 flex-wrap">
          <button
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300 select-none"
            onClick={() => alert('Edit Profile clicked!')} // You can replace this with actual edit logic
          >
            Edit Profile
          </button>

          <button
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition duration-300 select-none"
            onClick={() => { navigate('/resetpin') }}
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
