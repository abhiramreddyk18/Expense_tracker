import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
const UserDetailsForm = () => {
  
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    accountNumber: '',
    bankName: '',
    ifscCode: ''
  });
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:3000';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch(`${backendUrl}/bank/verify_bank_details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (data.success) {
      navigate('/home');
    } else {
      alert(data.message);
    }
  };

  return (
    <form
    onSubmit={handleSubmit}
    style={{
      maxWidth: '500px',
      margin: '60px auto',
      padding: '40px',
      backgroundColor: '#ffffff',
      border: '1px solid #ddd',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}
  >
    <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
      Enter Your Bank Details
    </h2>
  
    <label style={{ fontWeight: '600', color: '#444' }}>Email:</label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
      style={{
        padding: '12px',
        fontSize: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        outlineColor: '#007bff',
      }}
    />
  
    <label style={{ fontWeight: '600', color: '#444' }}>Phone Number:</label>
    <input
      type="text"
      name="phoneNumber"
      value={formData.phoneNumber}
      onChange={handleChange}
      required
      style={{
        padding: '12px',
        fontSize: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        outlineColor: '#007bff',
      }}
    />
  
    <label style={{ fontWeight: '600', color: '#444' }}>Account Number:</label>
    <input
      type="text"
      name="accountNumber"
      value={formData.accountNumber}
      onChange={handleChange}
      required
      style={{
        padding: '12px',
        fontSize: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        outlineColor: '#007bff',
      }}
    />
  
    <label style={{ fontWeight: '600', color: '#444' }}>Bank Name:</label>
    <select
      name="bankName"
      value={formData.bankName}
      onChange={handleChange}
      required
      style={{
        padding: '12px',
        fontSize: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
        outlineColor: '#007bff',
      }}
    >
      <option value="">Select Bank</option>
      <option value="SBI">State Bank of India</option>
      <option value="HDFC">HDFC Bank</option>
      <option value="ICICI">ICICI Bank</option>
      <option value="Axis">Axis Bank</option>
      <option value="PNB">Punjab National Bank</option>
      <option value="Kotak">Kotak Mahindra Bank</option>
      <option value="BOB">Bank of Baroda</option>
    </select>
  
    <label style={{ fontWeight: '600', color: '#444' }}>IFSC Code:</label>
    <input
      type="text"
      name="ifscCode"
      value={formData.ifscCode}
      onChange={handleChange}
      required
      style={{
        padding: '12px',
        fontSize: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        outlineColor: '#007bff',
      }}
    />
  
    <button
      type="submit"
      style={{
        padding: '14px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '10px',
      }}
    >
      Submit
    </button>
  </form>
  
  );
};

export default UserDetailsForm;
