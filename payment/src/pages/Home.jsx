import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #ebf4ff, #e9d8fd)',
    padding: '24px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'white',
    padding: '20px',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  logo: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#4c51bf'
  },
  welcome: {
    fontSize: '18px',
    color: '#4a5568',
    fontWeight: '500'
  },
  welcomeSpan: {
    fontWeight: '600'
  },
  logoutButton: {
    backgroundColor: '#f56565',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    transition: 'background-color 0.3s ease'
  },
  balanceSection: {
    marginTop: '32px',
    background: 'white',
    padding: '24px',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center'
  },
  balanceText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2d3748'
  },
  balanceAmount: {
    color: '#38a169',
    fontWeight: '700'
  },
  insightsLink: {
    backgroundColor: '#3182ce',
    color: 'white',
    padding: '10px 24px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '14px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  navCards: {
    marginTop: '40px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px'
  },
  card: {
    padding: '24px',
    borderRadius: '20px',
    color: 'white',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '600',
    textDecoration: 'none',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease'
  },
  greenCard: {
    background: 'linear-gradient(to right, #48bb78, #38a169)'
  },
  purpleCard: {
    background: 'linear-gradient(to right, #9f7aea, #805ad5)'
  },
  yellowCard: {
    background: 'linear-gradient(to right, #f6ad55, #dd6b20)'
  }
};

const Home = () => {
  const [userName, setUserName] = useState('');
  const [balance, setBalance] = useState(0);
  const backendUrl = 'http://localhost:3000';
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user/${userId}`);
        const user = res.data;
        setUserName(user.name);
        setBalance(user.balance);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>🏦 BankVault</div>
        <div style={styles.welcome}>Welcome, <span style={styles.welcomeSpan}>{userName}</span>!</div>
        <button style={styles.logoutButton}>🔓 Logout</button>
      </header>

      <section style={styles.balanceSection}>
        <div style={styles.balanceText}>
          💰 Current Balance: <span style={styles.balanceAmount}>₹ {balance.toLocaleString()}</span>
        </div>
        <Link to="/insights" style={styles.insightsLink}>
          👁️ View Insights
        </Link>
      </section>

      <section style={styles.navCards}>
        <Link to="/send-money" style={{ ...styles.card, ...styles.greenCard }}>💸 Send Money</Link>
        <Link to="/transactions" style={{ ...styles.card, ...styles.purpleCard }}>📄 Transaction History</Link>
        <Link to="/profile" style={{ ...styles.card, ...styles.yellowCard }}>👤 Profile</Link>
      </section>
    </div>
  );
};

export default Home;
