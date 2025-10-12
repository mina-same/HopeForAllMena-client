import React, { useState } from "react";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import blogAPI from "../../services/blogAPI";
import "./comment-form-rtl.css";

const CommentForm = ({ blogId, onCommentAdded }) => {
  const { t } = useTranslation('Blog');
  const { language: currentLanguage } = useI18next();
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
      setMessage(t('comments.required'));
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      const newComment = await blogAPI.createComment(blogId, formData);
      
      setMessage(t('comments.success'));
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
      setMessage(t('comments.error'));
      console.error('Error submitting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={currentLanguage === 'ar' ? 'rtl-comment-form' : ''} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className={`blog-details__title ${currentLanguage === 'ar' ? 'text-right' : ''}`}>{t('comments.addComment')}</h3>
      <form onSubmit={handleSubmit} className="contact-form-validated contact-page__form form-one mb-80">
        <div className="form-group">
          <div className="form-control">
            <input 
              type="text" 
              name="name" 
              placeholder={t('comments.name')}
              value={formData.name}
              onChange={handleChange}
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              required
            />
          </div>
          <div className="form-control">
            <input 
              type="email" 
              name="email" 
              placeholder={t('comments.email')}
              value={formData.email}
              onChange={handleChange}
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              required
            />
          </div>
          <div className="form-control form-control-full">
            <textarea 
              name="content" 
              placeholder={t('comments.message')}
              rows="5"
              value={formData.content}
              onChange={handleChange}
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              required
            ></textarea>
          </div>
          <div className="form-control form-control-full">
            <button type="submit" className="thm-btn" disabled={loading}>
              {loading ? t('comments.submitting') : t('comments.submit')}
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
