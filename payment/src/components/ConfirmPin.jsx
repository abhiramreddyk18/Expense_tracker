import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const ConfirmPin = () => {
  const { state } = useLocation();
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      const res = await axios.post('/api/transaction/send-money', {
        senderId: localStorage.getItem("userId"), 
        receiverEmail: state.receiverEmail,
        amount: state.amount,
        category: state.category,
        description: state.description,
        pin,
      });

      alert("Money sent successfully");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Transaction failed");
    }
  };

  return (
    <div>
      <h3>Confirm with 4-digit PIN</h3>
      <input
        type="password"
        value={pin}
        maxLength="4"
        placeholder="Enter your PIN"
        onChange={(e) => setPin(e.target.value)}
      />
      <button onClick={handleConfirm}>Confirm & Send</button>
    </div>
  );
};

export default ConfirmPin;
