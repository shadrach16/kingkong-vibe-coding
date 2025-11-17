import api from './api'; // Assuming you have an axios instance configured here

const getPlans = async () => {
  try {
    const response = await api.get('/plans');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getBillingInfo = async (apiKey) => {
  try {
    const response = await api.get('/billing/usage', {
      headers: { 'x-api-key': apiKey },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const createCheckoutSession = async (priceId, apiKey) => {
  try {
    const response = await api.post('/billing/checkout', { priceId }, {
      headers: { 'x-api-key': apiKey },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const billingService = {
  getPlans,
  getBillingInfo,
  createCheckoutSession,
};

export default billingService;