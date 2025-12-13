import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { getSocket } from '@/utils/socket';
import { useAuth } from '@/context/AuthContext';
import { useSocketStore } from '@/store/useSocketStore';
import { useMessagesStore } from '@/store/useMessagesStore';
import { getMessages, Message } from "@/api/messaging/messages/messages";
import CloudinaryImage from '@/component/common/UI/CloudinaryImage';

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

interface ChatInterfaceProps {
  user: User;
  conversationId?: string;
  onBackToList?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, conversationId, onBackToList }) => {
  const { user: currentUser, token } = useAuth();
  const socket = useSocketStore(state => state.socket);
  const { connect } = useSocketStore();
  const { setCurrentConversationId } = useMessagesStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [isPeerTyping, setIsPeerTyping] = useState(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      connect(token);
    }
  }, [token, connect]);

  // Track current conversation ID in store
  useEffect(() => {
    if (conversationId) {
      setCurrentConversationId(conversationId);
    } else {
      setCurrentConversationId(null);
    }
    return () => {
      setCurrentConversationId(null);
    };
  }, [conversationId, setCurrentConversationId]);

  // Fetch messages when conversationId changes and mark unread messages as read
  useEffect(() => {
    if (!conversationId || !socket || !currentUser) return;

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMessages(conversationId);
        setMessages(data.messages || []);

        // Mark all unread messages in this conversation as read
        const unreadMessages = data.messages.filter((msg: Message) => {
          // Message is unread if:
          // 1. It's not from current user
          // 2. Current user hasn't read it
          const senderUserId = msg.sender.userId;
          const isFromCurrentUser = typeof senderUserId === 'string'
            ? senderUserId === currentUser.id
            : (typeof senderUserId === 'object' && senderUserId !== null)
              ? (senderUserId._id === currentUser.id || senderUserId.id === currentUser.id)
              : false;

          if (isFromCurrentUser) return false;

          const readBy = msg.readBy || [];
          const isRead = readBy.some((read) => {
            const readUserId = typeof read.userId === 'string'
              ? read.userId
              : (typeof read.userId === 'object' && read.userId !== null)
                ? (read.userId as { _id?: string; id?: string })._id || (read.userId as { _id?: string; id?: string }).id
                : undefined;
            return readUserId === currentUser.id;
          });

          return !isRead;
        });

        // Mark each unread message as read
        unreadMessages.forEach((msg: Message) => {
          socket.emit('message_read', {
            messageId: msg._id,
            conversationId: conversationId
          });
        });

        // Request updated unread count after marking messages as read
        if (unreadMessages.length > 0) {
          setTimeout(() => {
            socket.emit('get_unread_count');
          }, 500); // Small delay to ensure backend has processed the reads
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, currentUser, socket]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Socket event handlers
  useEffect(() => {
    if (!conversationId || !socket) return;

    socket.emit('join_conversation', { conversationId });

    const handleNewMessage = (payload: { message: Message }) => {

      setMessages(prev => {
        // Avoid duplicates
        const exists = prev.some(msg => msg._id === payload.message._id);
        if (exists) {
          return prev;
        }
        return [...prev, payload.message];
      });
    };

    const handleUserTyping = (data: { conversationId: string; userId: string }) => {
      if (data.conversationId === conversationId && data.userId !== currentUser?.id) {
        setIsPeerTyping(true);
      }
    };

    const handleUserStoppedTyping = (data: { conversationId: string; userId: string }) => {
      if (data.conversationId === conversationId && data.userId !== currentUser?.id) {
        setIsPeerTyping(false);
      }
    };

    const handleMessageRead = (data: { messageId: string; readBy: string }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.messageId
            ? {
              ...msg,
              readBy: [...(msg.readBy || []), { userId: data.readBy, readAt: new Date().toISOString() }]
            }
            : msg
        )
      );
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);
    socket.on('message_read_update', handleMessageRead);

    return () => {
      socket.emit('leave_conversation', { conversationId });
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
      socket.off('message_read_update', handleMessageRead);
    };
  }, [conversationId, currentUser?.id, socket]);

  // Handle input change with typing indicators
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    const socket = getSocket();
    if (!socket || !conversationId) return;

    // Emit typing start
    socket.emit('typing_start', { conversationId });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { conversationId });
    }, 1000);
  };

  // Send message
  const handleSend = useCallback(async () => {
    const socket = getSocket();
    if (!socket || !conversationId || !input.trim() || sending) return;

    setSending(true);
    setError(null);

    try {
      // Clear typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      socket.emit('typing_stop', { conversationId });

      // Send message
      socket.emit('send_message', {
        conversationId,
        messageType: 'text',
        content: { text: input.trim() }
      });

      setInput('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  }, [conversationId, input, sending]);

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format message time
  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if message is read
  const isMessageRead = (message: Message) => {
    if (!message.readBy) return false;
    const otherParticipants = user.id ? [user.id] : [];
    return otherParticipants.every(participantId =>
      message.readBy?.some(read => read.userId === participantId)
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back button - visible on mobile only */}
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          {user.profilePhoto && !user.isSystem ? (
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <CloudinaryImage
                src={user.profilePhoto}
                alt={user.name}
                width={32}
                height={32}
                fallbackSrc="/icons/avatar.png"
              />
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
              style={{ backgroundColor: '#0ab2e1' }}
            >
              {user.avatar}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm sm:text-base whitespace-normal break-words" style={{ color: '#030460' }}>
              {user.name}
            </h3>
            <p className="text-xs sm:text-sm truncate" style={{ color: isPeerTyping ? '#0ab2e1' : '#999' }}>
              {isPeerTyping ? 'typing...' : 'online'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 px-3 sm:px-6 py-4 sm:py-6 overflow-y-auto space-y-3 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-sm">Loading messages...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm hover:underline"
                style={{ color: '#0ab2e1' }}
              >
                Retry
              </button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            // Extract sender ID - handle both string and object formats
            const getSenderId = () => {
              const sender = message.sender?.userId;
              if (typeof sender === 'string') {
                return sender;
              }
              if (typeof sender === 'object' && sender !== null) {
                return sender._id || sender.id;
              }
              return null;
            };

            const senderId = getSenderId();
            const isOwnMessage = senderId === currentUser?.id;
            const isRead = isMessageRead(message);

            return (
              <div
                key={message._id || index}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-[70%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl ${isOwnMessage
                    ? 'rounded-br-sm'
                    : 'rounded-bl-sm'
                    }`}
                  style={{
                    backgroundColor: isOwnMessage ? '#0ab2e1' : '#ffffff',
                    color: isOwnMessage ? '#ffffff' : '#222222',
                    border: isOwnMessage ? 'none' : '1px solid #e5e5e5'
                  }}
                >
                  <div className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                    {message.content?.text || String(message.content)}
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1 sm:mt-1.5">
                    <span
                      className="text-[10px] sm:text-[11px]"
                      style={{ color: isOwnMessage ? 'rgba(255, 255, 255, 0.8)' : '#999' }}
                    >
                      {message.createdAt && formatMessageTime(message.createdAt)}
                    </span>
                    {isOwnMessage && (
                      <span
                        className="text-[10px] sm:text-xs ml-1"
                        style={{ color: isRead ? '#facd0b' : 'rgba(255, 255, 255, 0.6)' }}
                      >
                        {isRead ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Message Input */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            disabled={sending || !conversationId}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-full focus:outline-none focus:border-[#0ab2e1] disabled:opacity-50 text-sm transition-colors"
            style={{ color: '#222222' }}
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim() || !conversationId}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"
            style={{ backgroundColor: '#0ab2e1' }}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;