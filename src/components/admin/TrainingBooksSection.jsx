import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Calendar, Search, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ImageUpload from '../ui/image-upload';
import { authStorage } from '../../utils/storage';

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
    fetchTrainingBooks();
  }, [fetchTrainingBooks]);

  // Re-fetch data when language changes
  useEffect(() => {
    if (trainingBooks.length > 0) {
      fetchTrainingBooks();
    }
  }, [currentLanguage, fetchTrainingBooks, trainingBooks.length]);

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
        fetchTrainingBooks();
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
        fetchTrainingBooks();
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


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('loading.books')}</div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? '' : 'text-left'}`}>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('title')}</h2>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 mb-4 xs:mb-6">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-4 xs:p-6">
            <div className={`flex items-center justify-between flex-row ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
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
            <div className={`flex items-center justify-between flex-row ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
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
            <div className={`flex items-center justify-between flex-row${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
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

      {/* Search, Filter, and Add Button Controls */}
      <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between mb-4 sm:mb-6 ${currentLanguage === 'ar' ? 'sm:' : ''}`}>
        <div className={`flex flex-col xs:flex-row gap-3 sm:gap-4 flex-1 w-full sm:w-auto ${currentLanguage === 'ar' ? 'xs: sm:' : ''}`}>
          {/* Search */}
          <div className="relative flex-1 w-full xs:max-w-xs sm:max-w-md">
            <Search className={`absolute ${currentLanguage === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4`} />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${currentLanguage === 'ar' ? 'pr-[30px] text-right' : 'pl-[30px]'} w-full`}
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
          
          {/* Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full xs:w-40 sm:w-48 flex-row">
              <Filter className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.allBooks')}</SelectItem>
              <SelectItem value="active">{t('filters.activeOnly')}</SelectItem>
              <SelectItem value="inactive">{t('filters.inactiveOnly')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Add Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className={`bg-[#2194D1] hover:bg-[#2194D1]/90 w-full sm:w-auto ${currentLanguage === 'ar' ? '' : ''}`}>
              <Plus className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('addBook')}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="w-full max-w-[95vw] xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl max-h-[90vh] overflow-y-auto p-3 xs:p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                {editingBook ? t('form.editTitle') : t('form.createTitle')}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4">
              <div className="space-y-3 xs:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                  <div>
                    <Label htmlFor="name">{t('form.fields.nameEn')} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('form.fields.nameEnPlaceholder')}
                      required
                      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                  <div>
                    <Label htmlFor="description">{t('form.fields.descriptionEn')}</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={t('form.fields.descriptionEnPlaceholder')}
                      rows={3}
                      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
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
                  <div className={`flex items-center justify-between mb-2 ${currentLanguage === 'ar' ? '' : ''}`}>
                    <Label>{t('form.fields.bookParts')}</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addPart} className={currentLanguage === 'ar' ? '' : ''}>
                      <Plus className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-1' : 'mr-1'}`} />
                      {t('form.buttons.addPart')}
                    </Button>
                  </div>
                  {formData.parts.map((part, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 p-2 xs:p-3 border rounded">
                      <Input
                        placeholder={t('form.fields.partNameEn')}
                        value={part.name}
                        onChange={(e) => updatePart(index, 'name', e.target.value)}
                        required
                        dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                      />
                      <div className="flex gap-2 sm:col-span-1">
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


                <div className={`flex items-center ${currentLanguage === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
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
              </div>

              <div className={`flex ${currentLanguage === 'ar' ? 'justify-start  space-x-reverse space-x-4' : 'justify-end space-x-4'}`}>
                <Button type="button" variant="outline" onClick={resetForm}>
                  {t('form.buttons.cancel')}
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingBook ? t('form.buttons.update') : t('form.buttons.create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Training Books Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
        {filteredBooks.map((book) => (
          <Card key={book._id} className="border-0 shadow-modern bg-card hover:shadow-glow transition-all duration-300">
            <CardContent className="p-0">
              <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                <img
                  src={book.coverImageUrl || '/api/placeholder/300/400'}
                  alt={currentLanguage === 'ar' && book.nameAr ? book.nameAr : book.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="p-3 xs:p-4 sm:p-6">
                <div className={`flex items-start justify-between mb-2 xs:mb-3 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm xs:text-base sm:text-lg text-foreground line-clamp-2">
                      {currentLanguage === 'ar' && book.nameAr ? book.nameAr : book.name}
                    </h3>
                  </div>
                  <div className={`flex ${currentLanguage === 'ar' ? 'space-x-reverse space-x-1 mr-1 xs:mr-2' : 'space-x-1 ml-1 xs:ml-2'} flex-shrink-0`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(book)}
                      className="hover:bg-primary/10 hover:text-primary p-1 xs:p-2"
                    >
                      <Edit2 className="h-3 w-3 xs:h-4 xs:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(book._id)}
                      className="hover:bg-destructive/10 hover:text-destructive p-1 xs:p-2"
                    >
                      <Trash2 className="h-3 w-3 xs:h-4 xs:w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-xs xs:text-sm mb-3 xs:mb-4 line-clamp-2 xs:line-clamp-3">
                  {currentLanguage === 'ar' && book.descriptionAr ? book.descriptionAr : book.description}
                </p>

                <div className="mb-3 xs:mb-4">
                  <div className="flex flex-wrap gap-1">
                    {book.parts.map((part, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {currentLanguage === 'ar' && part.nameAr ? part.nameAr : part.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className={`flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0 ${currentLanguage === 'ar' ? 'xs:' : ''}`}>
                  <Badge 
                    variant={book.isActive ? "default" : "secondary"} 
                    className={`${book.isActive ? "bg-green-400 text-green-700 border-green-200" : "bg-gray-400 text-gray-600 border-gray-200"} ${currentLanguage === 'ar' ? ' self-end xs:self-auto' : 'self-start xs:self-auto'} text-xs`}
                  >
                    <BookOpen className={`h-3 w-3 ${currentLanguage === 'ar' ? 'ml-1' : 'mr-1'}`} />
                    {book.isActive ? t('status.active') : t('status.inactive')}
                  </Badge>
                  <span className={`text-xs text-muted-foreground ${currentLanguage === 'ar' ? 'text-right xs:text-left' : 'text-left'}`}>
                    {t('table.updated')} {new Date(book.updatedAt).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && trainingBooks.length > 0 && (
        <Card className="border-0 shadow-modern">
          <CardContent className={`text-center py-12`}>
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-center">{t('empty.noFilteredBooks')}</p>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {t('empty.adjustFilters')}
            </p>
          </CardContent>
        </Card>
      )}

      {trainingBooks.length === 0 && (
        <Card className="border-0 shadow-modern">
          <CardContent className={`text-center py-12 ${currentLanguage === 'ar' ? 'text-center' : 'text-center'}`}>
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-center">{t('empty.noBooks')}</p>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {t('empty.addFirstBook')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


export { TrainingBooksSection };
export default TrainingBooksSection;