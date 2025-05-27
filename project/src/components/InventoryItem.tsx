import React from 'react';
import { InventoryItem as InventoryItemType } from '../contexts/InventoryContext';
import { Edit, Trash } from 'lucide-react';

interface InventoryItemProps {
  item: InventoryItemType;
  onEdit: () => void;
  onDelete: () => void;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ item, onEdit, onDelete }) => {
  const { name, price, quantity, category, lowStockThreshold, imageUrl } = item;
  const isLowStock = quantity <= lowStockThreshold;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="h-32 bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="text-gray-400 text-xs uppercase">{category}</div>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div className="font-medium text-gray-800">{name}</div>
          {isLowStock && (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
              Low Stock
            </span>
          )}
        </div>
        
        <div className="mt-1 text-sm text-gray-500">{category}</div>
        
        <div className="mt-2 flex justify-between items-center">
          <span className="font-medium text-blue-600">${price.toFixed(2)}</span>
          <span className="text-sm">
            Qty: <span className={isLowStock ? 'text-red-600 font-medium' : ''}>
              {quantity}
            </span>
          </span>
        </div>
        
        <div className="mt-3 flex space-x-2">
          <button
            onClick={onEdit}
            className="flex-1 py-1 text-sm bg-blue-50 text-blue-600 rounded flex items-center justify-center"
          >
            <Edit size={14} className="mr-1" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-1 text-sm bg-red-50 text-red-600 rounded flex items-center justify-center"
          >
            <Trash size={14} className="mr-1" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryItem;