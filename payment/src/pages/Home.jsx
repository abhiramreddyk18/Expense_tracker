import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GiTakeMyMoney } from "react-icons/gi";
import { Player } from '@lottiefiles/react-lottie-player';

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
      {/* Header */}
    
    

      {/* Balance Section */}
      <section
        style={{
          backgroundColor: 'white',
          textAlign: 'center',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
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
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
          color: '#2d3748'
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '16px',
            color: '#4c51bf'
          }}
        >
          Why Choose ExpenseTracker?
        </h2>
        <p
          style={{
            fontSize: '16px',
            fontWeight: '500',
            lineHeight: '1.6',
            maxWidth: '640px',
            margin: '0 auto'
          }}
        >
          ExpenseTracker is your modern and secure financial companion. Monitor your transactions, send money
          effortlessly, and gain smart insights to grow your savings — all in a seamless and intuitive interface.
        </p>
      </section>
    </div>
  );
};

export default Home;
