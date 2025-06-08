import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { isLoggedIn } from '../auth';
import { useTheme } from '../context/ThemeContext'; // 👈 import context

const Header = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('name') || 'User';
  const { darkMode, toggleDarkMode } = useTheme(); // 👈 use context
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const closeDropdown = () => setShowDropdown(false);

  return (
    <header className={`sticky top-0 z-10 px-6 py-4 shadow-md flex justify-between items-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-blue-600 text-white'}`}>
      <div className="flex items-center gap-6">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <FaMoneyBillTrendUp className="mr-2 text-2xl" />
          <span className="text-lg font-bold">
            PayOLog <sub className="text-xs">E T S</sub>
          </span>
        </div>

        {!isMobile && isLoggedIn() && (
          <nav className="flex gap-6">
            <button onClick={() => navigate('/send-money')} className="hover:opacity-80 transition">Send Money</button>
            <button onClick={() => navigate('/transactions')} className="hover:opacity-80 transition">Transactions</button>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4 relative">
        <button onClick={toggleDarkMode} className="border px-3 py-1 rounded hover:opacity-80 text-sm">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {isMobile && isLoggedIn() && (
          <>
            <FaBars className="text-xl cursor-pointer" onClick={toggleDropdown} />
            {showDropdown && (
              <div className={`absolute top-12 right-0 flex flex-col bg-blue-800 text-white rounded-md shadow-md p-4 z-20 ${darkMode ? 'bg-gray-800' : ''}`}>
                <button onClick={() => { navigate('/send-money'); closeDropdown(); }} className="text-left py-1 hover:opacity-80">Send Money</button>
                <button onClick={() => { navigate('/transactions'); closeDropdown(); }} className="text-left py-1 hover:opacity-80">Transactions</button>
                <button onClick={() => { navigate('/profile'); closeDropdown(); }} className="text-left py-1 hover:opacity-80">Profile</button>
              </div>
            )}
          </>
        )}

        {isLoggedIn() && !isMobile && (
          <>
            <FaUserCircle className="text-xl cursor-pointer" onClick={() => navigate('/profile')} />
            <span>{userName}</span>
          </>
        )}

        {!isLoggedIn() && (
          <button onClick={() => navigate('/login')} className="hover:opacity-80 transition">Login</button>
        )}
      </div>
    </header>
  );
};

export default Header;
