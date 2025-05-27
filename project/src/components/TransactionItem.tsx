import React from 'react';
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import { Transaction } from '../contexts/TransactionContext';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
  showDate?: boolean;
}

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

const formatTime = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleTimeString('en-US', options);
};

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  onClick,
  showDate = true
}) => {
  const { type, amount, description, category, date } = transaction;
  
  return (
    <div 
      className="flex items-center py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
      onClick={onClick}
    >
      <div className={`rounded-full p-2 mr-3 ${type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
        {type === 'income' ? (
          <TrendingUp size={16} className="text-green-600" />
        ) : (
          <TrendingDown size={16} className="text-red-600" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="font-medium text-gray-800">{description}</div>
        <div className="text-xs text-gray-500">
          {category} {showDate && `• ${formatDate(date)} ${formatTime(date)}`}
        </div>
      </div>
      
      <div className={`font-medium ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
        {type === 'income' ? '+' : '-'}${amount.toFixed(2)}
      </div>
      
      <ChevronRight size={16} className="ml-2 text-gray-400" />
    </div>
  );
};

export default TransactionItem;