import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GiTakeMyMoney } from "react-icons/gi";
import { BsGraphUp } from "react-icons/bs";
import { BiSolidCategory } from "react-icons/bi";
import { GrTransaction } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { useTheme } from '../context/ThemeContext'; // Adjust the import path based on your folder structure

const Home = () => {
  const [balance, setBalance] = useState(0);
  const backendUrl = 'http://localhost:3000';
  const { darkMode } = useTheme();

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

  // Theme classes based on context
  const bgClass = darkMode ? "bg-gray-900" : "bg-indigo-100";
  const textPrimaryClass = darkMode ? "text-indigo-200" : "text-indigo-900";
  const textSecondaryClass = darkMode ? "text-indigo-400" : "text-indigo-600";
  const cardBgClass = darkMode ? "bg-gray-800" : "bg-indigo-50";
  const footerBgClass = darkMode ? "bg-gray-800" : "bg-indigo-100";
  const borderColor = darkMode ? "border-gray-700" : "border-indigo-300";

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-500`}>
      {/* Hero Section */}
      <section className={`flex flex-col lg:flex-row py-5 rounded-lg overflow-hidden mb-8 max-w-7xl mx-auto`}>
        {/* Left Side: Balance & Button */}
        <div className={`flex-1 p-12 flex flex-col justify-center items-center text-center space-y-8 rounded-l-lg ${bgClass}`}>
          <h2 className={`text-3xl font-extrabold ${textPrimaryClass}`}>Welcome Back 👋</h2>

          <div className={`flex items-center gap-3 text-2xl font-semibold ${textPrimaryClass}`}>
            <GiTakeMyMoney size={36} className="text-green-500" />
            Current Balance:
            <span className="text-green-400 font-bold">₹ {balance.toLocaleString()}</span>
          </div>

          <Link
            to="/insights"
            className={`font-semibold py-3 px-10 rounded-lg transition 
              ${darkMode ? 'bg-indigo-700 text-white hover:bg-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            View Insights
          </Link>

          <div className="w-full max-w-xs">
            <h4 className={`text-lg font-semibold mb-2 ${textPrimaryClass}`}>Monthly Spending</h4>
            <div className={`${darkMode ? 'bg-indigo-700' : 'bg-indigo-200'} rounded-full h-5 overflow-hidden`}>
              <div className="bg-indigo-500 h-full rounded-full transition-width duration-500 ease-in-out" style={{ width: '65%' }}></div>
            </div>
            <p className={`text-sm mt-1 font-medium ${textSecondaryClass}`}>₹6,500 of ₹10,000 spent</p>
          </div>

          <div className={`italic text-sm max-w-sm px-4 ${textSecondaryClass}`}>
            "Do not save what is left after spending, but spend what is left after saving." – Warren Buffett
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="flex-1 p-10 flex items-center justify-center rounded-r-lg">
          <img
            src="/images/paymentimg.png"
            alt="Payment Illustration"
            className="w-full max-h-[500px] object-contain rounded-lg"
          />
        </div>
      </section>

      {/* About Section */}
      <section className={`text-center rounded-lg px-8 py-12 max-w-3xl mx-auto mb-12 ${textPrimaryClass}`}>
        <p className="text-base font-medium leading-relaxed mb-4">
          Expense Tracking System is your personal finance assistant. It helps you track and categorize every transaction you make while sending money to others.
        </p>
        <p className="text-base font-medium leading-relaxed">
          You can assign categories like food, travel, shopping, etc., and monitor your financial habits with ease.
        </p>
      </section>

      {/* Features Section in Cards */}
      <section className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 mb-16`}>
        {[
          {
            icon: <GiTakeMyMoney className="text-green-400" size={28} />,
            text: "Track money you send or receive",
          },
          {
            icon: <BiSolidCategory className="text-blue-400" size={28} />,
            text: "View categorized spending in the Insights page",
          },
          {
            icon: <BsGraphUp className="text-purple-400" size={28} />,
            text: "Set category-based limits and visualize progress with graphs",
          },
          {
            icon: <GrTransaction className="text-orange-400" size={28} />,
            text: "Filter transaction history by date, month, type, or category",
          },
          {
            icon: <CgProfile className="text-gray-400" size={28} />,
            text: "View profile and detailed breakdowns of income, expenses, and savings",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className={`${cardBgClass} rounded-xl shadow-sm p-6 flex items-start gap-4 hover:shadow-lg transition-shadow`}
          >
            {feature.icon}
            <p className={`${textPrimaryClass} font-medium`}>{feature.text}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className={`text-center py-8 mt-8 border-t ${borderColor} text-sm max-w-7xl mx-auto rounded-lg shadow-inner ${footerBgClass} ${textSecondaryClass}`}>
        <p>© {new Date().getFullYear()} Expense Tracking System. Built with 💙 to help you manage your money smarter.</p>
        <p className="mt-2">Designed & Developed by <span className="font-semibold">YourName</span></p>
        <p className="mt-1">Contact: support@expensetracker.com | Version 1.0.0</p>
      </footer>
    </div>
  );
};

export default Home;
