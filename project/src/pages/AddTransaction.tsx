import React, { useState, useContext } from 'react';
import { TransactionContext } from '../contexts/TransactionContext';
import { AuthContext } from '../contexts/AuthContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const AddTransaction: React.FC = () => {
  const { addTransaction } = useContext(TransactionContext);
  const { setCurrentPage } = useContext(AuthContext);
  
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const categories = {
    income: ['Sales', 'Services', 'Refunds', 'Investments', 'Other Income'],
    expense: ['Supplies', 'Equipment', 'Rent', 'Utilities', 'Salaries', 'Marketing', 'Other Expenses'],
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category || !date) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Create transaction object
    const transaction = {
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date(date),
    };
    
    // Add transaction to context
    addTransaction(transaction);
    
    // Show success message
    setShowSuccess(true);
    
    // Reset form after delay
    setTimeout(() => {
      setAmount('');
      setDescription('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setIsSubmitting(false);
      setShowSuccess(false);
      setCurrentPage('dashboard');
    }, 1500);
  };
  
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
          <h1 className="text-xl font-semibold text-gray-900">
            {showSuccess ? 'Transaction Added' : 'Add Transaction'}
          </h1>
        </div>
      </header>
      
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        {showSuccess ? (
          <div className="card fade-in flex flex-col items-center justify-center py-8">
            <CheckCircle size={48} className="text-green-500 mb-3" />
            <h2 className="text-xl font-medium text-gray-800 mb-1">Transaction Added!</h2>
            <p className="text-gray-500">Your transaction has been recorded successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card slide-up">
            {/* Transaction Type Toggle */}
            <div className="mb-6">
              <label className="form-label">Transaction Type</label>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-3 text-center font-medium transition-colors ${
                    type === 'income' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-3 text-center font-medium transition-colors ${
                    type === 'expense' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'
                  }`}
                >
                  Expense
                </button>
              </div>
            </div>
            
            {/* Amount Input */}
            <div className="mb-4">
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input pl-8 text-xl font-medium"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Description Field */}
            <div className="mb-4">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <input
                id="description"
                type="text"
                className="form-input"
                placeholder="What's this transaction for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            {/* Category Dropdown */}
            <div className="mb-4">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories[type].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date Picker */}
            <div className="mb-6">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                id="date"
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className={`btn w-full ${
                type === 'income' ? 'btn-success' : 'btn-danger'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                `Save ${type === 'income' ? 'Income' : 'Expense'}`
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddTransaction;