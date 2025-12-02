import React from 'react';
import { X } from 'lucide-react';
import Notifications from './notifications';

interface NotificationsSideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsSideBar: React.FC<NotificationsSideBarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className="fixed right-0 top-0 h-full w-[40%] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">All Notifications</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Notifications Content */}
        <div className="flex-1 overflow-y-auto">
          <Notifications />
        </div>
      </div>
    </>
  );
};

export default NotificationsSideBar;