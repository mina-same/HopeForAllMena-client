import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, Calendar, Search, Book } from 'lucide-react';
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

export function BooksSection() {
  const { toast } = useToast();
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
        title: "Error",
        description: "Failed to fetch books. Please try again.",
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
          title: "Validation Error",
          description: `Please fill in all required fields: ${missingFields.join(', ')}`,
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
          title: "Validation Error",
          description: "Arabic short description must be at least 10 characters long.",
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
          title: "Validation Error",
          description: "Please enter a valid publication year between 1000 and " + (new Date().getFullYear() + 10),
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
            title: "Validation Error",
            description: "Cover image URL must be a valid image URL ending with .jpg, .jpeg, .png, .gif, or .webp",
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
          title: "Book Updated",
          description: `${bookForm.title} has been updated successfully.`,
        });
      } else {
        await booksAPI.createBook(formData);
        toast({
          title: "Book Created",
          description: `${bookForm.title} has been added successfully.`,
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
      let errorMessage = "Failed to save book. Please try again.";
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.keys(errors).map(field => `${field}: ${errors[field]}`).join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Error",
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
        title: "Book Deleted",
        description: `${bookToDelete.title} has been deleted successfully.`,
      });
      fetchBooks();
    } catch (error) {
      console.error('Failed to delete book:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete book. Please try again.",
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
        title: "Book Updated",
        description: `${book.title} status has been updated to ${newStatus}.`,
      });
      fetchBooks();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: "Error",
        description: "Failed to update book status. Please try again.",
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Books Management</h2>
          <p className="text-muted-foreground text-sm md:text-base">Manage your publishing house book catalog</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="text-white shadow-elegant hover:shadow-lg transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Add New Book
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 min-w-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    name="title"
                    value={bookForm.title}
                    onChange={handleInputChange}
                    placeholder="Enter book title"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleAr">Title (Arabic) <span className="text-red-500">*</span></Label>
                  <Input
                    id="titleAr"
                    name="titleAr"
                    value={bookForm.titleAr}
                    onChange={handleInputChange}
                    placeholder="عنوان الكتاب"
                    required
                    disabled={isSubmitting}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author <span className="text-red-500">*</span></Label>
                  <Select value={bookForm.author} onValueChange={(value) => setBookForm(prev => ({ ...prev, author: value }))} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map(author => (
                        <SelectItem key={author._id} value={author._id}>{author.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Select value={bookForm.category} onValueChange={(value) => setBookForm(prev => ({ ...prev, category: value }))} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name_en} {category.name_ar && `(${category.name_ar})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={bookForm.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Brief description of the book..."
                    rows={2}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortDescriptionAr">Short Description (Arabic) <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="shortDescriptionAr"
                    name="shortDescriptionAr"
                    value={bookForm.shortDescriptionAr}
                    onChange={handleInputChange}
                    placeholder="وصف مختصر للكتاب..."
                    rows={2}
                    required
                    disabled={isSubmitting}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={bookForm.description}
                    onChange={handleInputChange}
                    placeholder="Detailed description of the book..."
                    rows={4}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">Description (Arabic) <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="descriptionAr"
                    name="descriptionAr"
                    value={bookForm.descriptionAr}
                    onChange={handleInputChange}
                    placeholder="وصف مفصل للكتاب..."
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
                label="Book Cover Image"
                disabled={isSubmitting}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pages">Pages (Optional)</Label>
                  <Input
                    id="pages"
                    name="pages"
                    type="number"
                    value={bookForm.pages}
                    onChange={handleInputChange}
                    placeholder="350"
                    min="1"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    name="language"
                    value={bookForm.language}
                    onChange={handleInputChange}
                    placeholder="English"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publicationYear">Publication Year <span className="text-red-500">*</span></Label>
                  <Input
                    id="publicationYear"
                    name="publicationYear"
                    type="number"
                    value={bookForm.publicationYear}
                    onChange={handleInputChange}
                    placeholder="2024"
                    min="1000"
                    max={new Date().getFullYear() + 10}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select value={bookForm.format} onValueChange={(value) => setBookForm(prev => ({ ...prev, format: value }))} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paperback">Paperback</SelectItem>
                      <SelectItem value="hardcover">Hardcover</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ageGroup">Age Group</Label>
                  <Select value={bookForm.ageGroup} onValueChange={(value) => setBookForm(prev => ({ ...prev, ageGroup: value }))} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="children">Children</SelectItem>
                      <SelectItem value="young-adult">Young Adult</SelectItem>
                      <SelectItem value="adult">Adult</SelectItem>
                      <SelectItem value="all-ages">All Ages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={bookForm.status}
                    onValueChange={(value) => setBookForm({...bookForm, status: value})}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="not-published">Not Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={bookForm.tags}
                  onChange={handleInputChange}
                  placeholder="fiction, adventure, fantasy (comma-separated)"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    value={bookForm.metaTitle}
                    onChange={handleInputChange}
                    placeholder="SEO meta title"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaTitleAr">Meta Title (Arabic)</Label>
                  <Input
                    id="metaTitleAr"
                    name="metaTitleAr"
                    value={bookForm.metaTitleAr}
                    onChange={handleInputChange}
                    placeholder="عنوان الميتا"
                    disabled={isSubmitting}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={bookForm.metaDescription}
                    onChange={handleInputChange}
                    placeholder="SEO meta description"
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescriptionAr">Meta Description (Arabic)</Label>
                  <Textarea
                    id="metaDescriptionAr"
                    name="metaDescriptionAr"
                    value={bookForm.metaDescriptionAr}
                    onChange={handleInputChange}
                    placeholder="وصف الميتا"
                    rows={2}
                    disabled={isSubmitting}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" className=" text-white" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingBook ? 'Update Book' : 'Add Book')}
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-[30px]"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not-published">Not Published</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name_en} {category.name_ar && `(${category.name_ar})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                {authors.map(author => (
                  <SelectItem key={author._id} value={author._id}>{author.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Books</SelectItem>
                <SelectItem value="true">Featured</SelectItem>
                <SelectItem value="false">Not Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5 text-theme-base" />
            Books ({totalBooks})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-base mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading books...</p>
            </div>
          ) : books.length > 0 ? (
            <div className="space-y-4">
              {books.map((book) => (
                <div key={book._id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={book.coverImageUrl}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjgwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{book.title}</h3>
                        <Badge variant={book.status === 'published' ? 'default' : 'secondary'}>
                          {book.status === 'published' ? 'Published' : 'Not Published'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">by {book.author?.name || 'Unknown Author'}</p>
                      <p className="text-sm text-muted-foreground">{book.category?.name_en || 'Unknown Category'}</p>
                      <div className="flex items-center gap-4 mt-1">
                        {book.pages && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Book className="h-4 w-4" />
                            {book.pages} pages
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {book.publicationYear}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {book.format}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {book.totalReviews} review{book.totalReviews !== 1 ? 's' : ''}
                      </div>
                      {book.averageRating > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          {book.averageRating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Select value={book.status} onValueChange={(value) => handleStatusChange(book, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-published">Not Published</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(book)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(book)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No books found. Add your first book to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBookToDelete(null);
        }}
        onConfirm={confirmDeleteBook}
        title="Delete Book"
        description={`Are you sure you want to delete "${bookToDelete?.title}"? This action cannot be undone and will permanently remove the book from the system.`}
        confirmText="Delete Book"
        cancelText="Cancel"
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