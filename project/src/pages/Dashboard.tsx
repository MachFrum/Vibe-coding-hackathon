import React, { useContext } from 'react';
import { TransactionContext } from '../contexts/TransactionContext';
import { AuthContext } from '../contexts/AuthContext';
import TransactionItem from '../components/TransactionItem';
import WeeklyChart from '../components/WeeklyChart';
import { Plus, LogOut, Menu } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { getFilteredTransactions, getDailyTotal, getWeeklyData } = useContext(TransactionContext);
  const { logout, user, setCurrentPage } = useContext(AuthContext);
  
  const dailyIncome = getDailyTotal('income');
  const dailyExpense = getDailyTotal('expense');
  const dailyNet = getDailyTotal('net');
  
  const recentTransactions = getFilteredTransactions().slice(0, 5);
  const weeklyData = getWeeklyData();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name || 'User'}</p>
          </div>
          <div className="flex">
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <LogOut size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 ml-1">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>
      
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Daily Summary */}
        <div className="card mb-4 fade-in">
          <h2 className="font-medium text-gray-800 mb-3">Today's Summary</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs text-green-700 mb-1">Income</div>
              <div className="text-lg font-semibold text-green-700">${dailyIncome.toFixed(2)}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-xs text-red-700 mb-1">Expenses</div>
              <div className="text-lg font-semibold text-red-700">${dailyExpense.toFixed(2)}</div>
            </div>
            <div className={`rounded-lg p-3 ${dailyNet >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
              <div className={`text-xs ${dailyNet >= 0 ? 'text-blue-700' : 'text-orange-700'} mb-1`}>
                Net
              </div>
              <div className={`text-lg font-semibold ${dailyNet >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                ${Math.abs(dailyNet).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Weekly Chart */}
        <WeeklyChart data={weeklyData} />
        
        {/* Quick Actions */}
        <div className="mt-4 mb-4 slide-up">
          <h2 className="font-medium text-gray-800 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => {
                setCurrentPage('addTransaction');
              }}
              className="bg-green-600 text-white rounded-lg p-4 text-center transition-transform hover:scale-105"
            >
              <Plus size={18} className="mx-auto mb-1" />
              <div className="text-xs">Add Sale</div>
            </button>
            <button
              onClick={() => {
                setCurrentPage('addTransaction');
              }}
              className="bg-red-600 text-white rounded-lg p-4 text-center transition-transform hover:scale-105"
            >
              <Plus size={18} className="mx-auto mb-1" />
              <div className="text-xs">Add Expense</div>
            </button>
            <button
              onClick={() => {
                setCurrentPage('addInventory');
              }}
              className="bg-blue-600 text-white rounded-lg p-4 text-center transition-transform hover:scale-105"
            >
              <Plus size={18} className="mx-auto mb-1" />
              <div className="text-xs">Add Inventory</div>
            </button>
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="card mb-4 fade-in">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium text-gray-800">Recent Transactions</h2>
            <button
              onClick={() => setCurrentPage('transactionHistory')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          
          {recentTransactions.length > 0 ? (
            <div>
              {recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => {
                    // Handle transaction click
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No recent transactions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;