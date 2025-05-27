import React, { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { Bell, Package, DollarSign, X, Check } from 'lucide-react';

const NotificationCenter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, clearNotification } = useContext(NotificationContext);

  const getIcon = (type: string) => {
    switch (type) {
      case 'inventory':
        return <Package size={18} className="text-emerald-600" />;
      case 'sale':
        return <DollarSign size={18} className="text-green-600" />;
      default:
        return <Bell size={18} className="text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-lg slide-down">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              Mark all as read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 ${notification.read ? 'bg-white' : 'bg-slate-50'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{notification.title}</h3>
                      <p className="text-sm text-slate-600 mt-0.5">{notification.message}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-slate-400">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            <Check size={12} />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => clearNotification(notification.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <Bell size={48} className="text-slate-300 mb-2" />
              <p>No notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;