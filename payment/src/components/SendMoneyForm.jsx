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
    <div>
       <button onClick={() => navigate(-1)}>← Back</button>
      <h3>Send Money to {receiver?.name || 'Recipient'}</h3>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
      />

      <button onClick={handleSend}>Send Money</button>
    </div>
  );
};

export default SendMoneyForm;
