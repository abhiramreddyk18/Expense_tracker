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
import SearchUser from './components/SearchUser';
import ProfilePage from './pages/ProfilePage';
import Insigths from './pages/Insigths';
import Header from './components/Header';
import ResetPin from './components/Resetpin';
import PrivateRoute from './PrivateRoute';
import { Navigate } from 'react-router-dom';



function App() {


  return (
    <div className="App">
     
      <BrowserRouter>
       <Header/>
        <Routes>
          <Route path="/" element={<LoginForm/>}></Route>
          <Route path="/send-money" element={<SendMoneyPage />}></Route>
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/transactions" element={<TransactionHistory />}></Route>
          <Route path="/confirm-pin" element={<ConfirmPin/>}></Route>
          <Route path="/setpin" element={<SetPin/>}></Route>
          <Route path="/bankfrom" element={<UserDetailsForm />}></Route>
          <Route path="/calender" element={<CalendarPage/>}></Route>
          
          <Route path="/searchuser" element={<SearchUser/>}></Route>
          <Route path="/insights" element={<Insigths/>}></Route>
          <Route path="/profile" element={<ProfilePage/>}></Route>
             <Route path="/resetpin" element={<ResetPin/>}></Route>
           <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>}/>

        <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </BrowserRouter>
    </div>


  );
}

export default App; 

