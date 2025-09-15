import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'gatsby';
import CourseFilters from '../components/courses/CourseFilters';
import CourseGrid from '../components/courses/CourseGrid';
import { useCourses } from '../context/CourseContext';
import { Search, GraduationCap, Users, Award, Filter } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import Layout from '../components/layout';
import StickyHeader from '../components/header/sticky-header';
import HeaderTwo from '../components/header/header-two';
import Footer from '../components/footer';

const CoursesPage= () => {
  const { courses, filters, setFilters } = useCourses();
  const [searchValue, setSearchValue] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredCourses = useMemo(() => {
    let filtered = courses.filter((course) => {
      const matchesSearch = 
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.category.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = filters.category === 'all' || course.category === filters.category;
      const matchesSubcategory = filters.subcategory === 'all' || course.subcategory === filters.subcategory;
      const matchesLevel = filters.level === 'all' || course.level === filters.level;
      const matchesFormat = filters.format === 'all' || course.format === filters.format;
      const matchesInstitution = filters.institution === 'all' || course.institution.name === filters.institution;
      
      const matchesPriceRange = filters.priceRange === 'all' || (() => {
        switch (filters.priceRange) {
          case 'free': return course.price === 0;
          case 'under-500': return course.price > 0 && course.price < 500;
          case '500-1000': return course.price >= 500 && course.price < 1000;
          case '1000-2000': return course.price >= 1000 && course.price < 2000;
          case 'over-2000': return course.price >= 2000;
          default: return true;
        }
      })();

      const matchesRating = filters.rating === 'all' || course.averageRating >= parseFloat(filters.rating);

      return matchesSearch && matchesCategory && matchesSubcategory && matchesLevel && 
             matchesFormat && matchesInstitution && matchesPriceRange && matchesRating;
    });

    // Sort courses
    switch (filters.sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }

    return filtered;
  }, [courses, filters]);

  const handleSearchChange = (search) => {
    setSearchValue(search);
    setFilters({ search });
  };

  // Statistics
  const totalCourses = courses.length;
  const totalInstructors = new Set(courses.map(c => c.instructor)).size;
  const totalInstitutions = new Set(courses.map(c => c.institution.name)).size;

  return (
    <Layout >
        <HeaderTwo/>
        <StickyHeader/>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        {/* Modern Video Hero Section */}
        <section className="relative h-[80vh] overflow-hidden flex items-center">
            {/* Video Background */}
            <video 
                autoPlay 
                muted 
                loop 
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
            >
                <source src="/courses.mp4" type="video/mp4" />
                <source src="/courses.mp4" type="video/webm" />
                Your browser does not support the video tag.
            </video>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>
            
            {/* Content */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center text-white">
                    {/* Badge */}
                    <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium mb-8">
                        <GraduationCap className="w-5 h-5 mr-2" />
                        Transform Your Faith Journey
                    </div>
                    
                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl text-[#2194D1] font-bold mb-6 leading-tight">
                        Master Theology &
                        <span className="block bg-gradient-to-r from-thm-base to-thm-primary bg-clip-text text-transparent">
                            Divinity Studies
                        </span>
                    </h1>
                    
                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Join thousands of students worldwide in comprehensive theological education. 
                        <strong className="text-white"> Start your spiritual academic journey today.</strong>
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <button className="text-thm-primary bg-[#2194D1] hover:bg-[#2194D1]/90 px-6 py-2 text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                            Start Learning Now
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-thm-primary px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 bg-transparent">
                            Browse Courses
                        </button>
                    </div>
                    
                    {/* Simple Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">{totalCourses}+</div>
                            <div className="text-white/80 text-lg">Courses</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">{totalInstructors}+</div>
                            <div className="text-white/80 text-lg">Expert Instructors</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">{totalInstitutions}+</div>
                            <div className="text-white/80 text-lg">Institutions</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 md:py-16">
            {/* Courses Grid */}
            <main className="w-full">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-thm-primary to-thm-base bg-clip-text text-transparent">
                    Available Courses
                    </h2>
                    <p className="text-muted-foreground text-lg">
                    {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 sm:max-w-80">
                        <SheetHeader>
                        <SheetTitle>Filter Courses</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                        <CourseFilters />
                        </div>
                    </SheetContent>
                    </Sheet>
                </div>
                </div>

                {/* Enhanced Course Grid with Animation */}
                <div className="animate-fade-in">
                <CourseGrid courses={filteredCourses} />
                </div>
            </main>
        </div>
        </div>
        <Footer/>
    </Layout>
  );
};

export default CoursesPage;