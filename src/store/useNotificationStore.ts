import { create } from 'zustand';

interface NotificationStore {
  isVisible: boolean;
  toggleNotificationVisibility: () => void;
  show: () => void;
  hide: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  isVisible: false,
  toggleNotificationVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  show: () => set({ isVisible: true }),
  hide: () => set({ isVisible: false }),
}));