import { Transaction } from '../contexts/TransactionContext';
import { InventoryItem } from '../contexts/InventoryContext';

export const generateMockTransactions = (): Transaction[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 3);
  
  const fourDaysAgo = new Date(today);
  fourDaysAgo.setDate(today.getDate() - 4);
  
  return [
    {
      id: '1',
      type: 'income',
      amount: 125.50,
      description: 'Product sale - Premium package',
      category: 'Sales',
      date: today,
    },
    {
      id: '2',
      type: 'expense',
      amount: 42.75,
      description: 'Office supplies',
      category: 'Supplies',
      date: today,
    },
    {
      id: '3',
      type: 'income',
      amount: 250.00,
      description: 'Consulting services',
      category: 'Services',
      date: yesterday,
    },
    {
      id: '4',
      type: 'expense',
      amount: 65.99,
      description: 'Internet bill',
      category: 'Utilities',
      date: yesterday,
    },
    {
      id: '5',
      type: 'income',
      amount: 175.25,
      description: 'Product sale - Basic package',
      category: 'Sales',
      date: twoDaysAgo,
    },
    {
      id: '6',
      type: 'expense',
      amount: 12.50,
      description: 'Coffee and snacks',
      category: 'Other Expenses',
      date: twoDaysAgo,
    },
    {
      id: '7',
      type: 'income',
      amount: 350.00,
      description: 'Website design',
      category: 'Services',
      date: threeDaysAgo,
    },
    {
      id: '8',
      type: 'expense',
      amount: 89.99,
      description: 'Software subscription',
      category: 'Other Expenses',
      date: threeDaysAgo,
    },
    {
      id: '9',
      type: 'income',
      amount: 155.75,
      description: 'Product sale - Standard package',
      category: 'Sales',
      date: fourDaysAgo,
    },
    {
      id: '10',
      type: 'expense',
      amount: 750.00,
      description: 'Monthly rent',
      category: 'Rent',
      date: fourDaysAgo,
    },
  ];
};

export const generateMockInventory = (): InventoryItem[] => {
  return [
    {
      id: '1',
      name: 'Premium Notebook',
      price: 24.99,
      quantity: 15,
      category: 'Supplies',
      lowStockThreshold: 5,
      imageUrl: 'https://images.pexels.com/photos/6475045/pexels-photo-6475045.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      id: '2',
      name: 'Ergonomic Desk Chair',
      price: 199.99,
      quantity: 3,
      category: 'Equipment',
      lowStockThreshold: 2,
      imageUrl: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      id: '3',
      name: 'Wireless Keyboard',
      price: 59.99,
      quantity: 8,
      category: 'Electronics',
      lowStockThreshold: 3,
      imageUrl: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      id: '4',
      name: 'Coffee Pods (Box of 50)',
      price: 35.50,
      quantity: 2,
      category: 'Supplies',
      lowStockThreshold: 3,
    },
    {
      id: '5',
      name: 'Wireless Mouse',
      price: 29.99,
      quantity: 12,
      category: 'Electronics',
      lowStockThreshold: 5,
      imageUrl: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      id: '6',
      name: 'Printer Paper (500 sheets)',
      price: 8.99,
      quantity: 20,
      category: 'Supplies',
      lowStockThreshold: 5,
    },
    {
      id: '7',
      name: 'Whiteboard Markers',
      price: 12.50,
      quantity: 4,
      category: 'Supplies',
      lowStockThreshold: 6,
    },
    {
      id: '8',
      name: 'USB-C Hub',
      price: 45.99,
      quantity: 7,
      category: 'Electronics',
      lowStockThreshold: 3,
      imageUrl: 'https://images.pexels.com/photos/11130644/pexels-photo-11130644.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ];
};