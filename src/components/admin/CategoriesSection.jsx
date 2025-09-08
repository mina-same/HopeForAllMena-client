import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderOpen, Book, Search, Star, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { categoriesAPI } from '../../services/publishingAPI';
import ConfirmationModal from '../ui/ConfirmationModal';

const categoryIcons = [
  'FolderOpen', 'Book', 'Tag', 'Code', 'Database', 'Shield', 'Cloud', 'Brain', 'Heart', 'Star', 'Rocket', 'Search'
];

const categoryColors = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-red-100 text-red-800 border-red-200',
  'bg-yellow-100 text-yellow-800 border-yellow-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-pink-100 text-pink-800 border-pink-200'
];

export function CategoriesSection() {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [categoryForm, setCategoryForm] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    icon: 'Book',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    parentCategory: 'none',
    sortOrder: 0
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        sortBy: 'createdAt',
        sortOrder: 'asc'
      };

      console.log('Frontend: Fetching categories with params:', params);
      console.log('Frontend: Auth token exists:', !!localStorage.getItem('authToken'));
      console.log('Frontend: User logged in:', !!localStorage.getItem('user'));
      const response = await categoriesAPI.getCategories(params);
      console.log('Frontend: Categories response:', response.data);
      console.log('Frontend: Categories data:', response.data.data.categories);
      response.data.data.categories.forEach(cat => {
        console.log(`Frontend: Category ${cat.name_en} has booksCount: ${cat.booksCount}`);
      });
      setCategories(response.data.data.categories);
      setTotalPages(response.data.data.pagination.totalPages);
      setTotalCategories(response.data.data.pagination.totalCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Validation errors:', error.response?.data?.errors);

      if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to access categories.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch categories. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm, statusFilter]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!categoryForm.name_en.trim()) {
        toast({
          title: "Validation Error",
          description: "Category name (English) is required.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      if (!categoryForm.name_ar.trim()) {
        toast({
          title: "Validation Error",
          description: "Category name (Arabic) is required.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      if (categoryForm.description_en.trim().length < 10) {
        toast({
          title: "Validation Error",
          description: "Category description (English) must be at least 10 characters long.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      if (categoryForm.description_ar.trim().length < 10) {
        toast({
          title: "Validation Error",
          description: "Category description (Arabic) must be at least 10 characters long.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Create form data without parentCategory first
      const { parentCategory, ...formDataWithoutParent } = categoryForm;

      const formData = {
        ...formDataWithoutParent,
        sortOrder: parseInt(categoryForm.sortOrder) || 0,
        status: 'active' // Default status since we removed it from the form
      };

      // Only include parentCategory if it's a valid ObjectId (not 'none' or empty)
      if (parentCategory &&
        parentCategory !== 'none' &&
        parentCategory !== '' &&
        parentCategory.length === 24) { // MongoDB ObjectId is 24 characters
        formData.parentCategory = parentCategory;
      }

      console.log('Submitting category data:', formData); // Debug log
      console.log('Suggested unique name:', `${formData.name_en}_${Date.now()}`);

      if (editingCategory) {
        await categoriesAPI.updateCategory(editingCategory._id, formData);
        toast({
          title: "Category Updated",
          description: `${categoryForm.name_en} has been updated successfully.`,
        });
      } else {
        await categoriesAPI.createCategory(formData);
        toast({
          title: "Category Added",
          description: `${categoryForm.name_en} has been added successfully.`,
        });
      }

      setIsDialogOpen(false);
      setEditingCategory(null);
      setCategoryForm({
        name_en: '',
        name_ar: '',
        description_en: '',
        description_ar: '',
        icon: 'Book',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        parentCategory: 'none',
        sortOrder: 0
      });
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      console.error('Category creation error details:', error.response?.data);
      console.error('Category creation error status:', error.response?.status);
      console.error('Category validation errors:', error.response?.data?.errors);
      if (error.response?.data?.errors?.length > 0) {
        console.error('First validation error:', error.response.data.errors[0]);
      }
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name_en: category.name_en || '',
      name_ar: category.name_ar || '',
      description_en: category.description_en || '',
      description_ar: category.description_ar || '',
      icon: category.icon,
      color: category.color,
      parentCategory: category.parentCategory?._id || 'none',
      sortOrder: category.sortOrder
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await categoriesAPI.deleteCategory(categoryToDelete._id);
      toast({
        title: "Category Deleted",
        description: `${categoryToDelete.name} has been deleted successfully.`,
      });
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };


  const handleStatusChange = async (category, newStatus) => {
    try {
      await categoriesAPI.updateCategoryStatus(category._id, newStatus);
      toast({
        title: "Category Updated",
        description: `${category.name} status has been updated to ${newStatus}.`,
      });
      fetchCategories();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: "Error",
        description: "Failed to update category status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openAddDialog = () => {
    setEditingCategory(null);
    setCategoryForm({
      name_en: '',
      name_ar: '',
      description_en: '',
      description_ar: '',
      icon: 'Book',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      parentCategory: 'none',
      sortOrder: 0
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
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Categories Management</h2>
          <p className="text-muted-foreground text-sm md:text-base">Manage your publishing house book categories</p>
        </div>
        <Button onClick={openAddDialog} className=" text-white shadow-elegant hover:shadow-lg transition-all duration-300">
          <Plus className="h-4 w-4 mr-2" />
          Add New Category
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_en">Name (English) *</Label>
                  <Input
                    id="name_en"
                    name="name_en"
                    value={categoryForm.name_en}
                    onChange={handleInputChange}
                    placeholder="Category name in English"
                    required
                    disabled={isSubmitting}
                    className="pl-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_ar">Name (Arabic) *</Label>
                  <Input
                    id="name_ar"
                    name="name_ar"
                    value={categoryForm.name_ar}
                    onChange={handleInputChange}
                    placeholder="اسم الفئة بالعربية"
                    required
                    disabled={isSubmitting}
                    className="pl-2"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description_en">Description (English) * (min 10 characters)</Label>
                  <Textarea
                    id="description_en"
                    name="description_en"
                    value={categoryForm.description_en}
                    onChange={handleInputChange}
                    placeholder="Enter a detailed description of the category in English (minimum 10 characters)..."
                    rows={3}
                    required
                    minLength={10}
                    disabled={isSubmitting}
                    className={categoryForm.description_en.length > 0 && categoryForm.description_en.length < 10 ? 'border-red-300' : ''}
                  />
                  {categoryForm.description_en.length > 0 && categoryForm.description_en.length < 10 && (
                    <p className="text-sm text-red-600">Description must be at least 10 characters long</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_ar">Description (Arabic) * (min 10 characters)</Label>
                  <Textarea
                    id="description_ar"
                    name="description_ar"
                    value={categoryForm.description_ar}
                    onChange={handleInputChange}
                    placeholder="أدخل وصفاً مفصلاً للفئة باللغة العربية (10 أحرف على الأقل)..."
                    rows={3}
                    required
                    minLength={10}
                    disabled={isSubmitting}
                    dir="rtl"
                    className={categoryForm.description_ar.length > 0 && categoryForm.description_ar.length < 10 ? 'border-red-300' : ''}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    value={categoryForm.sortOrder}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    disabled={isSubmitting}
                    className="pl-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={categoryForm.icon} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, icon: value }))} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryIcons.map(icon => (
                        <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color Theme</Label>
                  <Select value={categoryForm.color} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, color: value }))} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryColors.map(color => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${color.split(' ')[0]}`}></div>
                            {color.split(' ')[0].replace('bg-', '').replace('-100', '')}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentCategory">Parent Category</Label>
                <Select value={categoryForm.parentCategory} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, parentCategory: value }))} disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent category</SelectItem>
                    {categories.filter(cat => cat._id !== editingCategory?._id).map(category => (
                      <SelectItem key={category._id} value={category._id}>{category.name_en || category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" className=" text-white" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingCategory ? 'Update Category' : 'Add Category')}
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
                  placeholder="Search categories..."
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
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-theme-base" />
            Categories ({totalCategories})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-base mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading categories...</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${category.color}`}>
                      <FolderOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{category.name_en || category.name}</h3>
                        <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
                          {category.status}
                        </Badge>
                        {category.parentCategory && (
                          <Badge variant="outline">
                            Subcategory
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Book className="h-4 w-4" />
                          {category.booksCount || 0} book{(category.booksCount || 0) !== 1 ? 's' : ''}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Sort: {category.sortOrder}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(category.createdAt)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select value={category.status} onValueChange={(value) => handleStatusChange(category, value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category)}
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
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No categories found. Add your first category to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
        }}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone and will permanently remove the category from the system.`}
        confirmText="Delete Category"
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