import axios from 'axios';

const API_URL = 'https://snippy-backend-1.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Adding token to request');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('Got 401, trying to refresh token');

        // Get the current user from Firebase
        const { auth } = require('../config/firebase');
        const user = auth.currentUser;

        if (user) {
          // Get a fresh token
          const freshToken = await user.getIdToken(true);
          console.log('Got fresh token from Firebase');

          // Update token in localStorage
          localStorage.setItem('token', freshToken);

          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;

          // Retry the request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  googleAuth: (token) => api.post('/auth/google', { token }),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  getCurrentUser: () => api.get('/auth/me'),
};

// URL API
export const urlAPI = {
  shortenUrl: (urlData) => api.post('/shorten', urlData),
  getUserUrls: () => api.get('/user/urls'),
  getUrlAnalytics: (slug) => api.get(`/user/url/${slug}`),
  deactivateUrl: (slug) => api.post(`/url/${slug}/deactivate`),
  deleteUrl: (slug) => api.delete(`/url/${slug}`),
  generateQrCode: (slug) => api.get(`/url/${slug}/qr`, { responseType: 'blob' }),
};

export default api;
