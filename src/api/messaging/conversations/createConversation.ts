
import apiClient from '../../core/apiClient';

export interface ConversationParticipant {
  userId: string;
  userType: 'patient' | 'optometrist';
  joinedAt: string;
}

export interface ConversationMetadata {
  appointmentId?: string;
  consultationType?: 'general' | 'followup' | 'emergency' | 'prescription';
}

export interface Conversation {
  _id: string;
  participants: ConversationParticipant[];
  lastMessage?: string;
  lastMessageAt: string;
  isActive: boolean;
  metadata?: ConversationMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationRequest {
  otherUserId: string;
  otherUserType: 'patient' | 'optometrist';
  metadata?: ConversationMetadata;
}

export interface CreateConversationResponse {
  conversation: Conversation;
  isNew: boolean;
}

export async function createConversation(
  data: CreateConversationRequest
): Promise<CreateConversationResponse> {
  const response = await apiClient.post<CreateConversationResponse>(
    '/api/messaging/conversations',
    data
  );
  return response.data;
}
