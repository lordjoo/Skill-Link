import api, { multipart } from './apiClient'

// Shared endpoints used by both account types (chat + notifications).
export const commonAPI = {
  // Chat
  getChatRooms: () => api.get('/chats'),
  getChatTasks: (chatRoomId) => api.get(`/chats/${chatRoomId}/tasks`),
  createChatTask: (chatRoomId, data) => api.post(`/chats/${chatRoomId}/tasks`, data),
  updateTaskStatus: (taskId, data) => api.put(`/chats/tasks/${taskId}`, data),
  getAttachments: (chatRoomId) => api.get(`/chats/${chatRoomId}/attachments`),
  createAttachment: (chatRoomId, formData) =>
    api.post(`/chats/${chatRoomId}/attachments`, formData, multipart),
  getChatMessages: (roomId) => api.get(`/chats/${roomId}/messages`),
  sendMessage: (roomId, data) => api.post(`/chats/${roomId}/messages`, data),

  // Notifications (bell dropdown)
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id) => api.put(`/notifications/${id}/read`)
}
