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
          <div className="flex items-center justify-between">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={courseForm.startDate}
                onChange={(e) => setCourseForm(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={courseForm.endDate}
                onChange={(e) => setCourseForm(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="maxStudents">Max Students</Label>
              <Input
                id="maxStudents"
                type="number"
                value={courseForm.maxStudents}
                onChange={(e) => setCourseForm(prev => ({ ...prev, maxStudents: Number(e.target.value) }))}
                min="1"
              />
            </div>
            
            <div>
              <Label htmlFor="availableSeats">Available Seats</Label>
              <Input
                id="availableSeats"
                type="number"
                value={courseForm.availableSeats}
                onChange={(e) => setCourseForm(prev => ({ ...prev, availableSeats: Number(e.target.value) }))}
                min="0"
              />
            </div>
          </div>

          {/* Institution and Instructor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="institutionName">Institution *</Label>
              <Select value={courseForm.institutionName} onValueChange={(value) => setCourseForm(prev => ({ ...prev, institutionName: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select institution" />
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
              <Label htmlFor="instructorName">Instructor Name *</Label>
              <Input
                id="instructorName"
                value={courseForm.instructorName}
                onChange={(e) => setCourseForm(prev => ({ ...prev, instructorName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => { resetForm(); setIsAddDialogOpen(false); }}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCourse ? 'Update Course' : 'Add Course'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Course Management</h2>
          <p className="text-sm md:text-base text-muted-foreground">Manage your educational courses and programs</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <CourseDialog />
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-xl md:text-2xl font-bold  bg-clip-text text-transparent">{courses.length}</p>
              </div>
              <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-xl md:text-2xl font-bold  bg-clip-text text-transparent">{categories.length}</p>
              </div>
              <Filter className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Enrollments</p>
                <p className="text-xl md:text-2xl font-bold  bg-clip-text text-transparent">{courses.reduce((sum, course) => sum + course.totalEnrollments, 0)}</p>
              </div>
              <Users className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-xl md:text-2xl font-bold  bg-clip-text text-transparent">
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
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search courses, instructors, or institutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-[30px]"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-44 md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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
      <Card>
        <CardHeader>
          <CardTitle>Courses ({filteredCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Enrollment</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.duration}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>{course.institution.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{course.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        course.level === 'beginner' ? 'default' :
                        course.level === 'intermediate' ? 'secondary' : 'destructive'
                      }>
                        {course.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.format}</Badge>
                    </TableCell>
                    <TableCell>
                      {course.price === 0 ? 'Free' : `${course.currency}${course.price}`}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{course.totalEnrollments}/20</p>
                        <p className="text-muted-foreground">
                          {course.availableSeats} seats left
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.averageRating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(course)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== 'all' ? 'No courses match your filters.' : 'No courses added yet.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};