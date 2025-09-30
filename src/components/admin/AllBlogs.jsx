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
import { Link } from 'gatsby';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { graphql } from 'gatsby';
import { useAuth } from '../../context/AuthContext';
import blogAPI from '../../services/blogAPI';

const AllBlogs = () => {
  const { token } = useAuth();
  const { t } = useTranslation('BlogsManagement');
  const { language: currentLanguage } = useI18next();
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
  }, [filters, pagination.page, currentLanguage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        language: currentLanguage,
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
      setMessage({ type: 'danger', text: t('messages.fetchError') });
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
    // Navigate to edit blog page using Gatsby Link
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
      setMessage({ type: 'success', text: t('messages.deleteSuccess') });
      setShowDeleteModal(false);
      setBlogToDelete(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      setMessage({ type: 'danger', text: t('messages.deleteError') });
    }
  };

  const handleStatusUpdate = async (blogId, newStatus) => {
    try {
      await blogAPI.updateBlog(blogId, { status: newStatus }, token);
      setMessage({ type: 'success', text: t('messages.statusUpdateSuccess') });
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog status:', error);
      setMessage({ type: 'danger', text: t('messages.statusUpdateError') });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US');
  };

  return (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${currentLanguage === 'ar' ? 'sm:flex-row' : ''}`}>
        <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('title')}</h2>
          <p className="text-sm md:text-base text-muted-foreground">{t('description')}</p>
        </div>
        
        <Button 
          onClick={() => window.location.href = '/admin/new-blog'}
          className={`bg-primary hover:bg-primary/90 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}
        >
          <Plus className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
          {t('addBlog')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{t('stats.totalPosts')}</p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text ">{blogs.length}</p>
              </div>
              <FileText className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{t('stats.published')}</p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text ">{blogs.filter(b => b.status === 'published').length}</p>
              </div>
              <Eye className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{t('stats.draftPosts')}</p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text ">{blogs.filter(b => b.status === 'draft').length}</p>
              </div>
              <Edit3 className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{t('stats.totalViews')}</p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text ">{blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}</p>
              </div>
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-4 md:p-6">
          <div className={`flex flex-col sm:flex-row gap-3 md:gap-4 ${currentLanguage === 'ar' ? 'sm:flex-row' : ''}`}>
            <div className="flex-1">
              <div className="relative">
                <Search className={`h-4 w-4 absolute top-3 text-muted-foreground ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={t('filters.searchPlaceholder')}
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ target: { name: 'search', value: e.target.value } })}
                  className={currentLanguage === 'ar' ? 'pr-[30px] text-right' : 'pl-[30px]'}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            
            <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange({ target: { name: 'status', value: value === 'all' ? '' : value } })}>
              <SelectTrigger className="w-full sm:w-44 md:w-48">
                <SelectValue placeholder={t('filters.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.status.all')}</SelectItem>
                <SelectItem value="published">{t('filters.status.published')}</SelectItem>
                <SelectItem value="draft">{t('filters.status.draft')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange({ target: { name: 'category', value: value === 'all' ? '' : value } })}>
              <SelectTrigger className="w-full sm:w-44 md:w-48">
                <SelectValue placeholder={t('filters.filterByCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.category.all')}</SelectItem>
                <SelectItem value="news">{t('filters.category.news')}</SelectItem>
                <SelectItem value="updates">{t('filters.category.updates')}</SelectItem>
                <SelectItem value="events">{t('filters.category.events')}</SelectItem>
                <SelectItem value="stories">{t('filters.category.stories')}</SelectItem>
                <SelectItem value="announcements">{t('filters.category.announcements')}</SelectItem>
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
          <CardTitle>{t('table.title', { count: blogs.length })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('loading.blogs')}</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {filters.search || filters.status || filters.category ? t('empty.noResults') : t('empty.noBlogs')}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.title')}</TableHead>
                    <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.author')}</TableHead>
                    <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.category')}</TableHead>
                    <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.status')}</TableHead>
                    <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.views')}</TableHead>
                    <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.date')}</TableHead>
                    <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog._id}>
                      <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                        <div>
                          <p className="font-medium">
                            {currentLanguage === 'ar' && blog.titleAr ? blog.titleAr : blog.title}
                          </p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                            {currentLanguage === 'ar' && blog.excerptAr ? blog.excerptAr : (blog.excerpt || t('table.noExcerpt'))}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{blog.author?.name || t('table.unknownAuthor')}</TableCell>
                      <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                        <Badge variant="secondary">{t(`filters.category.${blog.category}`) || t('table.uncategorized')}</Badge>
                      </TableCell>
                      <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                        <Badge variant={
                          blog.status === 'published' ? 'default' : 'secondary'
                        }>
                          {t(`status.${blog.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{blog.views || 0}</TableCell>
                      <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{formatDate(blog.createdAt)}</TableCell>
                      <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                        <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(blog)}
                            title={t('actions.edit')}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(blog)}
                            className="text-destructive hover:text-destructive"
                            title={t('actions.delete')}
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
        <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
          <p className={`text-sm text-muted-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
            {t('pagination.showing', {
              start: ((pagination.page - 1) * pagination.limit) + 1,
              end: Math.min(pagination.page * pagination.limit, pagination.total),
              total: pagination.total
            })}
          </p>
          <div className={`flex ${currentLanguage === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              className="border-muted hover:bg-muted/50"
            >
              {t('pagination.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              className="border-muted hover:bg-muted/50"
            >
              {t('pagination.next')}
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