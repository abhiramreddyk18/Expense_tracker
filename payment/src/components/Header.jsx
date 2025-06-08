import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { isLoggedIn } from '../auth';
import { FaMoneyBillTrendUp } from "react-icons/fa6";

const Header = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('name') || 'User';
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => setShowDropdown(false);

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
    logoicon: {
      margin: '10px'
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
      position: 'relative',
    },
    hamburger: {
      fontSize: '24px',
      cursor: 'pointer',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '48px',
      right: '0',
      backgroundColor: '#1d4ed8',
      borderRadius: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      padding: '10px',
      zIndex: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    dropdownItem: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '16px',
      textAlign: 'left',
      cursor: 'pointer',
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <div style={styles.brand} onClick={() => navigate('/')}>
          <div style={styles.logoicon}><FaMoneyBillTrendUp /></div>
          <div style={{ padding: '5px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              PayOLog <sub style={{ fontSize: '12px' }}>E T S</sub>
            </div>
          </div>
        </div>
        {!isMobile && isLoggedIn() && (
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
          </nav>
        )}
      </div>

      <div style={styles.userSection}>
        {isMobile && isLoggedIn() && (
          <>
            <FaBars style={styles.hamburger} onClick={toggleDropdown} />
            {showDropdown && (
              <div style={styles.dropdownMenu}>
                <button style={styles.dropdownItem} onClick={() => { navigate('/send-money'); closeDropdown(); }}>
                  Send Money
                </button>
                <button style={styles.dropdownItem} onClick={() => { navigate('/transactions'); closeDropdown(); }}>
                  Transactions
                </button>
                <button style={styles.dropdownItem} onClick={() => { navigate('/profile'); closeDropdown(); }}>
                  Profile
                </button>
              </div>
            )}
          </>
        )}

        {isLoggedIn() && !isMobile && (
          <>
            <FaUserCircle size={24} onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }} />
            <span>{userName}</span>
          </>
        )}

        {!isLoggedIn() && (
          <button
            onClick={() => navigate('/login')}
            style={styles.navButton}
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
