import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ConfirmPin = () => {
  const { state } = useLocation();
  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [senderbankid ,setsenderbankid]=useState(null);
  const backendUrl = 'http://localhost:3000';

  useEffect(() => {
    console.log("Navigation state received:", state);
  },);

  
  useEffect(() => {
    const checkPinSet = async () => {
      try {
        console.log("confirm pin page: " + state.senderId);

        const res = await axios.get(`${backendUrl}/user/${state?.senderId}`);

        console.log("inside conform sender data:" +  res.data);

        setsenderbankid(res.data);

        console.log("inside confirmpin:"+  senderbankid);


        if (!res.data.pin) {
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

        alert("Unable to verify PIN setup. Please try again.",err);
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
        amount:  Number(state?.amount),
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
