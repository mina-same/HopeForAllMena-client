import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, BookOpen, Users, Calendar, Clock, Star, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../../hooks/use-toast';
import { useCourses } from '../../context/CourseContext';
import ConfirmationModal from '../ui/ConfirmationModal';

export function CoursesSection() {
  const { toast } = useToast();
  const {
    courses,
    loading,
    addCourse,
    updateCourse,
    deleteCourse,
    institutions
  } = useCourses();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [courseForm, setCourseForm] = useState({
    // Basic Information
    title: '',
    titleAr: '',
    titleEn: '',
    description: '',
    descriptionAr: '',
    descriptionEn: '',
    shortDescription: '',
    shortDescriptionAr: '',
    shortDescriptionEn: '',
    
    // Category and Classification
    category: '',
    categoryAr: '',
    categoryEn: '',
    subcategory: '',
    subcategoryAr: '',
    subcategoryEn: '',
    level: 'beginner',
    format: 'online',
    
    // Duration and Schedule
    duration: '',
    durationAr: '',
    durationEn: '',
    totalHours: 0,
    schedule: '',
    
    // Pricing
    price: 0,
    currency: 'EGP',
    discountedPrice: 0,
    actualPrice: 0,
    
    // Dates
    startDate: '',
    endDate: '',
    
    // Capacity
    maxStudents: 50,
    
    // People
    instructor: '',
    instructorAr: '',
    instructorEn: '',
    
    // Institution
    institution: {
      id: '',
      name: '',
      nameAr: '',
      nameEn: '',
      logo: '',
      website: ''
    },
    
    // Course Details
    language: 'English',
    imageUrl: '',
    prerequisites: [],
    certification: 'Certificate of Completion',
    certificateIssuer: '',
    tags: [],
    
    // Age Requirements
    minAge: 0,
    maxAge: 0,
    
    // Study Structure
    onlinePercentage: 100,
    offlinePercentage: 0,
    studyStructure: {
      semesters: 1,
      hasSummerCourse: false,
      hasGraduationProject: false,
      hasGraduationCeremony: false
    },
    
    // Weekly Schedule
    weeklySchedule: {
      day: '',
      startTime: '',
      endTime: '',
      duration: 0,
      platform: ''
    },
    
    // Attendance Policy
    attendancePolicy: {
      allowedAbsencesPerMonth: 1,
      dismissalAfterAbsences: 2,
      requiresExcuse: true
    },
    
    // Payment Options
    paymentInstallments: {
      enabled: false,
      numberOfInstallments: 1,
      installmentAmount: 0
    },
    
    // Requirements
    requiresReferenceLetter: false,
    referenceLetterFrom: '',
    
    // Status and Features
    featured: false,
    status: 'draft'
  });

  // Reset form
  const resetForm = () => {
    setCourseForm({
      // Basic Information
      title: '',
      titleAr: '',
      titleEn: '',
      description: '',
      descriptionAr: '',
      descriptionEn: '',
      shortDescription: '',
      shortDescriptionAr: '',
      shortDescriptionEn: '',
      
      // Category and Classification
      category: '',
      categoryAr: '',
      categoryEn: '',
      subcategory: '',
      subcategoryAr: '',
      subcategoryEn: '',
      level: 'beginner',
      format: 'online',
      
      // Duration and Schedule
      duration: '',
      durationAr: '',
      durationEn: '',
      totalHours: 0,
      schedule: '',
      
      // Pricing
      price: 0,
      currency: 'EGP',
      discountedPrice: 0,
      actualPrice: 0,
      
      // Dates
      startDate: '',
      endDate: '',
      
      // Capacity
      maxStudents: 50,
      
      // People
      instructor: '',
      instructorAr: '',
      instructorEn: '',
      
      // Institution
      institution: {
        id: '',
        name: '',
        nameAr: '',
        nameEn: '',
        logo: '',
        website: ''
      },
      
      // Course Details
      language: 'English',
      imageUrl: '',
      prerequisites: [],
      certification: 'Certificate of Completion',
      certificateIssuer: '',
      tags: [],
      
      // Age Requirements
      minAge: 0,
      maxAge: 0,
      
      // Study Structure
      onlinePercentage: 100,
      offlinePercentage: 0,
      studyStructure: {
        semesters: 1,
        hasSummerCourse: false,
        hasGraduationProject: false,
        hasGraduationCeremony: false
      },
      
      // Weekly Schedule
      weeklySchedule: {
        day: '',
        startTime: '',
        endTime: '',
        duration: 0,
        platform: ''
      },
      
      // Attendance Policy
      attendancePolicy: {
        allowedAbsencesPerMonth: 1,
        dismissalAfterAbsences: 2,
        requiresExcuse: true
      },
      
      // Payment Options
      paymentInstallments: {
        enabled: false,
        numberOfInstallments: 1,
        installmentAmount: 0
      },
      
      // Requirements
      requiresReferenceLetter: false,
      referenceLetterFrom: '',
      
      // Status and Features
      featured: false,
      status: 'draft'
    });
    setEditingCourse(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    
    if (type === 'number') {
      processedValue = value === '' ? 0 : Number(value);
    } else if (type === 'checkbox') {
      processedValue = checked;
    }
    
    // Handle nested object fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCourseForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: processedValue
        }
      }));
    } else {
      setCourseForm(prev => ({
        ...prev,
        [name]: processedValue
      }));
    }
  };

  // Handle array fields (prerequisites, tags)
  const handleArrayChange = (fieldName, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setCourseForm(prev => ({
      ...prev,
      [fieldName]: arrayValue
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id || editingCourse._id, courseForm);
        toast({
          title: "Success",
          description: "Course updated successfully",
          variant: "default"
        });
      } else {
        await addCourse(courseForm);
        toast({
          title: "Success",
          description: "Course created successfully",
          variant: "default"
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: editingCourse ? "Failed to update course" : "Failed to create course",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (course) => {
    setEditingCourse(course);
    setCourseForm({
      // Basic Information
      title: course.title || '',
      titleAr: course.titleAr || '',
      titleEn: course.titleEn || '',
      description: course.description || '',
      descriptionAr: course.descriptionAr || '',
      descriptionEn: course.descriptionEn || '',
      shortDescription: course.shortDescription || '',
      shortDescriptionAr: course.shortDescriptionAr || '',
      shortDescriptionEn: course.shortDescriptionEn || '',
      
      // Category and Classification
      category: course.category || '',
      categoryAr: course.categoryAr || '',
      categoryEn: course.categoryEn || '',
      subcategory: course.subcategory || '',
      subcategoryAr: course.subcategoryAr || '',
      subcategoryEn: course.subcategoryEn || '',
      level: course.level || 'beginner',
      format: course.format || 'online',
      
      // Duration and Schedule
      duration: course.duration || '',
      durationAr: course.durationAr || '',
      durationEn: course.durationEn || '',
      totalHours: course.totalHours || 0,
      schedule: course.schedule || '',
      
      // Pricing
      price: course.price || 0,
      currency: course.currency || 'EGP',
      discountedPrice: course.discountedPrice || 0,
      actualPrice: course.actualPrice || 0,
      
      // Dates
      startDate: course.startDate ? course.startDate.split('T')[0] : '',
      endDate: course.endDate ? course.endDate.split('T')[0] : '',
      
      // Capacity
      maxStudents: course.maxStudents || 50,
      
      // People
      instructor: course.instructor || '',
      instructorAr: course.instructorAr || '',
      instructorEn: course.instructorEn || '',
      
      // Institution
      institution: {
        id: course.institution?.id || '',
        name: course.institution?.name || '',
        nameAr: course.institution?.nameAr || '',
        nameEn: course.institution?.nameEn || '',
        logo: course.institution?.logo || '',
        website: course.institution?.website || ''
      },
      
      // Course Details
      language: course.language || 'English',
      imageUrl: course.imageUrl || '',
      prerequisites: course.prerequisites || [],
      certification: course.certification || 'Certificate of Completion',
      certificateIssuer: course.certificateIssuer || '',
      tags: course.tags || [],
      
      // Age Requirements
      minAge: course.minAge || 0,
      maxAge: course.maxAge || 0,
      
      // Study Structure
      onlinePercentage: course.onlinePercentage || 100,
      offlinePercentage: course.offlinePercentage || 0,
      studyStructure: {
        semesters: course.studyStructure?.semesters || 1,
        hasSummerCourse: course.studyStructure?.hasSummerCourse || false,
        hasGraduationProject: course.studyStructure?.hasGraduationProject || false,
        hasGraduationCeremony: course.studyStructure?.hasGraduationCeremony || false
      },
      
      // Weekly Schedule
      weeklySchedule: {
        day: course.weeklySchedule?.day || '',
        startTime: course.weeklySchedule?.startTime || '',
        endTime: course.weeklySchedule?.endTime || '',
        duration: course.weeklySchedule?.duration || 0,
        platform: course.weeklySchedule?.platform || ''
      },
      
      // Attendance Policy
      attendancePolicy: {
        allowedAbsencesPerMonth: course.attendancePolicy?.allowedAbsencesPerMonth || 1,
        dismissalAfterAbsences: course.attendancePolicy?.dismissalAfterAbsences || 2,
        requiresExcuse: course.attendancePolicy?.requiresExcuse !== false
      },
      
      // Payment Options
      paymentInstallments: {
        enabled: course.paymentInstallments?.enabled || false,
        numberOfInstallments: course.paymentInstallments?.numberOfInstallments || 1,
        installmentAmount: course.paymentInstallments?.installmentAmount || 0
      },
      
      // Requirements
      requiresReferenceLetter: course.requiresReferenceLetter || false,
      referenceLetterFrom: course.referenceLetterFrom || '',
      
      // Status and Features
      featured: course.featured || false,
      status: course.status || 'draft'
    });
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteCourse(courseToDelete.id || courseToDelete._id);
      toast({
        title: "Success",
        description: "Course deleted successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(courses.map(course => course.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Courses Management</h2>
          <p className="text-gray-600">Manage your courses and training programs</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Custom Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                  {[
                    { id: 'basic', name: 'Basic Information' },
                    { id: 'details', name: 'Details' },
                    { id: 'schedule', name: 'Schedule' },
                    { id: 'pricing', name: 'Pricing' },
                    { id: 'advanced', name: 'Advanced' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={courseForm.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter course title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={courseForm.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Brief description of the course"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={courseForm.description}
                    onChange={handleInputChange}
                    placeholder="Detailed course description"
                    rows={4}
                  />
                </div>
              </div>

              {/* Course Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={courseForm.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Programming, Design"
                  />
                </div>
                
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select value={courseForm.level} onValueChange={(value) => setCourseForm(prev => ({...prev, level: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="format">Format</Label>
                  <Select value={courseForm.format} onValueChange={(value) => setCourseForm(prev => ({...prev, format: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={courseForm.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 8 weeks, 40 hours"
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={courseForm.price}
                    onChange={handleInputChange}
                    placeholder="0 for free"
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxStudents">Max Students</Label>
                  <Input
                    id="maxStudents"
                    name="maxStudents"
                    type="number"
                    min="1"
                    value={courseForm.maxStudents}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={courseForm.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={courseForm.endDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    name="instructor"
                    value={courseForm.instructor}
                    onChange={handleInputChange}
                    placeholder="Instructor name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={courseForm.status} onValueChange={(value) => setCourseForm(prev => ({...prev, status: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="titleAr">Arabic Title</Label>
                      <Input
                        id="titleAr"
                        name="titleAr"
                        value={courseForm.titleAr}
                        onChange={handleInputChange}
                        placeholder="العنوان بالعربية"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Input
                        id="subcategory"
                        name="subcategory"
                        value={courseForm.subcategory}
                        onChange={handleInputChange}
                        placeholder="e.g., Web Development"
                      />
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select value={courseForm.language} onValueChange={(value) => setCourseForm(prev => ({...prev, language: value}))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Arabic">Arabic</SelectItem>
                          <SelectItem value="Both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="totalHours">Total Hours</Label>
                      <Input
                        id="totalHours"
                        name="totalHours"
                        type="number"
                        min="0"
                        value={courseForm.totalHours}
                        onChange={handleInputChange}
                        placeholder="Total course hours"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="schedule">Schedule</Label>
                      <Input
                        id="schedule"
                        name="schedule"
                        value={courseForm.schedule}
                        onChange={handleInputChange}
                        placeholder="e.g., Mon-Wed-Fri 6-8 PM"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weeklySchedule.day">Day</Label>
                      <Select value={courseForm.weeklySchedule.day} onValueChange={(value) => setCourseForm(prev => ({...prev, weeklySchedule: {...prev.weeklySchedule, day: value}}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monday">Monday</SelectItem>
                          <SelectItem value="Tuesday">Tuesday</SelectItem>
                          <SelectItem value="Wednesday">Wednesday</SelectItem>
                          <SelectItem value="Thursday">Thursday</SelectItem>
                          <SelectItem value="Friday">Friday</SelectItem>
                          <SelectItem value="Saturday">Saturday</SelectItem>
                          <SelectItem value="Sunday">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="weeklySchedule.startTime">Start Time</Label>
                      <Input
                        id="weeklySchedule.startTime"
                        name="weeklySchedule.startTime"
                        type="time"
                        value={courseForm.weeklySchedule.startTime}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weeklySchedule.endTime">End Time</Label>
                      <Input
                        id="weeklySchedule.endTime"
                        name="weeklySchedule.endTime"
                        type="time"
                        value={courseForm.weeklySchedule.endTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="discountedPrice">Discounted Price</Label>
                      <Input
                        id="discountedPrice"
                        name="discountedPrice"
                        type="number"
                        min="0"
                        value={courseForm.discountedPrice}
                        onChange={handleInputChange}
                        placeholder="Discounted price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="actualPrice">Actual Price</Label>
                      <Input
                        id="actualPrice"
                        name="actualPrice"
                        type="number"
                        min="0"
                        value={courseForm.actualPrice}
                        onChange={handleInputChange}
                        placeholder="Original price"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="paymentInstallments.enabled"
                        checked={courseForm.paymentInstallments.enabled}
                        onCheckedChange={(checked) => setCourseForm(prev => ({...prev, paymentInstallments: {...prev.paymentInstallments, enabled: checked}}))}
                      />
                      <Label htmlFor="paymentInstallments.enabled">Enable Installments</Label>
                    </div>
                    {courseForm.paymentInstallments.enabled && (
                      <div>
                        <Label htmlFor="paymentInstallments.numberOfInstallments">Number of Installments</Label>
                        <Input
                          id="paymentInstallments.numberOfInstallments"
                          name="paymentInstallments.numberOfInstallments"
                          type="number"
                          min="1"
                          value={courseForm.paymentInstallments.numberOfInstallments}
                          onChange={(e) => setCourseForm(prev => ({...prev, paymentInstallments: {...prev.paymentInstallments, numberOfInstallments: Number(e.target.value)}}))}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="prerequisites">Prerequisites (comma-separated)</Label>
                      <Textarea
                        id="prerequisites"
                        value={courseForm.prerequisites.join(', ')}
                        onChange={(e) => handleArrayChange('prerequisites', e.target.value)}
                        placeholder="Basic programming, Mathematics"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Textarea
                        id="tags"
                        value={courseForm.tags.join(', ')}
                        onChange={(e) => handleArrayChange('tags', e.target.value)}
                        placeholder="programming, web development, javascript"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minAge">Minimum Age</Label>
                        <Input
                          id="minAge"
                          name="minAge"
                          type="number"
                          min="0"
                          value={courseForm.minAge}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxAge">Maximum Age</Label>
                        <Input
                          id="maxAge"
                          name="maxAge"
                          type="number"
                          min="0"
                          value={courseForm.maxAge}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={courseForm.featured}
                        onCheckedChange={(checked) => setCourseForm(prev => ({...prev, featured: checked}))}
                      />
                      <Label htmlFor="featured">Featured Course</Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-500">Loading courses...</p>
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by creating your first course'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id || course._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {course.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {course.category || 'Uncategorized'}
                      </Badge>
                      <Badge 
                        variant={course.level === 'beginner' ? 'default' : 
                                course.level === 'intermediate' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {course.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.format}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(course)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(course)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {course.shortDescription || course.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  {course.instructor && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{course.instructor}</span>
                    </div>
                  )}
                  
                  {course.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{course.duration}</span>
                    </div>
                  )}
                  
                  {course.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Starts {new Date(course.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">
                        {course.price === 0 ? 'Free' : `${course.price} ${course.currency || 'EGP'}`}
                      </span>
                    </div>
                    
                    {course.averageRating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{course.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  {course.totalEnrollments > 0 && (
                    <div className="text-xs text-gray-500">
                      {course.totalEnrollments} students enrolled
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Course"
        description={`Are you sure you want to delete "${courseToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}

export default CoursesSection;