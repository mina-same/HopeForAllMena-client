import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
    Calendar,
    Clock,
    GraduationCap,
    MapPin,
    Star,
    Users,
    BookOpen,
    Award
} from 'lucide-react';
import { useTranslation, useI18next, Link } from 'gatsby-plugin-react-i18next';

const CourseGrid = ({ courses }) => {
    const { t } = useTranslation('Courses');
    const { language: currentLanguage } = useI18next();
    const isRTL = currentLanguage === 'ar';

    const formatPrice = (price, currency) => {
        return price === 0 ? t('courseCard.price.free') : `${price.toLocaleString()} ${currency}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getLevelLabel = (level) => {
        const levelMap = {
            'beginner': t('courseCard.levels.beginner'),
            'intermediate': t('courseCard.levels.intermediate'),
            'advanced': t('courseCard.levels.advanced')
        };
        return levelMap[level] || level.charAt(0).toUpperCase() + level.slice(1);
    };

    if (courses.length === 0) {
        return (
            <div className={`text-center py-16 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className={`text-xl font-semibold text-foreground mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                    {t('empty.title')}
                </h3>
                <p className="text-muted-foreground">
                    {t('empty.description')}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8" dir={isRTL ? 'rtl' : 'ltr'}>
            {courses.map((course, index) => (
                <Card
                    key={course.id}
                    className="group hover:shadow-elegant transition-all duration-500 h-full flex flex-col border-0 bg-foreground hover:from-card hover:to-muted/50 backdrop-blur-sm overflow-hidden hover-scale"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <CardHeader className="pb-4 relative">
                        {/* Course Image/Icon with Enhanced Design */}
                        <div className="aspect-video bg-[#050517] rounded-xl mb-4 flex items-center justify-center group-hover:from-theme-primary/30 group-hover:via-theme-base/30 group-hover:to-theme-secondary/30 transition-all duration-500 relative overflow-hidden">
                            {course.imageUrl ? (
                                <img
                                    src={course.imageUrl}
                                    alt={course.title}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                <>
                                    <div className="bg-white backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                                        <BookOpen className="h-10 w-10 text-theme-primary group-hover:text-theme-base transition-colors duration-300" />
                                    </div>
                                    {/* Decorative Corner */}
                                    <div className={`absolute top-3 w-2 h-2 bg-theme-primary rounded-full opacity-60 ${isRTL ? 'left-3' : 'right-3'}`}></div>
                                </>
                            )}
                        </div>

                        {/* Title and Badges */}
                        <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
                            <h3 className={`font-bold text-xl leading-tight group-hover:text-theme-primary transition-colors duration-300 line-clamp-2 ${isRTL ? 'font-arabic' : ''}`}>
                                {isRTL ? (course.titleAr || course.title) : (course.titleEn || course.title)}
                            </h3>

                            <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row' : ''}`}>
                                <Badge variant="secondary" className="text-xs bg-theme-light/20 text-theme-primary border-theme-primary/20 hover:bg-theme-light/30">
                                    {isRTL ? (course.categoryAr || course.category) : (course.categoryEn || course.category)}
                                </Badge>
                                <Badge
                                    variant={course.level === 'beginner' ? 'default' : course.level === 'intermediate' ? 'secondary' : 'destructive'}
                                    className="text-xs"
                                >
                                    {getLevelLabel(course.level)}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-muted-foreground/30">
                                    {isRTL && course.formatAr ? course.formatAr : course.format}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between space-y-6 px-6 pb-6">
                        {/* Course Info */}
                        <div className="space-y-4">
                            <p className={`text-sm text-foreground line-clamp-3 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                                {isRTL ? (course.shortDescriptionAr || course.shortDescription) : (course.shortDescriptionEn || course.shortDescription)}
                            </p>

                            <div className="space-y-3 text-sm">
                                <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isRTL ? 'flex-row' : ''}`}>
                                    <div className="bg-theme-light/20 p-1.5 rounded-lg">
                                        <GraduationCap className="h-4 w-4 text-theme-primary flex-shrink-0" />
                                    </div>
                                    <span className={`truncate font-medium ${isRTL ? 'text-right' : ''}`}>
                                        {isRTL ? (course.instructorAr || course.instructor) : (course.instructorEn || course.instructor)}
                                    </span>
                                </div>

                                <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isRTL ? 'flex-row' : ''}`}>
                                    <div className="bg-theme-light/20 p-1.5 rounded-lg">
                                        <Award className="h-4 w-4 text-theme-primary flex-shrink-0" />
                                    </div>
                                    <span className={`truncate ${isRTL ? 'text-right' : ''}`}>
                                        {isRTL ? (course.institution.nameAr || course.institution.name) : (course.institution.nameEn || course.institution.name)}
                                    </span>
                                </div>

                                <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isRTL ? 'flex-row' : ''}`}>
                                    <div className="bg-theme-light/20 p-1.5 rounded-lg">
                                        <MapPin className="h-4 w-4 text-theme-primary flex-shrink-0" />
                                    </div>
                                    <span className={`truncate ${isRTL ? 'text-right' : ''}`}>
                                        {isRTL && course.institution.locationAr ? course.institution.locationAr : course.institution.location}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${isRTL ? 'flex-row' : ''}`}>
                                        <Clock className="h-4 w-4 text-theme-primary flex-shrink-0" />
                                        <span className="text-xs">{isRTL ? (course.durationAr || course.duration) : (course.durationEn || course.duration)}</span>
                                    </div>

                                    <div className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${isRTL ? 'flex-row' : ''}`}>
                                        <Calendar className="h-4 w-4 text-theme-primary flex-shrink-0" />
                                        <span className="text-xs">{t('courseCard.starts')} {formatDate(course.startDate)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating and Enrollment */}
                            <div className={`flex items-center justify-between p-3 bg-[#2194D1]/10 rounded-xl ${isRTL ? 'flex-row' : ''}`}>
                                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row' : ''}`}>
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-sm" dir="ltr">{course.averageRating.toFixed(1)}</span>
                                </div>
                                <div className={`flex items-center gap-2 text-muted-foreground ${isRTL ? 'flex-row' : ''}`}>
                                    <Users className="h-4 w-4" />
                                    <span className="text-sm font-medium" dir="ltr">{course.totalEnrollments}</span>
                                    <span className="text-sm font-medium">{t('courseCard.enrolled')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Price and CTA */}
                        <div className="space-y-4 pt-4 border-t border-border/50">
                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : ''}`}>
                                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row' : ''}`}>
                                    <span className="font-bold text-xl text-foreground">
                                        {formatPrice(course.price, course.currency)}
                                    </span>
                                </div>
                                <div className={`text-sm text-muted-foreground bg-[#2194D1]/50 px-3 py-1 rounded-full ${isRTL ? 'text-right' : ''}`}>
                                    <span dir="ltr">{course.availableSeats}</span> {t('courseCard.seatsLeft')}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link to={`/enrollment?courseId=${course.id}`} className="w-full">
                                    <Button
                                        className="w-full bg-[#2194D1] hover:from-theme-primary/90 hover:to-theme-base/90 shadow-lg hover:shadow-elegant transition-all duration-300"
                                        disabled={course.availableSeats === 0}
                                    >
                                        {course.availableSeats === 0 ? t('courseCard.status.full') : t('courseCard.status.enrollNow')}
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
