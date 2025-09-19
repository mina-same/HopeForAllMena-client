const API_BASE_URL = process.env.GATSBY_API_URL || 'http://localhost:5001/api';

class BlogAPI {
  // Public blog endpoints
  async getPublishedBlogs(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/blogs/published?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch blogs');
    return response.json();
  }

  async getBlogBySlug(slug) {
    const response = await fetch(`${API_BASE_URL}/blogs/slug/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch blog');
    return response.json();
  }

  async getFeaturedBlogs() {
    const response = await fetch(`${API_BASE_URL}/blogs/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured blogs');
    return response.json();
  }

  async getRecentBlogs(limit = 5) {
    const response = await fetch(`${API_BASE_URL}/blogs/recent?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch recent blogs');
    return response.json();
  }

  async getAdjacentBlogs(slug) {
    const response = await fetch(`${API_BASE_URL}/blogs/adjacent/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch adjacent blogs');
    return response.json();
  }

  // Comment endpoints
  async getBlogComments(blogId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  }

  async createComment(blogId, commentData) {
    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) throw new Error('Failed to create comment');
    return response.json();
  }

  async getCommentReplies(commentId) {
    const response = await fetch(`${API_BASE_URL}/blogs/comments/${commentId}/replies`);
    if (!response.ok) throw new Error('Failed to fetch replies');
    return response.json();
  }

  // Admin endpoints
  async getAllBlogs(params = {}, token) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/blogs/admin/all?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch all blogs');
    return response.json();
  }

  async createBlog(blogData, token) {
    const formData = new FormData();
    
    Object.keys(blogData).forEach(key => {
      if (key === 'image' && blogData[key] instanceof File) {
        formData.append('image', blogData[key]);
      } else if (key === 'tags' && Array.isArray(blogData[key])) {
        formData.append('tags', blogData[key].join(','));
      } else {
        formData.append(key, blogData[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/blogs/admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create blog');
    return response.json();
  }

  async updateBlog(blogId, blogData, token) {
    const formData = new FormData();
    
    Object.keys(blogData).forEach(key => {
      if (key === 'image' && blogData[key] instanceof File) {
        formData.append('image', blogData[key]);
      } else if (key === 'tags' && Array.isArray(blogData[key])) {
        formData.append('tags', blogData[key].join(','));
      } else {
        formData.append(key, blogData[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/blogs/admin/${blogId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update blog');
    return response.json();
  }

  async deleteBlog(blogId, token) {
    const response = await fetch(`${API_BASE_URL}/blogs/admin/${blogId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete blog');
    return response.json();
  }

  async getBlogStats(token) {
    const response = await fetch(`${API_BASE_URL}/blogs/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch blog stats');
    return response.json();
  }

  // Admin comment endpoints
  async getAllComments(params = {}, token) {
    const queryParams = new URLSearchParams(params).toString();
    console.log('Making request to:', `${API_BASE_URL}/blogs/admin/comments?${queryParams}`);
    console.log('With token:', token ? 'Present' : 'Missing');
    
    const response = await fetch(`${API_BASE_URL}/blogs/admin/comments?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`Failed to fetch comments: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  }

  async updateCommentStatus(commentId, status, token) {
    const response = await fetch(`${API_BASE_URL}/blogs/admin/comments/${commentId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update comment status');
    return response.json();
  }

  async deleteComment(commentId, token) {
    const response = await fetch(`${API_BASE_URL}/blogs/admin/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete comment');
    return response.json();
  }

  async getCommentStats(token) {
    const response = await fetch(`${API_BASE_URL}/blogs/admin/comments/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch comment stats');
    return response.json();
  }

  async bulkUpdateComments(commentIds, status, token) {
    const response = await fetch(`${API_BASE_URL}/blogs/admin/comments/bulk-update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ commentIds, status }),
    });
    if (!response.ok) throw new Error('Failed to bulk update comments');
    return response.json();
  }
}

export default new BlogAPI();
