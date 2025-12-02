import { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import MessagingPolicy from './MessagingPolicy';
import MessagingListSidebar from './MessagingListSidebar';
import { useAuth } from '@/context/AuthContext';
import { getConversations, getDisplayName, getOtherParticipant } from '@/api/messaging';
import { Conversation } from '@/types/api/messaging';
import { useRouter } from 'next/router';
import { useMessagesStore } from '@/store/useMessagesStore';
import { createConversation } from '@/api/messaging';
import { CreateConversationRequest } from '@/api/messaging/conversations/createConversation';

type ParticipantUserId = Conversation['participants'][number]['userId'];

export interface User {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  isSystem: boolean;
  avatar: string;
  profilePhoto?: string;
  conversationId?: string;
  userType?: 'patient' | 'optometrist';
}

interface MessagesProps {
  conversationId?: string | null;
  targetUserId?: string | null; // User ID to open conversation with
}

const Messages = ({ conversationId, targetUserId: propTargetUserId }: MessagesProps) => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { targetUserId: storeTargetUserId, setTargetUserId } = useMessagesStore();
  const targetUserId = propTargetUserId || storeTargetUserId;

  const [selectedUser, setSelectedUser] = useState<User>({
    id: 'nethra',
    name: 'Nethra',
    lastMessage: 'Welcome to the platform',
    timestamp: 'Just now',
    isSystem: true,
    avatar: 'N'
  });

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // On mobile: show list by default if no targetUserId, otherwise show chat
  const [showMobileList, setShowMobileList] = useState(!targetUserId);

  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);
      try {
        const data = await getConversations();
        setConversations(data.conversations);

        // Priority 1: If we have a targetUserId, find or create conversation
        if (targetUserId && targetUserId !== 'nethra') {
          // Normalize targetUserId for comparison
          const normalizedTargetId = String(targetUserId);

          const existingConversation = data.conversations.find((conv: Conversation) => {
            const otherParticipant = getOtherParticipant(conv, currentUser.id);
            if (!otherParticipant) return false;
            const userId = otherParticipant.userId._id;
            // Normalize both IDs for comparison
            return String(userId) === normalizedTargetId;
          });

          if (existingConversation) {
            const otherParticipant = getOtherParticipant(existingConversation, currentUser.id);
            if (otherParticipant) {
              const userId: ParticipantUserId = otherParticipant.userId;
              const profilePhoto = userId.photo || userId.profilePicture || undefined;
              const conversationUser: User = {
                id: userId._id,
                name: getDisplayName(userId),
                lastMessage: existingConversation.lastMessage?.content?.text || 'No messages yet',
                timestamp: existingConversation.lastMessageAt ?
                  new Date(existingConversation.lastMessageAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Just now',
                isSystem: false,
                avatar: getDisplayName(userId).charAt(0).toUpperCase(),
                profilePhoto: profilePhoto,
                conversationId: existingConversation._id,
                userType: otherParticipant.userType
              };
              setSelectedUser(conversationUser);
              setTargetUserId(null); // Clear target after opening
              setShowMobileList(false); // Show chat on mobile after selecting
            }
          } else {
            // Create new conversation if it doesn't exist
            try {
              const request: CreateConversationRequest = {
                otherUserId: targetUserId,
                otherUserType: 'optometrist', // Default, will be corrected by backend
                metadata: {}
              };
              const response = await createConversation(request);
              // Refetch conversations to get the new one
              const updatedData = await getConversations();
              setConversations(updatedData.conversations);

              const newConv = updatedData.conversations.find(conv => conv._id === response.conversation._id);
              if (newConv) {
                const otherParticipant = getOtherParticipant(newConv, currentUser.id);
                if (otherParticipant) {
                  const userId: ParticipantUserId = otherParticipant.userId;
                  const profilePhoto = userId.photo || userId.profilePicture || undefined;
                  const conversationUser: User = {
                    id: userId._id,
                    name: getDisplayName(userId),
                    lastMessage: 'No messages yet',
                    timestamp: 'Just now',
                    isSystem: false,
                    avatar: getDisplayName(userId).charAt(0).toUpperCase(),
                    profilePhoto: profilePhoto,
                    conversationId: newConv._id,
                    userType: otherParticipant.userType
                  };
                  setSelectedUser(conversationUser);
                  setTargetUserId(null); // Clear target after opening
                }
              }
            } catch (createErr) {
              console.error('Error creating conversation:', createErr);
              setError('Failed to create conversation');
            }
          }
        }
        // Priority 2: If we have a conversationId from props, find and set that conversation
        else if (conversationId) {
          const targetConversation = data.conversations.find(conv => conv._id === conversationId);
          if (targetConversation) {
            const otherParticipant = getOtherParticipant(targetConversation, currentUser.id);
            if (otherParticipant) {
              const userId: ParticipantUserId = otherParticipant.userId;
              const profilePhoto = userId.photo || userId.profilePicture || undefined;
              const conversationUser: User = {
                id: userId._id,
                name: getDisplayName(userId),
                lastMessage: targetConversation.lastMessage?.content?.text || 'No messages yet',
                timestamp: targetConversation.lastMessageAt ?
                  new Date(targetConversation.lastMessageAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Just now',
                isSystem: false,
                avatar: getDisplayName(userId).charAt(0).toUpperCase(),
                profilePhoto: profilePhoto,
                conversationId: targetConversation._id,
                userType: otherParticipant.userType
              };
              setSelectedUser(conversationUser);
              setShowMobileList(false); // Show chat on mobile
            }
          }
        }

        // If no targetUserId or conversationId, show list on mobile
        if (!targetUserId && !conversationId) {
          setShowMobileList(true);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser, conversationId, targetUserId, setTargetUserId]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowMobileList(false); // Hide list and show chat on mobile after selection
  };

  // Transform conversations to users for sidebar
  // Use a Map to deduplicate by conversationId to prevent duplicate keys
  const conversationMap = new Map<string, User>();

  conversations.forEach(conv => {
    if (!currentUser) return;

    const otherParticipant = getOtherParticipant(conv, currentUser.id);
    if (!otherParticipant) return;

    const userId: ParticipantUserId = otherParticipant.userId;
    const profilePhoto = userId.photo || userId.profilePicture || undefined;
    const conversationId = conv._id;

    // Only add if conversationId doesn't already exist (deduplicate)
    if (!conversationMap.has(conversationId)) {
      conversationMap.set(conversationId, {
        id: userId._id,
        name: getDisplayName(userId),
        lastMessage: conv.lastMessage?.content?.text || 'No messages yet',
        timestamp: conv.lastMessageAt ?
          new Date(conv.lastMessageAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }) : 'Just now',
        isSystem: false,
        avatar: getDisplayName(userId).charAt(0).toUpperCase(),
        profilePhoto: profilePhoto,
        conversationId: conversationId,
        userType: otherParticipant.userType
      });
    }
  });

  const conversationUsers = Array.from(conversationMap.values());

  // Add system user to the list
  const allUsers = [
    {
      id: 'nethra',
      name: 'Nethra',
      lastMessage: 'Welcome to the platform',
      timestamp: 'Just now',
      isSystem: true,
      avatar: 'N',
      conversationId: undefined // System user has no conversationId
    },
    ...conversationUsers
  ];

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] rounded-lg overflow-hidden shadow-sm">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading conversations...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-200px)] rounded-lg overflow-hidden shadow-sm">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p>{error}</p>
            <button
              onClick={() => router.reload()}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full rounded-lg overflow-hidden shadow-sm">
      {/* Sidebar - Visible on desktop, toggleable on mobile */}
      <div className={`${showMobileList ? 'block' : 'hidden'} lg:block absolute lg:relative inset-0 lg:inset-auto z-10 lg:z-auto`}>
        <MessagingListSidebar
          selectedUser={selectedUser}
          onSelectUser={handleUserSelect}
          users={allUsers}
        />
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col w-full lg:w-auto ${showMobileList ? 'hidden' : 'block'} lg:block`}>
        {selectedUser.isSystem ? (
          <MessagingPolicy onBackToList={() => setShowMobileList(true)} />
        ) : (
          <ChatInterface
            user={selectedUser}
            conversationId={selectedUser.conversationId}
            onBackToList={() => setShowMobileList(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Messages;