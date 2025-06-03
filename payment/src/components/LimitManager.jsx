import React, { useState } from 'react';
import axios from 'axios';

const LimitManager = ({ limitsData, setLimitsData, userId, backendUrl, availableCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [limitAmount, setLimitAmount] = useState('');

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
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8 font-sans text-gray-800 select-none">
      <h3 className="mb-6 font-extrabold text-2xl text-center text-indigo-900 tracking-wide">
        Set New Category Limit
      </h3>

      <div className="flex gap-4 mb-8">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="flex-2 p-3 rounded-xl border-2 border-gray-300 bg-gray-100 text-base cursor-pointer outline-none focus:border-indigo-600 transition-colors"
        >
          <option value="" disabled>
            -- Select Category --
          </option>
          {availableCategories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Limit amount (₹)"
          value={limitAmount}
          onChange={e => setLimitAmount(e.target.value)}
          min="0"
          className="flex-2 p-3 rounded-xl border-2 border-gray-300 bg-gray-100 text-base outline-none focus:border-indigo-600 transition-colors"
        />

        <button
          onClick={handleAddLimit}
          aria-label="Save category limit"
          className="flex-1 bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-800 hover:shadow-lg transition duration-300 select-none"
        >
          Save
        </button>
      </div>

      <h3 className="font-extrabold text-xl text-indigo-900 mb-5 border-b-2 border-indigo-700 pb-2 select-text">
        Current Limits
      </h3>

      {limitsData.length === 0 ? (
        <p className="text-center text-gray-500 italic select-text text-base">No limits set yet.</p>
      ) : (
        limitsData.map(({ category, limit }, idx) => (
          <div
            key={idx}
            className="p-4 mb-3 rounded-lg bg-gray-50 flex justify-between items-center font-medium text-base shadow-inner select-text"
          >
            <span>{category}</span>
            <span className="flex items-center gap-3">
              <span className="text-indigo-700 font-bold">₹{limit.toFixed(2)}</span>
              <button
                onClick={() => handleDeleteLimit(category)}
                title="Delete Limit"
                className="text-red-600 text-lg font-bold hover:text-red-800 transition-colors cursor-pointer bg-transparent border-none"
              >
                ❌
              </button>
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default LimitManager;
