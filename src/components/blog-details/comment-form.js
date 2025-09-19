import React, { useState } from "react";
import blogAPI from "../../services/blogAPI";

const CommentForm = ({ blogId, onCommentAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.content) {
      setMessage('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      const newComment = await blogAPI.createComment(blogId, formData);
      
      setMessage('Comment submitted successfully! It will be visible after approval.');
      setFormData({
        name: '',
        email: '',
        website: '',
        content: ''
      });
      
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (error) {
      setMessage('Failed to submit comment. Please try again.');
      console.error('Error submitting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="blog-details__title">Leave a comment</h3>
      <form onSubmit={handleSubmit} className="contact-form-validated contact-page__form form-one mb-80">
        <div className="form-group">
          <div className="form-control">
            <input 
              type="text" 
              name="name" 
              placeholder="Your Name *" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address *" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control form-control-full">
            <textarea 
              name="content" 
              placeholder="Write your comment *" 
              rows="5"
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-control form-control-full">
            <button type="submit" className="thm-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Comment'}
            </button>
          </div>
        </div>
      </form>
      {message && (
        <div className={`result ${message.includes('successfully') ? 'text-success' : 'text-danger'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CommentForm;
