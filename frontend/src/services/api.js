import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Music API
export const musicAPI = {
  getAll: (params) => api.get('/music', { params }),
  getById: (id) => api.get(`/music/${id}`),
  getPopular: (limit = 10) => api.get(`/music/featured/popular?limit=${limit}`),
  stream: (id) => `${API_BASE_URL}/music/${id}/stream`,
  upload: (formData) => api.post('/music/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Payment API
export const paymentAPI = {
  create: (musicItems) => api.post('/payments/create', { musicItems }),
  getStatus: (transactionId) => api.get(`/payments/${transactionId}/status`),
  getHistory: (params) => api.get('/payments/history', { params }),
};

// Auth API
export const authAPI = {
  googleLogin: (token) => api.post('/auth/google', { token }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
};

export default api;
