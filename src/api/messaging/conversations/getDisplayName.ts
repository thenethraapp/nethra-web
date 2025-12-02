import { Conversation } from '@/types/api/messaging';

export function getDisplayName(user: Conversation['participants'][0]['userId']): string {
    if (user.role === 'optometrist') {
      return user.fullName || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Unknown Optometrist';
    }
    return user.username || 'Unknown Patient';
}