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
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #ebf4ff, #e9d8fd)',
        padding: '24px',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      }}
    >
      {/* Balance Section */}
      <section
        style={{
          
          textAlign: 'center',
          padding: '32px',
          borderRadius: '16px',
          marginBottom: '40px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            fontSize: '22px',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '16px'
          }}
        >
          <GiTakeMyMoney size={32} />
          Current Balance:
          <span style={{ color: '#38a169', fontWeight: '700' }}>
            ₹ {balance.toLocaleString()}
          </span>
        </div>
        <Link
          to="/insights"
          style={{
            backgroundColor: '#3182ce',
            color: 'white',
            fontWeight: '600',
            padding: '10px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            
            transition: 'background-color 0.3s'
          }}
        >
          View Insights
        </Link>
      </section>

      {/* Animation */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px'
        }}
      >
        <Player
          autoplay
          loop
          src="https://assets10.lottiefiles.com/packages/lf20_fcfjwiyb.json"
          style={{ height: '288px', width: '288px' }}
        />
      </section>

      {/* About Section */}
     <section
  style={{
   
    padding: '32px',
    borderRadius: '16px',
   
    textAlign: 'center',
    color: '#2d3748',
    marginBottom: '40px'
  }}
>

  <p
    style={{
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: '1.6',
      maxWidth: '700px',
      margin: '0 auto 24px'
    }}
  >
    Expense Trackering System is your personal finance assistant. It helps you track and categorize every transaction you make while sending money to others. You can assign categories (like food, travel, shopping, etc.) to your expenses and monitor your financial habits.
  </p>

  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#2b6cb0' }}>Features:</h3>
  <ul
    style={{
      listStyle: 'none',
      textAlign: 'left',
      maxWidth: '700px',
      margin: '0 auto',
      paddingLeft: '0',
      lineHeight: '1.8'
    }}
  >
    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
      <GiTakeMyMoney size={20} style={{ marginRight: '12px', color: '#38a169' }} />
      Track money you send or receive
    </li>
    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
      <BiSolidCategory size={20} style={{ marginRight: '12px', color: '#4299e1' }} />
      View categorized spending in the <strong style={{ marginLeft: '4px', marginRight: '4px' }}>Insights</strong>  page
    </li>
    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
      <BsGraphUp size={20} style={{ marginRight: '12px', color: '#805ad5' }} />
      Set category-based limits and visualize your progress with graphs
    </li>
    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
      <GrTransaction size={20} style={{ marginRight: '12px', color: '#dd6b20' }} />
      Filter transaction history by date, month, type, or category
    </li>
    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
      <CgProfile size={20} style={{ marginRight: '12px', color: '#4a5568' }} />
      View your profile and see detailed breakdowns of income, expenses, and savings for the last 30 days
    </li>
  </ul>
</section>

      {/* Footer Section */}
      <footer
        style={{
          textAlign: 'center',
          padding: '20px',
          marginTop: '40px',
          borderTop: '1px solid #e2e8f0',
          color: '#718096',
          fontSize: '14px'
        }}
      >
        © {new Date().getFullYear()} Expense Trackering System. Built with 💙 to help you manage your money smarter.
      </footer>
    </div>
  );
};

export default Home;
