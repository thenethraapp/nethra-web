import { create } from 'zustand';
import { Notification } from '@/api/notifications/getNotifications';

interface NotificationStore {
  isVisible: boolean;
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;
  toggleNotificationVisibility: () => void;
  show: () => void;
  hide: () => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setUnreadCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  isVisible: false,
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  hasMore: true,

  toggleNotificationVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  show: () => set({ isVisible: true }),
  hide: () => set({ isVisible: false }),

  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) => set((state) => {
    // Avoid duplicates
    const exists = state.notifications.some(n => n._id === notification._id);
    if (exists) return state;

    return {
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
    };
  }),

  removeNotification: (id) => set((state) => {
    const notification = state.notifications.find(n => n._id === id);
    return {
      notifications: state.notifications.filter(n => n._id !== id),
      unreadCount: notification && !notification.isRead
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount,
    };
  }),

  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n =>
      n._id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({
      ...n,
      isRead: true,
      readAt: new Date().toISOString()
    })),
    unreadCount: 0,
  })),

  setUnreadCount: (count) => set({ unreadCount: count }),
  setLoading: (loading) => set({ isLoading: loading }),
  setHasMore: (hasMore) => set({ hasMore }),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
