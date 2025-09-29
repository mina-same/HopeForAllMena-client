import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageCircle, Check, X, Trash2, Eye, MoreVertical, Calendar, User, ExternalLink, Users, Clock, CheckCircle } from 'lucide-react';
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
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { Link, graphql } from 'gatsby';

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

  const getStatusBadge = (status) => {
    const variants = {
      approved: 'success',
      pending: 'warning',
      rejected: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{t(`status.${status}`)}</Badge>;
  };

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-xl md:text-2xl font-bold text-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
            {t('title')}
          </h2>
          <p className={`text-sm md:text-base text-muted-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
            {t('description')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium text-muted-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t('stats.totalComments')}
                </p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text text-transparent">{pagination.total}</p>
              </div>
              <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium text-muted-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t('stats.pendingReview')}
                </p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text text-transparent">{comments.filter(c => c.status === 'pending').length}</p>
              </div>
              <Clock className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium text-muted-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t('stats.approved')}
                </p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text text-transparent">{comments.filter(c => c.status === 'approved').length}</p>
              </div>
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium text-muted-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t('stats.rejected')}
                </p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text text-transparent">{comments.filter(c => c.status === 'rejected').length}</p>
              </div>
              <X className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-4 md:p-6">
          <div className={`flex flex-col ${currentLanguage === 'ar' ? 'sm:flex-row-reverse' : 'sm:flex-row'} gap-3 md:gap-4`}>
            <div className="flex-1">
              <div className="relative">
                <Search className={`h-4 w-4 absolute ${currentLanguage === 'ar' ? 'right-3' : 'left-3'} top-3 text-muted-foreground`} />
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
                <SelectItem value="approved">{t('filters.status.approved')}</SelectItem>
                <SelectItem value="pending">{t('filters.status.pending')}</SelectItem>
                <SelectItem value="rejected">{t('filters.status.rejected')}</SelectItem>
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
              <div className={`flex items-center ${currentLanguage === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange('approved')}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Check className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-1' : 'mr-1'}`} />
                  {t('bulkActions.approveAll')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange('rejected')}
                  className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                >
                  <X className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-1' : 'mr-1'}`} />
                  {t('bulkActions.rejectAll')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-1' : 'mr-1'}`} />
                  {t('bulkActions.deleteAll')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Table */}
      <Card>
        <CardHeader>
          <CardTitle className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
            {t('table.title')} {t('table.count', { count: comments.length })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('loading.comments')}</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-center">
                  {filters.search || filters.status ? t('table.noMatchingComments') : t('table.noComments')}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedComments.length === comments.length && comments.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.author')}</TableHead>
                    <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.content')}</TableHead>
                    <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.blogPost')}</TableHead>
                    <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.status')}</TableHead>
                    <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.date')}</TableHead>
                    <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map(comment => (
                    <TableRow key={comment._id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedComments.includes(comment._id)}
                          onChange={() => handleSelectComment(comment._id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                          <p className="font-medium">{comment.author.name}</p>
                          <p className="text-sm text-muted-foreground">{comment.author.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`max-w-xs ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          <p className="text-sm truncate" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                            {truncateText(comment.content)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`max-w-xs ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
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
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          comment.status === 'approved' ? 'default' :
                          comment.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {comment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(comment.createdAt)}</TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${currentLanguage === 'ar' ? 'justify-end' : 'justify-start'}`}>
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
                                <X className="h-4 w-4" />
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
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(comment)}
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
            {t('pagination.showing', {
              from: ((pagination.currentPage - 1) * 10) + 1,
              to: Math.min(pagination.currentPage * 10, pagination.total),
              total: pagination.total
            })}
          </p>
          <div className={`flex items-center ${currentLanguage === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === 1}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              className="border-muted hover:bg-muted/50"
            >
              {t('pagination.previous')}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t('pagination.page', { current: pagination.currentPage, total: pagination.totalPages })}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
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
            <DialogTitle className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
              {t('deleteModal.title')}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className={`text-foreground mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                {t('deleteModal.description')}
              </p>
              <p className={`text-sm text-muted-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                {t('deleteModal.warning')}
              </p>
              {commentToDelete && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <p className={`text-sm text-muted-foreground mb-1 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t('deleteModal.preview')}
                  </p>
                  <p className="text-sm font-medium">
                    "{commentToDelete.content?.substring(0, 100)}{commentToDelete.content?.length > 100 ? '...' : ''}"
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className={`flex ${currentLanguage === 'ar' ? 'justify-start flex-row-reverse' : 'justify-end'} gap-3 pt-4`}>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
            >
              {t('deleteModal.cancel')}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteConfirm}
              className={currentLanguage === 'ar' ? 'flex-row-reverse' : ''}
            >
              <Trash2 className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('deleteModal.confirmDelete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentsManagement;

export const query = graphql`
  query($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
