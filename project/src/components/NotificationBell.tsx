import React, { useContext } from 'react';
import { Bell } from 'lucide-react';
import { NotificationContext } from '../contexts/NotificationContext';

const NotificationBell: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { unreadCount } = useContext(NotificationContext);

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 h-4 w-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;