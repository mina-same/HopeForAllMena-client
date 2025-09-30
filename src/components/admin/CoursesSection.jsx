import React, { useState } from 'react';
import { Plus, Edit, Trash2, BookOpen, Users, Star, Clock, Search, Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useCourses } from '../../context/CourseContext';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { Link, graphql } from 'gatsby';
// Course type removed - using JavaScript

export const CoursesSection = () => {
  const { courses, institutions, companies, addCourse, updateCourse, deleteCourse } = useCourses();
  const { toast } = useToast();
  const { t } = useTranslation('CoursesManagement');
  const { language: currentLanguage } = useI18next();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    level: 'beginner',
    format: 'online',
    duration: '',
    price: 0,
    currency: '$',
    startDate: '',
    endDate: '',
    institutionName: '',
    companyName: '',
    instructorName: '',
    maxStudents: 20,
    availableSeats: 20,
    featured: false
  });

  const categories = [...new Set(courses.map(course => course.category))];
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.institution.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setCourseForm({
      title: '',
      description: '',
      category: '',
      subcategory: '',
      level: 'beginner',
      format: 'online',
      duration: '',
      price: 0,
      currency: '$',
      startDate: '',
      endDate: '',
      institutionName: '',
      companyName: '',
      instructorName: '',
      maxStudents: 20,
      availableSeats: 20,
      featured: false
    });
    setEditingCourse(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const selectedInstitution = institutions.find(inst => inst.name === courseForm.institutionName);
    const courseData = {
      ...courseForm,
      instructor: courseForm.instructorName,
      institution: selectedInstitution || institutions[0],
      shortDescription: courseForm.description.substring(0, 100),
      imageUrl: '',
      prerequisites: [],
      certification: 'Certificate of Completion',
      syllabus: [],
      schedule: 'TBD',
      language: 'English',
      tags: [courseForm.category, courseForm.level],
    };
    
    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
      toast({
        title: t('success.courseUpdated'),
        description: t('success.courseUpdated'),
      });
    } else {
      addCourse(courseData);
      toast({
        title: t('success.courseAdded'),
        description: t('success.courseAdded'),
      });
    }
    
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (course) => {
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      subcategory: course.subcategory,
      level: course.level,
      format: course.format,
      duration: course.duration,
      price: course.price,
      currency: course.currency,
      startDate: course.startDate,
      endDate: course.endDate,
      institutionName: course.institution.name,
      companyName: '',
      instructorName: course.instructor,
      maxStudents: 20,
      availableSeats: course.availableSeats,
      featured: false
    });
    setEditingCourse(course);
    setIsAddDialogOpen(true);
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const handleDelete = (course) => {
    setCourseToDelete(course);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete.id);
      toast({
        title: t('success.courseDeleted'),
        description: t('success.courseDeleted'),
      });
      setDeleteModalOpen(false);
      setCourseToDelete(null);
    }
  };

  const CourseDialog = () => (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <div className="flex items-center justify-between flex-row">
            <DialogTitle className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
              {editingCourse ? t('form.editTitle') : t('form.createTitle')}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { resetForm(); setIsAddDialogOpen(false); }}
              className={`${currentLanguage === 'ar' ? 'order-first' : 'order-last'}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className={`font-semibold text-lg ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.basicInformation')}</h3>
              
              <div>
                <Label htmlFor="title" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.title')} *</Label>
                <Input
                  id="title"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t('form.fields.titlePlaceholder')}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.description')} *</Label>
                <Textarea
                  id="description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('form.fields.descriptionPlaceholder')}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.category')} *</Label>
                <Input
                  id="category"
                  value={courseForm.category}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, category: e.target.value }))}
                  placeholder={t('form.fields.categoryPlaceholder')}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="subcategory" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.subcategory')}</Label>
                <Input
                  id="subcategory"
                  value={courseForm.subcategory}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, subcategory: e.target.value }))}
                  placeholder={t('form.fields.subcategoryPlaceholder')}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>

            {/* Course Details */}
            <div className="space-y-4">
              <h3 className={`font-semibold text-lg ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.courseDetails')}</h3>
              
              <div>
                <Label htmlFor="level" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.level')} *</Label>
                <Select value={courseForm.level} onValueChange={(value) => setCourseForm(prev => ({ ...prev, level: value }))}>
                  <SelectTrigger dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'} className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">{t('form.levels.beginner')}</SelectItem>
                    <SelectItem value="intermediate">{t('form.levels.intermediate')}</SelectItem>
                    <SelectItem value="advanced">{t('form.levels.advanced')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="format" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.format')} *</Label>
                <Select value={courseForm.format} onValueChange={(value) => setCourseForm(prev => ({ ...prev, format: value }))}>
                  <SelectTrigger dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'} className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">{t('form.formats.online')}</SelectItem>
                    <SelectItem value="offline">{t('form.formats.offline')}</SelectItem>
                    <SelectItem value="hybrid">{t('form.formats.hybrid')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="duration" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.duration')}</Label>
                <Input
                  id="duration"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder={t('form.fields.durationPlaceholder')}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                />
              </div>
              
              <div>
                <Label htmlFor="price" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.price')} *</Label>
                <Input
                  id="price"
                  type="number"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Dates and Enrollment */}
          <div className="space-y-4">
            <h3 className={`font-semibold text-lg ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.datesEnrollment')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.startDate')}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={courseForm.startDate}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, startDate: e.target.value }))}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                />
              </div>
              
              <div>
                <Label htmlFor="endDate" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.endDate')}</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={courseForm.endDate}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, endDate: e.target.value }))}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                />
              </div>
              
              <div>
                <Label htmlFor="maxStudents" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.maxStudents')}</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  value={courseForm.maxStudents}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, maxStudents: Number(e.target.value) }))}
                  min="1"
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                />
              </div>
              
              <div>
                <Label htmlFor="availableSeats" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.availableSeats')}</Label>
                <Input
                  id="availableSeats"
                  type="number"
                  value={courseForm.availableSeats}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, availableSeats: Number(e.target.value) }))}
                  min="0"
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>
          </div>

          {/* Institution and Instructor */}
          <div className="space-y-4">
            <h3 className={`font-semibold text-lg ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.institutionInstructor')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="institutionName" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.institutionName')} *</Label>
                <Select value={courseForm.institutionName} onValueChange={(value) => setCourseForm(prev => ({ ...prev, institutionName: value }))}>
                  <SelectTrigger dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'} className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    <SelectValue placeholder={t('form.placeholders.selectInstitution')} />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((institution) => (
                      <SelectItem key={institution.id} value={institution.name}>
                        {institution.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="instructorName" className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('form.fields.instructorName')} *</Label>
                <Input
                  id="instructorName"
                  value={courseForm.instructorName}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, instructorName: e.target.value }))}
                  placeholder={t('form.fields.instructorPlaceholder')}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                  required
                />
              </div>
            </div>
          </div>

          <div className={`flex ${currentLanguage === 'ar' ? 'justify-start flex-row-reverse' : 'justify-end'} gap-3 pt-4`}>
            <Button type="button" variant="outline" onClick={() => { resetForm(); setIsAddDialogOpen(false); }}>
              {t('form.buttons.cancel')}
            </Button>
            <Button type="submit">
              {editingCourse ? t('form.buttons.update') : t('form.buttons.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-xl md:text-2xl font-bold text-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
            {t('title')}
          </h2>
          <p className={`text-sm md:text-base text-muted-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
            {t('description')}
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className={`bg-primary hover:bg-primary/90 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Plus className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('addCourse')}
            </Button>
          </DialogTrigger>
          <CourseDialog />
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between flex-row ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className={`text-xs md:text-sm font-medium text-muted-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t('stats.totalCourses')}
                </p>
                <p className="text-xl md:text-2xl font-bold  bg-clip-text ">{courses.length}</p>
              </div>
              <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between flex-row ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className={`text-xs md:text-sm font-medium text-muted-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t('stats.categories')}
                </p>
                <p className="text-xl md:text-2xl font-bold  bg-clip-text ">{categories.length}</p>
              </div>
              <Filter className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between flex-row ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className={`text-xs md:text-sm font-medium text-muted-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t('stats.totalEnrollments')}
                </p>
                <p className="text-xl md:text-2xl font-bold  bg-clip-text">{courses.reduce((sum, course) => sum + course.totalEnrollments, 0)}</p>
              </div>
              <Users className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between flex-row ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className={`text-xs md:text-sm font-medium text-muted-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t('stats.avgRating')}
                </p>
                <p className="text-xl md:text-2xl font-bold  bg-clip-text ">
                  {courses.length > 0 
                    ? (courses.reduce((sum, course) => sum + course.averageRating, 0) / courses.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <Star className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-4 md:p-6">
          <div className={`flex flex-col ${currentLanguage === 'ar' ? 'sm:flex-row-reverse' : 'sm:flex-row'} gap-3 md:gap-4`}>
            <div className="flex-1">
              <div className="relative">
                <Search className={`h-4 w-4 absolute ${currentLanguage === 'ar' ? 'right-3' : 'left-3'} top-3 text-muted-foreground`} />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={currentLanguage === 'ar' ? 'pr-[30px] text-right' : 'pl-[30px]'}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-44 md:w-48 flex-row">
                <SelectValue placeholder={t('filters.filterByCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allCategories')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
     w

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
              {t('deleteModal.title')}
            </DialogTitle>
          </DialogHeader>
          <div className={`py-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
            <p className="text-muted-foreground">
              {t('deleteModal.description', { courseName: courseToDelete?.title })}
            </p>
          </div>
          <div className={`flex ${currentLanguage === 'ar' ? 'justify-start flex-row-reverse' : 'justify-end'} gap-3`}>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              {t('deleteModal.cancelText')}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              {t('deleteModal.confirmText')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const query = graphql`
  query($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;