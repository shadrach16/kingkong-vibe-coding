const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const dashboardService = {
  getDashboardData: async (apiKey) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch dashboard data.');
      }

      return response.json();
    } catch (error) {
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  },
};

export default dashboardService;