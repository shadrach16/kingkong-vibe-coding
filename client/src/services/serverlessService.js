const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const serverlessService = {
  createServerlessFunction: async (prompt, functionName, projectId, apiKey) => {
    const response = await fetch(`${API_BASE_URL}/serverless/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ prompt, functionName, projectId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create serverless function.');
    }
    return response.json();
  },
};

export default serverlessService;