import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Book, Calendar, Users, Search, Star, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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

export function AuthorsSection() {
  const { toast } = useToast();
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
        sortOrder: 'desc'
      };

      const response = await authorsAPI.getAuthors(params);
      setAuthors(response.data.data.authors);
      setTotalPages(response.data.data.pagination.totalPages);
      setTotalAuthors(response.data.data.pagination.totalAuthors);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch authors. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [currentPage, searchTerm, statusFilter, featuredFilter]);

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
        title: "Validation Error",
        description: "English biography must be at least 10 characters long.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (authorForm.biographyAr.length < 10) {
      toast({
        title: "Validation Error", 
        description: "Arabic biography must be at least 10 characters long.",
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
          title: "Author Updated",
          description: `${authorForm.name} has been updated successfully.`,
        });
      } else {
        console.log('Creating new author with data:', authorForm);
        await authorsAPI.createAuthor(authorForm);
        toast({
          title: "Author Added",
          description: `${authorForm.name} has been added successfully.`,
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
        title: "Error",
        description: error.response?.data?.message || "Failed to save author. Please try again.",
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
        title: "Author Deleted",
        description: `${authorToDelete.name} has been deleted successfully.`,
      });
      fetchAuthors();
    } catch (error) {
      console.error('Failed to delete author:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete author. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setAuthorToDelete(null);
    }
  };

  const handleToggleFeatured = async (author) => {
    try {
      await authorsAPI.toggleAuthorFeatured(author._id);
      toast({
        title: "Author Updated",
        description: `${author.name} has been ${author.featured ? 'unfeatured' : 'featured'}.`,
      });
      fetchAuthors();
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (author, newStatus) => {
    try {
      await authorsAPI.updateAuthorStatus(author._id, newStatus);
      toast({
        title: "Author Updated",
        description: `${author.name} status has been updated to ${newStatus}.`,
      });
      fetchAuthors();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: "Error",
        description: "Failed to update author status. Please try again.",
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Authors Management</h2>
          <p className="text-muted-foreground text-sm md:text-base">Manage your publishing house authors</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className=" text-white shadow-elegant hover:shadow-lg transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Add New Author
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAuthor ? 'Edit Author' : 'Add New Author'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImage={authorForm.avatarUrl}
                uploadType="author-image"
                label="Author Avatar"
                disabled={isSubmitting}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name (English) *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={authorForm.name}
                    onChange={handleInputChange}
                    placeholder="Author name in English"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr">Name (Arabic) *</Label>
                  <Input
                    id="nameAr"
                    name="nameAr"
                    value={authorForm.nameAr}
                    onChange={handleInputChange}
                    placeholder="اسم المؤلف بالعربية"
                    required
                    disabled={isSubmitting}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="biography">Biography (English) * (min 10 characters)</Label>
                  <Textarea
                    id="biography"
                    name="biography"
                    value={authorForm.biography}
                    onChange={handleInputChange}
                    placeholder="Enter a detailed biography of the author in English (minimum 10 characters)..."
                    rows={4}
                    required
                    minLength={10}
                    disabled={isSubmitting}
                    className={authorForm.biography.length > 0 && authorForm.biography.length < 10 ? 'border-red-300' : ''}
                  />
                  {authorForm.biography.length > 0 && authorForm.biography.length < 10 && (
                    <p className="text-sm text-red-600">Biography must be at least 10 characters long</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biographyAr">Biography (Arabic) * (min 10 characters)</Label>
                  <Textarea
                    id="biographyAr"
                    name="biographyAr"
                    value={authorForm.biographyAr}
                    onChange={handleInputChange}
                    placeholder="أدخل سيرة ذاتية مفصلة للمؤلف باللغة العربية (10 أحرف على الأقل)..."
                    rows={4}
                    required
                    minLength={10}
                    disabled={isSubmitting}
                    dir="rtl"
                    className={authorForm.biographyAr.length > 0 && authorForm.biographyAr.length < 10 ? 'border-red-300' : ''}
                  />
                </div>
              </div>


              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" className=" text-white" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingAuthor ? 'Update Author' : 'Add Author')}
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
                  placeholder="Search authors..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                <SelectItem value="true">Featured</SelectItem>
                <SelectItem value="false">Not Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Authors ({totalAuthors})</h3>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 mx-auto"></div>
              <p className="text-gray-500 mt-3">Loading authors...</p>
            </div>
          ) : authors.length > 0 ? (
            <div className="space-y-3">
              {authors.map((author) => (
                <div key={author._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                  <div className="flex gap-6">
                    {/* Author Image */}
                    <div className="flex-shrink-0">
                      <Avatar className="h-20 w-20 border-2 border-gray-100 shadow-sm">
                        <AvatarImage src={author.avatarUrl} alt={author.name} />
                        <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 font-semibold text-xl">
                          {author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    {/* Author Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="font-semibold text-gray-900 text-xl">{author.name}</h4>
                            {author.featured && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                ⭐ Featured
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              author.status === 'active' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}>
                              {author.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="font-medium">{author.booksCount} book{author.booksCount !== 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>Added {formatDate(author.createdAt)}</span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFeatured(author)}
                            className="h-9 w-9 p-0 hover:bg-gray-100 rounded-lg"
                            title={author.featured ? 'Unfeature' : 'Feature'}
                          >
                            {author.featured ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Select value={author.status} onValueChange={(value) => handleStatusChange(author, value)}>
                            <SelectTrigger className="w-24 h-9 text-xs border-gray-300 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(author)}
                            className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(author)}
                            className="h-9 w-9 p-0 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No authors found. Add your first author to get started.</p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border-gray-300"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 px-3">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="border-gray-300"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setAuthorToDelete(null);
        }}
        onConfirm={confirmDeleteAuthor}
        title="Delete Author"
        description={`Are you sure you want to delete "${authorToDelete?.name}"? This action cannot be undone and will permanently remove the author from the system.`}
        confirmText="Delete Author"
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