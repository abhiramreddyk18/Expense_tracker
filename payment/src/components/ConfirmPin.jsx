import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmPin = () => {
  const { state } = useLocation();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [senderbankid, setsenderbankid] = useState(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const checkPinSet = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user/${state?.senderId}`);
        const userbank = res.data;
        setsenderbankid(userbank._id);

        if (!userbank.pin) {
          toast.info("You need to set your PIN before making transactions.");
          setTimeout(() => {
            navigate("/setpin", { state: { senderId: state?.senderId } });
          }, 2000);
        } else {
          setLoading(false);
        }
      } catch (err) {
        toast.error("Unable to verify PIN setup. Please try again.");
        setTimeout(() => {
          navigate("/searchuser");
        }, 2000);
      }
    };

    if (state?.senderId && state?.receiver) {
      checkPinSet();
    } else {
      toast.error("Invalid access");
      setTimeout(() => {
        navigate("/searchuser");
      }, 2000);
    }
  }, [state?.senderId, state?.receiver, navigate]);

  const handleConfirm = async () => {
    const toastId = toast.loading("Processing your transaction...");

    try {
      await axios.post(`${backendUrl}/payment/send_money`, {
        senderId: senderbankid,
        receiverId: state.receiver._id,
        amount: Number(state.amount),
        category: state.category,
        description: state.description,
        pin
      });

      toast.update(toastId, {
        render: "Money sent successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setTimeout(() => {
        if (state?.returnToChat) {
          navigate("/chat", {
            state: { receiver: state.receiver }
          });
        } else {
          navigate("/searchuser");
        }
      }, 2000);

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Transaction failed";

      toast.update(toastId, {
        render: errorMsg,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });

      try {
        await axios.post(`${backendUrl}/chat/send`, {
          senderId: state?.senderId,
          receiverId: state.receiver._id,
          message: `❌ Transaction failed: ${errorMsg}`,
          type: "text",
        });
      } catch (chatErr) {
        console.error("Failed to send error message to chat:", chatErr);
      }

      setTimeout(() => {
        if (state?.returnToChat) {
          navigate("/chat", {
            state: { receiver: state.receiver }
          });
        } else {
          navigate("/searchuser");
        }
      }, 2000);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f3f4f6' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Confirm Transaction</h2>
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>Enter your 4-digit PIN</p>
        <input
          type="password"
          value={pin}
          maxLength="4"
          placeholder="••••"
          style={{ fontSize: '20px', textAlign: 'center', width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc', letterSpacing: '8px' }}
          onChange={(e) => setPin(e.target.value)}
        />
        <button
          onClick={handleConfirm}
          style={{ width: '100%', padding: '12px', fontSize: '16px', color: '#fff', backgroundColor: '#007bff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Confirm & Send
        </button>
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
};

export default ConfirmPin;
