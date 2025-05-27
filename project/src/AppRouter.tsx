import React, { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import AuthScreen from './pages/AuthScreen';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import TransactionHistory from './pages/TransactionHistory';
import Inventory from './pages/Inventory';
import AddEditInventory from './pages/AddEditInventory';
import Navigation from './components/Navigation';

type Route = {
  path: string;
  element: React.ReactNode;
};

const AppRouter: React.FC = () => {
  const { isAuthenticated, currentPage, setCurrentPage } = useContext(AuthContext);

  // Define routes
  const authenticatedRoutes: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    addTransaction: <AddTransaction />,
    transactionHistory: <TransactionHistory />,
    inventory: <Inventory />,
    addInventory: <AddEditInventory />,
    editInventory: <AddEditInventory />
  };

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pb-16">
        {authenticatedRoutes[currentPage] || <Dashboard />}
      </main>
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default AppRouter;