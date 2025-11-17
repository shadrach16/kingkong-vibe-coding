import api from './api';


const logService = {
  getProjectLogs: async (projectId, apiKey, level = null,selectedDate=null) => {
    const params = level ? `?level=${level}&date=${selectedDate}` : `?date=${selectedDate}`;
    try {
    const response = await api.get(`/logs/${projectId}${params}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }


  },
};




export { logService };