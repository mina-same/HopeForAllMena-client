const API_BASE_URL = process.env.GATSBY_API_URL || 'http://localhost:5001/api';

class EventService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/events`;
  }

  // Get authentication token from localStorage
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
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
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  }

  // Get all events (public endpoint)
  async getAllEvents(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });

      const url = queryParams.toString() 
        ? `${this.baseURL}/public?${queryParams.toString()}`
        : `${this.baseURL}/public`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Get single event
  async getEvent(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }

  // Create new event
  async createEvent(eventData) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(eventData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Update event
  async updateEvent(id, eventData) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(eventData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // Delete event
  async deleteEvent(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Get upcoming events (public endpoint)
  async getUpcomingEvents(limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/public/upcoming?limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  }

  // Get events by date range (public endpoint)
  async getEventsByDateRange(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const response = await fetch(`${this.baseURL}/public/date-range?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching events by date range:', error);
      throw error;
    }
  }

  // Get event statistics
  async getEventStats() {
    try {
      const response = await fetch(`${this.baseURL}/stats`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching event stats:', error);
      throw error;
    }
  }

  // Transform API event data to calendar format
  transformEventForCalendar(apiEvent) {
    return {
      id: apiEvent._id,
      title: apiEvent.title,
      start: new Date(apiEvent.start),
      end: new Date(apiEvent.end),
      color: apiEvent.color,
      description: apiEvent.description,
      location: apiEvent.location,
      organizer: apiEvent.organizer,
      participants: apiEvent.participants,
      status: apiEvent.status,
      category: apiEvent.category,
      isAllDay: apiEvent.isAllDay,
    };
  }

  // Transform calendar event data to API format
  transformEventForAPI(calendarEvent) {
    // Ensure dates are proper Date objects
    const startDate = calendarEvent.start instanceof Date ? calendarEvent.start : new Date(calendarEvent.start);
    const endDate = calendarEvent.end instanceof Date ? calendarEvent.end : new Date(calendarEvent.end);
    
    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date provided');
    }
    
    if (startDate >= endDate) {
      throw new Error('End date must be after start date');
    }
    
    return {
      title: calendarEvent.title?.trim() || '',
      description: calendarEvent.description?.trim() || '',
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      color: calendarEvent.color || 'default',
      location: calendarEvent.location?.trim() || '',
      organizer: calendarEvent.organizer?.trim() || '',
      participants: parseInt(calendarEvent.participants) || 0,
      status: calendarEvent.status || 'scheduled',
      category: calendarEvent.category || 'other',
      isAllDay: Boolean(calendarEvent.isAllDay),
    };
  }
}

export default new EventService();
