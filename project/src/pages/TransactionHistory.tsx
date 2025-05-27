import React, { useContext, useState } from 'react';
import { TransactionContext, TransactionFilter } from '../contexts/TransactionContext';
import { AuthContext } from '../contexts/AuthContext';
import TransactionItem from '../components/TransactionItem';
import { ArrowLeft, Calendar, Search, Filter } from 'lucide-react';

const TransactionHistory: React.FC = () => {
  const { getFilteredTransactions, filter, setFilter } = useContext(TransactionContext);
  const { setCurrentPage } = useContext(AuthContext);
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filter.searchTerm);
  
  const handleSearch = () => {
    setFilter({ ...filter, searchTerm });
  };
  
  const handleDateRangeChange = (dateRange: TransactionFilter['dateRange']) => {
    setFilter({ ...filter, dateRange });
    setShowFilters(false);
  };
  
  const transactions = getFilteredTransactions();
  
  // Calculate totals for filtered transactions
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netAmount = totalIncome - totalExpense;
  
  // Group transactions by date
  const groupedTransactions: Record<string, typeof transactions> = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    if (!groupedTransactions[date]) {
      groupedTransactions[date] = [];
    }
    
    groupedTransactions[date].push(transaction);
  });
  
  // Get dates in descending order
  const dates = Object.keys(groupedTransactions).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="mr-3 text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
        </div>
      </header>
      
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Summary Card */}
        <div className="card mb-4 fade-in">
          <h2 className="font-medium text-gray-800 mb-3">
            {filter.dateRange === 'today' ? "Today's" : 
             filter.dateRange === 'week' ? "This Week's" :
             filter.dateRange === 'month' ? "This Month's" : "Custom Period"} Summary
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs text-green-700 mb-1">Income</div>
              <div className="text-lg font-semibold text-green-700">${totalIncome.toFixed(2)}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-xs text-red-700 mb-1">Expenses</div>
              <div className="text-lg font-semibold text-red-700">${totalExpense.toFixed(2)}</div>
            </div>
            <div className={`rounded-lg p-3 ${netAmount >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
              <div className={`text-xs ${netAmount >= 0 ? 'text-blue-700' : 'text-orange-700'} mb-1`}>
                Net
              </div>
              <div className={`text-lg font-semibold ${netAmount >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                ${Math.abs(netAmount).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm mb-4 slide-up">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={handleSearch}
              >
                <Search size={18} />
              </button>
            </div>
          </div>
          
          {/* Date Range Selector */}
          <div className="p-3 flex justify-between items-center">
            <div className="flex items-center">
              <Calendar size={18} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">
                {filter.dateRange === 'today' ? 'Today' :
                 filter.dateRange === 'week' ? 'This Week' :
                 filter.dateRange === 'month' ? 'This Month' : 'Custom'}
              </span>
            </div>
            <button
              className="text-blue-600 text-sm flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="mr-1" />
              Filter
            </button>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <div className="grid grid-cols-2 gap-2">
                <button
                  className={`text-center py-2 rounded-lg text-sm ${
                    filter.dateRange === 'today'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  onClick={() => handleDateRangeChange('today')}
                >
                  Today
                </button>
                <button
                  className={`text-center py-2 rounded-lg text-sm ${
                    filter.dateRange === 'week'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  onClick={() => handleDateRangeChange('week')}
                >
                  This Week
                </button>
                <button
                  className={`text-center py-2 rounded-lg text-sm ${
                    filter.dateRange === 'month'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  onClick={() => handleDateRangeChange('month')}
                >
                  This Month
                </button>
                <button
                  className={`text-center py-2 rounded-lg text-sm ${
                    filter.dateRange === 'custom'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  onClick={() => handleDateRangeChange('custom')}
                >
                  Custom
                </button>
              </div>
              
              {/* Custom Date Range (simplified for this demo) */}
              {filter.dateRange === 'custom' && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      onChange={(e) => {
                        const startDate = e.target.value ? new Date(e.target.value) : undefined;
                        setFilter({ ...filter, startDate });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      onChange={(e) => {
                        const endDate = e.target.value ? new Date(e.target.value) : undefined;
                        setFilter({ ...filter, endDate });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Transaction List */}
        <div className="mb-16">
          {transactions.length > 0 ? (
            <>
              {dates.map((date) => (
                <div key={date} className="mb-4">
                  <div className="text-sm font-medium text-gray-500 mb-2 px-2">{date}</div>
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {groupedTransactions[date].map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        showDate={false}
                        onClick={() => {
                          // Handle transaction click (e.g., show details)
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-gray-500 mb-2">No transactions found</div>
              <p className="text-sm text-gray-400">
                Try changing your filters or add a new transaction
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;