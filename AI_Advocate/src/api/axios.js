import axios from 'axios';

// Create a globally shared Axios instance pointing to the Express server
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // Large timeout for deep legal AI calculations (1 minute)
});

// Interceptor to attach the secure JWT token automatically to every outgoing request header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to intercept 401s and automatically clear local storage and redirect if token is compromised
API.interceptors.response.use(
  (response) => response.data, // Automatically strip the axios wrapper and return standard { success, message, data }
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[SECURITY] Token expired or invalid. Purging session credentials.');
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      // Gracefully redirect to login if we are not already there
      if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    
    // Extract formatted backend message or fallback to default
    const apiError = error.response?.data || {
      success: false,
      message: error.message || 'Unable to establish secure connection with legal node.',
      data: null
    };
    
    return Promise.reject(apiError);
  }
);

export default API;
