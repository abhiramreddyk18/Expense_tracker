import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GiTakeMyMoney } from "react-icons/gi";
import { Player } from '@lottiefiles/react-lottie-player';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6 font-sans">
      {/* Balance Section */}
      <section className="text-center p-8 rounded-xl mb-10">
        <div className="flex justify-center items-center gap-3 text-xl font-semibold text-gray-800 mb-4">
          <GiTakeMyMoney size={32} />
          Current Balance:
          <span className="text-green-600 font-bold">₹ {balance.toLocaleString()}</span>
        </div>
        <Link
          to="/insights"
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
        >
          View Insights
        </Link>
      </section>

      {/* Animation */}
      <section className="flex justify-center mb-10">
        <Player
          autoplay
          loop
          src="https://assets10.lottiefiles.com/packages/lf20_fcfjwiyb.json"
          style={{ height: '288px', width: '288px' }}
        />
      </section>

      {/* About Section */}
      <section className="text-center p-8 rounded-xl text-gray-800 mb-10">
        <p className="text-base font-medium leading-relaxed max-w-2xl mx-auto mb-6">
          Expense Trackering System is your personal finance assistant. It helps you track and categorize every transaction you make while sending money to others. You can assign categories (like food, travel, shopping, etc.) to your expenses and monitor your financial habits.
        </p>

        <h3 className="text-lg font-semibold mb-3 text-blue-700">Features:</h3>
        <ul className="list-none text-left max-w-2xl mx-auto pl-0 leading-relaxed">
          <li className="flex items-center mb-3">
            <GiTakeMyMoney className="mr-3 text-green-600" size={20} />
            Track money you send or receive
          </li>
          <li className="flex items-center mb-3">
            <BiSolidCategory className="mr-3 text-blue-400" size={20} />
            View categorized spending in the <strong className="mx-1">Insights</strong> page
          </li>
          <li className="flex items-center mb-3">
            <BsGraphUp className="mr-3 text-purple-600" size={20} />
            Set category-based limits and visualize your progress with graphs
          </li>
          <li className="flex items-center mb-3">
            <GrTransaction className="mr-3 text-orange-500" size={20} />
            Filter transaction history by date, month, type, or category
          </li>
          <li className="flex items-center mb-3">
            <CgProfile className="mr-3 text-gray-700" size={20} />
            View your profile and see detailed breakdowns of income, expenses, and savings for the last 30 days
          </li>
        </ul>
      </section>

      
      <footer className="text-center py-5 mt-10 border-t border-gray-300 text-gray-500 text-sm">
        © {new Date().getFullYear()} Expense Trackering System. Built with 💙 to help you manage your money smarter.
      </footer>
    </div>
  );
};

export default Home;
