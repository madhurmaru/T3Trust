// BorrowerDashboard.js
import React from 'react';

const BorrowerDashboard = () => {
  const activeLoans = [
    { id: 1, amount: '₹5,000', interest: '8%', due: 'Due in 10 days' },
    { id: 2, amount: '₹2,000', interest: '10%', due: 'Due in 5 days' }
  ];

  const creditScore = 760;
  const walletBalance = '₹2,500';
  const interestPayable = '₹150';

  const lenders = [
    { name: 'Ravi', amount: '₹10,000', interest: '10%' },
    { name: 'Priya', amount: '₹5,000', interest: '8%' },
    { name: 'Akash', amount: '₹8,000', interest: '9%' },
    { name: 'Sunita', amount: '₹15,000', interest: '11%' }
  ];

  const getScoreStatus = (score) => {
    if (score >= 750) return { color: 'text-green-600', label: 'Good' };
    if (score >= 600) return { color: 'text-yellow-600', label: 'Fair' };
    return { color: 'text-red-600', label: 'Poor' };
  };

  const { color, label } = getScoreStatus(creditScore);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">
        UPI Loan Nexus <span className="text-black">Borrower Dashboard</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Active Loans */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2 mb-4">
            <span>📄</span> Active Loans
          </h2>
          {activeLoans.map((loan) => (
            <div key={loan.id} className="flex justify-between items-center border p-3 rounded-lg mb-3">
              <div>
                <p className="font-medium">{loan.amount}</p>
                <p className="text-sm text-gray-500">at {loan.interest} interest</p>
              </div>
              <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                📅 {loan.due}
              </div>
            </div>
          ))}
        </div>

        {/* Credit Score */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2 mb-4">
            <span>📈</span> Credit Score (via UPI) <span className="text-gray-400 cursor-help">ⓘ</span>
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-8 border-green-400 flex items-center justify-center text-3xl font-bold">
              {creditScore}
            </div>
            <p className="text-gray-500 mt-2">out of 1000</p>
            <p className={`mt-2 px-3 py-1 rounded-full text-sm ${color} border ${color}/50`}>{label}</p>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2 mb-4">
            <span>💼</span> Wallet Balance + Interest
          </h2>
          <div className="text-center">
            <p className="text-3xl font-bold">{walletBalance}</p>
            <p className="text-sm text-gray-500 mb-3">Current Balance</p>
            <hr className="mb-3" />
            <p className="text-red-600 font-medium">{interestPayable}</p>
            <p className="text-sm text-gray-400">Upcoming Interest Payable</p>
            <p className="text-xs text-gray-400 mt-1 italic">All transactions processed via this wallet.</p>
          </div>
        </div>

        {/* Available Lenders */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2 mb-4">
            <span>🤝</span> Available Lenders
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lenders.map((lender, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold">{lender.name}</p>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                    {lender.interest} interest
                  </span>
                </div>
                <p className="text-lg font-bold mb-2">{lender.amount}</p>
                <button className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition">
                  Request
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <footer className="mt-12 text-center text-gray-400 text-sm">
        UPI Loan Nexus ©️ 2025 – Emergency Loan System
      </footer>
    </div>
  );
};

export default BorrowerDashboard;
