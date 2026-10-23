import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { coursesAPI, enrollmentsAPI } from '../services/api';
import coursesData from '../data/courses.json';
import { authStorage } from '../utils/storage';

const CourseContext = createContext(null);

// includeDrafts: admin views list every course status, public pages only published ones
export const CourseProvider = ({ children, includeDrafts = false }) => {
  const listStatus = includeDrafts ? 'all' : 'published';
  const queryClient = useQueryClient();
  const [reviews, setReviews] = useState([]);
  const [companies] = useState(coursesData.companies);
  const [currentPage, setCurrentPage] = useState(1);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);
  // Enrollments contain applicants' personal data and are admin-only
  const [hasToken] = useState(() => !!authStorage.getToken());
  const [filters, setFiltersState] = useState({
    search: '',
    category: 'all',
    subcategory: 'all',
    level: 'all',
    format: 'all',
    institution: 'all',
    priceRange: 'all',
    duration: 'all',
    rating: 'all',
    sortBy: 'newest'
  });

  const coursesKey = ['courses', { status: listStatus, limit: 100 }];
  const coursesQuery = useQuery({
    queryKey: coursesKey,
    queryFn: () => coursesAPI.getCourses({ status: listStatus, limit: 100 })
  });
  const enrollmentsQuery = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => enrollmentsAPI.getEnrollments(),
    enabled: hasToken
  });
  const institutionsQuery = useQuery({
    queryKey: ['institutions'],
    queryFn: () => coursesAPI.getInstitutions()
  });

  const courses = coursesQuery.isError
    ? coursesData.courses || []
    : coursesQuery.data?.data?.courses || [];
  const enrollments = enrollmentsQuery.data?.data?.enrollments || [];
  const institutions = institutionsQuery.data?.data?.institutions || coursesData.institutions;
  const loading = coursesQuery.isLoading || enrollmentsQuery.isLoading || institutionsQuery.isLoading || mutating;

  useEffect(() => {
    if (coursesQuery.isError) {
      console.warn('Failed to load courses, using fallback data:', coursesQuery.error);
    }
  }, [coursesQuery.isError]);

  useEffect(() => {
    if (enrollmentsQuery.isError) {
      console.warn('Failed to load enrollments:', enrollmentsQuery.error);
    }
  }, [enrollmentsQuery.isError]);

  const refreshCourses = () => queryClient.invalidateQueries({ queryKey: ['courses'] });
  const refreshEnrollments = () => queryClient.invalidateQueries({ queryKey: ['enrollments'] });

  const setCourses = (updater) => {
    queryClient.setQueryData(coursesKey, (old) => {
      const prev = old?.data?.courses || [];
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return { ...old, data: { ...old?.data, courses: next } };
    });
  };

  const addCourse = async (courseData) => {
    try {
      setMutating(true);
      const response = await coursesAPI.createCourse(courseData);
      const newCourse = response.data.course;
      await refreshCourses();
      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Failed to create course');
      throw error;
    } finally {
      setMutating(false);
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      setMutating(true);
      const response = await coursesAPI.updateCourse(id, courseData);
      const updatedCourse = response.data.course;
      await refreshCourses();
      return updatedCourse;
    } catch (error) {
      console.error('Error updating course:', error);
      setError('Failed to update course');
      throw error;
    } finally {
      setMutating(false);
    }
  };

  const deleteCourse = async (id) => {
    try {
      setMutating(true);
      await coursesAPI.deleteCourse(id);
      setReviews(prev => prev.filter(review => review.courseId !== id));
      await Promise.all([refreshCourses(), refreshEnrollments()]);
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Failed to delete course');
      throw error;
    } finally {
      setMutating(false);
    }
  };

  const addReview = (reviewData) => {
    const newReview = {
      ...reviewData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews(prev => [newReview, ...prev]);
    
    // Update course average rating
    const courseReviews = [...reviews, newReview].filter(r => r.courseId === reviewData.courseId);
    const avgRating = courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;
    
    updateCourse(reviewData.courseId, { averageRating: Number(avgRating.toFixed(1)) });
  };

  const deleteReview = (id) => {
    const review = reviews.find(r => r.id === id);
    setReviews(prev => prev.filter(r => r.id !== id));
    
    if (review) {
      const remainingReviews = reviews.filter(r => r.courseId === review.courseId && r.id !== id);
      const avgRating = remainingReviews.length > 0 
        ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length 
        : 0;
      
      updateCourse(review.courseId, { averageRating: Number(avgRating.toFixed(1)) });
    }
  };

  const addEnrollment = async (enrollmentData) => {
    try {
      setMutating(true);
      const response = await enrollmentsAPI.createEnrollment(enrollmentData);
      const newEnrollment = response.data.enrollment;
      // Refresh courses to get updated enrollment counts
      await Promise.all([refreshEnrollments(), refreshCourses()]);
      return newEnrollment;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      setError('Failed to create enrollment');
      throw error;
    } finally {
      setMutating(false);
    }
  };

  const updateEnrollmentStatus = async (id, status) => {
    try {
      setMutating(true);
      let response;
      
      if (status === 'approved') {
        response = await enrollmentsAPI.approveEnrollment(id);
      } else if (status === 'rejected') {
        response = await enrollmentsAPI.rejectEnrollment(id);
      } else {
        response = await enrollmentsAPI.updateEnrollment(id, { status });
      }
      
      const updatedEnrollment = response.data.enrollment;
      // Refresh courses to get updated enrollment counts
      await Promise.all([refreshEnrollments(), refreshCourses()]);
      return updatedEnrollment;
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      setError('Failed to update enrollment status');
      throw error;
    } finally {
      setMutating(false);
    }
  };

  const deleteEnrollment = async (id) => {
    try {
      setMutating(true);
      await enrollmentsAPI.deleteEnrollment(id);
      // Refresh courses to get updated enrollment counts
      await Promise.all([refreshEnrollments(), refreshCourses()]);
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      setError('Failed to delete enrollment');
      throw error;
    } finally {
      setMutating(false);
    }
  };

  const setFilters = (newFilters) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const value = {
    courses,
    reviews,
    enrollments,
    institutions,
    companies,
    filters,
    currentPage,
    loading,
    error,
    setCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    addReview,
    deleteReview,
    addEnrollment,
    updateEnrollmentStatus,
    deleteEnrollment,
    setFilters,
    setCurrentPage,
    setError
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export { CourseContext };