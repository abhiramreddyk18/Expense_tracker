import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GiTakeMyMoney } from "react-icons/gi";
import { BsGraphUp } from "react-icons/bs";
import { BiSolidCategory } from "react-icons/bi";
import { GrTransaction } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";

const Home = () => {
  const [balance, setBalance] = useState(0);
  const backendUrl = 'http://localhost:3000';

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user/${userId}`);
        setBalance(res.data.balance);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="min-h-screen  bg-indigo-100   from-blue-50 via-indigo-50 to-purple-50 font-sans">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row py-5 rounded-lg overflow-hidden mb-8 max-w-7xl mx-auto">
        {/* Left Side: Balance & Button */}
        <div className="flex-1 bg-indigo-100 p-12 flex flex-col justify-center items-center text-center space-y-8 rounded-l-lg">
          <h2 className="text-3xl font-extrabold text-indigo-800">Welcome Back 👋</h2>

          <div className="flex items-center gap-3 text-2xl font-semibold text-indigo-900">
            <GiTakeMyMoney size={36} className="text-green-600" />
            Current Balance:
            <span className="text-green-700 font-bold">₹ {balance.toLocaleString()}</span>
          </div>

          <Link
            to="/insights"
            className="bg-indigo-600 text-white font-semibold py-3 px-10 rounded-lg  hover:bg-indigo-700 transition"
          >
            View Insights
          </Link>

          <div className="w-full max-w-xs">
            <h4 className="text-lg font-semibold text-indigo-700 mb-2">Monthly Spending</h4>
            <div className="w-full bg-indigo-200 rounded-full h-5 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full transition-width duration-500 ease-in-out" style={{ width: '65%' }}></div>
            </div>
            <p className="text-sm mt-1 text-indigo-600 font-medium">₹6,500 of ₹10,000 spent</p>
          </div>

          <div className="italic text-sm text-indigo-500 max-w-sm px-4">
            "Do not save what is left after spending, but spend what is left after saving." – Warren Buffett
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="flex-1 p-10 flex items-center  justify-center  rounded-r-lg ">
          <img
            src="/images/paymentimg.png"
            alt="Payment Illustration"
            className="w-full max-h-[500px] object-contain rounded-lg"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="text-center  rounded-lg px-8 py-12 text-indigo-900 max-w-3xl mx-auto  mb-12">
        <p className="text-base font-medium leading-relaxed mb-4">
          Expense Tracking System is your personal finance assistant. It helps you track and categorize every transaction you make while sending money to others.
        </p>
        <p className="text-base font-medium leading-relaxed">
          You can assign categories like food, travel, shopping, etc., and monitor your financial habits with ease.
        </p>
      </section>

      {/* Features Section in Cards */}
      <section className="grid grid-cols-1  rounded-lg sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 mb-16 ">
        {[
          {
            icon: <GiTakeMyMoney className="text-green-600" size={28} />,
            text: "Track money you send or receive",
          },
          {
            icon: <BiSolidCategory className="text-blue-500" size={28} />,
            text: "View categorized spending in the Insights page",
          },
          {
            icon: <BsGraphUp className="text-purple-600" size={28} />,
            text: "Set category-based limits and visualize progress with graphs",
          },
          {
            icon: <GrTransaction className="text-orange-500" size={28} />,
            text: "Filter transaction history by date, month, type, or category",
          },
          {
            icon: <CgProfile className="text-gray-700" size={28} />,
            text: "View profile and detailed breakdowns of income, expenses, and savings",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-indigo-50 rounded-xl shadow-sm p-6 flex items-start gap-4 hover:shadow-lg transition-shadow"
          >
            {feature.icon}
            <p className="text-indigo-900 font-medium">{feature.text}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center py-8 mt-8 border-t border-indigo-300 text-indigo-700 text-sm bg-indigo-100 max-w-7xl mx-auto rounded-lg shadow-inner">
        <p>© {new Date().getFullYear()} Expense Tracking System. Built with 💙 to help you manage your money smarter.</p>
        <p className="mt-2">Designed & Developed by <span className="font-semibold text-indigo-700">YourName</span></p>
        <p className="mt-1">Contact: support@expensetracker.com | Version 1.0.0</p>
      </footer>
    </div>
  );
};

export default Home;
