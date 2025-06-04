  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';

  const SendMoneyForm = ({ senderId, receiver }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSend = async () => {
      if (!amount || !category) {
        return alert("Please enter all details");
      }

      console.log("receiver ---> " + JSON.stringify(receiver));
      console.log("senderId:" + senderId);
      console.log("recevierId:" + receiver._id);

      navigate('/confirm-pin', {
        state: {
          senderId,
          receiverId: receiver._id,
          receiverEmail: receiver.email,
          amount,
          category,
          description,
        }
      });
    };

    return (
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>

        <h3 style={styles.heading}>
          Send Money to <span style={styles.highlight}>{receiver?.name || 'Recipient'}</span>
        </h3>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option value="">--Select Category--</option>
          <option value="Food">Food</option>
          <option value="Bills">Bills</option>
          <option value="Shopping">Shopping</option>
          <option value="Travel">Travel</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          <option value="Salary">Salary</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleSend}
          style={styles.sendButton}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
        >
          Send Money
        </button>
      </div>
    );
  };

  // CSS styles as a JS object
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '40px auto',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
      background: '#ffffff',
      fontFamily: 'Arial, sans-serif',
    },
    backButton: {
      background: 'transparent',
      border: 'none',
      color: '#007bff',
      cursor: 'pointer',
      fontSize: '16px',
      marginBottom: '20px',
    },
    heading: {
      marginBottom: '25px',
      color: '#333',
    },
    highlight: {
      color: '#007bff',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '16px',
    },
    select: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '16px',
      backgroundColor: '#fff',
    },
    sendButton: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    }
  };

  export default SendMoneyForm;
