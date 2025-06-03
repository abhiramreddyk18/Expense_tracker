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
    return <p className="text-center mt-12 text-lg text-gray-600">Please login to view insights.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 rounded-xl bg-gradient-to-r from-white to-gray-100 shadow-lg font-sans">
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-8">📊 Spending Insights</h2>

      <div className="flex items-center justify-center mb-6 text-gray-700 text-base">
        <label className="font-medium mr-2">Show data for last</label>
        <input
          type="number"
          value={days}
          min="1"
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-20 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2"
        />
        <span className="font-medium">days</span>
      </div>

      <div className="flex justify-center mb-12 overflow-x-auto">
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
        <h3 className="text-center mb-6 text-lg font-semibold text-gray-800">💸 Category Limit vs Spending</h3>
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

      <div className="mt-12 pt-6 border-t border-gray-300">
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
