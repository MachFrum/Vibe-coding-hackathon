import React from 'react';
import { Home, BarChart3, Package, PieChart, Menu, Plus } from 'lucide-react';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  const { unreadCount } = useContext(NotificationContext);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-10">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`nav-item ${
              currentPage === 'dashboard' ? 'nav-item-active' : 'nav-item-inactive'
            }`}
          >
            <Home size={24} />
            <span>Home</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('transactionHistory')}
            className={`nav-item ${
              currentPage === 'transactionHistory' ? 'nav-item-active' : 'nav-item-inactive'
            }`}
          >
            <BarChart3 size={24} />
            <span>Transactions</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('addTransaction')}
            className="nav-item bg-emerald-600 text-white rounded-full -mt-8 p-4 shadow-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={24} />
          </button>
          
          <button
            onClick={() => setCurrentPage('inventory')}
            className={`nav-item ${
              currentPage === 'inventory' ? 'nav-item-active' : 'nav-item-inactive'
            }`}
          >
            <Package size={24} />
            <span>Inventory</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('more')}
            className={`nav-item relative ${
              currentPage === 'more' ? 'nav-item-active' : 'nav-item-inactive'
            }`}
          >
            <Menu size={24} />
            <span>More</span>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;