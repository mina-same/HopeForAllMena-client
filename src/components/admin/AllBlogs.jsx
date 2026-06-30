import React, { useState, useEffect, useCallback } from 'react';
import { Edit3, Eye, Trash2, Plus, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useAuth } from '../../context/AuthContext';
import blogAPI from '../../services/blogAPI';
import ConfirmationModal from '../ui/ConfirmationModal';
import { DataTable } from '../ui/DataTable';
import { SectionShell, SearchInput } from '../ui/SectionShell';

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

  const isRTL = currentLanguage === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const columns = [
    {
      key: 'thumbnail',
      label: t('table.headers.thumbnail'),
      width: 'w-16',
      skeletonWidth: '48px',
      render: (blog) => blog.thumbnail ? (
        <img
          src={blog.thumbnail}
          alt={isRTL && blog.titleAr ? blog.titleAr : blog.title}
          className="w-10 h-10 object-cover rounded"
        />
      ) : (
        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
    },
    {
      key: 'title',
      label: t('table.headers.title'),
      skeletonWidth: '70%',
      render: (blog) => (
        <div className="space-y-1">
          <p className="font-medium text-sm leading-tight" dir={dir}>
            {isRTL && blog.titleAr ? blog.titleAr : blog.title}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2 max-w-xs" dir={dir}>
            {isRTL && blog.excerptAr ? blog.excerptAr : (blog.excerpt || t('table.noExcerpt'))}
          </p>
        </div>
      ),
    },
    {
      key: 'author',
      label: t('table.headers.author'),
      skeletonWidth: '50%',
      render: (blog) => (
        <span className="text-sm">{blog.author?.name || t('table.unknownAuthor')}</span>
      ),
    },
    {
      key: 'date',
      label: t('table.headers.date'),
      skeletonWidth: '50%',
      render: (blog) => (
        <span className="text-sm">{formatDate(blog.createdAt)}</span>
      ),
    },
    {
      key: 'status',
      label: t('table.headers.status'),
      align: 'center',
      skeletonWidth: '50%',
      render: (blog) => (
        <Badge
          variant={blog.status === 'published' ? 'default' : 'secondary'}
          className="text-xs font-medium"
        >
          {t(`status.${blog.status}`)}
        </Badge>
      ),
    },
    {
      key: '_actions',
      label: '',
      align: 'end',
      skeletonWidth: '60px',
      render: (blog) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(blog)}
            title={t('actions.edit')}
            className="h-8 w-8 p-0 hover:bg-muted rounded-md"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteClick(blog)}
            title={t('actions.delete')}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive rounded-md"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <SectionShell
      title={t('title')}
      subtitle={t('description')}
      dir={dir}
      actions={
        <Button
          onClick={() => window.location.href = '/admin/new-blog'}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('addBlog')}
        </Button>
      }
      filters={
        <>
          <SearchInput
            value={filters.search}
            onChange={(e) => handleFilterChange({ target: { name: 'search', value: e.target.value } })}
            placeholder={t('filters.searchPlaceholder')}
            dir={dir}
          />
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
        </>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : ''}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{t('stats.totalPosts')}</p>
                <p className="text-xl md:text-2xl font-bold">{blogs.length}</p>
              </div>
              <FileText className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : ''}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{t('stats.published')}</p>
                <p className="text-xl md:text-2xl font-bold">{blogs.filter(b => b.status === 'published').length}</p>
              </div>
              <Eye className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : ''}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{t('stats.draftPosts')}</p>
                <p className="text-xl md:text-2xl font-bold">{blogs.filter(b => b.status === 'draft').length}</p>
              </div>
              <Edit3 className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : ''}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{t('stats.totalViews')}</p>
                <p className="text-xl md:text-2xl font-bold">{blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}</p>
              </div>
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert messages */}
      {message.text && (
        <Alert className={`border-0 shadow-sm ${
          message.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' :
          message.type === 'danger' ? 'border-destructive/20 bg-destructive/10 text-destructive' :
          'border-blue-200 bg-blue-50 text-blue-800'
        }`}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={blogs}
        loading={loading}
        emptyTitle={filters.search || filters.status || filters.category ? t('empty.noResults') : t('empty.noBlogs')}
        emptyIcon={FileText}
        countLabel={t('table.title', { count: blogs.length })}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        dir={dir}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBlogToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={t('deleteModal.title')}
        description={t('deleteModal.description', {
          title: isRTL && blogToDelete?.titleAr ? blogToDelete.titleAr : blogToDelete?.title
        })}
        confirmText={t('deleteModal.confirmText')}
        cancelText={t('deleteModal.cancelText')}
        variant="danger"
      />
    </SectionShell>
  );
};

export default AllBlogs;
