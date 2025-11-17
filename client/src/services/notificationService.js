const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const notificationService = {
  getNotifications: async (apiKey) => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: { 'x-api-key': apiKey },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch notifications.');
    }
    return response.json();
  },
  
  markAsRead: async (notificationId, apiKey) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: { 'x-api-key': apiKey },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to mark notification as read.');
    }
    return response.json();
  },
};

export { notificationService };