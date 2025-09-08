import api from './api';

// Authors API
export const authorsAPI = {
  // Get all authors with pagination and filtering
  getAuthors: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/authors?${queryParams.toString()}`);
  },

  // Get author by ID
  getAuthorById: (id) => api.get(`/authors/${id}`),

  // Create new author
  createAuthor: (authorData) => {
    console.log('API: Creating author with data:', authorData);
    console.log('API: Auth token exists:', !!localStorage.getItem('authToken'));
    return api.post('/authors', authorData);
  },

  // Update author
  updateAuthor: (id, authorData) => api.put(`/authors/${id}`, authorData),

  // Delete author
  deleteAuthor: (id) => api.delete(`/authors/${id}`),

  // Update author status
  updateAuthorStatus: (id, status) => api.patch(`/authors/${id}/status`, { status }),

  // Toggle author featured status
  toggleAuthorFeatured: (id) => api.patch(`/authors/${id}/featured`),

  // Get author statistics
  getAuthorStats: () => api.get('/authors/stats'),

  // Get featured authors
  getFeaturedAuthors: (limit = 10) => api.get(`/authors/featured?limit=${limit}`),

  // Update author statistics
  updateAuthorStats: (id) => api.patch(`/authors/${id}/stats`)
};

// Categories API
export const categoriesAPI = {
  // Get all categories with pagination and filtering
  getCategories: (params = {}) => {
    console.log('API: Fetching categories with params:', params);
    console.log('API: Auth token exists:', !!localStorage.getItem('authToken'));
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/categories?${queryParams.toString()}`);
  },

  // Get category by ID
  getCategoryById: (id) => api.get(`/categories/${id}`),

  // Get category hierarchy
  getCategoryHierarchy: () => api.get('/categories/hierarchy'),

  // Create new category
  createCategory: (categoryData) => {
    console.log('API: Creating category with data:', categoryData);
    console.log('API: Auth token exists:', !!localStorage.getItem('authToken'));
    return api.post('/categories', categoryData);
  },

  // Update category
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),

  // Delete category
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  // Update category status
  updateCategoryStatus: (id, status) => api.patch(`/categories/${id}/status`, { status }),


  // Get category statistics
  getCategoryStats: () => api.get('/categories/stats'),


  // Update category statistics
  updateCategoryStats: (id) => api.patch(`/categories/${id}/stats`)
};

// Books API
export const booksAPI = {
  // Get all books with pagination and filtering
  getBooks: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/books?${queryParams.toString()}`);
  },

  // Get book by ID
  getBookById: (id) => api.get(`/books/${id}`),

  // Create new book
  createBook: (bookData) => api.post('/books', bookData),

  // Update book
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),

  // Delete book
  deleteBook: (id) => api.delete(`/books/${id}`),

  // Update book status
  updateBookStatus: (id, status) => api.patch(`/books/${id}/status`, { status }),

  // Get book statistics
  getBookStats: () => api.get('/books/stats'),

  // Get recent books
  getRecentBooks: (limit = 10) => api.get(`/books/recent?limit=${limit}`),

  // Update book rating
  updateBookRating: (id) => api.patch(`/books/${id}/rating`)
};

// Reviews API
export const reviewsAPI = {
  // Get all reviews with pagination and filtering
  getReviews: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/reviews?${queryParams.toString()}`);
  },

  // Get review by ID
  getReviewById: (id) => api.get(`/reviews/${id}`),

  // Create new review
  createReview: (reviewData) => api.post('/reviews', reviewData),

  // Update review
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),

  // Delete review
  deleteReview: (id) => api.delete(`/reviews/${id}`),

  // Moderate review
  moderateReview: (id, status, notes = '') => api.patch(`/reviews/${id}/moderate`, { status, notes }),

  // Get pending reviews
  getPendingReviews: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/reviews/pending?${queryParams.toString()}`);
  },

  // Get reviews by book
  getReviewsByBook: (bookId, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/reviews/book/${bookId}?${queryParams.toString()}`);
  },

  // Get reviews by user
  getReviewsByUser: (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/reviews/user/${userId}?${queryParams.toString()}`);
  },

  // Mark review as helpful
  markHelpful: (id) => api.patch(`/reviews/${id}/helpful`),

  // Mark review as not helpful
  markNotHelpful: (id) => api.patch(`/reviews/${id}/not-helpful`),

  // Get review statistics
  getReviewStats: () => api.get('/reviews/stats')
};

// Contact Messages API
export const contactMessagesAPI = {
  // Get all contact messages with pagination and filtering
  getContactMessages: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/contact-messages?${queryParams.toString()}`);
  },

  // Get contact message by ID
  getContactMessageById: (id) => api.get(`/contact-messages/${id}`),

  // Create new contact message
  createContactMessage: (messageData) => api.post('/contact-messages', messageData),

  // Update contact message
  updateContactMessage: (id, messageData) => api.put(`/contact-messages/${id}`, messageData),

  // Delete contact message
  deleteContactMessage: (id) => api.delete(`/contact-messages/${id}`),

  // Update contact message status
  updateContactMessageStatus: (id, status) => api.patch(`/contact-messages/${id}/status`, { status }),

  // Assign contact message
  assignContactMessage: (id, assignedTo) => api.patch(`/contact-messages/${id}/assign`, { assignedTo }),

  // Respond to contact message
  respondToContactMessage: (id, content) => api.patch(`/contact-messages/${id}/respond`, { content }),

  // Close contact message
  closeContactMessage: (id) => api.patch(`/contact-messages/${id}/close`),

  // Add note to contact message
  addNoteToContactMessage: (id, note) => api.patch(`/contact-messages/${id}/note`, { note }),

  // Mark as read
  markAsRead: (id) => api.patch(`/contact-messages/${id}/read`),

  // Get book orders
  getBookOrders: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/contact-messages/book-orders?${queryParams.toString()}`);
  },

  // Get recent messages
  getRecentMessages: (limit = 10) => api.get(`/contact-messages/recent?limit=${limit}`),

  // Get contact message statistics
  getContactMessageStats: () => api.get('/contact-messages/stats')
};

export default {
  authors: authorsAPI,
  categories: categoriesAPI,
  books: booksAPI,
  reviews: reviewsAPI,
  contactMessages: contactMessagesAPI
};
