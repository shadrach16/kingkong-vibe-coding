const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const adminService = {
  getAllUsers: async (apiKey) => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'x-api-key': apiKey },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users.');
    }
    return response.json();
  },

  updateUserTaskLimit: async (userId, newLimit, apiKey) => {
    const response = await fetch(`${API_BASE_URL}/admin/user/${userId}/task-limit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ newLimit }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update task limit.');
    }
    return response.json();
  },

  resetUserApiKey: async (userId, apiKey) => {
    const response = await fetch(`${API_BASE_URL}/admin/user/${userId}/reset-api-key`, {
      method: 'PUT',
      headers: { 'x-api-key': apiKey },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reset API key.');
    }
    return response.json();
  },
};

export default adminService;