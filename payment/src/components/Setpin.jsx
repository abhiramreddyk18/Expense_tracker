import { useState } from 'react';
import axios from 'axios';

const SetPin = () => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin !== confirmPin) {
      alert('PINs do not match. Please try again.');
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      alert('PIN must be a 4-digit number.');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');

      await axios.post(`${ backendUrl}/payment/set-pin`, { userId, pin })

      alert('PIN set successfully');
      
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to set PIN');
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
      <input
        type="password"
        maxLength="4"
        value={confirmPin}
        onChange={(e) => setConfirmPin(e.target.value)}
        placeholder="Confirm 4-digit PIN"
        required
      />
      <button type="submit">Set PIN</button>
    </form>
  );
};

export default SetPin;
