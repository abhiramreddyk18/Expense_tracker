import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const SetPin = () => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const { state } = useLocation();
  const backendUrl = 'http://localhost:3000';
  const navigate = useNavigate(); 

  const handleClick = async () => {
    if (pin !== confirmPin) {
      alert('PINs do not match. Please try again.');
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      alert('PIN must be a 4-digit number.');
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/payment/user/set-pin`, {
        userId: state?.senderId,
        pin,
      });
      console.log(res.data);
      console.log('PIN set successfully');
      navigate('/confirm-pin');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to set PIN');
    }
  };

  return (
    <form>
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
      <button type="button" onClick={handleClick}>
        Set PIN
      </button>
    </form>
  );
};

export default SetPin;
