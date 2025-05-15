import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPin = () => {
 
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:3000';
  const userId = state?.userId;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert('User not found. Please login again.');
      return;
    }

    if (newPin !== confirmNewPin) {
      alert('New PINs do not match.');
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      alert('New PIN must be a 4-digit number.');
      return;
    }


    setLoading(true);

    try {
        await axios.post(`${backendUrl}/payment/user/set-pin`, {
        userId,
        pin: newPin,
      });

      alert('PIN updated successfully.');
      navigate('/profile');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to reset PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h3>Reset Transaction PIN</h3>

   
      <label>New PIN:</label>
      <input
        type="password"
        maxLength="4"
        value={newPin}
        autoComplete="new-password"
        onChange={(e) => setNewPin(e.target.value)}
        required
        placeholder="Enter new 4-digit PIN"
        style={{ display: 'block', marginBottom: '12px', width: '100%', padding: '8px' }}
      />

      <label>Confirm New PIN:</label>
      <input
        type="password"
        maxLength="4"
        value={confirmNewPin}
        autoComplete="off"
        onChange={(e) => setConfirmNewPin(e.target.value)}
        required
        placeholder="Confirm new 4-digit PIN"
        style={{ display: 'block', marginBottom: '20px', width: '100%', padding: '8px' }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: '600'
        }}
      >
        {loading ? 'Updating...' : 'Update PIN'}
      </button>
    </form>
  );
};

export default ResetPin;
