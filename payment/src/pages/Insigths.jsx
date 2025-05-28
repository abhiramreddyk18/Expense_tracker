import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Tooltip, Cell, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import LimitManager from '../components/LimitManager';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#F9C80E'];

const Insights = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [limitsData, setLimitsData] = useState([]);
  const [days, setDays] = useState(30);

  const userId = localStorage.getItem('userId');
  const backendUrl = 'http://localhost:3000';
  const categories = ['Food', 'Bills', 'Shopping', 'Travel', 'Education', 'Health', 'Salary', 'Other'];

  useEffect(() => {
    if (!userId) {
      console.warn('No userId found in localStorage');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`${backendUrl}/bank/category-summary/${userId}?days=${days}`);
        const incomeData = [], expenseData = [];

        res.data.forEach(item => {
          if (item.type === 'Income') {
            incomeData.push({ category: `${item.category} (income)`, totalAmount: item.totalAmount });
          } else {
            expenseData.push({ category: `${item.category} (expense)`, totalAmount: item.totalAmount });
          }
        });

        setCategoryData([...incomeData, ...expenseData]);

        const limitsRes = await axios.get(`${backendUrl}/bank/category-limits/${userId}`);
        const mergedData = limitsRes.data.map(limitItem => {
          const matched = res.data.find(s => s.category === limitItem.category && s.type === 'expense');
          return {
            category: limitItem.category,
            limit: limitItem.limitAmount,
            spent: matched ? matched.totalAmount : 0
          };
        });

        setLimitsData(mergedData);
      } catch (err) {
        console.error('Error loading insights:', err);
      }
    };

    fetchData();
  }, [days, userId]);

  if (!userId) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Please login to view insights.</p>;
  }

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '40px auto',
      padding: '30px',
      borderRadius: '16px',
      background: 'linear-gradient(to right, #fdfbfb, #ebedee)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '28px',
        marginBottom: '30px',
        color: '#2c3e50',
        fontWeight: '600'
      }}>
        📊 Spending Insights
      </h2>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '25px',
        fontSize: '16px',
        color: '#333'
      }}>
        <label style={{ fontWeight: '500', marginRight: '10px' }}>Show data for last</label>
        <input
          type="number"
          value={days}
          min="1"
          onChange={(e) => setDays(Number(e.target.value))}
          style={{
            width: '80px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '15px',
            outline: 'none',
            marginRight: '6px'
          }}
        />
        <span style={{ fontWeight: '500' }}>days</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
        <PieChart width={500} height={350}>
          <Pie
            data={categoryData}
            dataKey="totalAmount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={60}
            label
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </div>

      <div>
        <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>
          💸 Category Limit vs Spending
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={limitsData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" angle={-20} textAnchor="end" interval={0} height={60} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="limit" fill="#8884d8" name="Limit" />
            <Bar dataKey="spent" fill="#ff5e57" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '50px', padding: '20px', borderTop: '1px solid #ccc' }}>
        <LimitManager
          limitsData={limitsData}
          setLimitsData={setLimitsData}
          userId={userId}
          backendUrl={backendUrl}
          availableCategories={categories}
        />
      </div>
    </div>
  );
};

export default Insights;
