import React from 'react';
import { Link } from 'gatsby';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
    Calendar,
    Clock,
    DollarSign,
    GraduationCap,
    MapPin,
    Star,
    Users,
    BookOpen,
    Award
} from 'lucide-react';

const CourseGrid = ({ courses }) => {
    const formatPrice = (price , currency) => {
        return price === 0 ? 'Free' : `${price.toLocaleString()} ${currency}`;
    };

    const formatDate = (dateString ) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (courses.length === 0) {
        return (
            <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
                <p className="text-muted-foreground">
                    Try adjusting your filters or search terms to find more courses.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {courses.map((course, index) => (
                <Card
                    key={course.id}
                    className="group hover:shadow-elegant transition-all duration-500 h-full flex flex-col border-0 bg-foreground hover:from-card hover:to-muted/50 backdrop-blur-sm overflow-hidden hover-scale"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <CardHeader className="pb-4 relative">
                        {/* Course Image/Icon with Enhanced Design */}
                        <div className="aspect-video bg-[#050517] rounded-xl mb-4 flex items-center justify-center group-hover:from-theme-primary/30 group-hover:via-theme-base/30 group-hover:to-theme-secondary/30 transition-all duration-500 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-30" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                            }}></div>

                            <div className="bg-white backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="h-10 w-10 text-theme-primary group-hover:text-theme-base transition-colors duration-300" />
                            </div>

                            {/* Decorative Corner */}
                            <div className="absolute top-3 right-3 w-2 h-2 bg-theme-primary rounded-full opacity-60"></div>
                        </div>

                        {/* Title and Badges */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-xl leading-tight group-hover:text-theme-primary transition-colors duration-300 line-clamp-2">
                                {course.title}
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="text-xs bg-theme-light/20 text-theme-primary border-theme-primary/20 hover:bg-theme-light/30">
                                    {course.category}
                                </Badge>
                                <Badge
                                    variant={course.level === 'beginner' ? 'default' : course.level === 'intermediate' ? 'secondary' : 'destructive'}
                                    className="text-xs"
                                >
                                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-muted-foreground/30">
                                    {course.format}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between space-y-6 px-6 pb-6">
                        {/* Course Info */}
                        <div className="space-y-4">
                            <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
                                {course.shortDescription}
                            </p>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 p-2 rounded-lg transition-colors">
                                    <div className="bg-theme-light/20 p-1.5 rounded-lg">
                                        <GraduationCap className="h-4 w-4 text-theme-primary flex-shrink-0" />
                                    </div>
                                    <span className="truncate font-medium">{course.instructor}</span>
                                </div>

                                <div className="flex items-center gap-3 p-2 rounded-lg transition-colors">
                                    <div className="bg-theme-light/20 p-1.5 rounded-lg">
                                        <Award className="h-4 w-4 text-theme-primary flex-shrink-0" />
                                    </div>
                                    <span className="truncate">{course.institution.name}</span>
                                </div>

                                <div className="flex items-center gap-3 p-2 rounded-lg  transition-colors">
                                    <div className="bg-theme-light/20 p-1.5 rounded-lg">
                                        <MapPin className="h-4 w-4 text-theme-primary flex-shrink-0" />
                                    </div>
                                    <span className="truncate">{course.institution.location}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 p-2 rounded-lg transition-colors">
                                        <Clock className="h-4 w-4 text-theme-primary flex-shrink-0" />
                                        <span className="text-xs">{course.duration}</span>
                                    </div>

                                    <div className="flex items-center gap-2 p-2 rounded-lg transition-colors">
                                        <Calendar className="h-4 w-4 text-theme-primary flex-shrink-0" />
                                        <span className="text-xs">Starts {formatDate(course.startDate)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating and Enrollment */}
                            <div className="flex items-center justify-between p-3 bg-[#2194D1]/10 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-sm">{course.averageRating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span className="text-sm font-medium">{course.totalEnrollments} enrolled</span>
                                </div>
                            </div>
                        </div>

                        {/* Price and CTA */}
                        <div className="space-y-4 pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-theme-primary" />
                                    <span className="font-bold text-xl text-foreground">
                                        {formatPrice(course.price, course.currency)}
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground bg-[#2194D1]/50 px-3 py-1 rounded-full">
                                    {course.availableSeats} seats left
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link to={`/enrollment?courseId=${course.id}`} className="w-full">
                                    <Button
                                        className="w-full bg-[#2194D1] hover:from-theme-primary/90 hover:to-theme-base/90 shadow-lg hover:shadow-elegant transition-all duration-300"
                                        disabled={course.availableSeats === 0}
                                    >
                                        {course.availableSeats === 0 ? 'Full' : 'Enroll Now'}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CourseGrid;