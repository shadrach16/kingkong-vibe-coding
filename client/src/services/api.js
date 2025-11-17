// client/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('tkser14',user)
    const token = user?.token;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Sending request with token:', token);
    } else {
      console.log('No token found in localStorage, sending unauthenticated request.');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;