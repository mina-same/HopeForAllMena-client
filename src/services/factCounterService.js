const API_BASE_URL = process.env.GATSBY_API_URL || 'http://localhost:5001/api';

class FactCounterService {
  // Get current fact counter statistics
  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/fact-counter/stats`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch statistics');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching fact counter stats:', error);
      throw error;
    }
  }

  // Update fact counter statistics (requires authentication)
  async updateStats(stats, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/fact-counter/stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(stats)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update statistics');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating fact counter stats:', error);
      throw error;
    }
  }

  // Get historical data for analytics
  async getHistory(months = 12) {
    try {
      const response = await fetch(`${API_BASE_URL}/fact-counter/history?months=${months}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch historical data');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching fact counter history:', error);
      throw error;
    }
  }
}

const factCounterService = new FactCounterService();
export default factCounterService;
