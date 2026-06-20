import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ImageUpload from '../ui/image-upload';
import { authStorage } from '../../utils/storage';
import { DataTable } from '../ui/DataTable';
import { AdminModal } from '../ui/AdminModal';
import { SectionShell, SearchInput } from '../ui/SectionShell';

const TrainingBooksSection = () => {
  const { t } = useTranslation('TrainingBooksManagement');
  const { language: currentLanguage } = useI18next();
  const { toast } = useToast();
  const [trainingBooks, setTrainingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    coverImageUrl: '',
    parts: [{ name: '', nameAr: '' }],
    isActive: true
  });

  useEffect(() => {
    const fetchTrainingBooks = async () => {
      try {
        // Get auth token for admin requests to fetch all books (including inactive)
        const token = authStorage.getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch('http://localhost:5001/api/training-books', {
          method: 'GET',
          headers
        });
        if (response.ok) {
          const data = await response.json();
          setTrainingBooks(data);
        } else {
          throw new Error('Failed to fetch training books');
        }
      } catch (error) {
        toast({
          title: t('errors.loadBooks'),
          description: t('errors.loadBooks'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingBooks();
  }, [refetchTrigger, currentLanguage, t, toast]);

  // Filter books based on search term and status filter
  const filteredBooks = trainingBooks.filter(book => {
    const matchesSearch = searchTerm === '' ||
                         book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.nameAr && book.nameAr.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && book.isActive === true) ||
                         (statusFilter === 'inactive' && book.isActive === false);

    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingBook
        ? `http://localhost:5001/api/training-books/${editingBook._id}`
        : 'http://localhost:5001/api/training-books';

      const method = editingBook ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStorage.getToken()}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: t('success.bookCreated'),
          description: editingBook ? t('success.bookUpdated') : t('success.bookCreated'),
        });
        setRefetchTrigger(prev => prev + 1);
        resetForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save training book');
      }
    } catch (error) {
      toast({
        title: t('errors.saveBook'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      name: book.name,
      nameAr: book.nameAr,
      description: book.description || '',
      descriptionAr: book.descriptionAr || '',
      coverImageUrl: book.coverImageUrl || '',
      parts: book.parts.length > 0 ? book.parts : [{ name: '', nameAr: '' }],
      isActive: book.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm(t('deleteConfirm.message'))) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/training-books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStorage.getToken()}`
        },
      });

      if (response.ok) {
        toast({
          title: t('success.bookDeleted'),
          description: t('success.bookDeleted'),
        });
        setRefetchTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to delete training book');
      }
    } catch (error) {
      toast({
        title: t('errors.deleteBook'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      coverImageUrl: '',
      parts: [{ name: '', nameAr: '' }],
      isActive: true
    });
    setEditingBook(null);
    setIsDialogOpen(false);
  };

  const addPart = () => {
    setFormData({
      ...formData,
      parts: [...formData.parts, { name: '', nameAr: '' }]
    });
  };

  const removePart = (index) => {
    if (formData.parts.length > 1) {
      setFormData({
        ...formData,
        parts: formData.parts.filter((_, i) => i !== index)
      });
    }
  };

  const updatePart = (index, field, value) => {
    const updatedParts = formData.parts.map((part, i) =>
      i === index ? { ...part, [field]: value } : part
    );
    setFormData({ ...formData, parts: updatedParts });
  };

  const handleImageUpload = (imageData) => {
    if (imageData) {
      setFormData(prev => ({
        ...prev,
        coverImageUrl: imageData.url
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        coverImageUrl: ''
      }));
    }
  };

  const isRTL = currentLanguage === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const columns = [
    {
      key: 'cover',
      label: t('table.cover'),
      width: 'w-16',
      skeletonWidth: '48px',
      render: (book) => (
        <img
          src={book.coverImageUrl || '/api/placeholder/48/64'}
          alt={isRTL && book.nameAr ? book.nameAr : book.name}
          className="w-10 h-14 object-cover rounded"
        />
      ),
    },
    {
      key: 'title',
      label: t('table.title'),
      skeletonWidth: '70%',
      render: (book) => (
        <div>
          <p className="font-medium text-foreground text-sm">
            {isRTL && book.nameAr ? book.nameAr : book.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {isRTL ? book.name : (book.nameAr || '')}
          </p>
        </div>
      ),
    },
    {
      key: 'parts',
      label: t('table.parts'),
      skeletonWidth: '50%',
      render: (book) => (
        <div className="flex flex-wrap gap-1">
          {book.parts.slice(0, 2).map((part, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {isRTL && part.nameAr ? part.nameAr : part.name}
            </Badge>
          ))}
          {book.parts.length > 2 && (
            <Badge variant="outline" className="text-xs">+{book.parts.length - 2}</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: t('table.status'),
      align: 'center',
      skeletonWidth: '50%',
      render: (book) => (
        <Badge
          variant={book.isActive ? 'default' : 'secondary'}
          className={`${book.isActive ? 'bg-green-400 text-green-700 border-green-200' : ''} text-xs`}
        >
          <BookOpen className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
          {book.isActive ? t('status.active') : t('status.inactive')}
        </Badge>
      ),
    },
    {
      key: '_actions',
      label: '',
      align: 'end',
      skeletonWidth: '60px',
      render: (book) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(book)}
            className="h-8 w-8 p-0 hover:bg-muted rounded-md"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(book._id)}
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
        <Button
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="bg-[#2194D1] hover:bg-[#2194D1]/90"
        >
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 flex-row">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.allBooks')}</SelectItem>
              <SelectItem value="active">{t('filters.activeOnly')}</SelectItem>
              <SelectItem value="inactive">{t('filters.inactiveOnly')}</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-4 xs:p-6">
            <div className="flex items-center justify-between flex-row">
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-sm font-medium text-muted-foreground">{t('stats.totalBooks')}</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{trainingBooks.length}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-green-500/5">
          <CardContent className="p-4 xs:p-6">
            <div className="flex items-center justify-between flex-row">
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-sm font-medium text-muted-foreground">{t('stats.activeBooks')}</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {trainingBooks.filter(book => book.isActive).length}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-green-500/10">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-blue-500/5">
          <CardContent className="p-4 xs:p-6">
            <div className="flex items-center justify-between flex-row">
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-sm font-medium text-muted-foreground">{t('stats.updatedThisMonth')}</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {trainingBooks.filter(book =>
                    new Date(book.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-blue-500/10">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={filteredBooks}
        loading={loading}
        emptyTitle={trainingBooks.length === 0 ? t('empty.noBooks') : t('empty.noFilteredBooks')}
        emptyDescription={trainingBooks.length === 0 ? t('empty.addFirstBook') : t('empty.adjustFilters')}
        emptyIcon={BookOpen}
        dir={dir}
      />

      {/* Add / Edit Modal */}
      <AdminModal
        open={isDialogOpen}
        onClose={setIsDialogOpen}
        title={editingBook ? t('form.editTitle') : t('form.createTitle')}
        size="lg"
        dir={dir}
        footer={
          <>
            <Button type="button" variant="outline" onClick={resetForm}>
              {t('form.buttons.cancel')}
            </Button>
            <Button type="submit" form="training-book-form" className="bg-primary hover:bg-primary/90">
              {editingBook ? t('form.buttons.update') : t('form.buttons.create')}
            </Button>
          </>
        }
      >
        <form id="training-book-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t('form.fields.nameEn')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('form.fields.nameEnPlaceholder')}
                required
                dir={dir}
              />
            </div>
            <div>
              <Label htmlFor="nameAr">{t('form.fields.nameAr')} *</Label>
              <Input
                id="nameAr"
                value={formData.nameAr}
                onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                placeholder={t('form.fields.nameArPlaceholder')}
                required
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">{t('form.fields.descriptionEn')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('form.fields.descriptionEnPlaceholder')}
                rows={3}
                dir={dir}
              />
            </div>
            <div>
              <Label htmlFor="descriptionAr">{t('form.fields.descriptionAr')}</Label>
              <Textarea
                id="descriptionAr"
                value={formData.descriptionAr}
                onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                placeholder={t('form.fields.descriptionArPlaceholder')}
                rows={3}
                dir="rtl"
              />
            </div>
          </div>

          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={formData.coverImageUrl}
            uploadType="training-book-cover"
            label={t('form.fields.coverImage')}
          />

          <div>
            <div className={`flex items-center justify-between mb-2`}>
              <Label>{t('form.fields.bookParts')}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addPart}>
                <Plus className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {t('form.buttons.addPart')}
              </Button>
            </div>
            {formData.parts.map((part, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 p-3 border rounded">
                <Input
                  placeholder={t('form.fields.partNameEn')}
                  value={part.name}
                  onChange={(e) => updatePart(index, 'name', e.target.value)}
                  required
                  dir={dir}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder={t('form.fields.partNameAr')}
                    value={part.nameAr}
                    onChange={(e) => updatePart(index, 'nameAr', e.target.value)}
                    required
                    dir="rtl"
                    className="flex-1"
                  />
                  {formData.parts.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePart(index)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
            />
            <Label htmlFor="isActive" className="text-sm font-medium">
              {t('form.fields.isActive')}
            </Label>
          </div>
        </form>
      </AdminModal>
    </SectionShell>
  );
};

export { TrainingBooksSection };
export default TrainingBooksSection;
