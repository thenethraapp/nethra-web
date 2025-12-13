import { useState, useEffect } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/api/notifications/getNotifications';
import {
  Bell,
  X,
  Check,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  MessageSquare,
  FileText,
  AlertTriangle
} from 'lucide-react';

const NotificationsBar = () => {
  const { isVisible, hide } = useNotificationStore();
  const {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
  } = useNotifications();
  const [showReadAll, setShowReadAll] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      hide();
    }, 300);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment_scheduled':
      case 'appointment_rescheduled':
      case 'appointment_reminder':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'appointment_cancelled':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'new_message':
        return <MessageSquare className="w-5 h-5 text-cyan-500" />;
      case 'prescription_ready':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'system_alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else if (diffInMinutes < 2880) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isVisible) return null;

  return (
    <section
      className={`bg-black/30 fixed w-screen h-screen top-0 left-0 z-[950] transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
      onClick={handleClose}
    >
      <section
        className={`fixed top-16 right-4 bg-white rounded-2xl shadow-2xl z-[1000] h-[80vh] w-[90%] max-w-2xl pb-6 transition-all duration-300 ease-out flex flex-col ${isAnimating
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-4 scale-95'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='p-6 flex justify-between items-center border-b border-gray-200 flex-shrink-0'>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <h3 className='text-lg md:text-xl font-semibold text-gray-800'>Notifications</h3>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowReadAll(!showReadAll)}
                  className="hover:bg-gray-100 cursor-pointer p-2 rounded-lg transition-colors duration-200"
                >
                  <Check className="w-5 h-5 text-gray-600" />
                </button>
                {showReadAll && (
                  <button
                    className="absolute top-10 right-0 bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-lg px-4 py-2 rounded-lg w-[160px] text-sm cursor-pointer z-10"
                    onClick={() => {
                      markAllAsRead();
                      setShowReadAll(false);
                    }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            )}
            <button
              onClick={handleClose}
              className="hover:bg-gray-100 cursor-pointer p-2 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {isLoading && notifications.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading notifications...</div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <Bell className="w-12 h-12 text-gray-300 mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">No notifications</h4>
              <p className="text-sm text-gray-500">You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`rounded-lg p-4 transition-all cursor-pointer border ${notification.isRead
                    ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    : 'bg-white border-blue-200 shadow-sm hover:shadow-md'
                    }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`font-semibold text-sm ${notification.isRead ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                          {notification.title}
                          {!notification.isRead && (
                            <span className="inline-block w-2 h-2 rounded-full ml-2 bg-blue-500" />
                          )}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="flex-shrink-0 p-1 rounded hover:bg-gray-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(notification.createdAt)}
                        </div>

                        {!notification.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            className="text-xs font-medium px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="w-full py-3 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Loading...' : 'Load more'}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </section>
  );
};

export default NotificationsBar;
