import apiClient from '../core/apiClient';

export interface NotificationMetadata {
  [key: string]: unknown; // replaces 'any', allows flexible metadata safely
  conversationId?: string;
  messageId?: string;
  appointmentId?: string;
  prescriptionId?: string;
}

export interface Notification {
  _id: string;
  type:
  | 'new_message'
  | 'appointment_scheduled'
  | 'appointment_reminder'
  | 'appointment_cancelled'
  | 'appointment_rescheduled'
  | 'prescription_ready'
  | 'consultation_request'
  | 'payment_received'
  | 'review_request'
  | 'account_verification'
  | 'system_alert';
  title: string;
  message: string;
  data?: NotificationMetadata;
  isRead: boolean;
  readAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
  hasMore: boolean;
}

export async function getNotifications(
  limit = 20,
  skip = 0,
  isRead?: boolean
): Promise<GetNotificationsResponse> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
    });

    if (isRead !== undefined) {
      params.append('isRead', isRead.toString());
    }

    const response = await apiClient.get<GetNotificationsResponse>(
      `/api/notifications?${params.toString()}`
    );
    return response.data;
  } catch (error: unknown) {
    // Handle 403 (Forbidden) and other auth errors gracefully
    const axiosError = error as { response?: { status?: number } };
    if (axiosError?.response?.status === 403 || axiosError?.response?.status === 401) {
      console.warn('Access denied to notifications:', axiosError.response?.status);
      // Return empty response instead of throwing
      return {
        notifications: [],
        totalCount: 0,
        unreadCount: 0,
        hasMore: false,
      };
    }

    // Re-throw other errors
    throw error;
  }
}
