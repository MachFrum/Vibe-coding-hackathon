import React, { useState, useContext, useEffect } from 'react';
import { InventoryContext } from '../contexts/InventoryContext';
import { AuthContext } from '../contexts/AuthContext';
import { ArrowLeft, CheckCircle, Image } from 'lucide-react';

const AddEditInventory: React.FC = () => {
  const { addInventoryItem, updateInventoryItem, currentInventoryItem } = useContext(InventoryContext);
  const { setCurrentPage } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('5');
  const [category, setCategory] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [imageUrl, setImageUrl] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const isEditing = !!currentInventoryItem;
  
  // Set initial values when editing
  useEffect(() => {
    if (currentInventoryItem) {
      setName(currentInventoryItem.name);
      setPrice(currentInventoryItem.price.toString());
      setQuantity(currentInventoryItem.quantity.toString());
      setCategory(currentInventoryItem.category);
      setLowStockThreshold(currentInventoryItem.lowStockThreshold.toString());
      setImageUrl(currentInventoryItem.imageUrl || '');
    }
  }, [currentInventoryItem]);
  
  const categories = [
    'Raw Materials',
    'Finished Goods',
    'Supplies',
    'Equipment',
    'Electronics',
    'Food & Beverage',
    'Clothing',
    'Other'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !quantity || !category || !lowStockThreshold) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Create item object
    const item = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      lowStockThreshold: parseInt(lowStockThreshold),
      imageUrl: imageUrl || undefined,
    };
    
    // Add or update inventory item
    if (isEditing && currentInventoryItem) {
      updateInventoryItem(currentInventoryItem.id, item);
    } else {
      addInventoryItem(item);
    }
    
    // Show success message
    setShowSuccess(true);
    
    // Reset form after delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(false);
      setCurrentPage('inventory');
    }, 1500);
  };
  
  const decrementQuantity = () => {
    const current = parseInt(quantity) || 0;
    if (current > 0) {
      setQuantity((current - 1).toString());
    }
  };
  
  const incrementQuantity = () => {
    const current = parseInt(quantity) || 0;
    setQuantity((current + 1).toString());
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => setCurrentPage('inventory')}
            className="mr-3 text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            {showSuccess 
              ? 'Item Saved' 
              : isEditing 
                ? 'Edit Inventory Item' 
                : 'Add Inventory Item'
            }
          </h1>
        </div>
      </header>
      
      <div className="max-w-screen-xl mx-auto px-4 py-4 mb-16">
        {showSuccess ? (
          <div className="card fade-in flex flex-col items-center justify-center py-8">
            <CheckCircle size={48} className="text-green-500 mb-3" />
            <h2 className="text-xl font-medium text-gray-800 mb-1">
              {isEditing ? 'Item Updated!' : 'Item Added!'}
            </h2>
            <p className="text-gray-500">Your inventory has been updated successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card slide-up">
            {/* Item Name */}
            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                Item Name
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            {/* Price */}
            <div className="mb-4">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input pl-8"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Quantity */}
            <div className="mb-4">
              <label htmlFor="quantity" className="form-label">
                Quantity
              </label>
              <div className="flex">
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-lg"
                  onClick={decrementQuantity}
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="0"
                  className="flex-1 text-center border-y border-gray-300 py-2"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-r-lg"
                  onClick={incrementQuantity}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Category */}
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
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Low Stock Threshold */}
            <div className="mb-4">
              <label htmlFor="lowStockThreshold" className="form-label">
                Low Stock Alert Threshold
              </label>
              <input
                id="lowStockThreshold"
                type="number"
                min="0"
                className="form-input"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                You'll get a low stock alert when quantity falls below this number
              </p>
            </div>
            
            {/* Image URL (Optional) */}
            <div className="mb-6">
              <label htmlFor="imageUrl" className="form-label">
                Image URL (Optional)
              </label>
              <div className="relative">
                <input
                  id="imageUrl"
                  type="url"
                  className="form-input pl-10"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
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
                isEditing ? 'Update Item' : 'Add Item'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEditInventory;