import apiClient from "../../core/apiClient";

export interface Message {
  _id: string;
  content: {
    text?: string;
  };
  sender: {
    userId: string | { _id?: string; id?: string };
    userType: 'patient' | 'optometrist';
  };
  readBy?: Array<{ userId: string; readAt: string }>;
  createdAt: string;
}


export interface GetMessagesResponse {
  messages: Message[];
}

export async function getMessages(conversationId: string): Promise<GetMessagesResponse> {
  const response = await apiClient.get(`/api/messaging/messages?conversationId=${conversationId}`);
  return response.data;
}