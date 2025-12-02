import { Bell, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface NotificationsDropdownProps {
  onSeeAllClick: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsDropdown = ({
  onSeeAllClick,
  isOpen,
  onClose
}: NotificationsDropdownProps) => {

  const notifications = [
    {
      id: 1,
      type: 'appointment',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      title: 'Appointment Confirmed',
      message: 'Your appointment with John Doe has been confirmed for tomorrow at 2:00 PM',
      time: '5 minutes ago',
      unread: true,
    },
    {
      id: 2,
      type: 'message',
      icon: Bell,
      iconColor: 'text-blue-500',
      title: 'New Message',
      message: 'You have received a new message from Sarah Smith',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      type: 'reminder',
      icon: AlertCircle,
      iconColor: 'text-orange-500',
      title: 'Upcoming Appointment',
      message: 'Reminder: You have an appointment in 30 minutes',
      time: '2 hours ago',
      unread: false,
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div
                key={notification.id}
                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${notification.unread ? 'bg-blue-50' : ''
                  }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <IconComponent className={`w-5 h-5 ${notification.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      {notification.unread && (
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={onSeeAllClick}
            className="w-full py-2 px-4 bg-primary-cyan text-white cursor-pointer text-sm font-medium rounded-lg hover:bg-primary-cyan/70 transition-colors"
          >
            See All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationsDropdown;