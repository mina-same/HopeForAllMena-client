import React, { createContext, useContext, useState, useEffect } from 'react';
import { coursesAPI, enrollmentsAPI } from '../services/api';
import coursesData from '../data/courses.json';

const CourseContext = createContext(undefined);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [institutions, setInstitutions] = useState(coursesData.institutions);
  const [companies] = useState(coursesData.companies);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load courses, enrollments, and institutions in parallel
        const [coursesResponse, enrollmentsResponse, institutionsResponse] = await Promise.allSettled([
          coursesAPI.getCourses({ status: 'published' }),
          enrollmentsAPI.getEnrollments(),
          coursesAPI.getInstitutions()
        ]);
        
        // Handle courses
        if (coursesResponse.status === 'fulfilled') {
          setCourses(coursesResponse.value.data?.courses || []);
        } else {
          console.warn('Failed to load courses, using fallback data:', coursesResponse.reason);
          setCourses(coursesData.courses || []);
        }
        
        // Handle enrollments
        if (enrollmentsResponse.status === 'fulfilled') {
          setEnrollments(enrollmentsResponse.value.data?.enrollments || []);
        } else {
          console.warn('Failed to load enrollments:', enrollmentsResponse.reason);
        }
        
        // Handle institutions
        if (institutionsResponse.status === 'fulfilled') {
          setInstitutions(institutionsResponse.value.data?.institutions || coursesData.institutions);
        }
        
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load course data');
        // Use fallback data
        setCourses(coursesData.courses || []);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const addCourse = async (courseData) => {
    try {
      setLoading(true);
      const response = await coursesAPI.createCourse(courseData);
      const newCourse = response.data.course;
      setCourses(prev => [newCourse, ...prev]);
      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Failed to create course');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      setLoading(true);
      const response = await coursesAPI.updateCourse(id, courseData);
      const updatedCourse = response.data.course;
      setCourses(prev => prev.map(course => 
        course._id === id || course.id === id ? updatedCourse : course
      ));
      return updatedCourse;
    } catch (error) {
      console.error('Error updating course:', error);
      setError('Failed to update course');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    try {
      setLoading(true);
      await coursesAPI.deleteCourse(id);
      setCourses(prev => prev.filter(course => course._id !== id && course.id !== id));
      setReviews(prev => prev.filter(review => review.courseId !== id));
      setEnrollments(prev => prev.filter(enrollment => enrollment.courseId !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Failed to delete course');
      throw error;
    } finally {
      setLoading(false);
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
      setLoading(true);
      const response = await enrollmentsAPI.createEnrollment(enrollmentData);
      const newEnrollment = response.data.enrollment;
      setEnrollments(prev => [newEnrollment, ...prev]);
      
      // Refresh courses to get updated enrollment counts
      const coursesResponse = await coursesAPI.getCourses({ status: 'published' });
      if (coursesResponse.data?.courses) {
        setCourses(coursesResponse.data.courses);
      }
      
      return newEnrollment;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      setError('Failed to create enrollment');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateEnrollmentStatus = async (id, status) => {
    try {
      setLoading(true);
      let response;
      
      if (status === 'approved') {
        response = await enrollmentsAPI.approveEnrollment(id);
      } else if (status === 'rejected') {
        response = await enrollmentsAPI.rejectEnrollment(id);
      } else {
        response = await enrollmentsAPI.updateEnrollment(id, { status });
      }
      
      const updatedEnrollment = response.data.enrollment;
      setEnrollments(prev => prev.map(enrollment => 
        enrollment._id === id || enrollment.id === id ? updatedEnrollment : enrollment
      ));
      
      // Refresh courses to get updated enrollment counts
      const coursesResponse = await coursesAPI.getCourses({ status: 'published' });
      if (coursesResponse.data?.courses) {
        setCourses(coursesResponse.data.courses);
      }
      
      return updatedEnrollment;
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      setError('Failed to update enrollment status');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteEnrollment = async (id) => {
    try {
      setLoading(true);
      await enrollmentsAPI.deleteEnrollment(id);
      setEnrollments(prev => prev.filter(e => e._id !== id && e.id !== id));
      
      // Refresh courses to get updated enrollment counts
      const coursesResponse = await coursesAPI.getCourses({ status: 'published' });
      if (coursesResponse.data?.courses) {
        setCourses(coursesResponse.data.courses);
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      setError('Failed to delete enrollment');
      throw error;
    } finally {
      setLoading(false);
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