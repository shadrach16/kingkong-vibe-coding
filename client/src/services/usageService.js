// client/src/services/usageService.js

import api from './api';

const getUsageMetrics = async () => {
  try {
    const response = await api.get('/metrics/usage');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const usageService = {
  getUsageMetrics,
};

export default usageService;