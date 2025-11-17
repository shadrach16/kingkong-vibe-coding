import api from './api'; // Assuming you have an axios instance configured here

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const playgroundService = {
  runTask: async (payload, apiKey) => {

    if (!apiKey) {
      throw new Error('User not authenticated. Please log in.');
    }
    const response = await fetch(`${API_BASE_URL}/v1/kingkong/run-tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to execute task.');
    }

    return response.json();
  },



  // ⚠️ NEW: Function to get all internal functions for a project
  getInternalFunctions: async (projectId, apiKey) => {
    if (!apiKey) {
        throw new Error('API key is required.');
    }
    try {

    const response = await api.get(`${API_BASE_URL}/v1/internal-functions?projectId=${projectId}`, {
          headers: { 'x-api-key': apiKey },
      });
      return response.data;
    }  catch (error) {
    throw error.response.data;
  }
  
 
  },

  // ⚠️ NEW: Function to create a new internal function
  createInternalFunction: async (payload, apiKey) => {
    if (!apiKey) {
        throw new Error('API key is required.');
    }
    const response = await fetch(`${API_BASE_URL}/v1/internal-functions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create internal function.');
    }
    return response.json();
  },

  // ⚠️ NEW: Function to update an existing internal function
  updateInternalFunction: async (id, payload, apiKey) => {
    if (!apiKey) {
        throw new Error('API key is required.');
    }
    const response = await fetch(`${API_BASE_URL}/v1/internal-functions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update internal function.');
    }
    return response.json();
  }, 
  deleteInternalFunction: async (projectId,id, apiKey) => {
    if (!apiKey) {
      throw new Error('API key is required.');
    }
    try {
      const response = await api.delete(`${API_BASE_URL}/v1/internal-functions/${id}?projectId=`+projectId, {
        headers: { 'x-api-key': apiKey },
      },

      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  runInternalFunction: async (projectId, functionId, params, apiKey) => {
    const response = await fetch(`${API_BASE_URL}/v1/internal-functions/${projectId}/functions/${functionId}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({ params,projectId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to run function.');
    }
    const data = await response.json();
    return data.output;
  },
};

export default playgroundService;