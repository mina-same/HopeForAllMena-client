const API_BASE_URL = process.env.GATSBY_API_URL || 'http://localhost:5001/api';

class ContactMessageService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/contact-messages`;
  }

  // Get authentication token from localStorage
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Create headers with authentication
  getHeaders() {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json();
      // If there are validation errors, show them in a more user-friendly way
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors.map(err => err.message).join('\n');
        throw new Error(errorMessages);
      }
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  }

  // Create new contact message (public endpoint)
  async createContactMessage(messageData) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error creating contact message:', error);
      throw error;
    }
  }

  // Get all contact messages (admin only)
  async getContactMessages(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });

      const url = queryParams.toString() 
        ? `${this.baseURL}?${queryParams.toString()}`
        : this.baseURL;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }
  }

  // Get contact message by ID (admin only)
  async getContactMessage(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching contact message:', error);
      throw error;
    }
  }

  // Update contact message status (admin only)
  async updateContactMessageStatus(id, status) {
    try {
      const response = await fetch(`${this.baseURL}/${id}/status`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ status }),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error updating contact message status:', error);
      throw error;
    }
  }

  // Mark message as read (admin only)
  async markAsRead(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}/read`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  // Delete contact message (admin only)
  async deleteContactMessage(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting contact message:', error);
      throw error;
    }
  }

  // Get contact message statistics (admin only)
  async getContactMessageStats() {
    try {
      const response = await fetch(`${this.baseURL}/stats`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching contact message stats:', error);
      throw error;
    }
  }

  // Get recent messages (admin only)
  async getRecentMessages(limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/recent?limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching recent messages:', error);
      throw error;
    }
  }

  // Respond to contact message (admin only)
  async respondToContactMessage(id, content) {
    try {
      const response = await fetch(`${this.baseURL}/${id}/respond`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ content }),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error responding to contact message:', error);
      throw error;
    }
  }
}

export default new ContactMessageService();
