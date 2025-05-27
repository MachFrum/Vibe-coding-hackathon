import React, { useContext, useState } from 'react';
import { InventoryContext } from '../contexts/InventoryContext';
import { AuthContext } from '../contexts/AuthContext';
import InventoryItem from '../components/InventoryItem';
import { ArrowLeft, Search, Grid, List, Plus, AlertCircle } from 'lucide-react';

const Inventory: React.FC = () => {
  const { searchInventory, deleteInventoryItem, setCurrentInventoryItem } = useContext(InventoryContext);
  const { setCurrentPage } = useContext(AuthContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Search and filter inventory
  const filteredInventory = searchInventory(searchTerm, filterLowStock);
  
  const handleEdit = (itemId: string) => {
    const item = filteredInventory.find(item => item.id === itemId);
    if (item) {
      setCurrentInventoryItem(item);
      setCurrentPage('editInventory');
    }
  };
  
  const handleDelete = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteInventoryItem(itemId);
    }
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
          <h1 className="text-xl font-semibold text-gray-900">Inventory</h1>
        </div>
      </header>
      
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm mb-4 slide-up">
          <div className="p-3">
            <div className="relative">
              <input
                type="text"
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search size={18} />
              </span>
            </div>
          </div>
          
          {/* Filters */}
          <div className="px-3 pb-3 flex justify-between items-center">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                checked={filterLowStock}
                onChange={() => setFilterLowStock(!filterLowStock)}
              />
              Low stock only
            </label>
            
            <div className="flex border border-gray-200 rounded overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-white text-gray-600'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-white text-gray-600'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Inventory Items */}
        {filteredInventory.length > 0 ? (
          <div className={`mb-20 ${
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-3'
          }`}>
            {filteredInventory.map((item) => (
              viewMode === 'grid' ? (
                <InventoryItem
                  key={item.id}
                  item={item}
                  onEdit={() => handleEdit(item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              ) : (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-3 flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <div className="text-gray-400 text-xs uppercase">{item.category.slice(0, 2)}</div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start">
                      <div className="font-medium text-gray-800">{item.name}</div>
                      {item.quantity <= item.lowStockThreshold && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full flex items-center">
                          <AlertCircle size={10} className="mr-0.5" />
                          Low
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">${item.price.toFixed(2)} • Qty: {item.quantity}</div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="p-2 text-blue-600 bg-blue-50 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center mb-20">
            <div className="text-gray-500 mb-2">No inventory items found</div>
            <p className="text-sm text-gray-400">
              {searchTerm || filterLowStock
                ? 'Try changing your search or filters'
                : 'Add your first inventory item'}
            </p>
          </div>
        )}
        
        {/* Add Item Button */}
        <button
          onClick={() => {
            setCurrentInventoryItem(null);
            setCurrentPage('addInventory');
          }}
          className="fixed bottom-20 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default Inventory;