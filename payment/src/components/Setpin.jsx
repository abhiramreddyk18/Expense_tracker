import React, { useState } from 'react';
import axios from 'axios';

const SetPin = () => {
  const [pin, setPin] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) return alert("PIN must be 4 digits");

    try {
      await axios.post('/api/user/set-pin', { userId, pin });
      alert("PIN set successfully");
    } catch (err) {
      alert("Failed to set PIN");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Set 4-Digit Transaction PIN</h3>
      <input
        type="password"
        maxLength="4"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Enter 4-digit PIN"
        required
      />
      <button type="submit">Set PIN</button>
    </form>
  );
};

export default SetPin;
