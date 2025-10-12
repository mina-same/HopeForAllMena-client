import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, Calendar, Search, Book, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { booksAPI, authorsAPI, categoriesAPI } from '../../services/publishingAPI';
import ConfirmationModal from '../ui/ConfirmationModal';
import ImageUpload from '../ui/image-upload';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';

export function BooksSection() {
  const { toast } = useToast();
  const { t } = useTranslation('BooksManagement');
  const { language: currentLanguage } = useI18next();
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [bookForm, setBookForm] = useState({
    title: '',
    titleAr: '',
    author: '',
    category: '',
    description: '',
    descriptionAr: '',
    shortDescription: '',
    shortDescriptionAr: '',
    coverImageUrl: '',
    pages: '',
    language: 'English',
    publicationYear: '',
    status: 'not-published',
    tags: '',
    format: 'paperback',
    ageGroup: 'adult',
    metaTitle: '',
    metaDescription: '',
    metaTitleAr: '',
    metaDescriptionAr: ''
  });

  // Fetch books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter,
        category: categoryFilter === 'all' ? '' : categoryFilter,
        author: authorFilter === 'all' ? '' : authorFilter,
        featured: featuredFilter === 'all' ? '' : featuredFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const response = await booksAPI.getBooks(params);
      setBooks(response.data.data.books);
      setTotalPages(response.data.data.pagination.totalPages);
      setTotalBooks(response.data.data.pagination.totalBooks);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      toast({
        title: t('errors.loadBooks'),
        description: t('errors.loadBooks'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch authors and categories for dropdowns
  const fetchAuthorsAndCategories = async () => {
    try {
      const [authorsResponse, categoriesResponse] = await Promise.all([
        authorsAPI.getAuthors({ limit: 100, status: 'active' }),
        categoriesAPI.getCategories({ limit: 100, status: 'active' })
      ]);
      setAuthors(authorsResponse.data.data.authors);
      setCategories(categoriesResponse.data.data.categories);
    } catch (error) {
      console.error('Failed to fetch authors and categories:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchAuthorsAndCategories();
  }, [currentPage, searchTerm, statusFilter, categoryFilter, authorFilter, featuredFilter]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (imageData) => {
    if (imageData) {
      setBookForm(prev => ({
        ...prev,
        coverImageUrl: imageData.url
      }));
    } else {
      setBookForm(prev => ({
        ...prev,
        coverImageUrl: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Form submitted with data:', bookForm);

    try {
      // Validate required fields
      console.log('Checking required fields...');
      const missingFields = [];
      if (!bookForm.title?.trim()) missingFields.push('title');
      if (!bookForm.titleAr?.trim()) missingFields.push('titleAr');
      if (!bookForm.author) missingFields.push('author');
      if (!bookForm.category) missingFields.push('category');
      if (!bookForm.description?.trim()) missingFields.push('description');
      if (!bookForm.descriptionAr?.trim()) missingFields.push('descriptionAr');
      if (!bookForm.shortDescription?.trim()) missingFields.push('shortDescription');
      if (!bookForm.shortDescriptionAr?.trim()) missingFields.push('shortDescriptionAr');
      if (!bookForm.publicationYear) missingFields.push('publicationYear');
      
      if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields);
        toast({
          title: t('form.validation.missingFields', { fields: missingFields.join(', ') }),
          description: t('form.validation.missingFields', { fields: missingFields.join(', ') }),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      console.log('Required fields validation passed');

      // Validate field lengths
      console.log('Checking Arabic short description length:', bookForm.shortDescriptionAr.trim().length);
      if (bookForm.shortDescriptionAr.trim().length < 10) {
        console.log('Arabic short description too short, stopping submission');
        toast({
          title: t('form.validation.shortDescriptionMinLength'),
          description: t('form.validation.shortDescriptionMinLength'),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log('All validations passed, proceeding with API call');

      // Validate publication year
      const year = parseInt(bookForm.publicationYear);
      if (isNaN(year) || year < 1000 || year > new Date().getFullYear() + 10) {
        toast({
          title: t('form.validation.invalidYear', { maxYear: new Date().getFullYear() + 10 }),
          description: t('form.validation.invalidYear', { maxYear: new Date().getFullYear() + 10 }),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Validate cover image URL (only if provided)
      if (bookForm.coverImageUrl && bookForm.coverImageUrl.trim()) {
        const imageUrlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
        if (!imageUrlPattern.test(bookForm.coverImageUrl)) {
          toast({
            title: t('form.validation.invalidImageUrl'),
            description: t('form.validation.invalidImageUrl'),
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare form data with proper type conversions
      const formData = {
        title: bookForm.title.trim(),
        titleAr: bookForm.titleAr.trim(),
        author: bookForm.author,
        category: bookForm.category,
        description: bookForm.description.trim(),
        descriptionAr: bookForm.descriptionAr.trim(),
        shortDescription: bookForm.shortDescription.trim(),
        shortDescriptionAr: bookForm.shortDescriptionAr.trim(),
        coverImageUrl: bookForm.coverImageUrl.trim(),
        language: bookForm.language || 'English',
        publicationYear: parseInt(bookForm.publicationYear),
        status: bookForm.status,
        format: bookForm.format,
        ageGroup: bookForm.ageGroup,
        tags: bookForm.tags ? bookForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      // Add optional fields only if they have values
      if (bookForm.pages) {
        formData.pages = parseInt(bookForm.pages);
      }
      if (bookForm.metaTitle?.trim()) {
        formData.metaTitle = bookForm.metaTitle.trim();
      }
      if (bookForm.metaDescription?.trim()) {
        formData.metaDescription = bookForm.metaDescription.trim();
      }
      if (bookForm.metaTitleAr?.trim()) {
        formData.metaTitleAr = bookForm.metaTitleAr.trim();
      }
      if (bookForm.metaDescriptionAr?.trim()) {
        formData.metaDescriptionAr = bookForm.metaDescriptionAr.trim();
      }

      // Log the data being sent
      console.log('Sending book data:', formData);

      if (editingBook) {
        await booksAPI.updateBook(editingBook._id, formData);
        toast({
          title: t('success.bookUpdated', { title: bookForm.title }),
          description: t('success.bookUpdated', { title: bookForm.title }),
        });
      } else {
        await booksAPI.createBook(formData);
        toast({
          title: t('success.bookCreated', { title: bookForm.title }),
          description: t('success.bookCreated', { title: bookForm.title }),
        });
      }
      
      handleCloseDialog();
      fetchBooks();
    } catch (error) {
      console.error('Failed to save book:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error details:', error.response?.data?.errors);
      console.error('Full error response:', JSON.stringify(error.response?.data, null, 2));
      
      // Extract specific validation errors if available
      let errorMessage = t('errors.createBook');
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.keys(errors).map(field => `${field}: ${errors[field]}`).join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: t('errors.createBook'),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBook(null);
    resetForm();
  };

  const resetForm = () => {
    setBookForm({
      title: '',
      titleAr: '',
      author: '',
      category: '',
      description: '',
      descriptionAr: '',
      shortDescription: '',
      shortDescriptionAr: '',
      coverImageUrl: '',
      pages: '',
      language: 'English',
      publicationYear: '',
      status: 'not-published',
      tags: '',
      format: 'paperback',
      ageGroup: 'adult',
      metaTitle: '',
      metaDescription: '',
      metaTitleAr: '',
      metaDescriptionAr: ''
    });
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title || '',
      titleAr: book.titleAr || '',
      author: book.author?._id || book.author || '',
      category: book.category?._id || book.category || '',
      description: book.description || '',
      descriptionAr: book.descriptionAr || '',
      shortDescription: book.shortDescription || '',
      shortDescriptionAr: book.shortDescriptionAr || '',
      coverImageUrl: book.coverImageUrl || '',
      pages: book.pages ? book.pages.toString() : '',
      language: book.language || 'English',
      publicationYear: book.publicationYear ? book.publicationYear.toString() : '',
      status: book.status || 'not-published',
      tags: book.tags ? book.tags.join(', ') : '',
      format: book.format || 'paperback',
      ageGroup: book.ageGroup || 'adult',
      metaTitle: book.metaTitle || '',
      metaDescription: book.metaDescription || '',
      metaTitleAr: book.metaTitleAr || '',
      metaDescriptionAr: book.metaDescriptionAr || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;

    setIsDeleting(true);
    try {
      await booksAPI.deleteBook(bookToDelete._id);
      toast({
        title: t('success.bookDeleted', { title: bookToDelete.title }),
        description: t('success.bookDeleted', { title: bookToDelete.title }),
      });
      fetchBooks();
    } catch (error) {
      console.error('Failed to delete book:', error);
      toast({
        title: t('errors.deleteBook'),
        description: error.response?.data?.message || t('errors.deleteBook'),
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
  };


  const handleStatusChange = async (book, newStatus) => {
    try {
      await booksAPI.updateBookStatus(book._id, newStatus);
      toast({
        title: t('success.statusUpdated', { title: book.title, status: t(`status.${newStatus}`) }),
        description: t('success.statusUpdated', { title: book.title, status: t(`status.${newStatus}`) }),
      });
      fetchBooks();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: t('errors.updateStatus'),
        description: t('errors.updateStatus'),
        variant: "destructive"
      });
    }
  };

  const openAddDialog = () => {
    setEditingBook(null);
    resetForm();
    setIsDialogOpen(true);
  };


  return (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('title')}</h2>
          <p className="text-muted-foreground text-sm md:text-base">{t('description')}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className={`text-white shadow-elegant hover:shadow-lg transition-all duration-300 ${currentLanguage === 'ar' ? '' : ''}`}>
              <Plus className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('addBook')}
            </Button>
          </DialogTrigger>
          <DialogContent className={`w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto ${currentLanguage === 'ar' ? 'rtl' : 'ltr'} [&>button]:hidden`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <DialogHeader className="relative pb-4">
              <DialogTitle className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'} text-lg font-semibold`}>
                {editingBook ? t('form.editTitle') : t('form.createTitle')}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className={`absolute -top-2 ${currentLanguage === 'ar' ? '-left-2' : '-right-2'} h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10`}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
              </Button>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.title')} <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    name="title"
                    value={bookForm.title}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.titlePlaceholder')}
                    required
                    disabled={isSubmitting}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleAr" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.titleAr')} <span className="text-red-500">*</span></Label>
                  <Input
                    id="titleAr"
                    name="titleAr"
                    value={bookForm.titleAr}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.titleArPlaceholder')}
                    required
                    disabled={isSubmitting}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.author')} <span className="text-red-500">*</span></Label>
                  <Select value={bookForm.author} onValueChange={(value) => setBookForm(prev => ({ ...prev, author: value }))} disabled={isSubmitting}>
                    <SelectTrigger className={`bg-white border border-gray-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      <SelectValue placeholder={t('form.fields.authorPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map(author => (
                        <SelectItem key={author._id} value={author._id}>
                          {currentLanguage === 'ar' ? (author.nameAr || author.name) : author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.category')} <span className="text-red-500">*</span></Label>
                  <Select value={bookForm.category} onValueChange={(value) => setBookForm(prev => ({ ...prev, category: value }))} disabled={isSubmitting}>
                    <SelectTrigger className={`bg-white border border-gray-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      <SelectValue placeholder={t('form.fields.categoryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category._id} value={category._id}>
                          {currentLanguage === 'ar' ? (category.name_ar || category.name_en) : (category.name_en || category.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shortDescription" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.shortDescription')} <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={bookForm.shortDescription}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.shortDescriptionPlaceholder')}
                    rows={2}
                    required
                    disabled={isSubmitting}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortDescriptionAr" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.shortDescriptionAr')} <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="shortDescriptionAr"
                    name="shortDescriptionAr"
                    value={bookForm.shortDescriptionAr}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.shortDescriptionArPlaceholder')}
                    rows={2}
                    required
                    disabled={isSubmitting}
                    dir="rtl"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.description')} <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={bookForm.description}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.descriptionPlaceholder')}
                    rows={4}
                    required
                    disabled={isSubmitting}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionAr" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.descriptionAr')} <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="descriptionAr"
                    name="descriptionAr"
                    value={bookForm.descriptionAr}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.descriptionArPlaceholder')}
                    rows={4}
                    required
                    disabled={isSubmitting}
                    dir="rtl"
                    className="w-full"
                  />
                </div>
              </div>

              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImage={bookForm.coverImageUrl}
                uploadType="book-cover"
                label={t('form.fields.coverImage')}
                disabled={isSubmitting}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pages" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.pages')}</Label>
                  <Input
                    id="pages"
                    name="pages"
                    type="number"
                    value={bookForm.pages}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.pagesPlaceholder')}
                    min="1"
                    disabled={isSubmitting}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.language')}</Label>
                  <Input
                    id="language"
                    name="language"
                    value={bookForm.language}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.languagePlaceholder')}
                    disabled={isSubmitting}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="publicationYear" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.publicationYear')} <span className="text-red-500">*</span></Label>
                  <Input
                    id="publicationYear"
                    name="publicationYear"
                    type="number"
                    value={bookForm.publicationYear}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.publicationYearPlaceholder')}
                    min="1000"
                    max={new Date().getFullYear() + 10}
                    required
                    disabled={isSubmitting}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="format" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.format')}</Label>
                  <Select value={bookForm.format} onValueChange={(value) => setBookForm(prev => ({ ...prev, format: value }))} disabled={isSubmitting}>
                    <SelectTrigger className={`bg-white border border-gray-200 w-full ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paperback">{t('formats.paperback')}</SelectItem>
                      <SelectItem value="hardcover">{t('formats.hardcover')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ageGroup" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.ageGroup')}</Label>
                  <Select value={bookForm.ageGroup} onValueChange={(value) => setBookForm(prev => ({ ...prev, ageGroup: value }))} disabled={isSubmitting}>
                    <SelectTrigger className={`bg-white border border-gray-200 w-full ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="children">{t('ageGroups.children')}</SelectItem>
                      <SelectItem value="young-adult">{t('ageGroups.youngAdult')}</SelectItem>
                      <SelectItem value="adult">{t('ageGroups.adult')}</SelectItem>
                      <SelectItem value="all-ages">{t('ageGroups.allAges')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="status" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.status')}</Label>
                  <Select
                    value={bookForm.status}
                    onValueChange={(value) => setBookForm({...bookForm, status: value})}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className={`bg-white border border-gray-200 w-full ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      <SelectValue placeholder={t('form.fields.statusPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">{t('status.published')}</SelectItem>
                      <SelectItem value="not-published">{t('status.notPublished')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.tags')}</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={bookForm.tags}
                  onChange={handleInputChange}
                  placeholder={t('form.fields.tagsPlaceholder')}
                  disabled={isSubmitting}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.metaTitle')}</Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    value={bookForm.metaTitle}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.metaTitlePlaceholder')}
                    disabled={isSubmitting}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaTitleAr" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.metaTitleAr')}</Label>
                  <Input
                    id="metaTitleAr"
                    name="metaTitleAr"
                    value={bookForm.metaTitleAr}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.metaTitleArPlaceholder')}
                    disabled={isSubmitting}
                    dir="rtl"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaDescription" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.metaDescription')}</Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={bookForm.metaDescription}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.metaDescriptionPlaceholder')}
                    rows={2}
                    disabled={isSubmitting}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescriptionAr" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.metaDescriptionAr')}</Label>
                  <Textarea
                    id="metaDescriptionAr"
                    name="metaDescriptionAr"
                    value={bookForm.metaDescriptionAr}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.metaDescriptionArPlaceholder')}
                    rows={2}
                    disabled={isSubmitting}
                    dir="rtl"
                    className="w-full"
                  />
                </div>
              </div>

              <div className={`flex gap-3 ${currentLanguage === 'ar' ? 'justify-end' : 'justify-start '}`}>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200" disabled={isSubmitting}>
                  {isSubmitting ? t('form.buttons.saving') : (editingBook ? t('form.buttons.update') : t('form.buttons.create'))}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)} 
                  disabled={isSubmitting}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  {t('form.buttons.cancel')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile-Optimized Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
            {/* Search Bar - Full width on mobile */}
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full h-10 ${currentLanguage === 'ar' ? 'pr-[30px] text-right' : 'pl-[30px]'}`}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            
            {/* Filter Selects - 2 columns on mobile, row on desktop */}
            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className={`bg-white border border-gray-200 w-full sm:w-32 lg:w-40 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  <SelectValue placeholder={t('filters.status.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.status.all')}</SelectItem>
                  <SelectItem value="not-published">{t('filters.status.notPublished')}</SelectItem>
                  <SelectItem value="published">{t('filters.status.published')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className={`bg-white border border-gray-200 w-full sm:w-32 lg:w-40 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  <SelectValue placeholder={t('filters.category.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.category.all')}</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category._id} value={category._id}>
                      {currentLanguage === 'ar' ? (category.name_ar || category.name_en) : (category.name_en || category.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={authorFilter} onValueChange={setAuthorFilter}>
                <SelectTrigger className={`bg-white border border-gray-200 w-full sm:w-32 lg:w-40 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  <SelectValue placeholder={t('filters.author.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.author.all')}</SelectItem>
                  {authors.map(author => (
                    <SelectItem key={author._id} value={author._id}>
                      {currentLanguage === 'ar' ? (author.nameAr || author.name) : author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger className={`bg-white border border-gray-200 w-full sm:w-32 lg:w-40 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  <SelectValue placeholder={t('filters.featured.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.featured.all')}</SelectItem>
                  <SelectItem value="true">{t('filters.featured.featured')}</SelectItem>
                  <SelectItem value="false">{t('filters.featured.notFeatured')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-modern">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${currentLanguage === 'ar' ? ' text-right' : 'text-left'}`}>
            <Book className="h-5 w-5 text-theme-base" />
            {t('booksCount', { count: totalBooks })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-base mx-auto"></div>
              <p className="text-muted-foreground mt-2">{t('loading.books')}</p>
            </div>
          ) : books.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {books.map((book) => (
                <div key={book._id} className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-3 sm:p-6">
                  {/* Mobile-First Layout */}
                  <div className="flex gap-3 sm:gap-6">
                    {/* Enhanced Book Cover - Mobile Optimized */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={book.coverImageUrl}
                          alt={currentLanguage === 'ar' ? (book.titleAr || book.title) : book.title}
                          className="w-16 h-24 sm:w-24 sm:h-32 object-cover rounded-lg border-2 border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iMTI4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI5NiIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                          }}
                        />
                        <div className={`absolute -top-1 ${currentLanguage === 'ar' ? '-left-1' : '-right-1'}`}>
                          <Badge 
                            variant={book.status === 'published' ? 'default' : 'secondary'}
                            className={`text-xs font-medium px-1.5 py-0.5 ${
                              book.status === 'published' 
                                ? '' 
                                : ''
                            }`}
                          >
                            {t(`status.${book.status === 'published' ? 'published' : 'notPublished'}`)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Book Info - Mobile Optimized */}
                    <div className={`flex-1 min-w-0 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      <div className="mb-2 sm:mb-3">
                        <h3 className={`text-base sm:text-lg font-bold text-gray-900 mb-1 leading-tight ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          {currentLanguage === 'ar' ? (book.titleAr || book.title) : book.title}
                        </h3>
                        <p className={`text-xs sm:text-sm text-gray-600 mb-1 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          {t('table.unknownAuthor').replace('Unknown Author', '')} {currentLanguage === 'ar' ? (book.author?.nameAr || book.author?.name || t('table.unknownAuthor')) : (book.author?.name || t('table.unknownAuthor'))}
                        </p>
                        <p className={`text-xs sm:text-sm text-blue-600 font-medium ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          {currentLanguage === 'ar' ? (book.category?.name_ar || book.category?.name_en || t('table.unknownCategory')) : (book.category?.name_en || book.category?.name || t('table.unknownCategory'))}
                        </p>
                      </div>
                      
                      {/* Mobile-Friendly Metadata */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 flex-row">
                        {book.pages && (
                          <div className="flex items-center gap-1">
                            <Book className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                            <span>{t('table.pagesCount', { count: book.pages })}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                          <span>{book.publicationYear}</span>
                        </div>
                        <div className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                          {t(`formats.${book.format}`) || book.format}
                        </div>
                      </div>
                      
                      {/* Mobile Reviews Section */}
                      <div className="mt-2 sm:hidden">
                        <div className="flex items-center gap-2 text-xs text-gray-600 flex-row">
                          <span>{t('table.reviewsCount', { count: book.totalReviews })}</span>
                          {book.averageRating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="font-medium">{book.averageRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Mobile-Optimized Action Section */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {/* Desktop Reviews and Rating (hidden on mobile) */}
                    <div className="hidden sm:flex items-center justify-between mb-3">
                      <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                        <div className="text-sm font-medium text-gray-700">
                          {t('table.reviewsCount', { count: book.totalReviews })}
                        </div>
                        {book.averageRating > 0 && (
                          <div className={`flex items-center gap-1 text-sm mt-1 ${currentLanguage === 'ar' ? 'justify-end' : 'justify-start'}`}>
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium text-gray-700">{book.averageRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile-First Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      {/* Status Selector - Full width on mobile */}
                      <div className="flex-1 sm:flex-none">
                        <Select value={book.status} onValueChange={(value) => handleStatusChange(book, value)}>
                          <SelectTrigger className={`bg-white border border-gray-200 w-full sm:w-36 h-10 flex-row ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-published">{t('status.notPublished')}</SelectItem>
                            <SelectItem value="published">{t('status.published')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Action Buttons - Better touch targets */}
                      <div className="flex gap-2 sm:gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(book)}
                          className="flex-1 sm:flex-none border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200 h-10 px-4"
                          title={t('actions.edit')}
                        >
                          <Edit className="h-4 w-4 sm:mr-0 mr-2" />
                          <span className="sm:hidden">{t('actions.edit')}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(book)}
                          className="flex-1 sm:flex-none border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 h-10 px-4"
                          title={t('actions.delete')}
                        >
                          <Trash2 className="h-4 w-4 sm:mr-0 mr-2" />
                          <span className="sm:hidden">{t('actions.delete')}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className={`flex justify-center items-center gap-3 mt-8 flex-row ${currentLanguage === 'ar' ? '' : ''}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {t('pagination.previous')}
                  </Button>
                  <span className="text-sm font-medium text-gray-700 px-3 py-2 bg-gray-50 rounded-lg">
                    {t('pagination.page', { current: currentPage, total: totalPages })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {t('pagination.next')}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className={`text-center py-12 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Book className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('empty.noBooks')}</h3>
                <p className="text-gray-500 max-w-md">{t('empty.noResults')}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBookToDelete(null);
        }}
        onConfirm={confirmDeleteBook}
        title={t('deleteModal.title')}
        description={t('deleteModal.description', { 
          title: currentLanguage === 'ar' ? (bookToDelete?.titleAr || bookToDelete?.title) : bookToDelete?.title 
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