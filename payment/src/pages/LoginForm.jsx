
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
function LoginForm() {

  const navigate = useNavigate();

  const [email, setemail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const backendUrl = 'http://localhost:3000';

  const handleEmailChange = (e) => {
    setemail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const sendOtp = async () => {
    try {
      const response = await fetch(`${backendUrl}/auth/sendotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        console.log(data.message);
        setOtpSent(true);
      } else {
        setError('Failed to send OTP.');
      }
    } catch (error) {
      setError('Error sending OTP.');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch(`${backendUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (data.verified) {

        if(data.isNewUser)
          {
            navigate('/bankfrom');
          }
        else 
        {
          navigate('/home');
        }

      } else {
        setError('Invalid OTP.');
      }
    } catch (error) {
      setError('Error verifying OTP.');
    }
  };

  return (
<div
  style={{
    maxWidth: '400px',
    margin: '80px auto',
    padding: '40px',
    border: '1px solid #ccc',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#ffffff',
  }}
>
  <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
    Login
  </h1>

  {!otpSent ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={handleEmailChange}
        style={{
          padding: '12px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          outlineColor: '#007bff',
        }}
      />
      <button
        onClick={sendOtp}
        style={{
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Send OTP
      </button>
    </div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={handleOtpChange}
        style={{
          padding: '12px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          outlineColor: '#28a745',
        }}
      />
      <button
        onClick={verifyOtp}
        style={{
          padding: '12px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Verify OTP
      </button>
    </div>
  )}

  {error && (
    <p style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>
      {error}
    </p>
  )}
</div>

  );
}

export default LoginForm;
