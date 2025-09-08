import React, { useState, useMemo } from 'react';
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
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-theme-primary via-theme-base to-theme-secondary py-20 md:py-32 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-5xl mx-auto">
                <div className="animate-fade-in">
                <h1 className="text-4xl md:text-7xl font-bold text-white mb-8 leading-tight">
                    Theology & Divinity
                    <span className="bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent block">
                    Studies
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto">
                    Deepen your understanding of Scripture, theology, and ministry through our comprehensive 
                    collection of courses from accredited institutions and renowned instructors.
                </p>
                </div>
                
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-16 animate-scale-in">
                <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all duration-300 hover-scale group">
                    <CardContent className="p-6 md:p-8 text-center">
                    <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="h-8 w-8 text-white mx-auto" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{totalCourses}</div>
                    <div className="text-white/80 font-medium">Courses Available</div>
                    </CardContent>
                </Card>
                
                <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all duration-300 hover-scale group">
                    <CardContent className="p-6 md:p-8 text-center">
                    <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Users className="h-8 w-8 text-white mx-auto" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{totalInstructors}</div>
                    <div className="text-white/80 font-medium">Expert Instructors</div>
                    </CardContent>
                </Card>
                
                <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all duration-300 hover-scale group">
                    <CardContent className="p-6 md:p-8 text-center">
                    <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Award className="h-8 w-8 text-white mx-auto" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{totalInstitutions}</div>
                    <div className="text-white/80 font-medium">Accredited Institutions</div>
                    </CardContent>
                </Card>
                </div>
            </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 md:py-16">
            {/* Courses Grid */}
            <main className="w-full">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-theme-primary to-theme-base bg-clip-text text-transparent">
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
    </Layout>
  );
};

export default CoursesPage;