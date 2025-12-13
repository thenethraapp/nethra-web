import { create } from 'zustand';

interface MessagesStore {
  isVisible: boolean;
  targetUserId: string | null; // User ID to open conversation with
  currentConversationId: string | null; // Currently open conversation ID
  toggleMessagesVisibility: () => void;
  show: (targetUserId?: string) => void; // Can optionally open a specific conversation
  hide: () => void;
  setTargetUserId: (userId: string | null) => void;
  setCurrentConversationId: (conversationId: string | null) => void;
}

export const useMessagesStore = create<MessagesStore>((set) => ({
  isVisible: false,
  targetUserId: null,
  currentConversationId: null,
  toggleMessagesVisibility: () => set((state) => ({
    isVisible: !state.isVisible,
    targetUserId: !state.isVisible ? null : state.targetUserId // Clear target when closing
  })),
  show: (targetUserId?: string) => set({
    isVisible: true,
    targetUserId: targetUserId || null
  }),
  hide: () => set({
    isVisible: false,
    targetUserId: null,
    currentConversationId: null
  }),
  setTargetUserId: (userId: string | null) => set({ targetUserId: userId }),
  setCurrentConversationId: (conversationId: string | null) => set({ currentConversationId: conversationId }),
}));