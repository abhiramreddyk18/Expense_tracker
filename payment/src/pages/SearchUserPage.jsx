import React from 'react';
import SearchUser from '../components/SearchUser';

const SearchUserPage = () => {
  const userId = localStorage.getItem('userId');

  const handleUserSelect = (user) => {
    console.log('Selected user:', user);
    // You can navigate or open another component with this user
    // For now, just logging the selected user
  };

  return <SearchUser loggedInUserId={userId} onUserSelect={handleUserSelect} />;
};

export default SearchUserPage;
