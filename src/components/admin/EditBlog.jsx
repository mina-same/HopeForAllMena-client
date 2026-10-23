import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import QuillEditor from '../ui/QuillEditor';
import { useAuth } from '../../context/AuthContext';
import blogAPI from '../../services/blogAPI';
import { ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const EditBlog = ({ blogId, onBack }) => {
  const { t } = useTranslation('NewBlog');
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    content: '',
    contentAr: '',
    excerpt: '',
    excerptAr: '',
    category: 'news',
    tags: '',
    tagsAr: '',
    status: 'draft',
    featured: false
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializedId, setInitializedId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    { value: 'news', label: 'News' },
    { value: 'events', label: 'Events' },
    { value: 'updates', label: 'Updates' },
    { value: 'stories', label: 'Stories' },
    { value: 'announcements', label: 'Announcements' }
  ];

  // The API has no admin get-by-id, so the blog is looked up in the full list
  const blogsQuery = useQuery({
    queryKey: ['blogs', { limit: 1000 }],
    queryFn: () => blogAPI.getAllBlogs({ limit: 1000 }, token),
    enabled: !!blogId
  });
  const loadingBlog = blogsQuery.isPending || (blogsQuery.isSuccess && initializedId !== blogId);

  // Copy the blog into the form once per id so refetches don't overwrite edits
  useEffect(() => {
    if (!blogsQuery.isSuccess || initializedId === blogId) return;
    const blog = blogsQuery.data?.blogs?.find(b => b._id === blogId);

    if (blog) {
      setFormData({
        title: blog.title || '',
        titleAr: blog.titleAr || '',
        content: blog.content || '',
        contentAr: blog.contentAr || '',
        excerpt: blog.excerpt || '',
        excerptAr: blog.excerptAr || '',
        category: blog.category || 'news',
        tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
        tagsAr: Array.isArray(blog.tagsAr) ? blog.tagsAr.join(', ') : (blog.tagsAr || ''),
        status: blog.status || 'draft',
        featured: blog.featured || false
      });
      setCurrentImage(blog.image);
    } else {
      setMessage({ type: 'danger', text: t('edit.notFound') });
    }
    setInitializedId(blogId);
  }, [blogsQuery.isSuccess, blogsQuery.data, blogId, initializedId]);

  useEffect(() => {
    if (blogsQuery.isError) {
      console.error('Error fetching blog:', blogsQuery.error);
      setMessage({ type: 'danger', text: t('edit.loadFailed') });
    }
  }, [blogsQuery.isError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setMessage({ type: 'danger', text: t('edit.required') });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        tagsAr: formData.tagsAr.split(',').map(tag => tag.trim()).filter(tag => tag),
        author: user._id
      };

      if (image) {
        blogData.image = image;
      }

      await blogAPI.updateBlog(blogId, blogData, token);
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setMessage({ type: 'success', text: 'Blog updated successfully!' });
      
      // Clear form after successful update
      setTimeout(() => {
        if (onBack) onBack();
      }, 2000);
      
    } catch (error) {
      console.error('Error updating blog:', error);
      setMessage({ type: 'danger', text: error.message || t('edit.updateFailed') });
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  if (loadingBlog) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">{t('edit.loading')}</span>
          </div>
          <p className="text-muted">{t('edit.loadingData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onBack}
            className="d-flex align-items-center gap-2"
          >
            <ArrowLeft size={16} />
            {t('edit.back')}
          </Button>
          <div>
            <h2 className="mb-1 fw-bold text-dark">{t('edit.title')}</h2>
            <p className="text-muted mb-0 small">{t('edit.subtitle')}</p>
          </div>
        </div>
      </div>

      {message.text && (
        <Alert variant={message.type} className="mb-4">
          {message.text}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            {/* Main Content Card */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h5 className="card-title mb-4 text-dark fw-semibold">{t('edit.content')}</h5>
                
                {/* Title */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium text-dark">{t('edit.titleEn')}</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder={t('edit.titlePh')}
                        required
                        className="form-control-lg border-2"
                        style={{ 
                          borderColor: '#e9ecef',
                          backgroundColor: '#f8f9fa'
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium text-dark">{t('edit.titleAr')}</Form.Label>
                      <Form.Control
                        type="text"
                        name="titleAr"
                        value={formData.titleAr}
                        onChange={handleChange}
                        placeholder="أدخل عنوان المقال باللغة العربية..."
                        className="form-control-lg border-2"
                        style={{ 
                          borderColor: '#e9ecef',
                          backgroundColor: '#f8f9fa',
                          direction: 'rtl'
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Excerpt */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium text-dark">{t('edit.excerptEn')}</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder={t('edit.excerptPh')}
                        className="border-2"
                        style={{ 
                          borderColor: '#e9ecef',
                          backgroundColor: '#f8f9fa'
                        }}
                      />
                      <Form.Text className="text-muted">
                        {t('edit.excerptHint')}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium text-dark">{t('edit.excerptAr')}</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="excerptAr"
                        value={formData.excerptAr}
                        onChange={handleChange}
                        placeholder="وصف مختصر للمقال..."
                        className="border-2"
                        style={{ 
                          borderColor: '#e9ecef',
                          backgroundColor: '#f8f9fa',
                          direction: 'rtl'
                        }}
                      />
                      <Form.Text className="text-muted">
                        سيظهر في معاينات المقالات ونتائج البحث
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Content */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium text-dark">{t('edit.contentEn')}</Form.Label>
                  <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '1px' }}>
                    <QuillEditor
                      value={formData.content}
                      onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                      placeholder={t('edit.contentPh')}
                      style={{ 
                        minHeight: '350px',
                        backgroundColor: 'white',
                        borderRadius: '7px'
                      }}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium text-dark">{t('edit.contentAr')}</Form.Label>
                  <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '1px' }}>
                    <QuillEditor
                      value={formData.contentAr}
                      onChange={(content) => setFormData(prev => ({ ...prev, contentAr: content }))}
                      placeholder="اكتب محتوى المقال هنا..."
                      style={{ 
                        minHeight: '350px',
                        backgroundColor: 'white',
                        borderRadius: '7px',
                        direction: 'rtl'
                      }}
                    />
                  </div>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Settings Card */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h5 className="card-title mb-4 text-dark fw-semibold">{t('edit.settings')}</h5>

                {/* Status */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">{t('edit.status')}</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="border-2"
                    style={{ 
                      borderColor: '#e9ecef',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    <option value="draft">{t('edit.draft')}</option>
                    <option value="published">{t('edit.published')}</option>
                  </Form.Select>
                </Form.Group>

                {/* Category */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">{t('edit.category')}</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="border-2"
                    style={{ 
                      borderColor: '#e9ecef',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {t(`categories.${cat.value}`, cat.label)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Tags */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">{t('edit.tagsEn')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder={t('edit.tagsPh')}
                    className="border-2"
                    style={{ 
                      borderColor: '#e9ecef',
                      backgroundColor: '#f8f9fa'
                    }}
                  />
                  <Form.Text className="text-muted">
                    {t('edit.tagsHint')}
                  </Form.Text>
                </Form.Group>

                {/* Arabic Tags */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">{t('edit.tagsAr')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="tagsAr"
                    value={formData.tagsAr}
                    onChange={handleChange}
                    placeholder="علامة1، علامة2، علامة3..."
                    className="border-2"
                    style={{ 
                      borderColor: '#e9ecef',
                      backgroundColor: '#f8f9fa',
                      direction: 'rtl'
                    }}
                  />
                  <Form.Text className="text-muted">
                    افصل العلامات بفواصل
                  </Form.Text>
                </Form.Group>

                {/* Featured */}
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    label={t('edit.featuredPost')}
                    className="fw-medium"
                  />
                  <Form.Text className="text-muted">
                    {t('edit.featuredHint')}
                  </Form.Text>
                </Form.Group>

                {/* Submit Button */}
                <div className="d-grid">
                  <Button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: '#2194D1',
                      borderColor: '#2194D1',
                      padding: '12px 24px',
                      fontWeight: '600'
                    }}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">{t('edit.loading')}</span>
                        </div>
                        {t('edit.updating')}
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        {t('edit.update')}
                      </>
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Image Card */}
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="card-title mb-3 text-dark fw-semibold">{t('edit.featuredImage')}</h5>
                
                {/* Current Image */}
                {currentImage && !imagePreview && (
                  <div className="mb-3">
                    <p className="small text-muted mb-2">{t('edit.currentImage')}</p>
                    <img
                      src={currentImage}
                      alt="Current blog"
                      className="img-fluid rounded"
                      style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
                    />
                  </div>
                )}

                {/* New Image Preview */}
                {imagePreview && (
                  <div className="mb-3">
                    <p className="small text-muted mb-2">{t('edit.newImagePreview')}</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid rounded"
                      style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
                    />
                  </div>
                )}

                <Form.Group>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border-2"
                    style={{ 
                      borderColor: '#e9ecef',
                      backgroundColor: '#f8f9fa'
                    }}
                  />
                  <Form.Text className="text-muted">
                    {t('edit.imageHint')}
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditBlog;
