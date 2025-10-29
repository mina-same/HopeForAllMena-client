import axios from 'axios';
import { authStorage } from '../utils/storage';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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
    // Only add auth token for non-public endpoints
    const isPublicEndpoint = config.url?.includes('/books') ||
      config.url?.includes('/categories') ||
      config.url?.includes('/authors') ||
      config.url?.includes('/courses') ||
      config.url?.includes('/enrollments') ||
      (config.url?.includes('/reviews') && config.method === 'post');

    const token = authStorage.getToken();
    if (token && !isPublicEndpoint) {
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
      // and if this is not a login attempt or public endpoint
      const currentPath = window.location.pathname;
      const isLoginAttempt = error.config?.url?.includes('/auth/login');
      const isPublicEndpoint = error.config?.url?.includes('/books') ||
        error.config?.url?.includes('/categories') ||
        error.config?.url?.includes('/authors') ||
        error.config?.url?.includes('/courses') ||
        error.config?.url?.includes('/enrollments') ||
        (error.config?.url?.includes('/reviews') && error.config?.method === 'post');

      if (currentPath !== '/login' && !isLoginAttempt && !isPublicEndpoint) {
        // Token expired or invalid - redirect to login
        authStorage.clearAuth();
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
    authStorage.clearAuth();
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

// Books API methods
export const booksAPI = {
  getBooks: async (params = {}) => {
    const response = await api.get('/books', { params });
    return response.data;
  },

  getBookById: async (id, params = {}) => {
    const response = await api.get(`/books/${id}`, { params });
    return response.data;
  },

  getRecentBooks: async (limit = 10) => {
    const response = await api.get('/books/recent', { params: { limit } });
    return response.data;
  },

  getBookStats: async () => {
    const response = await api.get('/books/stats');
    return response.data;
  },

  createBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  updateBookStatus: async (id, status) => {
    const response = await api.patch(`/books/${id}/status`, { status });
    return response.data;
  },

  updateBookRating: async (id) => {
    const response = await api.patch(`/books/${id}/rating`);
    return response.data;
  },
};

// Categories API methods
export const categoriesAPI = {
  getCategories: async (params = {}) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

// Authors API methods
export const authorsAPI = {
  getAuthors: async (params = {}) => {
    const response = await api.get('/authors', { params });
    return response.data;
  },

  getAuthorById: async (id) => {
    const response = await api.get(`/authors/${id}`);
    return response.data;
  },
};

// Reviews API methods
export const reviewsAPI = {
  getReviews: async (params = {}) => {
    const response = await api.get('/reviews', { params });
    return response.data;
  },

  getReviewById: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  getReviewsByBook: async (bookId, params = {}) => {
    const response = await api.get(`/reviews/book/${bookId}`, { params });
    return response.data;
  },

  getReviewsByUser: async (userId, params = {}) => {
    const response = await api.get(`/reviews/user/${userId}`, { params });
    return response.data;
  },

  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  moderateReview: async (id, moderationData) => {
    const response = await api.patch(`/reviews/${id}/moderate`, moderationData);
    return response.data;
  },

  getPendingReviews: async (params = {}) => {
    const response = await api.get('/reviews/pending', { params });
    return response.data;
  },

  getReviewStats: async () => {
    const response = await api.get('/reviews/stats');
    return response.data;
  },

  markHelpful: async (id) => {
    const response = await api.post(`/reviews/${id}/helpful`);
    return response.data;
  },

  markNotHelpful: async (id) => {
    const response = await api.post(`/reviews/${id}/not-helpful`);
    return response.data;
  },
};

// Courses API methods
export const coursesAPI = {
  getCourses: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  getFeaturedCourses: async (limit = 6) => {
    const response = await api.get('/courses/featured', { params: { limit } });
    return response.data;
  },

  getCoursesByCategory: async (category, limit = 10) => {
    const response = await api.get(`/courses/category/${category}`, { params: { limit } });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/courses/categories');
    return response.data;
  },

  getInstitutions: async () => {
    const response = await api.get('/courses/institutions');
    return response.data;
  },

  getInstructors: async () => {
    const response = await api.get('/courses/instructors');
    return response.data;
  },

  getCourseStats: async () => {
    const response = await api.get('/courses/stats');
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  updateCourseRating: async (id, rating) => {
    const response = await api.patch(`/courses/${id}/rating`, { rating });
    return response.data;
  },
};

// Enrollments API methods
export const enrollmentsAPI = {
  getEnrollments: async (params = {}) => {
    const response = await api.get('/enrollments', { params });
    return response.data;
  },

  getEnrollmentById: async (id) => {
    const response = await api.get(`/enrollments/${id}`);
    return response.data;
  },

  getEnrollmentsByCourse: async (courseId, status = null) => {
    const params = status ? { status } : {};
    const response = await api.get(`/enrollments/course/${courseId}`, { params });
    return response.data;
  },

  getEnrollmentsByStudent: async (studentId, status = null) => {
    const params = status ? { status } : {};
    const response = await api.get(`/enrollments/student/${studentId}`, { params });
    return response.data;
  },

  getEnrollmentStats: async () => {
    const response = await api.get('/enrollments/stats');
    return response.data;
  },

  createEnrollment: async (enrollmentData) => {
    const response = await api.post('/enrollments', enrollmentData);
    return response.data;
  },

  updateEnrollment: async (id, enrollmentData) => {
    const response = await api.put(`/enrollments/${id}`, enrollmentData);
    return response.data;
  },

  deleteEnrollment: async (id) => {
    const response = await api.delete(`/enrollments/${id}`);
    return response.data;
  },

  approveEnrollment: async (id, approvedBy = null) => {
    const response = await api.patch(`/enrollments/${id}/approve`, { approvedBy });
    return response.data;
  },

  rejectEnrollment: async (id, rejectedBy = null) => {
    const response = await api.patch(`/enrollments/${id}/reject`, { rejectedBy });
    return response.data;
  },

  updateProgress: async (id, completedLessons, totalLessons) => {
    const response = await api.patch(`/enrollments/${id}/progress`, {
      completedLessons,
      totalLessons
    });
    return response.data;
  },

  addGrade: async (id, assignment, score, feedback = '') => {
    const response = await api.post(`/enrollments/${id}/grades`, {
      assignment,
      score,
      feedback
    });
    return response.data;
  },

  recordAttendance: async (id, sessionDate, attended, duration = 0, notes = '') => {
    const response = await api.post(`/enrollments/${id}/attendance`, {
      sessionDate,
      attended,
      duration,
      notes
    });
    return response.data;
  },

  addFeedback: async (id, rating, review, wouldRecommend) => {
    const response = await api.post(`/enrollments/${id}/feedback`, {
      rating,
      review,
      wouldRecommend
    });
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
