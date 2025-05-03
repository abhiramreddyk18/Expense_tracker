import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SendMoneyPage from './pages/SendMoneyPage';
import LoginForm from './pages/LoginForm';
import TransactionHistory from './pages/TransactionHistory';
import ConfirmPin from './components/ConfirmPin';
import SetPin from './components/Setpin';
import UserDetailsForm from './pages/UserDetailsForm';
import CalendarPage from './pages/CalendarPage';


function App() {


  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/send-money" element={<SendMoneyPage />}></Route>
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/transactions" element={<TransactionHistory />}></Route>
          <Route path="/pin" element={<ConfirmPin/>}></Route>
          <Route path="/resetpin" element={<SetPin/>}></Route>
          <Route path="/bankfrom" element={<UserDetailsForm />}></Route>
          <Route path="/calender" element={<CalendarPage/>}></Route>
          <Route path="/home" element={<Home/>}></Route>
        </Routes>
      </BrowserRouter>

      
    </div>


  );
}

export default App; 

