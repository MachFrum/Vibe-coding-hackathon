import React, { createContext, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'alert' | 'sale' | 'inventory';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotification: () => {},
});

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'Premium Notebook is running low on stock (2 remaining)',
      timestamp: new Date(),
      read: false,
    },
    {
      id: '2',
      type: 'sale',
      title: 'New Sale',
      message: 'Received payment of $199.99 for Ergonomic Desk Chair',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};