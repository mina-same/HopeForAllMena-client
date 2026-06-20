import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { authorsAPI } from '../../services/publishingAPI';
import ConfirmationModal from '../ui/ConfirmationModal';
import ImageUpload from '../ui/image-upload';
import { DataTable } from '../ui/DataTable';
import { AdminModal } from '../ui/AdminModal';
import { SectionShell, SearchInput } from '../ui/SectionShell';
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
  const [refetchTrigger, setRefetchTrigger] = useState(0);

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
  useEffect(() => {
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

    fetchAuthors();
  }, [currentPage, searchTerm, statusFilter, featuredFilter, currentLanguage, toast, t, refetchTrigger]);

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
    const { authStorage } = require('../../utils/storage');
    console.log('Auth token:', authStorage.getToken());

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
      setRefetchTrigger(prev => prev + 1);
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
      setRefetchTrigger(prev => prev + 1);
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
      setRefetchTrigger(prev => prev + 1);
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

  // ── Derived ─────────────────────────────────────────────────
  const isRTL = currentLanguage === 'ar';
  const dir   = isRTL ? 'rtl' : 'ltr';

  const authorName = (a) =>
    isRTL ? a?.nameAr || a?.name : a?.name;

  const initials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // ── Table columns ────────────────────────────────────────────
  const columns = [
    {
      key: 'avatar',
      label: '',
      width: 'w-12',
      skeletonWidth: '36px',
      render: (author) => (
        <Avatar className="h-9 w-9">
          <AvatarImage src={author.avatarUrl} alt={authorName(author)} />
          <AvatarFallback className="bg-brand-light text-brand text-xs font-semibold">
            {initials(authorName(author))}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: 'name',
      label: t('form.fields.name.label'),
      render: (author) => (
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <p className="font-medium text-foreground leading-snug">{authorName(author)}</p>
          {author.featured && (
            <span className="inline-flex items-center mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700">
              {t('table.featured')}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: t('filters.status.placeholder'),
      skeletonWidth: '90px',
      render: (author) => (
        <Select value={author.status} onValueChange={(value) => handleStatusChange(author, value)}>
          <SelectTrigger className="h-7 w-[100px] text-xs border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">{t('status.active')}</SelectItem>
            <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'booksCount',
      label: 'Books',
      align: 'center',
      skeletonWidth: '30px',
      render: (author) => (
        <span className="tabular-nums text-muted-foreground">{author.booksCount ?? 0}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Added',
      skeletonWidth: '80px',
      render: (author) => (
        <span className="text-xs text-muted-foreground">{formatDate(author.createdAt)}</span>
      ),
    },
    {
      key: '_actions',
      label: '',
      align: 'end',
      skeletonWidth: '80px',
      render: (author) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(author)}
            className="h-8 w-8 p-0 hover:bg-muted rounded-md"
            title={t('actions.view')}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(author)}
            className="h-8 w-8 p-0 hover:bg-muted rounded-md"
            title={t('actions.edit')}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(author)}
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
          {t('addAuthor')}
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
            <SelectTrigger className="h-9 w-full sm:w-36">
              <SelectValue placeholder={t('filters.status.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.status.all')}</SelectItem>
              <SelectItem value="active">{t('filters.status.active')}</SelectItem>
              <SelectItem value="inactive">{t('filters.status.inactive')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
            <SelectTrigger className="h-9 w-full sm:w-36">
              <SelectValue placeholder={t('filters.featured.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.featured.all')}</SelectItem>
              <SelectItem value="true">{t('filters.featured.featured')}</SelectItem>
              <SelectItem value="false">{t('filters.featured.notFeatured')}</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
    >
      {/* ── Data table ──────────────────────────── */}
      <DataTable
        columns={columns}
        data={authors}
        loading={loading}
        emptyTitle={t('empty.description')}
        emptyIcon={Users}
        countLabel={t('table.authorsCount', { count: totalAuthors })}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        dir={dir}
      />

      {/* ── Add / Edit author ────────────────────── */}
      <AdminModal
        open={isDialogOpen}
        onClose={setIsDialogOpen}
        title={editingAuthor ? t('form.editTitle') : t('form.createTitle')}
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
              form="author-form"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t('form.buttons.saving')
                : editingAuthor
                  ? t('form.buttons.update')
                  : t('form.buttons.create')}
            </Button>
          </>
        }
      >
        <form id="author-form" onSubmit={handleSubmit} className="space-y-5">
          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={authorForm.avatarUrl}
            uploadType="author-image"
            label={t('form.fields.avatar.label')}
            disabled={isSubmitting}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">{t('form.fields.name.label')} *</Label>
              <Input
                id="name"
                name="name"
                value={authorForm.name}
                onChange={handleInputChange}
                placeholder={t('form.fields.name.placeholder')}
                required
                disabled={isSubmitting}
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nameAr">{t('form.fields.nameAr.label')} *</Label>
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
            <div className="space-y-1.5">
              <Label htmlFor="biography">
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
                dir="ltr"
                className={authorForm.biography.length > 0 && authorForm.biography.length < 10 ? 'border-destructive' : ''}
              />
              {authorForm.biography.length > 0 && authorForm.biography.length < 10 && (
                <p className="text-xs text-destructive">{t('form.validation.biographyMinLength')}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="biographyAr">
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
                className={`text-right ${authorForm.biographyAr.length > 0 && authorForm.biographyAr.length < 10 ? 'border-destructive' : ''}`}
              />
              {authorForm.biographyAr.length > 0 && authorForm.biographyAr.length < 10 && (
                <p className="text-xs text-destructive text-right">{t('form.validation.biographyArMinLength')}</p>
              )}
            </div>
          </div>
        </form>
      </AdminModal>

      {/* ── View author ──────────────────────────── */}
      <AdminModal
        open={showViewModal}
        onClose={setShowViewModal}
        title={t('viewModal.title')}
        size="md"
        dir={dir}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              {t('viewModal.close')}
            </Button>
            <Button
              onClick={() => {
                setShowViewModal(false);
                handleEdit(viewingAuthor);
              }}
            >
              <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('actions.edit')}
            </Button>
          </>
        }
      >
        {viewingAuthor && (
          <div className="space-y-5">
            {/* Avatar + name */}
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-16 w-16 border border-border flex-shrink-0">
                <AvatarImage src={viewingAuthor.avatarUrl} alt={authorName(viewingAuthor)} />
                <AvatarFallback className="bg-brand-light text-brand font-semibold text-xl">
                  {initials(authorName(viewingAuthor))}
                </AvatarFallback>
              </Avatar>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="text-lg font-semibold text-foreground">{authorName(viewingAuthor)}</h3>
                <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {viewingAuthor.featured && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700">
                      {t('table.featured')}
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                    viewingAuthor.status === 'active'
                      ? 'bg-status-approved text-status-approved'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {t(`status.${viewingAuthor.status}`)}
                  </span>
                </div>
              </div>
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('form.fields.name.label')}
                </p>
                <div className="text-sm text-foreground px-3 py-2 bg-muted/50 rounded-lg">{viewingAuthor.name}</div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('form.fields.nameAr.label')}
                </p>
                <div className="text-sm text-foreground px-3 py-2 bg-muted/50 rounded-lg text-right" dir="rtl">
                  {viewingAuthor.nameAr || '—'}
                </div>
              </div>
            </div>

            {/* Biography fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('form.fields.biography.label')}
                </p>
                <div className="text-sm text-foreground px-3 py-2 bg-muted/50 rounded-lg min-h-[80px]">
                  {viewingAuthor.biography}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('form.fields.biographyAr.label')}
                </p>
                <div className="text-sm text-foreground px-3 py-2 bg-muted/50 rounded-lg min-h-[80px] text-right" dir="rtl">
                  {viewingAuthor.biographyAr || '—'}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl border border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand tabular-nums">{viewingAuthor.booksCount || 0}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t('table.booksCount', { count: viewingAuthor.booksCount || 0 })}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{formatDate(viewingAuthor.createdAt)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t('viewModal.joinedDate')}</p>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* ── Delete confirmation ──────────────────── */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setAuthorToDelete(null); }}
        onConfirm={confirmDeleteAuthor}
        title={t('deleteModal.title')}
        description={t('deleteModal.description', {
          name: authorToDelete ? authorName(authorToDelete) : '',
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
