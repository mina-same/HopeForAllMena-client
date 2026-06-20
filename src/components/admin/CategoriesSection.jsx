import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderOpen, Book } from 'lucide-react';
import { Button } from '../ui/button';
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
import { DataTable } from '../ui/DataTable';
import { AdminModal } from '../ui/AdminModal';
import { SectionShell, SearchInput } from '../ui/SectionShell';

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
  const [refetchTrigger, setRefetchTrigger] = useState(0);

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
  useEffect(() => {
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

    fetchCategories();
  }, [currentPage, searchTerm, statusFilter, toast, t, refetchTrigger]);

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
      setRefetchTrigger(prev => prev + 1);
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
      setRefetchTrigger(prev => prev + 1);
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
      setRefetchTrigger(prev => prev + 1);
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

  const isRTL = currentLanguage === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const columns = [
    {
      key: 'name',
      label: t('table.name'),
      skeletonWidth: '60%',
      render: (category) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${category.color} flex-shrink-0`}>
            <FolderOpen className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">
              {isRTL ? (category.name_ar || category.name_en || category.name) : (category.name_en || category.name)}
            </p>
            <p className="text-xs text-muted-foreground">
              {isRTL ? (category.name_en || category.name) : (category.name_ar || '')}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      label: t('table.description'),
      skeletonWidth: '80%',
      render: (category) => (
        <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
          {isRTL ? (category.description_ar || category.description_en || '') : (category.description_en || '')}
        </p>
      ),
    },
    {
      key: 'status',
      label: t('table.status'),
      align: 'center',
      skeletonWidth: '50%',
      render: (category) => (
        <Badge variant={category.status === 'active' ? 'default' : 'secondary'} className="text-xs">
          {t(`status.${category.status}`)}
        </Badge>
      ),
    },
    {
      key: 'booksCount',
      label: t('table.books'),
      align: 'center',
      skeletonWidth: '30%',
      render: (category) => (
        <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm">
          <Book className="h-3.5 w-3.5" />
          <span>{category.booksCount || 0}</span>
        </div>
      ),
    },
    {
      key: '_actions',
      label: '',
      align: 'end',
      skeletonWidth: '60px',
      render: (category) => (
        <div className="flex items-center justify-end gap-1">
          <Select value={category.status} onValueChange={(value) => handleStatusChange(category, value)}>
            <SelectTrigger className="bg-card border-border w-24 text-xs flex-row">
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
            onClick={() => handleEdit(category)}
            title={t('actions.edit')}
            className="h-8 w-8 p-0 hover:bg-muted rounded-md"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(category)}
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
        <Button onClick={openAddDialog} className="text-white shadow-elegant hover:shadow-lg transition-all duration-300">
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          <span>{t('addCategory')}</span>
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-card border-border w-full sm:w-40">
              <SelectValue placeholder={t('status.all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('status.all')}</SelectItem>
              <SelectItem value="active">{t('status.active')}</SelectItem>
              <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
    >
      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        emptyTitle={t('empty.noCategories')}
        emptyIcon={FolderOpen}
        countLabel={t('categoriesCount', { count: totalCategories })}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        dir={dir}
      />

      {/* Add / Edit Modal */}
      <AdminModal
        open={isDialogOpen}
        onClose={setIsDialogOpen}
        title={editingCategory ? t('form.editTitle') : t('form.createTitle')}
        size="md"
        dir={dir}
        disabled={isSubmitting}
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              {t('form.buttons.cancel')}
            </Button>
            <Button
              type="submit"
              form="category-form"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('form.buttons.saving') : (editingCategory ? t('form.buttons.update') : t('form.buttons.create'))}
            </Button>
          </>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_en">{t('form.fields.nameEn')} *</Label>
              <Input
                id="name_en"
                name="name_en"
                value={categoryForm.name_en}
                onChange={handleInputChange}
                placeholder={t('form.fields.nameEnPlaceholder')}
                required
                disabled={isSubmitting}
                className="pl-2"
                dir={dir}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_ar">{t('form.fields.nameAr')} *</Label>
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description_en">{t('form.fields.descriptionEn')} * (min 10 characters)</Label>
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
                dir={dir}
                className={categoryForm.description_en.length > 0 && categoryForm.description_en.length < 10 ? 'border-red-300' : ''}
              />
              {categoryForm.description_en.length > 0 && categoryForm.description_en.length < 10 && (
                <p className="text-sm text-destructive">{t('form.validation.descriptionMinLength')}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_ar">{t('form.fields.descriptionAr')} * (min 10 characters)</Label>
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
                <p className="text-sm text-destructive">{t('form.validation.descriptionMinLength')}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sortOrder">{t('form.fields.sortOrder')}</Label>
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
                dir={dir}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">{t('form.fields.icon')}</Label>
              <Select value={categoryForm.icon} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, icon: value }))} disabled={isSubmitting}>
                <SelectTrigger className="bg-card border-border">
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
              <Label htmlFor="color">{t('form.fields.colorTheme')}</Label>
              <Select value={categoryForm.color} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, color: value }))} disabled={isSubmitting}>
                <SelectTrigger className="bg-card border-border flex-row">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryColors.map(color => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center gap-2">
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
            <Label htmlFor="parentCategory">{t('form.fields.parentCategory')}</Label>
            <Select value={categoryForm.parentCategory} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, parentCategory: value }))} disabled={isSubmitting}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder={t('form.fields.parentCategoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('form.fields.noParentCategory')}</SelectItem>
                {categories.filter(cat => cat._id !== editingCategory?._id).map(category => (
                  <SelectItem key={category._id} value={category._id}>
                    {isRTL ? (category.name_ar || category.name_en || category.name) : (category.name_en || category.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </AdminModal>

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
          name: isRTL
            ? (categoryToDelete?.name_ar || categoryToDelete?.name_en || categoryToDelete?.name)
            : (categoryToDelete?.name_en || categoryToDelete?.name)
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
