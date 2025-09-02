import React, { useState } from 'react';
import axios from 'axios';

const LimitManager = ({ limitsData, setLimitsData, userId, availableCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const backendUrl=process.env.REACT_APP_BACKEND_URL
  const handleDeleteLimit = async (categoryToDelete) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the limit for "${categoryToDelete}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`${backendUrl}/bank/category-limits/${userId}/${categoryToDelete}`);
      setLimitsData(prev => prev.filter(item => item.category !== categoryToDelete));
      alert('Limit deleted successfully!');
    } catch (error) {
      console.error('Error deleting limit:', error);
      alert('Failed to delete limit');
    }
  };

  const handleAddLimit = async () => {
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }
    if (!limitAmount || isNaN(limitAmount) || limitAmount <= 0) {
      alert('Please enter a valid limit amount');
      return;
    }

    try {
      await axios.post(`${backendUrl}/bank/category-limits/${userId}`, {
        category: selectedCategory,
        limitAmount: parseFloat(limitAmount),
      });

      setLimitsData(prev => {
        const exists = prev.find(item => item.category === selectedCategory);
        if (exists) {
          return prev.map(item =>
            item.category === selectedCategory ? { ...item, limit: parseFloat(limitAmount) } : item
          );
        } else {
          return [...prev, { category: selectedCategory, limit: parseFloat(limitAmount), spent: 0 }];
        }
      });

      alert('Limit saved successfully!');
      setSelectedCategory('');
      setLimitAmount('');
    } catch (error) {
      console.error('Error saving limit:', error);
      alert('Failed to save limit');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-netural-800 rounded-xl shadow-lg p-8 font-sans text-white select-none">
      <h3 className="text-2xl font-bold text-center mb-6 text-white tracking-wide">
        Set New Category Limit
      </h3>

      <div className="flex gap-4 mb-8">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 text-base font-normal focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
          aria-label="Select category"
        >
          <option value="" disabled>-- Select Category --</option>
          {availableCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Limit amount (₹)"
          value={limitAmount}
          onChange={e => setLimitAmount(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 text-base font-normal focus:outline-none focus:ring-2 focus:ring-blue-300"
          min="0"
          aria-label="Limit amount"
        />

        <button
          onClick={handleAddLimit}
          className="flex-none px-6 py-2 rounded-lg  text-lime-600  hover:text-black font-semibold shadow-md hover:bg-blue-300 hover:shadow-lg transition duration-300 select-none"
          aria-label="Save category limit"
        >
          Save
        </button>
      </div>

      <h3 className="text-xl font-semibold text-white mb-4 border-b-2 border-blue-300 pb-2 select-text">
        Current Limits
      </h3>

      {limitsData.length === 0 ? (
        <p className="text-center italic text-white select-text">No limits set yet.</p>
      ) : (
        limitsData.map(({ category, limit }, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center p-4 mb-3 rounded-lg bg-netrual-800 shadow-inner font-medium text-white select-text"
          >
            <span>{category}</span>
            <div className="flex items-center gap-4">
              <span>₹{limit}</span>
              <button
                onClick={() => handleDeleteLimit(category)}
                className="text-red-500 hover:text-red-700 transition duration-200 font-semibold cursor-pointer select-none"
                aria-label={`Delete limit for ${category}`}
                title={`Delete limit for ${category}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LimitManager;
