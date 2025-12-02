import apiClient from '../core/apiClient';

export async function markNotificationRead(notificationId: string) {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
}

export async function markAllNotificationsRead() {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
}
