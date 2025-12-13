/**
 * DashboardHeader Component
 * 
 * Header component for the dashboard.
 * Includes route header and user profile.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { HiChevronDown } from 'react-icons/hi';
import { Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CloudinaryImage from '@/component/common/UI/CloudinaryImage';
import { DashboardHeaderProps } from './types';
import type { ProfileData } from '@/types/domain/optometrist';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useMessagesStore } from '@/store/useMessagesStore';
import { useSocketStore } from '@/store/useSocketStore';

interface ExtendedDashboardHeaderProps extends DashboardHeaderProps {
  profileData?: ProfileData | {
    user?: {
      fullName?: string;
      username?: string;
      role?: string;
    };
    profile?: {
      photo?: string;
    } | null;
  } | null;
  onLogout?: () => void;
  onNavigate?: (tab: string) => void;
  isLoading?: boolean;
}

export const DashboardHeader: React.FC<ExtendedDashboardHeaderProps> = ({
  userName,
  userRole,
  activeTab,
  profileData,
  onLogout,
  onNavigate,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const { show: showNotifications } = useNotificationStore();
  const { show: showMessages } = useMessagesStore();
  const { socket, isConnected } = useSocketStore();

  // Prefer authenticated user's real name & role
  const displayName = profileData?.user?.fullName || profileData?.user?.username || user?.fullName || userName || 'User';
  const displayRole = user?.role
    ? user.role === 'superadmin'
      ? 'Super Admin'
      : user.role === 'admin'
        ? 'Admin'
        : user.role === 'optometrist'
          ? 'Optometrist'
          : 'Patient'
    : userRole || 'User';

  const displayPhoto = profileData?.profile?.photo || '';

  // Get time-based greeting with user name
  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';

    return `${greeting}, ${displayName.split(' ')[0]}`;
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    }
  };

  // Get page title from active tab
  const getPageTitle = () => {
    if (activeTab === 'overview' || !activeTab) {
      return getGreeting();
    }

    const tabTitles: Record<string, string> = {
      'ai_agent': 'Nethra Super Agent',
      'bookings': 'Bookings',
      'medical_history': 'Medical History',
      'patient_records': 'Patient Records',
      'payment_settings': 'Payment Settings',
      'shopping': 'Shopping History',
      'profile': 'Profile',
      'help': 'Help',
      'messages': 'Messages',
      'manage_subscriptions': 'Manage Subscriptions',
    };

    return tabTitles[activeTab] || activeTab.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const pageTitle = getPageTitle();

  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Listen for unread notification count updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleUnreadNotifications = (data: { count: number }) => {
      setUnreadNotificationCount(data.count);
    };

    const handleUnreadMessages = (data: { count: number }) => {
      setUnreadMessageCount(data.count);
    };

    // Request initial counts
    socket.emit('get_unread_notifications');
    socket.emit('get_unread_count');

    // Listen for updates
    socket.on('unread_notifications_count', handleUnreadNotifications);
    socket.on('unread_count_update', handleUnreadMessages);
    socket.on('new_notification', () => {
      // Refresh count when new notification arrives
      socket.emit('get_unread_notifications');
    });

    return () => {
      socket.off('unread_notifications_count', handleUnreadNotifications);
      socket.off('unread_count_update', handleUnreadMessages);
    };
  }, [socket, isConnected]);

  const handleNotificationClick = () => {
    showNotifications();
  };

  const handleMessageClick = () => {
    showMessages();
  };

  return (
    <header className="w-full bg-gray-100 rounded-full px-2 mb-2.5">
      <div className="flex items-center justify-between gap-4 p-2">
        {/* Left Section - Route Header */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-800">
            {pageTitle}
          </h1>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Icon */}
          <button
            onClick={handleNotificationClick}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-gray-600" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Messaging Icon */}
          <button
            onClick={handleMessageClick}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Messages"
          >
            <MessageSquare size={20} className="text-gray-600" />
            {unreadMessageCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isLoading ? (
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              ) : displayPhoto ? (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-cyan/10 flex items-center justify-center">
                  <CloudinaryImage
                    src={displayPhoto}
                    alt={displayName}
                    width={40}
                    height={40}
                    fallbackSrc="/default-avatar.png"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-cyan/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-cyan">
                    {getInitials(displayName)}
                  </span>
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">{displayName}</p>
                <p className="text-xs text-gray-500">{displayRole}</p>
              </div>
              <HiChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {onNavigate && (
                  <>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('profile');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('payment_settings');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Payment Settings
                    </button>
                    <hr className="my-2 border-gray-200" />
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
