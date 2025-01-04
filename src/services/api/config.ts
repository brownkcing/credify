import axios from 'axios';

const api = axios.create({
  // Use Vite's port 5173 instead of 3000
  baseURL: 'http://localhost:5173/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging in development
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log('Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;