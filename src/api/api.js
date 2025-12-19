import axios from 'axios';

// Ensure baseURL always includes /api
let baseURL = import.meta.env.VITE_API_URL || 'https://pulse-watches-backend.vercel.app/api';

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
console.log('=== API Configuration ===');
console.log('API Base URL:', baseURL);
console.log('VITE_API_URL env:', import.meta.env.VITE_API_URL || 'Not set');
console.log('Current Origin:', typeof window !== 'undefined' ? window.location.origin : 'SSR');
console.log('========================');

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
    console.log('API Response Success:', response.config?.method?.toUpperCase(), response.config?.url, response.status);
    return response;
  },
  error => {
    // Enhanced error logging
    console.error('=== API Error ===');
    console.error('Method:', error.config?.method?.toUpperCase());
    console.error('URL:', error.config?.url);
    console.error('Full URL:', error.config?.baseURL + error.config?.url);
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Response Data:', error.response?.data);
    console.error('Error Message:', error.message);
    console.error('Request Headers:', error.config?.headers);
    
    // Check for CORS errors specifically
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      console.error('⚠️ Network Error - Possible CORS issue or backend unreachable');
      console.error('Backend URL:', baseURL);
      console.error('Current Origin:', window.location.origin);
    }
    
    // Check for CORS in response headers
    if (error.response) {
      const corsHeader = error.response.headers['access-control-allow-origin'];
      console.error('CORS Header:', corsHeader || 'Not present');
      
      // Log the full error response for 500 errors
      if (error.response.status === 500) {
        console.error('⚠️ 500 Server Error Details:');
        console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    console.error('================');
    return Promise.reject(error);
  }
);

export default API;
