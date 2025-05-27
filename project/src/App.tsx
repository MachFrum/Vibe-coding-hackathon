import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AppRouter from './AppRouter';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <TransactionProvider>
          <InventoryProvider>
            <AppRouter />
          </InventoryProvider>
        </TransactionProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;