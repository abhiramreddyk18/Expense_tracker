import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const UserDetailsForm = () => {
  const [formData, setFormData] = useState({

    email:localStorage.getItem('userEmail'),
    phoneNumber: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    CVV: ''
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
      localStorage.setItem('userbankid', data.bankdetails);
      localStorage.setItem('name', data.name);
      navigate('/home');
    } else {
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-16 p-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Enter Your Bank Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
          <select
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring focus:ring-blue-400"
          >
            <option value="">Select Bank</option>
            <option value="State Bank of India">State Bank of India</option>
            <option value="HDFC Bank">HDFC Bank</option>
            <option value="ICICI Bank">ICICI Bank</option>
            <option value="Axis Bank">Axis Bank</option>
            <option value="PNB">Punjab National Bank</option>
            <option value="Kotak">Kotak Mahindra Bank</option>
            <option value="BOB">Bank of Baroda</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
          <input
            type="text"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
          <input
            type="text"
            name="CVV"
            value={formData.CVV}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-8 py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
      >
        Submit
      </button>
    </form>
  );
};

export default UserDetailsForm;
