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
    <div style={{
      maxWidth: 600,
      margin: '40px auto',
      backgroundColor: '#fff',
      borderRadius: 12,
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      padding: '30px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333',
      userSelect: 'none'
    }}>
      <h3 style={{
        marginBottom: 24,
        fontWeight: '700',
        fontSize: '1.8rem',
        color: '#2c3e50',
        textAlign: 'center',
        letterSpacing: '0.03em',
      }}>
        Set New Category Limit
      </h3>

      <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{
            flex: 2,
            padding: '12px 16px',
            borderRadius: 10,
            border: '1.8px solid #ccc',
            fontSize: 16,
            transition: 'border-color 0.3s',
            outline: 'none',
            cursor: 'pointer',
            backgroundColor: '#f9f9f9',
          }}
          onFocus={e => e.target.style.borderColor = '#3f51b5'}
          onBlur={e => e.target.style.borderColor = '#ccc'}
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
          style={{
            flex: 2,
            padding: '12px 16px',
            borderRadius: 10,
            border: '1.8px solid #ccc',
            fontSize: 16,
            outline: 'none',
            transition: 'border-color 0.3s',
            backgroundColor: '#f9f9f9',
          }}
          min="0"
          onFocus={e => e.target.style.borderColor = '#3f51b5'}
          onBlur={e => e.target.style.borderColor = '#ccc'}
        />

        <button
          onClick={handleAddLimit}
          style={{
            flex: 1,
            backgroundColor: '#3f51b5',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: 16,
            boxShadow: '0 4px 15px rgba(63, 81, 181, 0.4)',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            userSelect: 'none',
          }}
          onMouseEnter={e => {
            e.target.style.backgroundColor = '#303f9f';
            e.target.style.boxShadow = '0 6px 20px rgba(48, 63, 159, 0.6)';
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = '#3f51b5';
            e.target.style.boxShadow = '0 4px 15px rgba(63, 81, 181, 0.4)';
          }}
          aria-label="Save category limit"
        >
          Save
        </button>
      </div>

      <h3 style={{
        fontWeight: '700',
        fontSize: '1.6rem',
        color: '#2c3e50',
        marginBottom: 20,
        borderBottom: '2px solid #3f51b5',
        paddingBottom: 8,
        userSelect: 'text',
      }}>
        Current Limits
      </h3>

      {limitsData.length === 0 ? (
        <p style={{
          fontSize: 16,
          color: '#666',
          textAlign: 'center',
          fontStyle: 'italic',
          userSelect: 'text',
        }}>
          No limits set yet.
        </p>
      ) : (
        limitsData.map(({ category, limit }, idx) => (
  <div
    key={idx}
    style={{
      padding: '14px 18px',
      marginBottom: 12,
      borderRadius: 8,
      backgroundColor: '#f5f6fa',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 16,
      fontWeight: '500',
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
    }}
  >
    <span>{category}</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ color: '#3f51b5', fontWeight: '700' }}>₹{limit.toFixed(2)}</span>
      <button
        onClick={() => handleDeleteLimit(category)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#e53935',
          cursor: 'pointer',
          fontSize: 18,
          fontWeight: 'bold',
        }}
        title="Delete Limit"
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