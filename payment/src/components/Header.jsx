import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { isLoggedIn } from '../auth';
import { FaMoneyBillTrendUp } from "react-icons/fa6";

const Header = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('name') || 'User';

  const styles = {
    header: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '16px 0px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '34px',
      marginLeft: '40px',
    },
    brand: {
      fontSize: '24px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
    },
    nav: {
      display: 'flex',
      gap: '34px',
    },
    navButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '16px',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'opacity 0.2s',
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '16px',
      marginRight: '40px',
    },
    logoicon: {
      margin: '10px'
    },
    loginButton: {
      background: 'none',
      border: '1px solid white',
      borderRadius: '4px',
      color: 'white',
      fontSize: '14px',
      padding: '6px 12px',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <div style={styles.brand} onClick={() => navigate('/')}>
          <div style={styles.logoicon}><FaMoneyBillTrendUp /></div>
          Expenses Tracker
        </div>

        {isLoggedIn() && (
          <nav style={styles.nav}>
            <button
              onClick={() => navigate('/send-money')}
              style={styles.navButton}
              onMouseOver={(e) => (e.target.style.opacity = 0.8)}
              onMouseOut={(e) => (e.target.style.opacity = 1)}
            >
              Send Money
            </button>

            <button
              onClick={() => navigate('/transactions')}
              style={styles.navButton}
              onMouseOver={(e) => (e.target.style.opacity = 0.8)}
              onMouseOut={(e) => (e.target.style.opacity = 1)}
            >
              Transactions
            </button>

            <button
              onClick={() => navigate('/profile')}
              style={styles.navButton}
              onMouseOver={(e) => (e.target.style.opacity = 0.8)}
              onMouseOut={(e) => (e.target.style.opacity = 1)}
            >
              Profile
            </button>
          </nav>
        )}
      </div>

      <div style={styles.userSection}>
        <FaUserCircle size={24} />
        <span>{userName}</span>

        {!isLoggedIn() && (
          <button
            onClick={() => navigate('/login')}
            style={styles.loginButton}
            onMouseOver={(e) => (e.target.style.opacity = 0.8)}
            onMouseOut={(e) => (e.target.style.opacity = 1)}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
