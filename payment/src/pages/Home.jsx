import React from 'react'
const userName = "Rahul", balance = 12500.0 ;


const Home= () => {

  return (
    <div className="min-h-screen bg-gray-100 p-4">
    
    <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-xl">
      <div className="text-xl font-bold">🏦 YourLogo</div>
      <div className="text-md font-medium">Welcome, {userName}!</div>
      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Logout 🔓</button>
    </div>

   
    <div className="mt-6 bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center">
      <div className="text-lg font-semibold">💰 Bank Balance: ₹ {balance.toLocaleString()}</div>
      {/* <Link
        to="/insights"
        className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        👁️ View Insights
      </Link>
    </div>

 
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Link
        to="/send-money"
        className="bg-green-500 text-white text-center py-4 rounded-xl shadow-md hover:bg-green-600"
      >
        💸 Send Money
      </Link>
      <Link
        to="/transactions"
        className="bg-purple-500 text-white text-center py-4 rounded-xl shadow-md hover:bg-purple-600"
      >
        📄 Transaction History
      </Link>
      <Link
        to="/profile"
        className="bg-yellow-500 text-white text-center py-4 rounded-xl shadow-md hover:bg-yellow-600"
      >
        👤 Profile
      </Link> */}
    </div>
  </div>
  )
}

export default Home;
