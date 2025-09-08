import React from 'react';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { useCourses } from '../../context/CourseContext';

const CourseFilters = () => {
    const { courses, filters, setFilters } = useCourses();

    const categories = [...new Set(courses.map(course => course.category))];
    const subcategories = [...new Set(courses.map(course => course.subcategory))];
    const institutions = [...new Set(courses.map(course => course.institution.name))];
    const levels = ['beginner', 'intermediate', 'advanced'];
    const formats = ['online', 'offline', 'hybrid'];

    const clearFilters = () => {
        setFilters({
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
    };

    const hasActiveFilters = Object.values(filters).some(value =>
        value !== '' && value !== 'newest' && value !== 'all'
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-theme-light/20 p-2 rounded-lg">
                        <SlidersHorizontal className="h-5 w-5 text-theme-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground hover:text-theme-primary transition-colors"
                    >
                        Clear all
                    </Button>
                )}
            </div>

            {/* Filters Content */}
            <div className="space-y-6">
                {/* Sort By */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Search className="h-4 w-4 text-theme-primary" />
                        Sort By
                    </Label>
                    <Select value={filters.sortBy} onValueChange={(value) => setFilters({ sortBy: value })}>
                        <SelectTrigger className="bg-background/50 border-border/50 hover:border-theme-primary/50 transition-colors">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="title">Title A-Z</SelectItem>
                            <SelectItem value="price">Price Low to High</SelectItem>
                            <SelectItem value="rating">Highest Rated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Separator className="opacity-50" />

                {/* Category */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Category</Label>
                    <Select value={filters.category} onValueChange={(value) => setFilters({ category: value })}>
                        <SelectTrigger className="bg-background/50 border-border/50 hover:border-theme-primary/50 transition-colors">
                            <SelectValue placeholder="Select category" />
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

                {/* Level */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Level</Label>
                    <Select value={filters.level} onValueChange={(value) => setFilters({ level: value })}>
                        <SelectTrigger className="bg-background/50 border-border/50 hover:border-theme-primary/50 transition-colors">
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            {levels.map((level) => (
                                <SelectItem key={level} value={level}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Format */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Format</Label>
                    <Select value={filters.format} onValueChange={(value) => setFilters({ format: value })}>
                        <SelectTrigger className="bg-background/50 border-border/50 hover:border-theme-primary/50 transition-colors">
                            <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Formats</SelectItem>
                            {formats.map((format) => (
                                <SelectItem key={format} value={format}>
                                    {format.charAt(0).toUpperCase() + format.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Separator className="opacity-50" />

                {/* Price Range */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Price Range</Label>
                    <Select value={filters.priceRange} onValueChange={(value) => setFilters({ priceRange: value })}>
                        <SelectTrigger className="bg-background/50 border-border/50 hover:border-theme-primary/50 transition-colors">
                            <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="under-500">Under $500</SelectItem>
                            <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                            <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                            <SelectItem value="over-2000">Over $2,000</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Institution */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Institution</Label>
                    <Select value={filters.institution} onValueChange={(value) => setFilters({ institution: value })}>
                        <SelectTrigger className="bg-background/50 border-border/50 hover:border-theme-primary/50 transition-colors">
                            <SelectValue placeholder="Select institution" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Institutions</SelectItem>
                            {institutions.map((institution) => (
                                <SelectItem key={institution} value={institution}>
                                    {institution}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Minimum Rating</Label>
                    <Select value={filters.rating} onValueChange={(value) => setFilters({ rating: value })}>
                        <SelectTrigger className="bg-background/50 border-border/50 hover:border-theme-primary/50 transition-colors">
                            <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Ratings</SelectItem>
                            <SelectItem value="4.5">4.5+ Stars</SelectItem>
                            <SelectItem value="4.0">4.0+ Stars</SelectItem>
                            <SelectItem value="3.5">3.5+ Stars</SelectItem>
                            <SelectItem value="3.0">3.0+ Stars</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default CourseFilters;