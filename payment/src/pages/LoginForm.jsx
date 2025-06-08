import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { login, isLoggedIn } from '../auth';

function LoginForm() {
  const navigate = useNavigate();

  const [email, setemail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const backendUrl = 'http://localhost:3000';

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/home', { replace: true });
    }
  }, []);

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${backendUrl}/auth/sendotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
      } else {
        setError('Failed to send OTP.');
      }
    } catch (error) {
      setError('Error sending OTP.');
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${backendUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (data.verified) {
        login(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', email);
        navigate(data.isNewUser ? '/bankfrom' : '/home');
      } else {
        setError('Invalid OTP.');
      }
    } catch (error) {
      setError('Error verifying OTP.');
    }
    setLoading(false);
  };

 return (
  <div
    className="h-screen w-screen bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
    style={{ backgroundImage: "url('/images/loginpage.jpg')" }}
  >
    <div className="w-full max-w-sm bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>

      {loading ? (
        <p className="text-center text-gray-600">Processing...</p>
      ) : !otpSent ? (
        <div className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder="Enter Email"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendOtp}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Send OTP
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={verifyOtp}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
          >
            Verify OTP
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-600 text-center mt-4">{error}</p>
      )}
    </div>
  </div>
);

}

export default LoginForm;
