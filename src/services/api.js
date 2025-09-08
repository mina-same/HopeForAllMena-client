import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.GATSBY_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
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
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on the login page
      // and if this is not a login attempt (to prevent refresh on invalid credentials)
      const currentPath = window.location.pathname;
      const isLoginAttempt = error.config?.url?.includes('/auth/login');
      
      if (currentPath !== '/login' && !isLoginAttempt) {
        // Token expired or invalid - redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.post('/auth/verify-token');
    return response.data;
  },

  getPermissions: async () => {
    const response = await api.get('/auth/permissions');
    return response.data;
  },
};

// Users API methods
export const usersAPI = {
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (id, status) => {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data;
  },

  updateUserPermissions: async (id, permissions) => {
    const response = await api.patch(`/users/${id}/permissions`, { permissions });
    return response.data;
  },

  unlockUser: async (id) => {
    const response = await api.post(`/users/${id}/unlock`);
    return response.data;
  },
};

// Magazine Requests API methods
export const magazineRequestsAPI = {
  createRequest: async (requestData) => {
    const response = await api.post('/magazine-requests', requestData);
    return response.data;
  },

  getAllRequests: async (params = {}) => {
    const response = await api.get('/magazine-requests', { params });
    return response.data;
  },

  getRequestById: async (id) => {
    const response = await api.get(`/magazine-requests/${id}`);
    return response.data;
  },

  updateRequestStatus: async (id, statusData) => {
    const response = await api.put(`/magazine-requests/${id}/status`, statusData);
    return response.data;
  },

  approveRequest: async (id, adminNotes) => {
    const response = await api.put(`/magazine-requests/${id}/approve`, { adminNotes });
    return response.data;
  },

  rejectRequest: async (id, adminNotes) => {
    const response = await api.put(`/magazine-requests/${id}/reject`, { adminNotes });
    return response.data;
  },

  fulfillRequest: async (id, fulfillmentData) => {
    const response = await api.put(`/magazine-requests/${id}/fulfill`, fulfillmentData);
    return response.data;
  },

  deleteRequest: async (id) => {
    const response = await api.delete(`/magazine-requests/${id}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/magazine-requests/statistics');
    return response.data;
  },

  getPendingCount: async () => {
    const response = await api.get('/magazine-requests/pending-count');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
