import React, { useState } from 'react';
import SearchUser from '../components/SearchUser';
import SendMoneyForm from '../components/SendMoneyForm';

const SendMoneyPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const senderId = localStorage.getItem('userId');
  return (
    <div className="send-money-container">
      {!selectedUser ? (
        <SearchUser onUserSelect={setSelectedUser} />
      ) : (
        <SendMoneyForm senderId={senderId} receiver={selectedUser} />
      )}
    </div>
  );
};

export default SendMoneyPage;
