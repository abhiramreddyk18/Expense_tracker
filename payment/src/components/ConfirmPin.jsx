import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ConfirmPin = () => {
  const { state } = useLocation();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [senderbankid, setsenderbankid] = useState(null);
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:3000';

  useEffect(() => {
    console.log("Navigation state received:", state);
  }, []);

  useEffect(() => {
    const checkPinSet = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user/${state?.senderId}`);
        const userbank = res.data;

        setsenderbankid(userbank._id);

        if (!userbank.pin) {
          alert("You need to set your PIN before making transactions.");
          navigate("/setpin", {
            state: {
              senderId: state?.senderId,
            },
          });
        } else {
          setLoading(false);
        }
      } catch (err) {
        alert("Unable to verify PIN setup. Please try again.");
        navigate("/send-money");
      }
    };

    if (state?.senderId) {
      checkPinSet();
    } else {
      alert("Invalid access");
      navigate("/send-money");
    }
  }, [state?.senderId, navigate]);

  const handleConfirm = async () => {
    try {
      await axios.post(`${backendUrl}/payment/send_money`, {
        senderId: senderbankid,
        receiverId: state?.receiverId,
        amount: Number(state?.amount),
        category: state?.category,
        description: state?.description,
        pin
      });

      alert("Money sent successfully");
      navigate("/searchuser");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Transaction failed");
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Confirm Transaction</h3>
      <p style={styles.subTitle}>Enter your 4-digit PIN</p>
      <input
        type="password"
        value={pin}
        maxLength="4"
        placeholder="••••"
        autoComplete="new-password"
        style={styles.pinInput}
        onChange={(e) => setPin(e.target.value)}
      />
      <button
        style={styles.confirmButton}
        onClick={handleConfirm}
        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
      >
        Confirm & Send
      </button>
    </div>
  );
};

// CSS styles as JS object
const styles = {
  container: {
    maxWidth: '400px',
    margin: '60px auto',
    padding: '30px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
    color: '#333',
  },
  subTitle: {
    fontSize: '16px',
    marginBottom: '25px',
    color: '#666',
  },
  pinInput: {
    fontSize: '20px',
    textAlign: 'center',
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    letterSpacing: '8px',
    outline: 'none',
  },
  confirmButton: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  loading: {
    fontSize: '18px',
    textAlign: 'center',
    marginTop: '100px',
    color: '#333',
  }
};

export default ConfirmPin;
