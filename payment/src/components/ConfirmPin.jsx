import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ConfirmPin = () => {
  const { state } = useLocation();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:3000';
  useEffect(() => {
    const checkPinSet = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user/${state.senderId}`);
        
        
        if (!res.data.transactionPin) {
          alert("You need to set your PIN before making transactions.");
          navigate("/setpin");
        } else {
          setLoading(false);
        }
      } catch (err) {
        alert("Unable to verify PIN setup. Please try again.");
        navigate("/send-money");
      }
    };

    checkPinSet();
  }, [state.senderId, navigate]);

  const handleConfirm = async () => {
    try {
      const res = await axios.post('/api/transaction/send-money', {
        senderId: state.senderId,
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

  if (loading) return <div>Loading...</div>;

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
