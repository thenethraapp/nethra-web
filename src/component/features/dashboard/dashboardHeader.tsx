import { useState } from 'react';
import { Bell, MessageSquare, ChevronDown, Menu } from 'lucide-react';
import CloudinaryImage from '@/component/common/UI/CloudinaryImage';
import { ProfileData } from '@/types/domain/optometrist';
import NotificationsDropdown from '../notifications/notificationsDropdown';
import ProfileDropdown from './profileDropdown';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useMessagesStore } from '@/store/useMessagesStore';

interface DashboardHeaderProps {
  profileData: ProfileData | null;
  activeTab: string;  // Add this prop
  onShowNotificationsSidebar: () => void;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
  isLoading?: boolean;
  onToggleMobileMenu?: () => void;
}

const ProfileSkeleton = () => {
  return (
    <div className="flex items-center gap-3 pl-4 border-l border-gray-200 animate-pulse">
      <div className="w-9 h-9 bg-gray-300 rounded-full" />
      <div className="h-4 w-24 bg-gray-300 rounded" />
      <div className="w-4 h-4 bg-gray-300 rounded" />
    </div>
  );
};

export default function DashboardHeader({
  profileData,
  activeTab,
  onLogout,
  onNavigate,
  isLoading = false,
  onToggleMobileMenu
}: DashboardHeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { toggleNotificationVisibility } = useNotificationStore()
  const { toggleMessagesVisibility } = useMessagesStore();

  const displayName = profileData?.user?.fullName || profileData?.user?.username || 'User';
  const displayPhoto = profileData?.profile?.photo || '';

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getDynamicTitle = () => {
    if (activeTab === 'overview') {
      return `Hello, ${displayName}`;
    }

    const tabTitles: Record<string, string> = {
      'bookings': 'Bookings',
      'payment_settings': 'Payment Settings',
      'patient_records': 'Patient Records',
      'manage_subscriptions': 'Manage Subscriptions',
      'profile': 'Edit Profile',
      'help': 'Help'
    };

    return tabTitles[activeTab] || 'Dashboard';
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleSeeAllNotifications = () => {
    setIsNotificationsOpen(false);
  };

  const handleProfileDropdownToggle = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <div className="bg-white border-b border-gray-200 h-16 lg:h-20 flex-shrink-0">
      <div className="h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
          {/* Mobile Menu Button */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
            {getDynamicTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
          <button
            onClick={toggleMessagesVisibility}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 ease-in"
          >
            <MessageSquare className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative">
            <button
              onClick={toggleNotificationVisibility}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 ease-in relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <NotificationsDropdown
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
              onSeeAllClick={handleSeeAllNotifications}
            />
          </div>

          {isLoading ? (
            <ProfileSkeleton />
          ) : (
            <div className="relative flex items-center gap-2 lg:gap-3 pl-2 lg:pl-4 border-l border-gray-200">
              {displayPhoto ? (
                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden flex-shrink-0">
                  <CloudinaryImage
                    src={displayPhoto}
                    alt={displayName}
                    width={36}
                    height={36}
                    fallbackSrc="/default-avatar.png"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 lg:w-9 lg:h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-xs lg:text-sm flex-shrink-0">
                  {getInitials(displayName)}
                </div>
              )}

              <span className="hidden sm:inline text-sm font-medium text-gray-700 truncate max-w-[100px] lg:max-w-none">
                {displayName}
              </span>

              <button
                onClick={handleProfileDropdownToggle}
                className="hover:bg-gray-100 p-1 rounded transition-colors flex-shrink-0"
              >
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <ProfileDropdown
                isOpen={isProfileDropdownOpen}
                onClose={() => setIsProfileDropdownOpen(false)}
                onViewProfile={() => onNavigate('overview')}
                onEditProfile={() => onNavigate('profile')}
                onPaymentSettings={() => onNavigate('payment_settings')}
                onAccountSettings={() => console.log('Account settings')}
                onHelp={() => onNavigate('help')}
                onViewPublicProfile={() => console.log('View public profile')}
                onLogout={onLogout}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}