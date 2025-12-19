import axios from 'axios';

// Ensure baseURL always includes /api
let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Fix: Ensure baseURL always ends with /api
if (baseURL && !baseURL.endsWith('/api')) {
  // If it ends with /, remove it first
  baseURL = baseURL.replace(/\/$/, '');
  // Add /api if not present
  if (!baseURL.endsWith('/api')) {
    baseURL = baseURL + '/api';
  }
}

// Log API URL for debugging
console.log('API Base URL:', baseURL);

const API = axios.create({ 
  baseURL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
API.interceptors.request.use(
  cfg => {
    const token = localStorage.getItem('token');
    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', cfg.method?.toUpperCase(), cfg.url);
    return cfg;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('API Response Error:', error.response?.status, error.response?.data || error.message);
    if (error.response?.status === 404) {
      console.error('404 - Endpoint not found:', error.config?.url);
      console.error('Full URL:', error.config?.baseURL + error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default API;
