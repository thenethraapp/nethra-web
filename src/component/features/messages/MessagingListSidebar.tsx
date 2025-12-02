import React from 'react';
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

interface MessagingListSidebarProps {
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  users: User[];
}

const MessagingListSidebar: React.FC<MessagingListSidebarProps> = ({ 
  selectedUser, 
  onSelectUser,
  users 
}) => {
  return (
    <div className="w-80 bg-white h-full flex flex-col border-r border-gray-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-medium text-darkgray tracking-tight">Messages</h2>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {users.map((user: User, index: number) => (
          <div
            key={user.conversationId || `${user.id}-${index}`}
            onClick={() => onSelectUser(user)}
            className={`px-6 py-4 cursor-pointer transition-all duration-200 border-l-2 ${
              selectedUser?.id === user.id
                ? 'bg-blue-50 border-primary-cyan'
                : 'hover:bg-gray-50 border-transparent'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar - Smaller size */}
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 ${
                  user.isSystem ? 'bg-primary-cyan' : 'bg-darkgray'
                }`}>
                  {user.avatar}
                </div>
              )}

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-darkgray text-base whitespace-normal break-words">
                        {user.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {user.isSystem && (
                      <span className="text-[10px] text-primary-cyan bg-primary-cyan/10 py-1 px-2 rounded-full font-medium whitespace-nowrap">
                        Platform
                      </span>
                    )}
                    {!user.isSystem && user.userType && (
                      <span className="text-[10px] text-gray-500 bg-gray-100 py-1 px-2 rounded-full font-medium whitespace-nowrap">
                        {user.userType}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {user.timestamp}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 truncate leading-relaxed">
                  {user.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagingListSidebar;