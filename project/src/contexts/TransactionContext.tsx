import React, { createContext, useState, ReactNode } from 'react';
import { generateMockTransactions } from '../utils/mockData';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
}

export type TransactionFilter = {
  dateRange: 'today' | 'week' | 'month' | 'custom';
  startDate?: Date;
  endDate?: Date;
  searchTerm: string;
};

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  filter: TransactionFilter;
  setFilter: React.Dispatch<React.SetStateAction<TransactionFilter>>;
  getFilteredTransactions: () => Transaction[];
  getTransactionById: (id: string) => Transaction | undefined;
  getDailyTotal: (type: 'income' | 'expense' | 'net') => number;
  getWeeklyData: () => { day: string; income: number; expense: number; net: number }[];
}

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  addTransaction: () => {},
  updateTransaction: () => {},
  deleteTransaction: () => {},
  filter: { dateRange: 'today', searchTerm: '' },
  setFilter: () => {},
  getFilteredTransactions: () => [],
  getTransactionById: () => undefined,
  getDailyTotal: () => 0,
  getWeeklyData: () => [],
});

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(generateMockTransactions());
  const [filter, setFilter] = useState<TransactionFilter>({
    dateRange: 'today',
    searchTerm: '',
  });

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const updateTransaction = (id: string, updates: Partial<Omit<Transaction, 'id'>>) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  const getFilteredTransactions = () => {
    return transactions.filter((transaction) => {
      // Date filter
      let passesDateFilter = true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (filter.dateRange === 'today') {
        const transactionDate = new Date(transaction.date);
        transactionDate.setHours(0, 0, 0, 0);
        passesDateFilter = transactionDate.getTime() === today.getTime();
      } else if (filter.dateRange === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        passesDateFilter = new Date(transaction.date) >= weekStart && new Date(transaction.date) <= today;
      } else if (filter.dateRange === 'month') {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        passesDateFilter = new Date(transaction.date) >= monthStart && new Date(transaction.date) <= today;
      } else if (filter.dateRange === 'custom' && filter.startDate && filter.endDate) {
        passesDateFilter = new Date(transaction.date) >= filter.startDate && new Date(transaction.date) <= filter.endDate;
      }

      // Search filter
      const passesSearchFilter = !filter.searchTerm || 
        transaction.description.toLowerCase().includes(filter.searchTerm.toLowerCase()) || 
        transaction.category.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(filter.searchTerm);

      return passesDateFilter && passesSearchFilter;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first
  };

  const getTransactionById = (id: string) => {
    return transactions.find((transaction) => transaction.id === id);
  };

  const getDailyTotal = (type: 'income' | 'expense' | 'net') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      transactionDate.setHours(0, 0, 0, 0);
      return transactionDate.getTime() === today.getTime();
    });
    
    if (type === 'income') {
      return todayTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    } else if (type === 'expense') {
      return todayTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    } else {
      // Net
      return todayTransactions.reduce((sum, t) => 
        sum + (t.type === 'income' ? t.amount : -t.amount), 0);
    }
  };

  const getWeeklyData = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Adjust to get Monday as first day
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - mondayOffset);
    weekStart.setHours(0, 0, 0, 0);
    
    const weeklyData = days.map((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      
      // Get transactions for this day
      const dayTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate.getTime() === date.getTime();
      });
      
      const income = dayTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expense = dayTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
      return {
        day,
        income,
        expense,
        net: income - expense,
      };
    });
    
    return weeklyData;
  };

  const value = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    filter,
    setFilter,
    getFilteredTransactions,
    getTransactionById,
    getDailyTotal,
    getWeeklyData,
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};