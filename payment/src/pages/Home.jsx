import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Player } from '@lottiefiles/react-lottie-player';
;

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
  animationSection: {
    marginTop: '40px',
    display: 'flex',
    justifyContent: 'center'
  },
  aboutSection: {
    marginTop: '40px',
    background: '#fff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    color: '#2d3748'
  },
  aboutTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#4c51bf'
  },
  aboutText: {
    fontSize: '16px',
    lineHeight: '1.6',
    fontWeight: '500'
  }
  
};

const Home = () => {

  const [balance, setBalance] = useState(0);
  const backendUrl = 'http://localhost:3000';

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user/${userId}`);
        const user = res.data;
      
        setBalance(user.balance);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div style={styles.container}>
    

      <section style={styles.balanceSection}>
        <div style={styles.balanceText}>
          💰 Current Balance: <span style={styles.balanceAmount}>₹ {balance.toLocaleString()}</span>
        </div>
        <Link to="/insights" style={styles.insightsLink}>
          👁️ View Insights
        </Link>
      </section>

      <section style={styles.animationSection}>
        <Player
  autoplay
  loop
  src="https://assets10.lottiefiles.com/packages/lf20_fcfjwiyb.json"
  style={{ height: '300px', width: '300px' }}
/>

      </section>

      <section style={styles.aboutSection}>
        <div style={styles.aboutTitle}>Why Choose Expenses Tracker?</div>
        <p style={styles.aboutText}>
           Expenses Tracker is your modern and secure banking partner. Track your transactions, send money instantly, and gain insights into your financial growth. Experience a sleek, user-friendly interface backed by robust technology for peace of mind.
        </p>
      </section>
    </div>
  );
};

export default Home;
