import apiClient from '../../core/apiClient';
import { Conversation } from '@/types/api/messaging';

export interface ConversationMetadata {
  appointmentId?: string;
  consultationType?: 'general' | 'followup' | 'emergency' | 'prescription';
}

export interface GetConversationsResponse {
  conversations: Conversation[];
  hasMore: boolean;
}

export interface CreateConversationRequest {
  otherUserId: string;
  metadata?: ConversationMetadata;
}

export interface CreateConversationResponse {
  conversation: Conversation;
  isNew: boolean;
}

export async function getConversations(
  limit = 20,
  skip = 0
): Promise<GetConversationsResponse> {
  const response = await apiClient.get<GetConversationsResponse>(
    `/api/messaging/conversations?limit=${limit}&skip=${skip}`
  );
  return response.data;
}