import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import { logout } from '../auth';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [Income,setIncome]=useState(null);
  const [Expense,setExpense]=useState(null);
  const [Savings,setSavings]=useState(null);


const navigate = useNavigate();;

  const backendUrl = 'http://localhost:3000';
  
  const userId = localStorage.getItem("userId");


  const handleLogout = () => {
    logout();            
    navigate('/login');   
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user", err);
      }
    };


     fetchUser();


     const fetchTransactionSummary = async () => {
    try {
      let n=30;
      const res = await axios.get(`${backendUrl}/bank/summary/${userId}?days=${n}`);
      
      console.log(res.data);
      
      setIncome( res.data.income);
      setExpense(res.data.expense);
      setSavings(res.data.savings);
    
    } catch (err) {
      console.error("Error fetching summary", err);
    }
  };

 
  fetchTransactionSummary();
},[]);

  if (user==null) return <p>Loading...</p>;

  const containerStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f9f9f9',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#333'
  };

  const headerStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    borderBottom: '2px solid #ccc',
    paddingBottom: '10px',
    textAlign: 'center'
  };

  const labelStyle = {
    fontWeight: '600',
    marginBottom: '6px',
    color: '#444'
  };

  const valueStyle = {
    marginBottom: '16px',
    fontSize: '17px'
  };

  const sectionStyle = {
    marginTop: '30px'
  };

  const buttonStyle = {
    marginRight: '15px',
    padding: '10px 18px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: '0.3s ease'
  };

  const cardGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginTop: '20px'
  };

  const cardStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>👤 Profile</div>

      <div>
        <div style={labelStyle}>Name:</div>
        <div style={valueStyle}>{user.name}</div>

        <div style={labelStyle}>Email:</div>
        <div style={valueStyle}>{user.email}</div>

        <div style={labelStyle}>Phone:</div>
        <div style={valueStyle}>{user.phoneNumber || "Not provided"}</div>

        <div style={labelStyle}>Account Number:</div>
        <div style={valueStyle}>
          **** **** {user.accountNumber?.slice(-4) || "XXXX"}
        </div>

        <div style={labelStyle}>💰 Balance:</div>
        <div style={{ ...valueStyle, fontSize: '20px', color: 'green' }}>₹ {user.balance}</div>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: '10px' }}>📊 Insights</h3>
       
        <div style={cardGridStyle}>
          <div style={cardStyle}>
            <strong>Total Income</strong>
            <p>₹ {Income || 0}</p>
          </div>
          <div style={cardStyle}>
            <strong>Total Expense</strong>
            <p style={{ color: 'red' }}>₹ {Expense || 0}</p>
          </div>
          <div style={cardStyle}>
            <strong>Monthly Savings</strong>
            <p>₹ {(Savings|| 0)}</p>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: '10px' }}>⚙️ Actions</h3>
        <button style={buttonStyle}>Edit Profile</button>
        <button style={{ ...buttonStyle, backgroundColor: '#28a745' }} onClick={()=>{navigate('/resetpin')}}>Reset PIN</button>
        <button style={{ ...buttonStyle, backgroundColor: '#dc3545' }} onClick={()=>{handleLogout}}>Logout</button>
      </div>
    </div>
  );
};

export default ProfilePage;
