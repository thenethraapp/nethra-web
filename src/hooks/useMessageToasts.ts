import { useEffect, useRef } from 'react';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocketStore } from '@/store/useSocketStore';
import { useMessagesStore } from '@/store/useMessagesStore';
import { toast } from 'sonner';
import { Message } from '@/api/messaging/messages/messages';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/router';
import { getConversations } from '@/api/messaging';
import type { Conversation } from '@/types/api/messaging';

/**
 * Hook to show toast notifications when new messages are received
 * Only shows toasts when:
 * - Message is from someone else (not current user)
 * - Messaging bar is NOT visible
 */
export const useMessageToasts = () => {
  const { user: currentUser } = useAuth();
  const { socket, isConnected, isAuthenticated } = useSocketStore();
  const { isVisible } = useMessagesStore();
  const router = useRouter();

  const conversationsJoinedRef = useRef<Set<string>>(new Set());
  const joiningInProgressRef = useRef(false);
  const listenerSetupRef = useRef(false);

  // Join all conversations when socket is ready
  useEffect(() => {
    if (!socket || !isConnected || !isAuthenticated || !currentUser) {
      conversationsJoinedRef.current.clear();
      joiningInProgressRef.current = false;
      listenerSetupRef.current = false;
      return;
    }

    // Prevent multiple simultaneous join attempts
    if (joiningInProgressRef.current) {
      return;
    }

    joiningInProgressRef.current = true;

    const joinAllConversations = async () => {
      try {
        console.log('[Toast] 🔄 Fetching and joining conversations...');
        const data = await getConversations();
        const conversationIds = data.conversations.map((conv: Conversation) => conv._id);

        if (conversationIds.length === 0) {
          console.log('[Toast] ℹ️ No conversations found');
          joiningInProgressRef.current = false;
          return;
        }

        console.log('[Toast] 📋 Joining', conversationIds.length, 'conversations');

        // Join all conversations immediately (don't wait for confirmations)
        conversationIds.forEach((conversationId: string) => {
          socket.emit('join_conversation', { conversationId });
          conversationsJoinedRef.current.add(conversationId);
        });

        console.log('[Toast] ✅ Join requests sent for', conversationIds.length, 'conversations');
        joiningInProgressRef.current = false;

      } catch (error) {
        console.error('[Toast] ❌ Error joining conversations:', error);
        joiningInProgressRef.current = false;
      }
    };

    joinAllConversations();
  }, [socket, isConnected, isAuthenticated, currentUser]);

  // Set up message listener immediately (don't wait for conversations)
  useEffect(() => {
    if (!socket || !isConnected || !isAuthenticated || !currentUser) {
      listenerSetupRef.current = false;
      return;
    }

    // Only set up listener once
    if (listenerSetupRef.current) {
      return;
    }

    console.log('[Toast] ✅ Setting up message listener');

    const handleNewMessage = (payload: { message: Message & { conversationId?: string } }) => {
      const message = payload.message;

      // Verify message structure
      if (!message || !message._id) {
        return;
      }

      // Get conversation ID
      const messageWithConversation = message as Message & { conversationId?: string; conversation?: { _id?: string } };
      const messageConversationId = messageWithConversation.conversationId || messageWithConversation.conversation?._id;

      // If we receive a message from a conversation we're not in, join it immediately
      if (messageConversationId && !conversationsJoinedRef.current.has(messageConversationId)) {
        console.log('[Toast] 🔄 Auto-joining conversation:', messageConversationId);
        socket.emit('join_conversation', { conversationId: messageConversationId });
        conversationsJoinedRef.current.add(messageConversationId);
      }

      // Get sender ID
      let senderId = '';
      const senderUserId = message.sender?.userId;
      if (typeof senderUserId === 'string') {
        senderId = senderUserId;
      } else if (senderUserId && typeof senderUserId === 'object') {
        const userIdObj = senderUserId as { _id?: string; id?: string };
        senderId = userIdObj._id || userIdObj.id || '';
      }

      // Skip if message is from current user
      if (senderId && senderId === currentUser.id) {
        return;
      }

      // Skip if messaging bar is visible
      if (isVisible) {
        return;
      }

      // Get sender name
      let senderName = 'Someone';
      const senderUserIdForName = message.sender?.userId;
      if (typeof senderUserIdForName === 'object' && senderUserIdForName !== null) {
        const sender = senderUserIdForName as { fullName?: string; username?: string; name?: string };
        senderName = sender.fullName || sender.username || sender.name || 'Someone';
      }

      // Get message preview
      const messagePreview = message.content?.text || 'New message';
      const truncatedPreview = messagePreview.length > 60
        ? messagePreview.substring(0, 60) + '...'
        : messagePreview;

      // Create icon
      const MessageIcon = React.createElement(MessageSquare, {
        className: "w-5 h-5 text-primary-cyan",
        size: 20
      });

      // Show toast
      console.log('[Toast] 🍞 Showing toast from:', senderName);
      toast(truncatedPreview, {
        description: senderName,
        icon: MessageIcon,
        duration: 5000,
        className: 'message-toast',
        style: {
          background: 'linear-gradient(to right, #ffffff, #f9fafb)',
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '0.875rem 1rem',
          fontSize: '0.875rem',
          color: '#374151',
        },
        action: {
          label: 'View',
          onClick: () => {
            const { show } = useMessagesStore.getState();
            show();
            if (messageConversationId) {
              setTimeout(() => {
                router.push(`/message?conversationId=${messageConversationId}`);
              }, 100);
            }
          },
        },
        cancel: {
          label: 'Dismiss',
          onClick: () => { },
        },
      });
    };

    socket.on('new_message', handleNewMessage);
    listenerSetupRef.current = true;

    return () => {
      socket.off('new_message', handleNewMessage);
      listenerSetupRef.current = false;
    };
  }, [socket, isConnected, isAuthenticated, currentUser, isVisible, router]);

  // Handle socket reconnection - rejoin conversations
  useEffect(() => {
    if (!socket) return;

    const handleReconnect = () => {
      console.log('[Toast] 🔄 Socket reconnected, rejoining conversations');
      conversationsJoinedRef.current.clear();
      joiningInProgressRef.current = false;
      listenerSetupRef.current = false;
    };

    socket.on('reconnect', handleReconnect);

    return () => {
      socket.off('reconnect', handleReconnect);
    };
  }, [socket, isConnected, isAuthenticated, currentUser]);
};
