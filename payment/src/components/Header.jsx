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
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:3000';

  useEffect(() => {
    const checkPinSet = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user/${state?.senderId}`);
        const userbank = res.data;

        setsenderbankid(userbank._id);

        if (!userbank.pin) {
          toast.info("You need to set your PIN before making transactions.");
          setTimeout(() => {
            navigate("/setpin", {
              state: { senderId: state?.senderId },
            });
          }, 2000);
        } else {
          setLoading(false);
        }
      } catch (err) {
        toast.error("Unable to verify PIN setup. Please try again.");
        setTimeout(() => {
          navigate("/send-money");
        }, 2000);
      }
    };

    if (state?.senderId) {
      checkPinSet();
    } else {
      toast.error("Invalid access");
      setTimeout(() => {
        navigate("/send-money");
      }, 2000);
    }
  }, [state?.senderId, navigate]);

  const handleConfirm = async () => {
    if (pin.length !== 4) {
      toast.warning("Please enter a 4-digit PIN");
      return;
    }

    setProcessing(true);
    const toastId = toast.loading("Processing your transaction...");
    try {
      await axios.post(`${backendUrl}/payment/send_money`, {
        senderId: senderbankid,
        receiverId: state?.receiverId,
        amount: Number(state?.amount),
        category: state?.category,
        description: state?.description,
        pin
      });

      toast.update(toastId, {
        render: "Money sent successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setPin('');
      setTimeout(() => {
        navigate("/searchuser");
      }, 2000);
    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.message || "Transaction failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-24 text-lg text-gray-700">Loading...</div>
    );

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white rounded-xl shadow-md text-center font-sans">
      <h3 className="text-2xl font-semibold mb-3 text-gray-800">
        Confirm Transaction
      </h3>
      <p className="text-gray-600 mb-6">Enter your 4-digit PIN</p>
      <input
        type="password"
        value={pin}
        maxLength="4"
        placeholder="••••"
        autoComplete="new-password"
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, ''); // digits only
          if (val.length <= 4) setPin(val);
        }}
        disabled={processing}
        className="w-full text-center text-2xl tracking-widest border border-gray-300 rounded-lg py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleConfirm}
        disabled={processing || pin.length !== 4}
        className={`w-full py-3 text-white rounded-lg transition-colors duration-300 ${
          processing || pin.length !== 4
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {processing ? 'Processing...' : 'Confirm & Send'}
      </button>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ConfirmPin;
