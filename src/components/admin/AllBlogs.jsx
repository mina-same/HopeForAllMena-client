import React, { useState, useEffect, useCallback } from 'react';
import { Search, Edit3, Eye, Trash2, Plus, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
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

  const fetchBlogs = useCallback(async () => {
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
  }, [filters, pagination.page, pagination.limit, currentLanguage, token, t]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

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
      <Card className="border-0 shadow-modern">
        <CardHeader className="pb-4">
          <CardTitle className={`text-lg font-semibold ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
            {t('table.title', { count: blogs.length })}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground text-sm">{t('loading.blogs')}</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <FileText className="h-16 w-16 mb-4 text-muted-foreground opacity-40" />
              <p className="text-muted-foreground text-center max-w-md">
                {filters.search || filters.status || filters.category ? t('empty.noResults') : t('empty.noBlogs')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/50">
                      <TableHead className={`font-medium text-xs uppercase tracking-wider ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                        {t('table.headers.title')}
                      </TableHead>
                      <TableHead className={`font-medium text-xs uppercase tracking-wider ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                        {t('table.headers.author')}
                      </TableHead>
                      <TableHead className={`font-medium text-xs uppercase tracking-wider ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                        {t('table.headers.category')}
                      </TableHead>
                      <TableHead className={`font-medium text-xs uppercase tracking-wider ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                        {t('table.headers.status')}
                      </TableHead>
                      <TableHead className={`font-medium text-xs uppercase tracking-wider ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                        {t('table.headers.views')}
                      </TableHead>
                      <TableHead className={`font-medium text-xs uppercase tracking-wider ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                        {t('table.headers.date')}
                      </TableHead>
                      <TableHead className={`font-medium text-xs uppercase tracking-wider ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                        {t('table.headers.actions')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs.map((blog) => (
                      <TableRow key={blog._id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                        <TableCell className={`py-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          <div className="space-y-1">
                            <p className="font-medium text-sm leading-tight" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                              {currentLanguage === 'ar' && blog.titleAr ? blog.titleAr : blog.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2 max-w-xs" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                              {currentLanguage === 'ar' && blog.excerptAr ? blog.excerptAr : (blog.excerpt || t('table.noExcerpt'))}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className={`py-4 text-sm ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          {blog.author?.name || t('table.unknownAuthor')}
                        </TableCell>
                        <TableCell className={`py-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          <Badge variant="secondary" className="text-xs font-medium">
                            {t(`filters.category.${blog.category}`) || t('table.uncategorized')}
                          </Badge>
                        </TableCell>
                        <TableCell className={`py-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          <Badge 
                            variant={blog.status === 'published' ? 'default' : 'secondary'}
                            className="text-xs font-medium"
                          >
                            {t(`status.${blog.status}`)}
                          </Badge>
                        </TableCell>
                        <TableCell className={`py-4 text-sm font-medium ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          {blog.views || 0}
                        </TableCell>
                        <TableCell className={`py-4 text-sm ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          {formatDate(blog.createdAt)}
                        </TableCell>
                        <TableCell className={`py-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          <div className={`flex items-center gap-1 ${currentLanguage === 'ar' ? 'flex-row-reverse justify-start' : 'justify-start'}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(blog)}
                              className="h-8 w-8 p-0 hover:bg-muted"
                              title={t('actions.edit')}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteClick(blog)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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
              </div>

              {/* Mobile Cards */}
              <div className="block md:hidden space-y-4 p-4">
                {blogs.map((blog) => (
                  <Card key={blog._id} className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-3">
                      {/* Title and Excerpt */}
                      <div className={`space-y-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                        <h3 className="font-medium text-sm leading-tight" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                          {currentLanguage === 'ar' && blog.titleAr ? blog.titleAr : blog.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                          {currentLanguage === 'ar' && blog.excerptAr ? blog.excerptAr : (blog.excerpt || t('table.noExcerpt'))}
                        </p>
                      </div>

                      {/* Meta Information */}
                      <div className={`grid grid-cols-2 gap-3 text-xs ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                        <div>
                          <span className="text-muted-foreground">{t('table.headers.author')}: </span>
                          <span className="font-medium">{blog.author?.name || t('table.unknownAuthor')}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('table.headers.views')}: </span>
                          <span className="font-medium">{blog.views || 0}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('table.headers.date')}: </span>
                          <span className="font-medium">{formatDate(blog.createdAt)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('table.headers.category')}: </span>
                          <Badge variant="secondary" className="text-xs">
                            {t(`filters.category.${blog.category}`) || t('table.uncategorized')}
                          </Badge>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className={`flex items-center justify-between pt-2 border-t border-border/30 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Badge 
                          variant={blog.status === 'published' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {t(`status.${blog.status}`)}
                        </Badge>
                        <div className={`flex items-center gap-1 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(blog)}
                            className="h-8 w-8 p-0 hover:bg-muted"
                            title={t('actions.edit')}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(blog)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title={t('actions.delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
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
        <DialogContent className={currentLanguage === 'ar' ? 'rtl' : 'ltr'} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('deleteModal.title')}</DialogTitle>
          </DialogHeader>
          <div className={`flex items-start ${currentLanguage === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div className={`flex-1 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
              <p className="text-foreground mb-2" dangerouslySetInnerHTML={{
                __html: t('deleteModal.description', { 
                  title: currentLanguage === 'ar' && blogToDelete?.titleAr ? blogToDelete.titleAr : blogToDelete?.title 
                })
              }} />
              <p className="text-sm text-muted-foreground">
                {t('deleteModal.warning')}
              </p>
            </div>
          </div>
          <div className={`flex gap-3 pt-4 ${currentLanguage === 'ar' ? 'justify-start flex-row-reverse' : 'justify-end'}`}>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
            >
              {t('deleteModal.cancelText')}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteConfirm}
              className={currentLanguage === 'ar' ? 'flex-row-reverse' : ''}
            >
              <Trash2 className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('deleteModal.confirmText')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllBlogs;
