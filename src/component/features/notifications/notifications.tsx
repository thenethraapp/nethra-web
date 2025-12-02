import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Info, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { getNotifications, Notification } from '@/api/notifications/getNotifications';
import { markNotificationRead, markAllNotificationsRead } from '@/api/notifications/markNotificationRead';

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications(notifications.map(notif =>
        notif._id === id ? { ...notif, isRead: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif._id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment_scheduled':
      case 'appointment_reminder':
        return <CheckCircle className="w-5 h-5" style={{ color: '#1bc77c' }} />;
      case 'appointment_cancelled':
      case 'system_alert':
        return <AlertCircle className="w-5 h-5" style={{ color: '#195aff' }} />;
      case 'new_message':
      case 'consultation_request':
        return <Info className="w-5 h-5" style={{ color: '#1fb6ff' }} />;
      default:
        return <Bell className="w-5 h-5" style={{ color: '#6b7280' }} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else if (diffInMinutes < 2880) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.isRead)
      : notifications.filter(n => n.isRead);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen pt-6" style={{ backgroundColor: '#ffffff' }}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#F0EFFA' }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#F0EFFA' }}>
                <Bell className="w-6 h-6" style={{ color: '#195aff' }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#031e2d' }}>
                  Notifications
                </h1>
                <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
                  Stay updated with your latest activities
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: '#ffffff', color: '#195aff' }}
              >
                <Check className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {['all', 'unread', 'read'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className="px-5 py-2.5 rounded-lg font-medium transition-all capitalize"
                style={{
                  backgroundColor: filter === filterType ? '#195aff' : '#F0EFFA',
                  color: filter === filterType ? '#ffffff' : '#6b7280',
                }}
              >
                {filterType}
                {filterType === 'unread' && unreadCount > 0 && (
                  <span
                    className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: '#1bc77c', color: '#ffffff' }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#F0EFFA' }}>
              <Bell className="w-8 h-8" style={{ color: '#6b7280' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#031e2d' }}>
              No notifications
            </h3>
            <p style={{ color: '#6b7280' }}>
              {"You're"} all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className="rounded-xl p-5 transition-all hover:shadow-md border"
                style={{
                  backgroundColor: notification.isRead ? '#fafafa' : '#ffffff',
                  borderColor: notification.isRead ? '#F0EFFA' : '#195aff',
                  borderWidth: notification.isRead ? '1px' : '2px',
                }}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-semibold text-base" style={{ color: '#031e2d' }}>
                        {notification.title}
                        {!notification.isRead && (
                          <span
                            className="inline-block w-2 h-2 rounded-full ml-2"
                            style={{ backgroundColor: '#195aff' }}
                          />
                        )}
                      </h3>
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="flex-shrink-0 p-1 rounded-lg transition-all hover:bg-opacity-80"
                        style={{ backgroundColor: '#F0EFFA' }}
                      >
                        <X className="w-4 h-4" style={{ color: '#6b7280' }} />
                      </button>
                    </div>

                    <p className="text-sm mb-3 leading-relaxed" style={{ color: '#6b7280' }}>
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs" style={{ color: '#b2b4b8' }}>
                        <Clock className="w-3.5 h-3.5" />
                        {formatTimestamp(notification.createdAt)}
                      </div>

                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                          style={{ backgroundColor: '#F0EFFA', color: '#195aff' }}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;