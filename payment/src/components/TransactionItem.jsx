import React from 'react';
import { useTheme } from '../context/ThemeContext';

const TransactionItem = ({ txn }) => {
  const { darkMode } = useTheme();
  const formattedDate = new Date(txn.date).toLocaleString();

  return (
    <div
      className={`rounded-xl p-5 flex justify-between items-start border ${
        darkMode
          ? 'bg-gray-700 border-gray-600 text-white'
          : 'bg-white border-gray-200 text-gray-900'
      }`}
    >
      <div className="space-y-1">
        <p className="text-lg font-semibold">{txn.name}</p>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
          {txn.category}
        </p>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
          {formattedDate}
        </p>
      </div>
      <div
        className={`text-lg font-bold ${
          txn.type === 'income' ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {txn.type === 'income' ? `+ ₹${txn.amount}` : `- ₹${txn.amount}`}
      </div>
    </div>
  );
};

export default TransactionItem;
