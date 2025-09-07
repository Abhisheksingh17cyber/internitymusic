import axios from 'axios';
import { mockApiResponses } from './demoData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const IS_DEMO_MODE = process.env.NODE_ENV === 'production' && window.location.hostname.includes('github.io');

// Demo mode API simulator
const simulateApiCall = (method, url, data = null, params = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const key = `${method} ${url}`;
      const mockResponse = mockApiResponses[key];
      
      if (mockResponse) {
        const response = typeof mockResponse === 'function' 
          ? mockResponse(data || params) 
          : mockResponse;
        resolve({ data: response });
      } else {
        resolve({ 
          data: { 
            success: false, 
            message: 'Demo mode: API endpoint not implemented',
            isDemo: true 
          } 
        });
      }
    }, 500 + Math.random() * 1000); // Simulate network delay
  });
};

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

// Response interceptor to handle errors and demo mode
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // In demo mode, fallback to mock responses for failed requests
    if (IS_DEMO_MODE && error.code === 'ERR_NETWORK') {
      const method = error.config?.method?.toUpperCase();
      const url = error.config?.url?.replace(API_BASE_URL, '');
      return simulateApiCall(method, url, error.config?.data, error.config?.params);
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Custom API methods with demo mode support
const apiCall = async (method, url, data = null, config = {}) => {
  if (IS_DEMO_MODE) {
    return simulateApiCall(method, url, data, config.params);
  }
  
  switch (method) {
    case 'GET':
      return api.get(url, config);
    case 'POST':
      return api.post(url, data, config);
    case 'PUT':
      return api.put(url, data, config);
    case 'DELETE':
      return api.delete(url, config);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};

// Music API
export const musicAPI = {
  getAll: (params) => apiCall('GET', '/music', null, { params }),
  getById: (id) => apiCall('GET', `/music/${id}`),
  getPopular: (limit = 10) => apiCall('GET', `/music/featured/popular?limit=${limit}`),
  stream: (id) => IS_DEMO_MODE ? '#demo-stream' : `${API_BASE_URL}/music/${id}/stream`,
  upload: (formData) => apiCall('POST', '/music/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Payment API
export const paymentAPI = {
  create: (musicItems) => apiCall('POST', '/payment/create-upi', { musicItems, amount: musicItems.reduce((sum, item) => sum + item.price, 0) }),
  getStatus: (transactionId) => apiCall('GET', '/payment/status', null, { params: { transactionId } }),
  getHistory: (params) => apiCall('GET', '/payments/history', null, { params }),
};

// Auth API
export const authAPI = {
  googleLogin: (token) => apiCall('POST', '/auth/google', { token }),
  getProfile: () => apiCall('GET', '/auth/profile'),
  updateProfile: (data) => apiCall('PUT', '/auth/profile', data),
  logout: () => apiCall('POST', '/auth/logout'),
  login: (email, password) => apiCall('POST', '/auth/login', { email, password }),
  register: (name, email, password) => apiCall('POST', '/auth/register', { name, email, password }),
};

export default api;
