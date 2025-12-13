import apiClient from '../core/apiClient';

export async function deleteNotification(notificationId: string) {
  const response = await apiClient.delete(`/api/notifications/${notificationId}`);
  return response.data;
}
