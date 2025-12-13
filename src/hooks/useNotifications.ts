import { useEffect, useCallback } from 'react';
import { useSocketStore } from '@/store/useSocketStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { getNotifications, Notification } from '@/api/notifications/getNotifications';
import { markNotificationRead, markAllNotificationsRead } from '@/api/notifications/markNotificationRead';
import { deleteNotification as deleteNotificationAPI } from '@/api/notifications/deleteNotification';
import { toast } from 'sonner';

export const useNotifications = () => {
  const { socket, isConnected } = useSocketStore();
  const {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    setNotifications,
    addNotification,
    removeNotification,
    markAsRead: markAsReadStore,
    markAllAsRead: markAllAsReadStore,
    setUnreadCount,
    setLoading,
    setHasMore,
  } = useNotificationStore();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (limit = 20, skip = 0) => {
    try {
      setLoading(true);
      const response = await getNotifications(limit, skip);
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
      setHasMore(response.hasMore);
    } catch (error: unknown) {
      console.error('Error fetching notifications:', error);

      // Handle 403/401 errors gracefully - user might not have permission
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 403 || axiosError?.response?.status === 401) {
        // Set empty state instead of showing error
        setNotifications([]);
        setUnreadCount(0);
        setHasMore(false);
        // Don't show toast for permission errors - they're expected in some cases
      } else {
        // Only show toast for unexpected errors
        // toast.error('Failed to load notifications');
      }
    } finally {
      setLoading(false);
    }
  }, [setNotifications, setUnreadCount, setHasMore, setLoading]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      markAsReadStore(id);
      await markNotificationRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
      // Revert on error
      fetchNotifications();
    }
  }, [markAsReadStore, fetchNotifications]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      markAllAsReadStore();
      await markAllNotificationsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
      fetchNotifications();
    }
  }, [markAllAsReadStore, fetchNotifications]);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      removeNotification(id);
      await deleteNotificationAPI(id);
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
      fetchNotifications();
    }
  }, [removeNotification, fetchNotifications]);

  // Load more notifications
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    try {
      setLoading(true);
      const response = await getNotifications(20, notifications.length);
      setNotifications([...notifications, ...response.notifications]);
      setHasMore(response.hasMore);
    } catch (error: unknown) {
      console.error('Error loading more notifications:', error);

      // Handle 403/401 errors gracefully
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 403 || axiosError?.response?.status === 401) {
        // Stop trying to load more if we don't have permission
        setHasMore(false);
      } else {
        toast.error('Failed to load more notifications');
      }
    } finally {
      setLoading(false);
    }
  }, [notifications, hasMore, isLoading, setNotifications, setHasMore, setLoading]);

  // Listen to socket events
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (data: { notification: Notification; timestamp: string }) => {
      const notification = data.notification;
      addNotification(notification);

      // Show toast based on notification type
      const toastConfig = getToastConfig(notification);
      toast[toastConfig.type](notification.title, {
        description: notification.message,
        duration: toastConfig.duration,
        action: notification.actionUrl ? {
          label: notification.actionLabel || 'View',
          onClick: () => {
            if (notification.actionUrl) {
              window.location.href = notification.actionUrl;
            }
          },
        } : undefined,
      });
    };

    const handleUnreadCountUpdate = (data: { count: number }) => {
      setUnreadCount(data.count);
    };

    socket.on('new_notification', handleNewNotification);
    socket.on('unread_notifications_count', handleUnreadCountUpdate);

    // Request initial unread count
    socket.emit('get_unread_notifications');

    return () => {
      socket.off('new_notification', handleNewNotification);
      socket.off('unread_notifications_count', handleUnreadCountUpdate);
    };
  }, [socket, isConnected, addNotification, setUnreadCount]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
  };
};

// Helper function to get toast configuration based on notification type
function getToastConfig(notification: Notification): { type: 'success' | 'error' | 'info' | 'warning'; duration: number } {
  switch (notification.type) {
    case 'appointment_scheduled':
    case 'appointment_rescheduled':
      return { type: 'success', duration: 5000 };
    case 'appointment_cancelled':
      return { type: 'warning', duration: 5000 };
    case 'prescription_ready':
      return { type: 'success', duration: 6000 };
    case 'new_message':
      return { type: 'info', duration: 4000 };
    case 'system_alert':
      return { type: 'error', duration: 6000 };
    default:
      return { type: 'info', duration: 4000 };
  }
}
