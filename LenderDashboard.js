// LenderDashboard.js
import React from 'react';

const LenderDashboard = () => {
  const totalLent = '₹28,000';
  const totalReturns = '₹2,500';
  const borrowers = [
    { name: 'Ankit', amount: '₹5,000', status: 'On Time', due: '5 days' },
    { name: 'Neha', amount: '₹3,000', status: 'Late', due: '2 days' },
    { name: 'Rohan', amount: '₹10,000', status: 'On Time', due: '12 days' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-green-600 mb-10">
        UPI Loan Nexus <span className="text-black">Lender Dashboard</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Investment Summary */}
        <div className="bg-white rounded-xl shadow p-5 text-center">
          <h2 className="text-lg font-semibold text-green-800 mb-4">📊 Investment Summary</h2>
          <p className="text-3xl font-bold text-green-600">{totalLent}</p>
          <p className="text-sm text-gray-500 mb-3">Total Lent</p>
          <hr className="mb-3" />
          <p className="text-blue-600 font-medium">{totalReturns}</p>
          <p className="text-sm text-gray-400">Total Interest Earned</p>
        </div>

        {/* Borrowers List */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold text-green-800 mb-4">🤝 Your Borrowers</h2>
          {borrowers.map((borrower, index) => (
            <div key={index} className="border rounded-lg p-3 mb-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-lg">{borrower.name}</p>
                  <p className="text-gray-500 text-sm">Amount: {borrower.amount}</p>
                </div>
                <div className={`text-sm font-medium ${borrower.status === 'Late' ? 'text-red-600' : 'text-green-600'}`}>
                  ⏱ {borrower.status} ({borrower.due})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-400 text-sm">
        UPI Loan Nexus ©️ 2025 – Empowering Micro Lending
      </footer>
    </div>
  );
};

export default LenderDashboard;
