import React, { createContext, useContext, useState } from 'react';
import coursesData from '../data/courses.json';

const CourseContext = createContext(undefined);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState(coursesData.courses);
  const [reviews, setReviews] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [institutions] = useState(coursesData.institutions);
  const [companies] = useState(coursesData.companies);
  const [currentPage, setCurrentPage] = useState(1);
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

  const addCourse = (courseData) => {
    const newCourse = {
      ...courseData,
      id: Date.now().toString(),
      averageRating: 0,
      totalEnrollments: 0
    };
    setCourses(prev => [newCourse, ...prev]);
  };

  const updateCourse = (id, courseData) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, ...courseData } : course
    ));
  };

  const deleteCourse = (id) => {
    setCourses(prev => prev.filter(course => course.id !== id));
    setReviews(prev => prev.filter(review => review.courseId !== id));
    setEnrollments(prev => prev.filter(enrollment => enrollment.courseId !== id));
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

  const addEnrollment = (enrollmentData) => {
    const newEnrollment = {
      ...enrollmentData,
      id: Date.now().toString(),
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    setEnrollments(prev => [newEnrollment, ...prev]);
    
    // Update course total enrollments
    const course = courses.find(c => c.id === enrollmentData.courseId);
    if (course) {
      updateCourse(enrollmentData.courseId, { 
        totalEnrollments: course.totalEnrollments + 1,
        availableSeats: Math.max(0, course.availableSeats - 1)
      });
    }
  };

  const updateEnrollmentStatus = (id, status) => {
    setEnrollments(prev => prev.map(enrollment => 
      enrollment.id === id ? { ...enrollment, status } : enrollment
    ));
  };

  const deleteEnrollment = (id) => {
    const enrollment = enrollments.find(e => e.id === id);
    setEnrollments(prev => prev.filter(e => e.id !== id));
    
    if (enrollment) {
      const course = courses.find(c => c.id === enrollment.courseId);
      if (course) {
        updateCourse(enrollment.courseId, { 
          totalEnrollments: Math.max(0, course.totalEnrollments - 1),
          availableSeats: course.availableSeats + 1
        });
      }
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
    setCurrentPage
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