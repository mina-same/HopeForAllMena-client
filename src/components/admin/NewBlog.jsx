import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from '../../context/AuthContext';
import blogAPI from '../../services/blogAPI';

const NewBlog = () => {
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    { value: 'news', label: 'News' },
    { value: 'events', label: 'Events' },
    { value: 'updates', label: 'Updates' },
    { value: 'stories', label: 'Stories' },
    { value: 'announcements', label: 'Announcements' }
  ];

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

    if (!formData.title || !formData.content || !formData.excerpt) {
      setMessage({ type: 'danger', text: 'Please fill in all required English fields.' });
      return;
    }

    if (!image) {
      setMessage({ type: 'danger', text: 'Please select an image for the blog post.' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const blogData = {
        ...formData,
        image,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        tagsAr: formData.tagsAr.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await blogAPI.createBlog(blogData, token);

      setMessage({ type: 'success', text: 'Blog post created successfully!' });

      // Reset form
      setFormData({
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
      setImage(null);
      setImagePreview(null);

    } catch (error) {
      setMessage({ type: 'danger', text: error.message || 'Failed to create blog post.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-admin-container">
      <div className="admin-header mb-4">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="admin-title mb-1">Create New Blog Post</h2>
            <p className="admin-subtitle text-muted mb-0">Share your stories and updates with the world</p>
          </div>
          <div className="admin-actions">
            <Button variant="outline-secondary" className="me-2">
              <i className="fas fa-eye me-2"></i>Preview
            </Button>
            <Button variant="outline-primary">
              <i className="fas fa-save me-2"></i>Save Draft
            </Button>
          </div>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="modern-card border-0 shadow-sm">
            <Card.Body className="p-4">
              {message.text && (
                <Alert
                  variant={message.type}
                  onClose={() => setMessage({ type: '', text: '' })}
                  dismissible
                  className="modern-alert border-0 rounded-3"
                >
                  <div className="d-flex align-items-center">
                    <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : message.type === 'danger' ? 'fa-exclamation-triangle' : 'fa-info-circle'} me-2`}></i>
                    {message.text}
                  </div>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="modern-label fw-semibold mb-2">
                        <i className="fas fa-heading me-2 text-[#2194D1]"></i>Title (English) *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter an engaging blog title..."
                        required
                        className="modern-input border-0 shadow-sm rounded-3 p-3"
                        style={{ fontSize: '1.1rem', color: formData.title ? '#1f2937' : '#6b7280' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="modern-label fw-semibold mb-2">
                        <i className="fas fa-heading me-2 text-[#2194D1]"></i>Title (Arabic)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="titleAr"
                        value={formData.titleAr}
                        onChange={handleChange}
                        placeholder="أدخل عنوان المقال باللغة العربية..."
                        className="modern-input border-0 shadow-sm rounded-3 p-3"
                        style={{ fontSize: '1.1rem', color: formData.titleAr ? '#1f2937' : '#6b7280', direction: 'rtl' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="modern-label fw-semibold mb-2">
                        <i className="fas fa-align-left me-2 text-[#2194D1]"></i>Excerpt (English) *
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder="Write a compelling summary that will attract readers..."
                        style={{ color: formData.excerpt ? '#1f2937' : '#6b7280' }}
                        maxLength={200}
                        required
                        className="modern-textarea border-0 shadow-sm rounded-3 p-3"
                      />
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <Form.Text className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>This will appear in blog previews
                        </Form.Text>
                        <Badge bg={formData.excerpt.length > 180 ? 'warning' : 'secondary'}>
                          {formData.excerpt.length}/200
                        </Badge>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="modern-label fw-semibold mb-2">
                        <i className="fas fa-align-left me-2 text-[#2194D1]"></i>Excerpt (Arabic)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="excerptAr"
                        value={formData.excerptAr}
                        onChange={handleChange}
                        placeholder="اكتب ملخصاً جذاباً سيجذب القراء..."
                        style={{ color: formData.excerptAr ? '#1f2937' : '#6b7280', direction: 'rtl' }}
                        maxLength={200}
                        className="modern-textarea border-0 shadow-sm rounded-3 p-3"
                      />
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <Form.Text className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>سيظهر في معاينات المقالات
                        </Form.Text>
                        <Badge bg={formData.excerptAr.length > 180 ? 'warning' : 'secondary'}>
                          {formData.excerptAr.length}/200
                        </Badge>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-4">
                      <Form.Label className="modern-label fw-semibold mb-2">
                        <i className="fas fa-folder me-2 text-[#2194D1]"></i>Category *
                      </Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="modern-select border-0 shadow-sm rounded-3 p-3"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="modern-label fw-semibold mb-2">
                        <i className="fas fa-align-left me-2 text-[#2194D1]"></i>Excerpt (English) *
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder="Write a compelling summary that will attract readers..."
                        style={{ color: formData.excerpt ? '#1f2937' : '#6b7280' }}
                        maxLength={200}
                        required
                        className="modern-textarea border-0 shadow-sm rounded-3 p-3"
                      />
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <Form.Text className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>This will appear in blog previews
                        </Form.Text>
                        <Badge bg={formData.excerpt.length > 180 ? 'warning' : 'secondary'}>
                          {formData.excerpt.length}/200
                        </Badge>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="modern-label fw-semibold mb-2">
                        <i className="fas fa-align-left me-2 text-[#2194D1]"></i>Excerpt (Arabic)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="excerptAr"
                        value={formData.excerptAr}
                        onChange={handleChange}
                        placeholder="اكتب ملخصاً جذاباً سيجذب القراء..."
                        style={{ 
                          color: formData.excerptAr ? '#1f2937' : '#6b7280',
                          direction: 'rtl'
                        }}
                        maxLength={200}
                        className="modern-textarea border-0 shadow-sm rounded-3 p-3"
                      />
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <Form.Text className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>سيظهر في معاينات المقالات
                        </Form.Text>
                        <Badge bg={formData.excerptAr.length > 180 ? 'warning' : 'secondary'}>
                          {formData.excerptAr.length}/200
                        </Badge>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="modern-label fw-semibold mb-3">
                    <i className="fas fa-edit me-2 text-[#2194D1]"></i>Content (English) *
                  </Form.Label>
                  <div className="modern-editor-container">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                      placeholder="Tell your story... Use the toolbar above to format your content."
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          [{ 'script': 'sub'}, { 'script': 'super' }],
                          [{ 'indent': '-1'}, { 'indent': '+1' }],
                          [{ 'color': [] }, { 'background': [] }],
                          [{ 'align': [] }],
                          ['link', 'image', 'video'],
                          ['clean']
                        ]
                      }}
                      style={{ height: '350px', marginBottom: '60px' }}
                      className="modern-editor border-0 shadow-sm rounded-3"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="modern-label fw-semibold mb-3">
                    <i className="fas fa-edit me-2 text-[#2194D1]"></i>Content (Arabic)
                  </Form.Label>
                  <div className="modern-editor-container">
                    <ReactQuill
                      theme="snow"
                      value={formData.contentAr}
                      onChange={(value) => setFormData(prev => ({ ...prev, contentAr: value }))}
                      placeholder="احك قصتك... استخدم شريط الأدوات أعلاه لتنسيق المحتوى."
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          [{ 'script': 'sub'}, { 'script': 'super' }],
                          [{ 'indent': '-1'}, { 'indent': '+1' }],
                          [{ 'direction': 'rtl' }],
                          [{ 'color': [] }, { 'background': [] }],
                          [{ 'align': [] }],
                          ['link', 'image', 'video'],
                          ['clean']
                        ]
                      }}
                      style={{ height: '350px', marginBottom: '60px', direction: 'rtl' }}
                      className="modern-editor border-0 shadow-sm rounded-3"
                    />
                  </div>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="modern-label fw-semibold mb-2">
                        <i className="fas fa-tags me-2 text-[#2194D1]"></i>Tags (English)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="charity, education, community, impact..."
                        className="modern-input border-0 shadow-sm rounded-3 p-3"
                      />
                      <Form.Text className="text-muted d-flex align-items-center mt-2">
                        <i className="fas fa-lightbulb me-1"></i>
                        Use relevant tags to help readers discover your content
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="modern-label fw-semibold mb-2">
                        <i className="fas fa-tags me-2 text-[#2194D1]"></i>Tags (Arabic)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="tagsAr"
                        value={formData.tagsAr}
                        onChange={handleChange}
                        placeholder="خيرية، تعليم، مجتمع، تأثير..."
                        className="modern-input border-0 shadow-sm rounded-3 p-3"
                        style={{ direction: 'rtl' }}
                      />
                      <Form.Text className="text-muted d-flex align-items-center mt-2">
                        <i className="fas fa-lightbulb me-1"></i>
                        استخدم علامات ذات صلة لمساعدة القراء في اكتشاف المحتوى
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="modern-label fw-semibold mb-2">
                    <i className="fas fa-image me-2 text-[#2194D1]"></i>Featured Image *
                  </Form.Label>
                  <div className="modern-file-upload">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      className="modern-file-input border-0 shadow-sm rounded-3 p-3"
                    />
                    {imagePreview ? (
                      <div className="mt-3 text-center">
                        <div className="image-preview-container position-relative d-inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-fluid rounded-3 shadow-sm"
                            style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'cover' }}
                          />
                          <Badge bg="success" className="position-absolute top-0 start-0 m-2">
                            <i className="fas fa-check me-1"></i>Ready
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 text-center text-muted">
                        <i className="fas fa-cloud-upload-alt fa-2x mb-2"></i>
                        <p className="mb-0">Upload a high-quality image (recommended: 800x600px)</p>
                      </div>
                    )}
                  </div>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="modern-label fw-semibold mb-2">
                        <i className="fas fa-globe me-2 text-[#2194D1]"></i>Publication Status
                      </Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="modern-select border-0 shadow-sm rounded-3 p-3"
                      >
                        <option value="draft">📝 Draft - Save for later</option>
                        <option value="published">🌍 Published - Make it live</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <div className="modern-checkbox-container p-3 border rounded-3 bg-light">
                        <Form.Check
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          label="⭐ Featured Post"
                          className="modern-checkbox"
                        />
                        <Form.Text className="text-muted d-block mt-1">
                          Featured posts appear prominently on the homepage
                        </Form.Text>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="modern-form-actions d-flex justify-content-between align-items-center pt-4 border-top">
                  <div className="d-flex align-items-center text-muted">
                    <i className="fas fa-info-circle me-2"></i>
                    <small>Your progress is automatically saved</small>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-secondary"
                      type="button"
                      className="modern-btn-secondary px-4 py-2"
                      disabled={loading}
                    >
                      <i className="fas fa-save me-2"></i>Save Draft
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                      className="modern-btn-primary px-4 py-2"
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>Publish Post
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <div className="sticky-top" style={{ top: '2rem' }}>
            <Card className="modern-card border-0 shadow-sm mb-4">
              <Card.Header className="bg-[#ECF2FF] text-white border-0 rounded-top">
                <h6 className="mb-0 fw-semibold">
                  <i className="fas fa-lightbulb me-2"></i>Publishing Guidelines
                </h6>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="guideline-section mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="guideline-icon bg-[#ECF2FF] bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-pen-fancy text-[#2194D1]"></i>
                    </div>
                    <h6 className="mb-0 fw-semibold">Content Tips</h6>
                  </div>
                  <ul className="modern-list list-unstyled">
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Write engaging and informative content</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Use clear and concise language</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Include relevant images</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Add appropriate tags for discoverability</li>
                  </ul>
                </div>

                <div className="guideline-section mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="guideline-icon bg-info bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-image text-info"></i>
                    </div>
                    <h6 className="mb-0 fw-semibold">Image Requirements</h6>
                  </div>
                  <div className="modern-specs">
                    <div className="spec-item d-flex justify-content-between mb-2">
                      <span className="text-muted">Size:</span>
                      <Badge bg="light" text="dark">800x600px</Badge>
                    </div>
                    <div className="spec-item d-flex justify-content-between mb-2">
                      <span className="text-muted">Format:</span>
                      <Badge bg="light" text="dark">JPG, PNG, WebP</Badge>
                    </div>
                    <div className="spec-item d-flex justify-content-between">
                      <span className="text-muted">Max Size:</span>
                      <Badge bg="light" text="dark">5MB</Badge>
                    </div>
                  </div>
                </div>

                <div className="guideline-section">
                  <div className="d-flex align-items-center mb-3">
                    <div className="guideline-icon bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-globe text-warning"></i>
                    </div>
                    <h6 className="mb-0 fw-semibold">Publication Status</h6>
                  </div>
                  <div className="status-options">
                    <div className="status-item d-flex align-items-center justify-content-between p-2 rounded mb-2 bg-light">
                      <div className="d-flex align-items-center">
                        <Badge bg="secondary" className="me-2">Draft</Badge>
                        <small className="text-muted">Private & editable</small>
                      </div>
                      <i className="fas fa-eye-slash text-muted"></i>
                    </div>
                    <div className="status-item d-flex align-items-center justify-content-between p-2 rounded bg-light">
                      <div className="d-flex align-items-center">
                        <Badge bg="success" className="me-2">Published</Badge>
                        <small className="text-muted">Live & visible</small>
                      </div>
                      <i className="fas fa-eye text-success"></i>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="modern-card border-0 shadow-sm">
              <Card.Body className="p-4 text-center">
                <div className="mb-3">
                  <i className="fas fa-rocket fa-2x text-[#2194D1] mb-2"></i>
                  <h6 className="fw-semibold">Ready to Publish?</h6>
                </div>
                <p className="text-muted small mb-3">
                  Your blog post will be reviewed and published within 24 hours.
                </p>
                <Button variant="outline-primary" size="sm" className="w-100">
                  <i className="fas fa-question-circle me-2"></i>Need Help?
                </Button>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

// Add custom styles
const customStyles = `
  .modern-admin-container {
    background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
    min-height: 100vh;
    padding: 2rem;
  }
  
  .admin-header {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 2px 20px rgba(0,0,0,0.08);
  }
  
  .admin-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .admin-subtitle {
    font-size: 1.1rem;
  }
  
  .modern-card {
    border-radius: 1rem !important;
    transition: all 0.3s ease;
  }
  
  .modern-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
  }
  
  .modern-label {
    color: #4a5568;
    font-size: 0.95rem;
  }
  
  .modern-input, .modern-select, .modern-textarea {
    border-radius: 0.75rem !important;
    transition: all 0.3s ease;
    font-size: 0.95rem;
  }
  
  .modern-input:focus, .modern-select:focus, .modern-textarea:focus {
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    border-color: #667eea !important;
  }
  
  .modern-editor .ql-toolbar {
    border-radius: 0.75rem 0.75rem 0 0 !important;
    border: none !important;
    background: #f8f9fa;
  }
  
  .modern-editor .ql-container {
    border-radius: 0 0 0.75rem 0.75rem !important;
    border: none !important;
  }
  
  .modern-btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .modern-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  
  .modern-btn-secondary {
    border-radius: 0.75rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .modern-alert {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  }
  
  .guideline-section {
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 1.5rem;
  }
  
  .guideline-section:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .modern-list li {
    font-size: 0.9rem;
    color: #4a5568;
  }
  
  .modern-specs .spec-item {
    font-size: 0.9rem;
  }
  
  .status-item {
    transition: all 0.2s ease;
  }
  
  .status-item:hover {
    background-color: #f1f5f9 !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

export default NewBlog;
