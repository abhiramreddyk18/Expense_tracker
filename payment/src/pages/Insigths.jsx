import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Tooltip, Cell, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import LimitManager from '../components/LimitManager';
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { PiGraphFill } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import { TbCategory } from "react-icons/tb";
import { CgInsights } from "react-icons/cg";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#F9C80E'];

const Insights = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [limitsData, setLimitsData] = useState([]);
  const [days, setDays] = useState(30);

  const userId = localStorage.getItem('userId');
  const backendUrl = 'http://localhost:3000';
  const categories = ['Food', 'Bills', 'Shopping', 'Travel', 'Education', 'Health', 'Salary', 'Other'];

  useEffect(() => {
    if (!userId) return;

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

  const maxExpenseCategory = limitsData.length > 0
    ? limitsData.reduce((max, item) =>
        item.spent > (max.spent || 0) ? item : max, { spent: 0 })
    : null;

  return (
    <div className="w-full min-h-screen px-6 py-10 bg-indigo-100 font-sans">
      <h2 className="text-4xl font-bold text-black mb-8 flex items-center gap-3">
        <CgInsights className="text-3xl" />
        Spending Insights
      </h2>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10 px-6 py-4 bg-neutral-800 rounded-xl shadow-lg text-white">
        <div className="flex items-center gap-4">
          <label className="font-semibold text-base sm:text-lg flex items-center gap-2">
            <SlCalender className="text-xl" />
            Show data for last
          </label>
          <input
            type="number"
            value={days}
            min="1"
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-28 px-4 py-2 border border-blue-300 rounded-md shadow-inner text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition duration-200"
          />
          <span className="font-semibold text-base sm:text-lg">days</span>
        </div>

        {maxExpenseCategory && maxExpenseCategory.spent > 0 && (
          <div className="text-lg sm:text-xl font-semibold text-red-700 border border-red-400 bg-neutral-800 px-5 py-3 rounded-lg shadow w-fit">
            🔺 Highest Spending: <span className="font-bold">{maxExpenseCategory.category}</span> — ₹{maxExpenseCategory.spent}
          </div>
        )}
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-8 mb-12">
        <div className="w-full lg:w-1/2 p-6 rounded-xl shadow-lg bg-neutral-800">
          <h3 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
            <PiGraphFill className="text-2xl" />
            Category-wise Income & Expenses
          </h3>
          <div className="flex justify-center">
            <PieChart width={500} height={400}>
              <Pie
                data={categoryData}
                dataKey="totalAmount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={130}
                innerRadius={70}
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
        </div>

        <div className="w-full lg:w-1/2 bg-neutral-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
            <BsFileEarmarkBarGraph className="text-2xl" />
            Category Limit vs Spending
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
      </div>

      <div className="p-8 rounded-xl shadow-lg mb-1 bg-neutral-800">
        <h3 className="text-2xl font-semibold mb-5 text-white flex items-center gap-2">
          <TbCategory className="text-2xl" />
          Set Category Limits
        </h3>
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
