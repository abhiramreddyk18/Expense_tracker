import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#F9C80E'];

const Insights = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [days, setDays] = useState(30);
  const userId = localStorage.getItem('userId');
  const backendUrl = 'http://localhost:3000'; // Adjust if the backend URL is different

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await axios.get(`${backendUrl}/bank/category-summary/${userId}?days=${days}`);
        
        // Format the data to separate Income and Expense
        const incomeData = [];
        const expenseData = [];

        res.data.forEach(item => {
          if (item.type === 'Income') {
            incomeData.push({ category: `${item.category} (Income)`, totalAmount: item.totalAmount });
          } else {
            expenseData.push({ category: `${item.category} (Expense)`, totalAmount: item.totalAmount });
          }
        });

        // Combine the income and expense data
        setCategoryData([...incomeData, ...expenseData]);
      } catch (err) {
        console.error('Error fetching insights', err);
      }
    };

    fetchInsights();
  }, [days, userId]);

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '30px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📊 Spending Insights</h2>

      <div style={{ marginBottom: '20px' }}>
        <label><strong>Show data for last </strong></label>
        <input
          type="number"
          value={days}
          min="1"
          onChange={(e) => setDays(e.target.value)}
          style={{ marginLeft: '10px', width: '80px', padding: '6px', borderRadius: '6px' }}
        />{' '}
        days
      </div>

      <PieChart width={500} height={300}>
        <Pie
          data={categoryData}
          dataKey="totalAmount"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    
      {/* <div style={{ marginTop: '40px' }}>
        <h3>💼 Set Spending Limit per Category</h3>
        <form onSubmit={handleLimitSubmit} style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Category"
            value={newLimit.category}
            required
            onChange={(e) => setNewLimit({ ...newLimit, category: e.target.value })}
            style={{ marginRight: '10px', padding: '8px', borderRadius: '6px', width: '200px' }}
          />
          <input
            type="number"
            placeholder="Limit (₹)"
            value={newLimit.amount}
            required
            onChange={(e) => setNewLimit({ ...newLimit, amount: e.target.value })}
            style={{ marginRight: '10px', padding: '8px', borderRadius: '6px', width: '150px' }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Set Limit
          </button>
        </form>
      </div> */}

      {/* <div style={{ marginTop: '30px' }}>
        <h3>🚨 Limit Warnings</h3>
        {categoryData.map((item) => (
          <div key={item.category} style={{ margin: '10px 0' }}>
            <strong>{item.category}</strong>: Spent ₹{item.totalAmount} / ₹{categoryLimits[item.category] || '∞'}
            {categoryLimits[item.category] && item.totalAmount > categoryLimits[item.category] && (
              <span style={{ color: 'red', marginLeft: '10px' }}>⚠️ Over Limit!</span>
            )}
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Insights;
