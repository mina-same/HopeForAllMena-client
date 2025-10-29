import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderOpen, Book, Search, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { categoriesAPI } from '../../services/publishingAPI';
import ConfirmationModal from '../ui/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';

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
  const { t } = useTranslation('CategoriesManagement');
  const { language: currentLanguage } = useI18next();
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
      const { authStorage } = require('../../utils/storage');
      console.log('Frontend: Auth token exists:', !!authStorage.getToken());
      console.log('Frontend: User logged in:', !!authStorage.getUser());
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
          title: t('errors.authError'),
          description: t('errors.authError'),
          variant: "destructive"
        });
      } else {
        toast({
          title: t('errors.loadCategories'),
          description: error.response?.data?.message || t('errors.loadCategories'),
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm, statusFilter, fetchCategories]);

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
          title: t('form.validation.nameEnRequired'),
          description: t('form.validation.nameEnRequired'),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      if (!categoryForm.name_ar.trim()) {
        toast({
          title: t('form.validation.nameArRequired'),
          description: t('form.validation.nameArRequired'),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      if (categoryForm.description_en.trim().length < 10) {
        toast({
          title: t('form.validation.descriptionEnMinLength'),
          description: t('form.validation.descriptionEnMinLength'),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      if (categoryForm.description_ar.trim().length < 10) {
        toast({
          title: t('form.validation.descriptionArMinLength'),
          description: t('form.validation.descriptionArMinLength'),
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
          title: t('success.categoryUpdated', { name: categoryForm.name_en }),
          description: t('success.categoryUpdated', { name: categoryForm.name_en }),
        });
      } else {
        await categoriesAPI.createCategory(formData);
        toast({
          title: t('success.categoryAdded', { name: categoryForm.name_en }),
          description: t('success.categoryAdded', { name: categoryForm.name_en }),
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
        title: t('errors.createCategory'),
        description: error.response?.data?.message || t('errors.createCategory'),
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
        title: t('success.categoryDeleted', { name: categoryToDelete.name_en || categoryToDelete.name }),
        description: t('success.categoryDeleted', { name: categoryToDelete.name_en || categoryToDelete.name }),
      });
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast({
        title: t('errors.deleteCategory'),
        description: error.response?.data?.message || t('errors.deleteCategory'),
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
        title: t('success.statusUpdated', { name: category.name_en || category.name, status: t(`status.${newStatus}`) }),
        description: t('success.statusUpdated', { name: category.name_en || category.name, status: t(`status.${newStatus}`) }),
      });
      fetchCategories();
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
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 xs:gap-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg xs:text-xl md:text-2xl font-bold text-foreground truncate">{t('title')}</h2>
          <p className="text-muted-foreground text-xs xs:text-sm md:text-base">{t('description')}</p>
        </div>
        <Button onClick={openAddDialog} className={`text-white shadow-elegant hover:shadow-lg transition-all duration-300 w-full sm:w-auto ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
          <Plus className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
          <span className="text-sm xs:text-base">{t('addCategory')}</span>
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${currentLanguage === 'ar' ? 'rtl' : 'ltr'} [&>button]:hidden`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <DialogHeader className="relative pb-4">
              <DialogTitle className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'} text-lg font-semibold`}>
                {editingCategory ? t('form.editTitle') : t('form.createTitle')}
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
            <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_en" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.nameEn')} *</Label>
                  <Input
                    id="name_en"
                    name="name_en"
                    value={categoryForm.name_en}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.nameEnPlaceholder')}
                    required
                    disabled={isSubmitting}
                    className="pl-2"
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_ar" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.nameAr')} *</Label>
                  <Input
                    id="name_ar"
                    name="name_ar"
                    value={categoryForm.name_ar}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.nameArPlaceholder')}
                    required
                    disabled={isSubmitting}
                    className="pl-2"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-3 xs:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description_en" className={`text-xs xs:text-sm ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.descriptionEn')} * (min 10 characters)</Label>
                  <Textarea
                    id="description_en"
                    name="description_en"
                    value={categoryForm.description_en}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.descriptionEnPlaceholder')}
                    rows={3}
                    required
                    minLength={10}
                    disabled={isSubmitting}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className={categoryForm.description_en.length > 0 && categoryForm.description_en.length < 10 ? 'border-red-300' : ''}
                  />
                  {categoryForm.description_en.length > 0 && categoryForm.description_en.length < 10 && (
                    <p className={`text-sm text-red-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.validation.descriptionMinLength')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_ar" className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('form.fields.descriptionAr')} * (min 10 characters)</Label>
                  <Textarea
                    id="description_ar"
                    name="description_ar"
                    value={categoryForm.description_ar}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.descriptionArPlaceholder')}
                    rows={3}
                    required
                    minLength={10}
                    disabled={isSubmitting}
                    dir="rtl"
                    className={categoryForm.description_ar.length > 0 && categoryForm.description_ar.length < 10 ? 'border-red-300' : ''}
                  />
                  {categoryForm.description_ar.length > 0 && categoryForm.description_ar.length < 10 && (
                    <p className={`text-sm text-red-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.validation.descriptionMinLength')}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sortOrder" className={`text-xs xs:text-sm ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.sortOrder')}</Label>
                  <Input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    value={categoryForm.sortOrder}
                    onChange={handleInputChange}
                    placeholder={t('form.fields.sortOrderPlaceholder')}
                    min="0"
                    disabled={isSubmitting}
                    className="pl-2"
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon" className={`text-xs xs:text-sm ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.icon')}</Label>
                  <Select value={categoryForm.icon} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, icon: value }))} disabled={isSubmitting}>
                    <SelectTrigger className={`bg-white border border-gray-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryIcons.map(icon => (
                        <SelectItem key={icon} value={icon}>{t(`icons.${icon}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color" className={`text-xs xs:text-sm ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.colorTheme')}</Label>
                  <Select value={categoryForm.color} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, color: value }))} disabled={isSubmitting}>
                    <SelectTrigger className={`bg-white border border-gray-200 flex-row ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryColors.map(color => (
                        <SelectItem key={color} value={color}>
                          <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? '' : ''}`}>
                            <div className={`w-4 h-4 rounded ${color.split(' ')[0]}`}></div>
                            {t(`colors.${color.split(' ')[0].replace('bg-', '').replace('-100', '')}`)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentCategory" className={`text-xs xs:text-sm ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.parentCategory')}</Label>
                <Select value={categoryForm.parentCategory} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, parentCategory: value }))} disabled={isSubmitting}>
                  <SelectTrigger className={`bg-white border border-gray-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    <SelectValue placeholder={t('form.fields.parentCategoryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('form.fields.noParentCategory')}</SelectItem>
                    {categories.filter(cat => cat._id !== editingCategory?._id).map(category => (
                      <SelectItem key={category._id} value={category._id}>
                        {currentLanguage === 'ar' ? (category.name_ar || category.name_en || category.name) : (category.name_en || category.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={`flex flex-col xs:flex-row gap-2 xs:gap-3 ${currentLanguage === 'ar' ? 'xs:justify-end' : 'xs:justify-start xs:flex-row'}`}>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 xs:px-6 py-2 rounded-lg font-medium transition-colors duration-200 text-sm xs:text-base" disabled={isSubmitting}>
                  {isSubmitting ? t('form.buttons.saving') : (editingCategory ? t('form.buttons.update') : t('form.buttons.create'))}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)} 
                  disabled={isSubmitting}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 xs:px-6 py-2 rounded-lg font-medium transition-colors duration-200 text-sm xs:text-base"
                >
                  {t('form.buttons.cancel')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-3 xs:p-4">
          <div className={`flex flex-col sm:flex-row gap-3 xs:gap-4 ${currentLanguage === 'ar' ? 'sm:flex-row' : ''}`}>
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={currentLanguage === 'ar' ? 'pr-[30px] text-right' : 'pl-[30px]'}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={`bg-white border border-gray-200 w-full sm:w-32 lg:w-40 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                <SelectValue placeholder={t('status.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('status.all')}</SelectItem>
                <SelectItem value="active">{t('status.active')}</SelectItem>
                <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-modern">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${currentLanguage === 'ar' ? ' text-right' : 'text-left'}`}>
            <FolderOpen className="h-5 w-5 text-theme-base" />
            {t('categoriesCount', { count: totalCategories })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-base mx-auto"></div>
              <p className="text-muted-foreground mt-2">{t('loading.categories')}</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-3 xs:space-y-4">
              {categories.map((category) => (
                <div key={category._id} className={`flex flex-col lg:flex-row lg:items-center lg:justify-between p-3 xs:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors gap-3 lg:gap-4 ${currentLanguage === 'ar' ? 'lg:flex-row' : ''}`}>
                  <div className={`flex items-center gap-3 xs:gap-4 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                    <div className={`p-2 xs:p-3 rounded-lg ${category.color} flex-shrink-0`}>
                      <FolderOpen className="h-5 w-5 xs:h-6 xs:w-6" />
                    </div>
                    <div className={`flex-1 min-w-0 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      <div className={`flex flex-wrap items-center gap-1 xs:gap-2 ${currentLanguage === 'ar' ? 'flex-row justify-end' : ''}`}>
                        <h3 className="font-semibold text-foreground text-sm xs:text-base truncate">
                          {currentLanguage === 'ar' ? (category.name_ar || category.name_en || category.name) : (category.name_en || category.name)}
                        </h3>
                        <Badge variant={category.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {t(`status.${category.status}`)}
                        </Badge>
                        {category.parentCategory && (
                          <Badge variant="outline" className="text-xs">
                            {t('table.subcategory')}
                          </Badge>
                        )}
                      </div>
                      <div className={`flex flex-wrap items-center gap-2 xs:gap-4 mt-1 text-xs xs:text-sm ${currentLanguage === 'ar' ? 'flex-row justify-end' : ''}`}>
                        <div className={`flex items-center gap-1 text-muted-foreground ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                          <Book className="h-3 w-3 xs:h-4 xs:w-4" />
                          <span>{t('table.booksCount', { count: category.booksCount || 0 })}</span>
                        </div>
                        <div className="text-muted-foreground">
                          {t('table.sortOrder', { order: category.sortOrder })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 xs:gap-3 sm:gap-4 ${currentLanguage === 'ar' ? 'sm:flex-row' : ''}`}>
                    <div className={`${currentLanguage === 'ar' ? 'text-right sm:text-left' : 'text-left sm:text-right'} order-2 sm:order-1`}>
                      <div className="text-xs xs:text-sm text-muted-foreground">
                        {formatDate(category.createdAt)}
                      </div>
                    </div>
                    <div className={`flex flex-wrap gap-1 xs:gap-2 order-1 sm:order-2 flex-row ${currentLanguage === 'ar' ? 'justify-end sm:justify-start' : 'justify-start'}`}>
                      <Select value={category.status} onValueChange={(value) => handleStatusChange(category, value)}>
                        <SelectTrigger className={`bg-white border border-gray-200 w-20 xs:w-24 text-xs xs:text-sm  flex-row ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">{t('status.active')}</SelectItem>
                          <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        title={t('actions.edit')}
                        className="p-1 xs:p-2"
                      >
                        <Edit className="h-3 w-3 xs:h-4 xs:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 xs:p-2"
                        title={t('actions.delete')}
                      >
                        <Trash2 className="h-3 w-3 xs:h-4 xs:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={`flex flex-col xs:flex-row justify-center items-center gap-2 xs:gap-3 mt-4 xs:mt-6 ${currentLanguage === 'ar' ? '' : ''}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2"
                  >
                    {t('pagination.previous')}
                  </Button>
                  <span className="text-xs xs:text-sm text-muted-foreground text-center">
                    {t('pagination.page', { current: currentPage, total: totalPages })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2"
                  >
                    {t('pagination.next')}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">{t('empty.noCategories')}</p>
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
        title={t('deleteModal.title')}
        description={t('deleteModal.description', { 
          name: currentLanguage === 'ar' 
            ? (categoryToDelete?.name_ar || categoryToDelete?.name_en || categoryToDelete?.name)
            : (categoryToDelete?.name_en || categoryToDelete?.name)
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