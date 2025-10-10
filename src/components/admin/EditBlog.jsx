import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import QuillEditor from '../ui/QuillEditor';
import { useAuth } from '../../context/AuthContext';
import blogAPI from '../../services/blogAPI';
import { ArrowLeft, Save, Eye } from 'lucide-react';

const EditBlog = ({ blogId, onBack }) => {
  const { user, token } = useAuth();
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
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    { value: 'news', label: 'News' },
    { value: 'events', label: 'Events' },
    { value: 'updates', label: 'Updates' },
    { value: 'stories', label: 'Stories' },
    { value: 'announcements', label: 'Announcements' }
  ];

  // Fetch blog data for editing
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoadingBlog(true);
        const response = await blogAPI.getAllBlogs({ limit: 1000 }, token);
        const blog = response.blogs.find(b => b._id === blogId);
        
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
          setMessage({ type: 'danger', text: 'Blog not found' });
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setMessage({ type: 'danger', text: 'Failed to load blog data' });
      } finally {
        setLoadingBlog(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId, token]);

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
      setMessage({ type: 'danger', text: 'Title and content are required' });
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
      setMessage({ type: 'success', text: 'Blog updated successfully!' });
      
      // Clear form after successful update
      setTimeout(() => {
        if (onBack) onBack();
      }, 2000);
      
    } catch (error) {
      console.error('Error updating blog:', error);
      setMessage({ type: 'danger', text: error.message || 'Failed to update blog' });
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
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading blog data...</p>
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
            Back to Blogs
          </Button>
          <div>
            <h2 className="mb-1 fw-bold text-dark">Edit Blog Post</h2>
            <p className="text-muted mb-0 small">Update your blog post content and settings</p>
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
                <h5 className="card-title mb-4 text-dark fw-semibold">Blog Content</h5>
                
                {/* Title */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium text-dark">Title (English) *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter blog title..."
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
                      <Form.Label className="fw-medium text-dark">Title (Arabic)</Form.Label>
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
                      <Form.Label className="fw-medium text-dark">Excerpt (English)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder="Brief description of the blog post..."
                        className="border-2"
                        style={{ 
                          borderColor: '#e9ecef',
                          backgroundColor: '#f8f9fa'
                        }}
                      />
                      <Form.Text className="text-muted">
                        This will be shown in blog previews and search results
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium text-dark">Excerpt (Arabic)</Form.Label>
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
                  <Form.Label className="fw-medium text-dark">Content (English) *</Form.Label>
                  <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '1px' }}>
                    <QuillEditor
                      value={formData.content}
                      onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                      placeholder="Write your blog content here..."
                      style={{ 
                        minHeight: '350px',
                        backgroundColor: 'white',
                        borderRadius: '7px'
                      }}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium text-dark">Content (Arabic)</Form.Label>
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
                <h5 className="card-title mb-4 text-dark fw-semibold">Blog Settings</h5>

                {/* Status */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">Status</Form.Label>
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
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </Form.Select>
                </Form.Group>

                {/* Category */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">Category</Form.Label>
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
                        {cat.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Tags */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">Tags (English)</Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="tag1, tag2, tag3..."
                    className="border-2"
                    style={{ 
                      borderColor: '#e9ecef',
                      backgroundColor: '#f8f9fa'
                    }}
                  />
                  <Form.Text className="text-muted">
                    Separate tags with commas
                  </Form.Text>
                </Form.Group>

                {/* Arabic Tags */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">Tags (Arabic)</Form.Label>
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
                    label="Featured Post"
                    className="fw-medium"
                  />
                  <Form.Text className="text-muted">
                    Featured posts appear prominently on the homepage
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
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Update Blog Post
                      </>
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Image Card */}
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="card-title mb-3 text-dark fw-semibold">Featured Image</h5>
                
                {/* Current Image */}
                {currentImage && !imagePreview && (
                  <div className="mb-3">
                    <p className="small text-muted mb-2">Current Image:</p>
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
                    <p className="small text-muted mb-2">New Image Preview:</p>
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
                    Upload a new image to replace the current one (optional)
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
