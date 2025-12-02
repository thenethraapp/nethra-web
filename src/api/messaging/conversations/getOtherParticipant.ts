import { Conversation } from '@/types/api/messaging';

export function getOtherParticipant(conversation: Conversation, currentUserId: string) {
    if (!conversation?.participants?.length) return null;
    return (
      conversation.participants.find(
        (p) => p?.userId && String(p.userId._id) !== String(currentUserId)
      ) || null
    );
  }