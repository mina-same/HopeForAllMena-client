import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import NewBlog from './NewBlog';
import AllBlogs from './AllBlogs';
import CommentsManagement from './CommentsManagement';

const BlogManagement = ({ activeTab: propActiveTab }) => {
  const [activeTab, setActiveTab] = useState(propActiveTab || 'new-blog');

  useEffect(() => {
    if (propActiveTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="admin-header mb-4">
            <h2>Blog Management</h2>
            <p className="text-muted">Manage your blog posts, comments, and content</p>
          </div>

          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav variant="tabs" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="new-blog">
                  <i className="fas fa-plus-circle me-2"></i>
                  New Blog
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="all-blogs">
                  <i className="fas fa-list me-2"></i>
                  All Blogs
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="comments">
                  <i className="fas fa-comments me-2"></i>
                  Comments
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="new-blog">
                <NewBlog />
              </Tab.Pane>
              <Tab.Pane eventKey="all-blogs">
                <AllBlogs />
              </Tab.Pane>
              <Tab.Pane eventKey="comments">
                <CommentsManagement />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogManagement;
