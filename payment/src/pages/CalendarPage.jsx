import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDateClick = async (date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);

    try {
      const userId = localStorage.getItem('userId');
      const res = await axios.get(`/api/transaction/by-date`, {
        params: { userId, date: dateStr },
      });
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setTransactions([]);
    }
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const calendar = [];

    // Add empty days at the start of the calendar for the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendar.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const current = new Date(year, month, day);
      const isToday = current.toDateString() === today.toDateString();

      calendar.push(
        <div
          key={day}
          onClick={() => handleDateClick(current)}
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '8px',
            backgroundColor: isToday ? '#28a745' : '#f0f0f0', // Green for today's date
            fontWeight: isToday ? 'bold' : 'normal',
            color: isToday ? 'white' : 'black', // White text for today's date
          }}
        >
          {day}
        </div>
      );
    }

    return calendar;
  };

  const changeMonth = (direction) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() + direction);
      return newMonth;
    });
  };

  const handleMonthYearSubmit = (e) => {
    e.preventDefault();
    const month = parseInt(e.target.month.value, 10) - 1; // Month input is 1-12, JS months are 0-11
    const year = parseInt(e.target.year.value, 10);
    setCurrentMonth(new Date(year, month));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => changeMonth(-1)}
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Previous Month
        </button>

        <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>
          {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
        </h2>

        <button
          onClick={() => changeMonth(1)}
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Next Month
        </button>
      </div>

      {}
      <form onSubmit={handleMonthYearSubmit} style={{ textAlign: 'center', marginBottom: '20px' }}>
        <label htmlFor="month">Month:</label>
        <input
          type="number"
          id="month"
          name="month"
          min="1"
          max="12"
          defaultValue={currentMonth.getMonth() + 1} 
          style={{ marginLeft: '5px', padding: '5px', width: '60px' }}
        />
        <label htmlFor="year" style={{ marginLeft: '10px' }}>Year:</label>
        <input
          type="number"
          id="year"
          name="year"
          defaultValue={currentMonth.getFullYear()} 
          style={{ marginLeft: '5px', padding: '5px', width: '80px' }}
        />
        <button
          type="submit"
          style={{
            padding: '5px 10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginLeft: '10px',
            cursor: 'pointer',
          }}
        >
          Go
        </button>
      </form>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '10px',
        }}
      >
        {renderCalendar()}
      </div>

      {selectedDate && (
        <div style={{ marginTop: '30px' }}>
          <h3>Transactions on {selectedDate}</h3>
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <div
                key={txn._id}
                style={{
                  backgroundColor: '#fafafa',
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '6px',
                }}
              >
                <strong>Amount:</strong> ₹{txn.amount} <br />
                <strong>Category:</strong> {txn.category} <br />
                <strong>Description:</strong> {txn.description}
              </div>
            ))
          ) : (
            <p>No transactions found on this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
