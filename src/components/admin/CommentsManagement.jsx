import React, { useState, useEffect } from 'react';
import { Filter, MessageCircle, Check, Trash2, Eye, MoreVertical, Calendar, User, ExternalLink, Users, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../context/AuthContext';
import blogAPI from '../../services/blogAPI';
import { useTranslation } from 'react-i18next';
import { useI18next, Link } from 'gatsby-plugin-react-i18next';
import { DataTable } from '../ui/DataTable';
import { AdminModal } from '../ui/AdminModal';
import { SectionShell, SearchInput } from '../ui/SectionShell';

const CommentsManagement = () => {
  const { user, token } = useAuth();
  const { t } = useTranslation('CommentsManagement');
  const { language: currentLanguage } = useI18next();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    blogId: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [selectedComments, setSelectedComments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    fetchComments();
  }, [filters, pagination.currentPage, currentLanguage]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
        status: filters.status,
        search: filters.search
      };

      // Only add blogId if it's a valid ObjectId (24 character hex string)
      if (filters.blogId && filters.blogId.length === 24 && /^[0-9a-fA-F]{24}$/.test(filters.blogId)) {
        params.blogId = filters.blogId;
      }

      console.log('Fetching comments with params:', params);
      console.log('Using token:', token ? 'Token present' : 'No token');

      const response = await blogAPI.getAllComments(params, token);
      console.log('Comments response:', response);

      setComments(response.comments || []);
      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        total: response.total || 0
      });

      if (response.comments && response.comments.length === 0) {
        setMessage({ type: 'info', text: t('messages.noCommentsFound') });
      } else {
        setMessage({ type: '', text: '' });
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      console.error('Error details:', error.message);
      setMessage({
        type: 'danger',
        text: t('messages.fetchError', { error: error.message })
      });
      setComments([]);
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
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusChange = async (commentId, newStatus) => {
    try {
      await blogAPI.updateCommentStatus(commentId, newStatus, token);
      setMessage({ type: 'success', text: t('messages.statusUpdated') });
      fetchComments();
    } catch (error) {
      setMessage({ type: 'danger', text: t('messages.statusUpdateError') });
    }
  };

  const handleBulkStatusChange = async (status) => {
    if (selectedComments.length === 0) {
      setMessage({ type: 'warning', text: t('bulkActions.selectComments') });
      return;
    }

    try {
      await blogAPI.bulkUpdateComments(selectedComments, status, token);
      setMessage({ type: 'success', text: t('messages.bulkUpdated', { count: selectedComments.length }) });
      setSelectedComments([]);
      fetchComments();
    } catch (error) {
      setMessage({ type: 'danger', text: t('messages.bulkUpdateError') });
    }
  };

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await blogAPI.deleteComment(commentToDelete._id, token);
      setMessage({ type: 'success', text: t('messages.deleted') });
      setShowDeleteModal(false);
      setCommentToDelete(null);
      fetchComments();
    } catch (error) {
      setMessage({ type: 'danger', text: t('messages.deleteError') });
    }
  };

  const handleSelectComment = (commentId) => {
    setSelectedComments(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedComments.length === comments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(comments.map(comment => comment._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedComments.length === 0) {
      setMessage({ type: 'warning', text: t('bulkActions.selectCommentsToDelete') });
      return;
    }

    try {
      await Promise.all(selectedComments.map(commentId =>
        blogAPI.deleteComment(commentId, token)
      ));
      setMessage({ type: 'success', text: t('messages.bulkDeleted', { count: selectedComments.length }) });
      setSelectedComments([]);
      fetchComments();
    } catch (error) {
      setMessage({ type: 'danger', text: t('messages.bulkDeleteError') });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const isRTL = currentLanguage === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const columns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          checked={selectedComments.length === comments.length && comments.length > 0}
          onChange={handleSelectAll}
          className="rounded border-border"
        />
      ),
      width: 'w-12',
      render: (comment) => (
        <input
          type="checkbox"
          checked={selectedComments.includes(comment._id)}
          onChange={() => handleSelectComment(comment._id)}
          className="rounded border-border"
        />
      )
    },
    {
      key: 'author',
      label: t('table.headers.author'),
      render: (comment) => (
        <div>
          <p className="font-medium">{comment.author.name}</p>
          <p className="text-sm text-muted-foreground">{comment.author.email}</p>
        </div>
      )
    },
    {
      key: 'content',
      label: t('table.headers.content'),
      render: (comment) => (
        <div className="max-w-xs">
          <p className="text-sm truncate" dir={dir}>
            {truncateText(comment.content)}
          </p>
        </div>
      )
    },
    {
      key: 'blog',
      label: t('table.headers.blogPost'),
      render: (comment) => (
        <div className="max-w-xs">
          {comment.blog?.title ? (
            <Link
              to={`/news-details/${comment.blog.slug}`}
              className="text-primary hover:underline text-sm"
            >
              {truncateText(
                currentLanguage === 'ar' && comment.blog.titleAr ?
                  comment.blog.titleAr :
                  comment.blog.title,
                50
              )}
            </Link>
          ) : (
            <span className="text-muted-foreground text-sm">{t('table.blogNotFound')}</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: t('table.headers.status'),
      render: (comment) => (
        <Badge variant={
          comment.status === 'approved' ? 'default' :
          comment.status === 'pending' ? 'secondary' : 'destructive'
        }>
          {t(`status.${comment.status}`)}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: t('table.headers.date'),
      render: (comment) => formatDate(comment.createdAt)
    },
    {
      key: '_actions',
      label: t('table.headers.actions'),
      align: 'end',
      render: (comment) => (
        <div className="flex items-center gap-1 justify-end">
          {comment.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(comment._id, 'approved')}
                className="text-green-600 hover:bg-green-50"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(comment._id, 'rejected')}
                className="text-red-600 hover:bg-red-50"
              >
                <span className="h-4 w-4 flex items-center justify-center font-bold">✕</span>
              </Button>
            </>
          )}
          {comment.status === 'approved' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange(comment._id, 'pending')}
              className="text-yellow-600 hover:bg-yellow-50"
            >
              <Clock className="h-4 w-4" />
            </Button>
          )}
          {comment.status === 'rejected' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange(comment._id, 'approved')}
              className="text-green-600 hover:bg-green-50"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive rounded-md"
            onClick={() => handleDeleteClick(comment)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <SectionShell
      title={t('title')}
      subtitle={t('description')}
      dir={dir}
      filters={
        <div className={`flex flex-col ${isRTL ? 'sm:flex-row-reverse' : 'sm:flex-row'} gap-3 md:gap-4`}>
          <div className="flex-1">
            <SearchInput
              value={filters.search}
              onChange={(e) => handleFilterChange({ target: { name: 'search', value: e.target.value } })}
              placeholder={t('filters.searchPlaceholder')}
              dir={dir}
            />
          </div>
          <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange({ target: { name: 'status', value: value === 'all' ? '' : value } })}>
            <SelectTrigger className="w-full sm:w-44 md:w-48">
              <SelectValue placeholder={t('filters.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.status.all')}</SelectItem>
              <SelectItem value="approved">{t('filters.status.approved')}</SelectItem>
              <SelectItem value="pending">{t('filters.status.pending')}</SelectItem>
              <SelectItem value="rejected">{t('filters.status.rejected')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between flex-row">
              <div>
                <p className={`text-xs md:text-sm font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('stats.totalComments')}
                </p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text ">{pagination.total}</p>
              </div>
              <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between flex-row">
              <div>
                <p className={`text-xs md:text-sm font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('stats.pendingReview')}
                </p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text ">{comments.filter(c => c.status === 'pending').length}</p>
              </div>
              <Clock className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between flex-row">
              <div>
                <p className={`text-xs md:text-sm font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('stats.approved')}
                </p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text ">{comments.filter(c => c.status === 'approved').length}</p>
              </div>
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between flex-row">
              <div>
                <p className={`text-xs md:text-sm font-medium text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('stats.rejected')}
                </p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text ">{comments.filter(c => c.status === 'rejected').length}</p>
              </div>
              <span className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70 flex items-center justify-center text-xl font-bold">✕</span>
            </div>
          </CardContent>
        </Card>
      </div>

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

      {/* Bulk Actions */}
      {selectedComments.length > 0 && (
        <Card className="border-0 shadow-sm bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge className="bg-primary text-white">
                  {t('bulkActions.selected', { count: selectedComments.length })}
                </Badge>
                <span className="text-sm text-muted-foreground">{t('bulkActions.label')}</span>
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange('approved')}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Check className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {t('bulkActions.approveAll')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange('rejected')}
                  className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                >
                  <span className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'} flex items-center justify-center font-bold`}>✕</span>
                  {t('bulkActions.rejectAll')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {t('bulkActions.deleteAll')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <DataTable
        columns={columns}
        data={comments}
        loading={loading}
        emptyTitle={filters.search || filters.status ? t('table.noMatchingComments') : t('table.noComments')}
        countLabel={`${t('table.title')} ${t('table.count', { count: comments.length })}`}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(newPage) => setPagination(prev => ({ ...prev, currentPage: newPage }))}
        dir={dir}
      />

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-3 xs:space-y-4">
        {!loading && comments.map(comment => (
          <Card key={comment._id} className="border border-border hover:shadow-md transition-shadow">
            <CardContent className="p-3 xs:p-4">
              {/* Comment Header */}
              <div className={`flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-3 ${isRTL ? 'xs:flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 xs:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment._id)}
                    onChange={() => handleSelectComment(comment._id)}
                    className="rounded border-border flex-shrink-0"
                  />
                  <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h3 className="font-semibold text-foreground text-sm xs:text-base truncate">
                      {comment.author.name}
                    </h3>
                    <p className="text-xs xs:text-sm text-muted-foreground truncate">
                      {comment.author.email}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'self-end xs:self-start flex-row-reverse' : 'self-start'}`}>
                  <Badge variant={
                    comment.status === 'approved' ? 'default' :
                    comment.status === 'pending' ? 'secondary' : 'destructive'
                  } className="text-xs">
                    {t(`status.${comment.status}`)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
              </div>

              {/* Comment Content */}
              <div className={`mt-3 p-2 xs:p-3 bg-muted/30 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="text-sm xs:text-base" dir={dir}>
                  {comment.content}
                </p>
              </div>

              {/* Blog Post Link */}
              <div className={`mt-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                <span className="text-xs xs:text-sm text-muted-foreground">{t('table.headers.blogPost')}: </span>
                {comment.blog?.title ? (
                  <Link
                    to={`/news-details/${comment.blog.slug}`}
                    className="text-primary hover:underline text-xs xs:text-sm font-medium"
                  >
                    {currentLanguage === 'ar' && comment.blog.titleAr ?
                      comment.blog.titleAr :
                      comment.blog.title}
                  </Link>
                ) : (
                  <span className="text-muted-foreground text-xs xs:text-sm">{t('table.blogNotFound')}</span>
                )}
              </div>

              {/* Actions */}
              <div className={`flex flex-wrap items-center gap-1 xs:gap-2 mt-3 pt-3 border-t border-border ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                {comment.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(comment._id, 'approved')}
                      className="text-green-600 hover:bg-green-50 text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2"
                    >
                      <Check className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                      {t('actions.approve')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(comment._id, 'rejected')}
                      className="text-red-600 hover:bg-red-50 text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2"
                    >
                      <span className="h-3 w-3 xs:h-4 xs:w-4 mr-1 flex items-center justify-center font-bold">✕</span>
                      {t('actions.reject')}
                    </Button>
                  </>
                )}
                {comment.status === 'approved' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(comment._id, 'pending')}
                    className="text-yellow-600 hover:bg-yellow-50 text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2"
                  >
                    <Clock className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                    {t('actions.pending')}
                  </Button>
                )}
                {comment.status === 'rejected' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(comment._id, 'approved')}
                    className="text-green-600 hover:bg-green-50 text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2"
                  >
                    <Check className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                    {t('actions.approve')}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(comment)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive rounded-md text-xs xs:text-sm"
                >
                  <Trash2 className="h-3 w-3 xs:h-4 xs:w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <AdminModal
        open={showDeleteModal}
        onClose={setShowDeleteModal}
        title={t('deleteModal.title')}
        size="sm"
        dir={dir}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              {t('deleteModal.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className={isRTL ? 'flex-row-reverse' : ''}
            >
              <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('deleteModal.confirmDelete')}
            </Button>
          </>
        }
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className={`text-foreground mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('deleteModal.description')}
            </p>
            <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('deleteModal.warning')}
            </p>
            {commentToDelete && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                <p className={`text-sm text-muted-foreground mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('deleteModal.preview')}
                </p>
                <p className="text-sm font-medium">
                  "{commentToDelete.content?.substring(0, 100)}{commentToDelete.content?.length > 100 ? '...' : ''}"
                </p>
              </div>
            )}
          </div>
        </div>
      </AdminModal>
    </SectionShell>
  );
};

export default CommentsManagement;
