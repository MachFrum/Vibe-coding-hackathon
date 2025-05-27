import React, { createContext, useState, ReactNode } from 'react';
import { generateMockInventory } from '../utils/mockData';

export interface InventoryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  lowStockThreshold: number;
  imageUrl?: string;
}

interface InventoryContextType {
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<Omit<InventoryItem, 'id'>>) => void;
  deleteInventoryItem: (id: string) => void;
  getInventoryItemById: (id: string) => InventoryItem | undefined;
  searchInventory: (term: string, filterLowStock: boolean) => InventoryItem[];
  currentInventoryItem: InventoryItem | null;
  setCurrentInventoryItem: (item: InventoryItem | null) => void;
}

export const InventoryContext = createContext<InventoryContextType>({
  inventory: [],
  addInventoryItem: () => {},
  updateInventoryItem: () => {},
  deleteInventoryItem: () => {},
  getInventoryItemById: () => undefined,
  searchInventory: () => [],
  currentInventoryItem: null,
  setCurrentInventoryItem: () => {},
});

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(generateMockInventory());
  const [currentInventoryItem, setCurrentInventoryItem] = useState<InventoryItem | null>(null);

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setInventory([...inventory, newItem]);
  };

  const updateInventoryItem = (id: string, updates: Partial<Omit<InventoryItem, 'id'>>) => {
    setInventory(
      inventory.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  const getInventoryItemById = (id: string) => {
    return inventory.find((item) => item.id === id);
  };

  const searchInventory = (term: string, filterLowStock: boolean) => {
    return inventory.filter((item) => {
      const matchesTerm = !term || 
        item.name.toLowerCase().includes(term.toLowerCase()) || 
        item.category.toLowerCase().includes(term.toLowerCase());
      
      const matchesLowStock = !filterLowStock || item.quantity <= item.lowStockThreshold;
      
      return matchesTerm && matchesLowStock;
    });
  };

  const value = {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryItemById,
    searchInventory,
    currentInventoryItem,
    setCurrentInventoryItem,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};