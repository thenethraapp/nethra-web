import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import ChatInterface from './ChatInterface';
import { useAuth } from '@/context/AuthContext';
import { createConversation, getConversations, getOtherParticipant } from '@/api/messaging';
import { CreateConversationRequest } from '@/api/messaging/conversations/createConversation';
import { Conversation } from '@/types/api/messaging';
import WheelLoader from '@/component/common/UI/WheelLoader';

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  otherUserId: string;
  otherUserName?: string;
}

const MessagingModal: React.FC<MessagingModalProps> = ({ isOpen, onClose, otherUserId, otherUserName }) => {
  const { user: currentUser } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !currentUser || !otherUserId) return;

    const findOrCreateConversation = async () => {
      setLoading(true);
      setError(null);

      try {
        // First, try to find existing conversation
        const conversationsData = await getConversations();
        const existingConversation = conversationsData.conversations.find((conv: Conversation) => {
          const otherParticipant = getOtherParticipant(conv, currentUser.id);
          if (!otherParticipant) return false;
          const userId = otherParticipant.userId._id;
          return String(userId) === String(otherUserId);
        });

        if (existingConversation) {
          setConversationId(existingConversation._id);
          setLoading(false);
          return;
        }

        // If no existing conversation, create one
        const request: CreateConversationRequest = {
          otherUserId,
          otherUserType: 'optometrist', // Doctor is always optometrist
          metadata: {}
        };

        const response = await createConversation(request);
        setConversationId(response.conversation._id);
      } catch (err) {
        console.error('Error finding/creating conversation:', err);
        setError('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };

    findOrCreateConversation();
  }, [isOpen, currentUser, otherUserId]);

  // Get user info for ChatInterface
  const chatUser = {
    id: otherUserId,
    name: otherUserName || 'Doctor',
    lastMessage: '',
    timestamp: 'Just now',
    isSystem: false,
    avatar: (otherUserName || 'D').charAt(0).toUpperCase(),
    conversationId: conversationId || undefined,
    userType: 'optometrist' as const
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes slideUpFromBottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-500"
        onClick={onClose}
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
      />

      {/* Modal - Slides up from bottom, attached to right */}
      <div
        ref={modalRef}
        className="fixed right-0 bottom-0 w-full sm:w-96 lg:w-[420px] h-[85vh] sm:h-[90vh] bg-white rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none shadow-2xl z-50 flex flex-col"
        style={{
          animation: isOpen ? 'slideUpFromBottom 0.6s ease-out' : 'none',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-white rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none">
          <h2 className="text-lg font-semibold text-charcoal">Message Doctor</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close messaging modal"
          >
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <WheelLoader />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-500 text-sm mb-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-primary-cyan hover:underline"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : conversationId ? (
            <ChatInterface
              user={chatUser}
              conversationId={conversationId}
            />
          ) : null}
        </div>
      </div>

    </>
  );
};

export default MessagingModal;

