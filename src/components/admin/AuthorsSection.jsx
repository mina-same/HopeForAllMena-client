import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Search, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { authorsAPI } from '../../services/publishingAPI';
import ConfirmationModal from '../ui/ConfirmationModal';
import ImageUpload from '../ui/image-upload';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';

export function AuthorsSection() {
  const { toast } = useToast();
  const { t } = useTranslation('AuthorsManagement');
  const { language: currentLanguage } = useI18next();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAuthors, setTotalAuthors] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // View author modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingAuthor, setViewingAuthor] = useState(null);

  const [authorForm, setAuthorForm] = useState({
    name: '',
    nameAr: '',
    biography: '',
    biographyAr: '',
    avatarUrl: ''
  });

  // Fetch authors
  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter,
        featured: featuredFilter === 'all' ? '' : featuredFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        language: currentLanguage
      };

      const response = await authorsAPI.getAuthors(params);
      setAuthors(response.data.data.authors);
      setTotalPages(response.data.data.pagination.totalPages);
      setTotalAuthors(response.data.data.pagination.totalAuthors);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
      toast({
        title: t('toast.errors.validationError'),
        description: t('toast.errors.fetchAuthors'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [currentPage, searchTerm, statusFilter, featuredFilter, currentLanguage]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setAuthorForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (imageData) => {
    if (imageData) {
      setAuthorForm(prev => ({
        ...prev,
        avatarUrl: imageData.url
      }));
    } else {
      setAuthorForm(prev => ({
        ...prev,
        avatarUrl: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data before submission
    if (authorForm.biography.length < 10) {
      toast({
        title: t('toast.errors.validationError'),
        description: t('form.validation.biographyMinLength'),
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (authorForm.biographyAr.length < 10) {
      toast({
        title: t('toast.errors.validationError'), 
        description: t('form.validation.biographyArMinLength'),
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Debug: Log form data and auth token
    console.log('Form data being sent:', authorForm);
    console.log('Auth token:', localStorage.getItem('authToken'));

    try {
      if (editingAuthor) {
        await authorsAPI.updateAuthor(editingAuthor._id, authorForm);
        toast({
          title: t('toast.authorUpdated', { name: currentLanguage === 'ar' ? authorForm.nameAr || authorForm.name : authorForm.name }),
          description: t('toast.authorUpdated', { name: currentLanguage === 'ar' ? authorForm.nameAr || authorForm.name : authorForm.name }),
        });
      } else {
        console.log('Creating new author with data:', authorForm);
        await authorsAPI.createAuthor(authorForm);
        toast({
          title: t('toast.authorAdded', { name: currentLanguage === 'ar' ? authorForm.nameAr || authorForm.name : authorForm.name }),
          description: t('toast.authorAdded', { name: currentLanguage === 'ar' ? authorForm.nameAr || authorForm.name : authorForm.name }),
        });
      }

      setIsDialogOpen(false);
      setEditingAuthor(null);
      setAuthorForm({
        name: '',
        nameAr: '',
        biography: '',
        biographyAr: '',
        avatarUrl: ''
      });
      fetchAuthors();
    } catch (error) {
      console.error('Failed to save author:', error);
      toast({
        title: t('toast.errors.validationError'),
        description: error.response?.data?.message || t('toast.errors.saveAuthor'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setAuthorForm({
      name: author.name,
      nameAr: author.nameAr || '',
      biography: author.biography,
      biographyAr: author.biographyAr || '',
      avatarUrl: author.avatarUrl || ''
    });
    setIsDialogOpen(true);
  };

  const handleView = (author) => {
    setViewingAuthor(author);
    setShowViewModal(true);
  };

  const handleDelete = (author) => {
    setAuthorToDelete(author);
    setShowDeleteModal(true);
  };

  const confirmDeleteAuthor = async () => {
    if (!authorToDelete) return;

    setIsDeleting(true);
    try {
      await authorsAPI.deleteAuthor(authorToDelete._id);
      toast({
        title: t('toast.authorDeleted', { name: currentLanguage === 'ar' ? authorToDelete.nameAr || authorToDelete.name : authorToDelete.name }),
        description: t('toast.authorDeleted', { name: currentLanguage === 'ar' ? authorToDelete.nameAr || authorToDelete.name : authorToDelete.name }),
      });
      fetchAuthors();
    } catch (error) {
      console.error('Failed to delete author:', error);
      toast({
        title: t('toast.errors.validationError'),
        description: error.response?.data?.message || t('toast.errors.deleteAuthor'),
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setAuthorToDelete(null);
    }
  };


  const handleStatusChange = async (author, newStatus) => {
    try {
      await authorsAPI.updateAuthorStatus(author._id, newStatus);
      const authorName = currentLanguage === 'ar' ? author.nameAr || author.name : author.name;
      const statusText = t(`status.${newStatus}`);
      toast({
        title: t('toast.statusUpdated', { name: authorName, status: statusText }),
        description: t('toast.statusUpdated', { name: authorName, status: statusText }),
      });
      fetchAuthors();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: t('toast.errors.validationError'),
        description: t('toast.errors.updateStatus'),
        variant: "destructive"
      });
    }
  };

  const openAddDialog = () => {
    setEditingAuthor(null);
    setAuthorForm({
      name: '',
      nameAr: '',
      biography: '',
      biographyAr: '',
      avatarUrl: ''
    });
    setIsDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`flex flex-col sm:flex-row items-start sm:items-center ${currentLanguage === 'ar' ? 'justify-between ' : 'justify-between'} gap-4`}>
        <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('title')}</h2>
          <p className="text-muted-foreground text-sm md:text-base">{t('description')}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className=" text-white shadow-elegant hover:shadow-lg transition-all duration-300">
              <div className={`flex items-center flex-row`}>
                <Plus className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t('addAuthor')}
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent 
            className={`max-w-2xl max-h-[90vh] overflow-y-auto ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            <DialogHeader>
              <DialogTitle className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                {editingAuthor ? t('form.editTitle') : t('form.createTitle')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImage={authorForm.avatarUrl}
                uploadType="author-image"
                label={t('form.fields.avatar.label')}
                disabled={isSubmitting}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                    {t('form.fields.name.label')} *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={authorForm.name}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.name.placeholder')}
                    required
                    disabled={isSubmitting}
                    className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                    {t('form.fields.nameAr.label')} *
                  </Label>
                  <Input
                    id="nameAr"
                    name="nameAr"
                    value={authorForm.nameAr}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.nameAr.placeholder')}
                    required
                    disabled={isSubmitting}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="biography" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                    {t('form.fields.biography.label')} * ({t('form.fields.biography.minLength')})
                  </Label>
                  <Textarea
                    id="biography"
                    name="biography"
                    value={authorForm.biography}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.biography.placeholder')}
                    rows={4}
                    required
                    minLength={10}
                    disabled={isSubmitting}
                    className={`${authorForm.biography.length > 0 && authorForm.biography.length < 10 ? 'border-red-300' : ''} ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {authorForm.biography.length > 0 && authorForm.biography.length < 10 && (
                    <p className={`text-sm text-red-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      {t('form.validation.biographyMinLength')}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biographyAr" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                    {t('form.fields.biographyAr.label')} * ({t('form.fields.biographyAr.minLength')})
                  </Label>
                  <Textarea
                    id="biographyAr"
                    name="biographyAr"
                    value={authorForm.biographyAr}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.biographyAr.placeholder')}
                    rows={4}
                    required
                    minLength={10}
                    disabled={isSubmitting}
                    dir="rtl"
                    className={`${authorForm.biographyAr.length > 0 && authorForm.biographyAr.length < 10 ? 'border-red-300' : ''} text-right`}
                  />
                  {authorForm.biographyAr.length > 0 && authorForm.biographyAr.length < 10 && (
                    <p className="text-sm text-red-600 text-right">
                      {t('form.validation.biographyArMinLength')}
                    </p>
                  )}
                </div>
              </div>


              <div className={`flex gap-2 ${currentLanguage === 'ar' ? 'justify-start ' : 'justify-end'}`}>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  {t('form.buttons.cancel')}
                </Button>
                <Button type="submit" className=" text-white" disabled={isSubmitting}>
                  {isSubmitting ? t('form.buttons.saving') : (editingAuthor ? t('form.buttons.update') : t('form.buttons.create'))}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute ${currentLanguage === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4`} />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${currentLanguage === 'ar' ? 'pr-[30px] text-right' : 'pl-[30px] text-left'}`}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 flex-row">
                <SelectValue placeholder={t('filters.status.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.status.all')}</SelectItem>
                <SelectItem value="active">{t('filters.status.active')}</SelectItem>
                <SelectItem value="inactive">{t('filters.status.inactive')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger className="w-full sm:w-40 flex-row">
                <SelectValue placeholder={t('filters.featured.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.featured.all')}</SelectItem>
                <SelectItem value="true">{t('filters.featured.featured')}</SelectItem>
                <SelectItem value="false">{t('filters.featured.notFeatured')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className={`flex items-center ${currentLanguage === 'ar' ? 'justify-between ' : 'justify-between'}`}>
            <h3 className={`text-lg font-semibold text-gray-900 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
              {t('table.authorsCount', { count: totalAuthors })}
            </h3>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 mx-auto"></div>
              <p className="text-gray-500 mt-3">{t('loading.authors')}</p>
            </div>
          ) : authors.length > 0 ? (
            <div className="space-y-3">
              {authors.map((author) => {
                const displayName = currentLanguage === 'ar' ? author.nameAr || author.name : author.name;
                return (
                <div key={author._id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    {/* Mobile Header with Avatar and Name */}
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-12 w-12 border-2 border-gray-100 shadow-sm">
                        <AvatarImage src={author.avatarUrl} alt={displayName} />
                        <AvatarFallback className="font-semibold text-sm">
                          {displayName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-base truncate">{displayName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {author.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              {t('table.featured')}
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            author.status === 'active' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            {t(`status.${author.status}`)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="font-medium">
                        {t('table.booksCount', { count: author.booksCount })}
                      </span>
                      <span>{t('table.addedOn', { date: formatDate(author.createdAt) })}</span>
                    </div>
                    
                    {/* Mobile Action Buttons */}
                    <div className="pt-3 border-t border-gray-100 space-y-3">
                      {/* View, Edit and Delete Buttons Row */}
                      <div className="flex items-center justify-center gap-3 flex-row">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(author)}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                          title={t('actions.view')}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(author)}
                          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
                          title={t('actions.edit')}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(author)}
                          className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-500 hover:text-red-600 rounded-lg"
                          title={t('actions.delete')}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className={`flex gap-4 md:gap-6 ${currentLanguage === 'ar' ? '' : ''}`}>
                      {/* Author Image */}
                      <div className="flex-shrink-0">
                        <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-gray-100 shadow-sm">
                          <AvatarImage src={author.avatarUrl} alt={displayName} />
                          <AvatarFallback className="font-semibold text-lg md:text-xl">
                            {displayName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      {/* Author Details */}
                      <div className="flex-1 min-w-0">
                        <div className={`flex items-start ${currentLanguage === 'ar' ? 'justify-between ' : 'justify-between'}`}>
                          <div className={`flex-1 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                            <div className={`flex items-center gap-3 mb-2 md:mb-3 ${currentLanguage === 'ar' ? ' justify-end' : ''}`}>
                              <h4 className="font-semibold text-gray-900 text-lg md:text-xl">{displayName}</h4>
                              {author.featured && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                  {t('table.featured')}
                                </span>
                              )}
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                author.status === 'active' 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`}>
                                {t(`status.${author.status}`)}
                              </span>
                            </div>
                            
                            <div className={`flex items-center gap-4 text-sm text-gray-500 ${currentLanguage === 'ar' ? ' justify-end' : ''}`}>
                              <span className="font-medium">
                                {t('table.booksCount', { count: author.booksCount })}
                              </span>
                              <span>•</span>
                              <span>{t('table.addedOn', { date: formatDate(author.createdAt) })}</span>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'mr-4' : 'ml-4'}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(author)}
                              className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                              title={t('actions.view')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Select value={author.status} onValueChange={(value) => handleStatusChange(author, value)}>
                              <SelectTrigger className="w-24 h-9 text-xs border-gray-300 rounded-lg">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">{t('status.active')}</SelectItem>
                                <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(author)}
                              className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                              title={t('actions.edit')}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(author)}
                              className="h-9 w-9 p-0 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg"
                              title={t('actions.delete')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
              <p className="text-gray-500 text-sm sm:text-base text-center">
                {t('empty.description')}
              </p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`flex justify-center items-center gap-3 mt-8 pt-6 border-t border-gray-200 ${currentLanguage === 'ar' ? '' : ''}`}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border-gray-300"
              >
                {t('pagination.previous')}
              </Button>
              <span className="text-sm text-gray-600 px-3">
                {t('pagination.pageInfo', { current: currentPage, total: totalPages })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="border-gray-300"
              >
                {t('pagination.next')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* View Author Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent 
          className={`max-w-2xl max-h-[90vh] overflow-y-auto ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}
          dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
        >
          <DialogHeader>
            <DialogTitle className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
              {t('viewModal.title')}
            </DialogTitle>
          </DialogHeader>
          {viewingAuthor && (
            <div className="space-y-6">
              {/* Author Avatar and Basic Info */}
              <div className={`flex items-center gap-4 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-20 w-20 border-2 border-gray-100 shadow-sm">
                  <AvatarImage src={viewingAuthor.avatarUrl} alt={currentLanguage === 'ar' ? viewingAuthor.nameAr || viewingAuthor.name : viewingAuthor.name} />
                  <AvatarFallback className="font-semibold text-lg">
                    {(currentLanguage === 'ar' ? viewingAuthor.nameAr || viewingAuthor.name : viewingAuthor.name).split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex-1 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {currentLanguage === 'ar' ? viewingAuthor.nameAr || viewingAuthor.name : viewingAuthor.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {viewingAuthor.featured && (
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                        {t('table.featured')}
                      </Badge>
                    )}
                    <Badge className={viewingAuthor.status === 'active' ? 'bg-green-300 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                      {t(`status.${viewingAuthor.status}`)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Author Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className={`font-semibold ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t('form.fields.name.label')}
                  </Label>
                  <p className={`text-gray-700 p-3 bg-gray-50 rounded-lg ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    {viewingAuthor.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className={`font-semibold ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t('form.fields.nameAr.label')}
                  </Label>
                  <p className="text-gray-700 p-3 bg-gray-50 rounded-lg text-right" dir="rtl">
                    {viewingAuthor.nameAr || '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className={`font-semibold ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t('form.fields.biography.label')}
                  </Label>
                  <div className={`text-gray-700 p-3 bg-gray-50 rounded-lg min-h-[100px] ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    {viewingAuthor.biography}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className={`font-semibold ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t('form.fields.biographyAr.label')}
                  </Label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg min-h-[100px] text-right" dir="rtl">
                    {viewingAuthor.biographyAr || '-'}
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div className={`text-center ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className="text-2xl font-bold text-blue-600">{viewingAuthor.booksCount || 0}</div>
                  <div className="text-sm text-gray-600">{t('table.booksCount', { count: viewingAuthor.booksCount || 0 })}</div>
                </div>
                <div className={`text-center ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className="text-2xl font-bold text-blue-600">{formatDate(viewingAuthor.createdAt)}</div>
                  <div className="text-sm text-gray-600">{t('viewModal.joinedDate')}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-3 pt-4 border-t ${currentLanguage === 'ar' ? 'justify-start' : 'justify-end'}`}>
                <Button
                  variant="outline"
                  onClick={() => setShowViewModal(false)}
                >
                  {t('viewModal.close')}
                </Button>
                <Button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingAuthor);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t('actions.edit')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setAuthorToDelete(null);
        }}
        onConfirm={confirmDeleteAuthor}
        title={t('deleteModal.title')}
        description={t('deleteModal.description', { 
          name: currentLanguage === 'ar' 
            ? authorToDelete?.nameAr || authorToDelete?.name 
            : authorToDelete?.name 
        })}
        confirmText={t('deleteModal.confirmText')}
        cancelText={t('deleteModal.cancelText')}
        variant="danger"
        isLoading={isDeleting}
        icon={
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 border-red-200 border-2">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        }
      />
    </div>
  );
}

// GraphQL query for i18n support