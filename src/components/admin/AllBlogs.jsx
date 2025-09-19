import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit3, Eye, Trash2, Plus, MoreVertical, Calendar, User, Tag, BookOpen, FileText, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../context/AuthContext';
import blogAPI from '../../services/blogAPI';

const AllBlogs = () => {
  const { token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchBlogs();
  }, [filters, pagination.page]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      const response = await blogAPI.getAllBlogs(queryParams, token);
      setBlogs(response.blogs || []);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setMessage({ type: 'danger', text: 'Failed to fetch blogs. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleEdit = (blog) => {
    // Navigate to edit blog page or open edit modal
    window.location.href = `/admin/blog/edit/${blog._id}`;
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;

    try {
      await blogAPI.deleteBlog(blogToDelete._id, token);
      setMessage({ type: 'success', text: 'Blog deleted successfully!' });
      setShowDeleteModal(false);
      setBlogToDelete(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      setMessage({ type: 'danger', text: 'Failed to delete blog. Please try again.' });
    }
  };

  const handleStatusUpdate = async (blogId, newStatus) => {
    try {
      await blogAPI.updateBlog(blogId, { status: newStatus }, token);
      setMessage({ type: 'success', text: 'Blog status updated successfully!' });
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog status:', error);
      setMessage({ type: 'danger', text: 'Failed to update blog status. Please try again.' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Blog Management</h2>
          <p className="text-sm md:text-base text-muted-foreground">Manage and organize your blog content with ease</p>
        </div>
        
        <Button 
          onClick={() => window.location.href = '/admin/new-blog'}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Posts</p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text text-transparent">{blogs.length}</p>
              </div>
              <FileText className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text text-transparent">{blogs.filter(b => b.status === 'published').length}</p>
              </div>
              <Eye className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Draft Posts</p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text text-transparent">{blogs.filter(b => b.status === 'draft').length}</p>
              </div>
              <Edit3 className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text text-transparent">{blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}</p>
              </div>
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search blogs by title, content, author..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ target: { name: 'search', value: e.target.value } })}
                  className="pl-[30px]"
                />
              </div>
            </div>
            
            <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange({ target: { name: 'status', value: value === 'all' ? '' : value } })}>
              <SelectTrigger className="w-full sm:w-44 md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange({ target: { name: 'category', value: value === 'all' ? '' : value } })}>
              <SelectTrigger className="w-full sm:w-44 md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="updates">Updates</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="stories">Stories</SelectItem>
                <SelectItem value="announcements">Announcements</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      {message.text && (
        <Alert className={`border-0 shadow-sm ${
          message.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' :
          message.type === 'danger' ? 'border-red-200 bg-red-50 text-red-800' :
          'border-blue-200 bg-blue-50 text-blue-800'
        }`}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Blogs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({blogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading blog posts...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {filters.search || filters.status || filters.category ? 'No blogs match your filters.' : 'No blog posts added yet.'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{blog.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {blog.excerpt || 'No excerpt available'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{blog.author?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{blog.category || 'Uncategorized'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          blog.status === 'published' ? 'default' : 'secondary'
                        }>
                          {blog.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{blog.views || 0}</TableCell>
                      <TableCell>{formatDate(blog.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(blog)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(blog)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              className="border-muted hover:bg-muted/50"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              className="border-muted hover:bg-muted/50"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
          </DialogHeader>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-foreground mb-2">
                Are you sure you want to delete <strong>"{blogToDelete?.title}"</strong>?
              </p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. All comments and associated data will also be permanently deleted.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Blog Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllBlogs;