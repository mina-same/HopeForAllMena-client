import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, Calendar, Book } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { booksAPI, authorsAPI, categoriesAPI } from '../../services/publishingAPI';
import ConfirmationModal from '../ui/ConfirmationModal';
import ImageUpload from '../ui/image-upload';
import { DataTable } from '../ui/DataTable';
import { AdminModal } from '../ui/AdminModal';
import { SectionShell, SearchInput } from '../ui/SectionShell';
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
        toast({
          title: t('form.validation.missingFields', { fields: missingFields.join(', ') }),
          description: t('form.validation.missingFields', { fields: missingFields.join(', ') }),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      if (bookForm.shortDescriptionAr.trim().length < 10) {
        toast({
          title: t('form.validation.shortDescriptionMinLength'),
          description: t('form.validation.shortDescriptionMinLength'),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

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

      if (bookForm.pages) formData.pages = parseInt(bookForm.pages);
      if (bookForm.metaTitle?.trim()) formData.metaTitle = bookForm.metaTitle.trim();
      if (bookForm.metaDescription?.trim()) formData.metaDescription = bookForm.metaDescription.trim();
      if (bookForm.metaTitleAr?.trim()) formData.metaTitleAr = bookForm.metaTitleAr.trim();
      if (bookForm.metaDescriptionAr?.trim()) formData.metaDescriptionAr = bookForm.metaDescriptionAr.trim();

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

  // ── Derived ─────────────────────────────────────────────────
  const isRTL = currentLanguage === 'ar';
  const dir   = isRTL ? 'rtl' : 'ltr';

  const bookTitle = (b) => isRTL ? b?.titleAr || b?.title : b?.title;

  // ── Table columns ────────────────────────────────────────────
  const columns = [
    {
      key: 'cover',
      label: '',
      width: 'w-14',
      skeletonWidth: '48px',
      render: (book) => (
        <div className="relative w-10 flex-shrink-0">
          <img
            src={book.coverImageUrl}
            alt={bookTitle(book)}
            className="w-10 h-14 object-cover rounded border border-border"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjU2IiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';
            }}
          />
        </div>
      ),
    },
    {
      key: 'info',
      label: t('form.fields.title'),
      render: (book) => {
        const authorDisplay = isRTL
          ? book.author?.nameAr || book.author?.name || t('table.unknownAuthor')
          : book.author?.name || t('table.unknownAuthor');
        const categoryDisplay = isRTL
          ? book.category?.name_ar || book.category?.name_en || t('table.unknownCategory')
          : book.category?.name_en || book.category?.name || t('table.unknownCategory');
        return (
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="font-medium text-foreground leading-snug truncate max-w-[220px]">
              {bookTitle(book)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{authorDisplay}</p>
            <p className="text-xs text-brand mt-0.5">{categoryDisplay}</p>
          </div>
        );
      },
    },
    {
      key: 'meta',
      label: 'Year / Format',
      skeletonWidth: '80px',
      render: (book) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span className="tabular-nums">{book.publicationYear}</span>
          </div>
          {book.pages && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Book className="h-3 w-3" />
              <span className="tabular-nums">{book.pages}p</span>
            </div>
          )}
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
            {t(`formats.${book.format}`) || book.format}
          </span>
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      align: 'center',
      skeletonWidth: '50px',
      render: (book) => (
        <div className="text-center">
          {book.averageRating > 0 ? (
            <div className="flex items-center gap-1 justify-center">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
              <span className="text-xs font-medium tabular-nums">{book.averageRating.toFixed(1)}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
          <p className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">{book.totalReviews || 0} reviews</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: t('form.fields.status'),
      skeletonWidth: '100px',
      render: (book) => (
        <Select value={book.status} onValueChange={(value) => handleStatusChange(book, value)}>
          <SelectTrigger className="h-7 w-[120px] text-xs border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-published">{t('status.notPublished')}</SelectItem>
            <SelectItem value="published">{t('status.published')}</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: '_actions',
      label: '',
      align: 'end',
      skeletonWidth: '64px',
      render: (book) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(book)}
            className="h-8 w-8 p-0 hover:bg-muted rounded-md"
            title={t('actions.edit')}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(book)}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive rounded-md"
            title={t('actions.delete')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // ── Render ───────────────────────────────────────────────────
  return (
    <SectionShell
      title={t('title')}
      subtitle={t('description')}
      dir={dir}
      actions={
        <Button onClick={openAddDialog}>
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('addBook')}
        </Button>
      }
      filters={
        <>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            dir={dir}
          />
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder={t('filters.status.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.status.all')}</SelectItem>
                <SelectItem value="not-published">{t('filters.status.notPublished')}</SelectItem>
                <SelectItem value="published">{t('filters.status.published')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder={t('filters.category.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.category.all')}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category._id} value={category._id}>
                    {isRTL ? (category.name_ar || category.name_en) : (category.name_en || category.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder={t('filters.author.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.author.all')}</SelectItem>
                {authors.map(author => (
                  <SelectItem key={author._id} value={author._id}>
                    {isRTL ? (author.nameAr || author.name) : author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      }
    >
      {/* ── Data table ──────────────────────────── */}
      <DataTable
        columns={columns}
        data={books}
        loading={loading}
        emptyTitle={t('empty.noBooks')}
        emptyDescription={t('empty.noResults')}
        emptyIcon={Book}
        countLabel={t('booksCount', { count: totalBooks })}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        dir={dir}
      />

      {/* ── Add / Edit book ──────────────────────── */}
      <AdminModal
        open={isDialogOpen}
        onClose={handleCloseDialog}
        title={editingBook ? t('form.editTitle') : t('form.createTitle')}
        size="lg"
        dir={dir}
        disabled={isSubmitting}
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSubmitting}
            >
              {t('form.buttons.cancel')}
            </Button>
            <Button
              type="submit"
              form="book-form"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t('form.buttons.saving')
                : editingBook
                  ? t('form.buttons.update')
                  : t('form.buttons.create')}
            </Button>
          </>
        }
      >
        <form id="book-form" onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('form.fields.title')} <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                name="title"
                value={bookForm.title}
                onChange={handleInputChange}
                placeholder={t('form.fields.titlePlaceholder')}
                required
                disabled={isSubmitting}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleAr">{t('form.fields.titleAr')} <span className="text-destructive">*</span></Label>
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
              <Label htmlFor="author">{t('form.fields.author')} <span className="text-destructive">*</span></Label>
              <Select value={bookForm.author} onValueChange={(value) => setBookForm(prev => ({ ...prev, author: value }))} disabled={isSubmitting}>
                <SelectTrigger className="border-border">
                  <SelectValue placeholder={t('form.fields.authorPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {authors.map(author => (
                    <SelectItem key={author._id} value={author._id}>
                      {isRTL ? (author.nameAr || author.name) : author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{t('form.fields.category')} <span className="text-destructive">*</span></Label>
              <Select value={bookForm.category} onValueChange={(value) => setBookForm(prev => ({ ...prev, category: value }))} disabled={isSubmitting}>
                <SelectTrigger className="border-border">
                  <SelectValue placeholder={t('form.fields.categoryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category._id} value={category._id}>
                      {isRTL ? (category.name_ar || category.name_en) : (category.name_en || category.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shortDescription">{t('form.fields.shortDescription')} <span className="text-destructive">*</span></Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                value={bookForm.shortDescription}
                onChange={handleInputChange}
                placeholder={t('form.fields.shortDescriptionPlaceholder')}
                rows={2}
                required
                disabled={isSubmitting}
                dir={dir}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescriptionAr">{t('form.fields.shortDescriptionAr')} <span className="text-destructive">*</span></Label>
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
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">{t('form.fields.description')} <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                name="description"
                value={bookForm.description}
                onChange={handleInputChange}
                placeholder={t('form.fields.descriptionPlaceholder')}
                rows={4}
                required
                disabled={isSubmitting}
                dir={dir}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionAr">{t('form.fields.descriptionAr')} <span className="text-destructive">*</span></Label>
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
              <Label htmlFor="pages">{t('form.fields.pages')}</Label>
              <Input
                id="pages"
                name="pages"
                type="number"
                value={bookForm.pages}
                onChange={handleInputChange}
                placeholder={t('form.fields.pagesPlaceholder')}
                min="1"
                disabled={isSubmitting}
                dir={dir}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">{t('form.fields.language')}</Label>
              <Input
                id="language"
                name="language"
                value={bookForm.language}
                onChange={handleInputChange}
                placeholder={t('form.fields.languagePlaceholder')}
                disabled={isSubmitting}
                dir={dir}
              />
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="publicationYear">{t('form.fields.publicationYear')} <span className="text-destructive">*</span></Label>
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
                dir={dir}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">{t('form.fields.format')}</Label>
              <Select value={bookForm.format} onValueChange={(value) => setBookForm(prev => ({ ...prev, format: value }))} disabled={isSubmitting}>
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paperback">{t('formats.paperback')}</SelectItem>
                  <SelectItem value="hardcover">{t('formats.hardcover')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ageGroup">{t('form.fields.ageGroup')}</Label>
              <Select value={bookForm.ageGroup} onValueChange={(value) => setBookForm(prev => ({ ...prev, ageGroup: value }))} disabled={isSubmitting}>
                <SelectTrigger className="border-border">
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
              <Label htmlFor="status">{t('form.fields.status')}</Label>
              <Select
                value={bookForm.status}
                onValueChange={(value) => setBookForm({ ...bookForm, status: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger className="border-border">
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
            <Label htmlFor="tags">{t('form.fields.tags')}</Label>
            <Input
              id="tags"
              name="tags"
              value={bookForm.tags}
              onChange={handleInputChange}
              placeholder={t('form.fields.tagsPlaceholder')}
              disabled={isSubmitting}
              dir={dir}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">{t('form.fields.metaTitle')}</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                value={bookForm.metaTitle}
                onChange={handleInputChange}
                placeholder={t('form.fields.metaTitlePlaceholder')}
                disabled={isSubmitting}
                dir={dir}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaTitleAr">{t('form.fields.metaTitleAr')}</Label>
              <Input
                id="metaTitleAr"
                name="metaTitleAr"
                value={bookForm.metaTitleAr}
                onChange={handleInputChange}
                placeholder={t('form.fields.metaTitleArPlaceholder')}
                disabled={isSubmitting}
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaDescription">{t('form.fields.metaDescription')}</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={bookForm.metaDescription}
                onChange={handleInputChange}
                placeholder={t('form.fields.metaDescriptionPlaceholder')}
                rows={2}
                disabled={isSubmitting}
                dir={dir}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescriptionAr">{t('form.fields.metaDescriptionAr')}</Label>
              <Textarea
                id="metaDescriptionAr"
                name="metaDescriptionAr"
                value={bookForm.metaDescriptionAr}
                onChange={handleInputChange}
                placeholder={t('form.fields.metaDescriptionArPlaceholder')}
                rows={2}
                disabled={isSubmitting}
                dir="rtl"
              />
            </div>
          </div>
        </form>
      </AdminModal>

      {/* ── Delete confirmation ──────────────────── */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setBookToDelete(null); }}
        onConfirm={confirmDeleteBook}
        title={t('deleteModal.title')}
        description={t('deleteModal.description', {
          title: bookToDelete ? bookTitle(bookToDelete) : '',
        })}
        confirmText={t('deleteModal.confirmText')}
        cancelText={t('deleteModal.cancelText')}
        variant="danger"
        isLoading={isDeleting}
      />
    </SectionShell>
  );
}

// GraphQL query for i18n support
