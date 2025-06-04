import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchUser from '../components/SearchUser';

const SendMoneyPage = () => {
  const senderId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleUserSelect = (user) => {
    navigate(`/chat/${user._id}`);
  };

  return (
    <div className="send-money-container">
      <SearchUser loggedInUserId={senderId} onUserSelect={handleUserSelect} />
    </div>
  );
};

export default SendMoneyPage;
