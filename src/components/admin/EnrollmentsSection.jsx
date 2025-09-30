import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { Users, Calendar, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useCourses } from '../../context/CourseContext';
import { useToast } from '../../hooks/use-toast';

export const EnrollmentsSection = () => {
  const { t } = useTranslation('EnrollmentsManagement');
  const { language: currentLanguage } = useI18next();
  const { enrollments, courses, updateEnrollmentStatus, deleteEnrollment } = useCourses();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEnrollments = enrollments.filter(enrollment => {
    const course = courses.find(c => c.id === enrollment.courseId);
    const matchesSearch = enrollment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course?.title.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (enrollmentId, newStatus) => {
    updateEnrollmentStatus(enrollmentId, newStatus);
    toast({
      title: t('toast.statusUpdated'),
      description: t('toast.statusChanged', { status: t(`status.${newStatus}`) }),
    });
  };

  const handleDelete = (enrollmentId) => {
    if (window.confirm(t('actions.confirmDelete'))) {
      deleteEnrollment(enrollmentId);
      toast({
        title: t('toast.enrollmentDeleted'),
        description: t('toast.enrollmentRemoved'),
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${currentLanguage === 'ar' ? 'sm:' : ''}`}>
        <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('title')}</h2>
          <p className="text-sm md:text-base text-muted-foreground">{t('description')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{t('stats.totalEnrollments')}</p>
                <p className="text-xl md:text-2xl font-bold  bg-clip-text">
                  {enrollments.length}
                </p>
              </div>
              <Users className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{t('stats.pending')}</p>
                <p className="text-xl md:text-2xl font-bold text-orange-500">
                  {enrollments.filter(e => e.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-orange-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{t('stats.approved')}</p>
                <p className="text-xl md:text-2xl font-bold text-green-500">
                  {enrollments.filter(e => e.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{t('stats.rejected')}</p>
                <p className="text-xl md:text-2xl font-bold text-red-500">
                  {enrollments.filter(e => e.status === 'rejected').length}
                </p>
              </div>
              <XCircle className="h-6 w-6 md:h-8 md:w-8 text-red-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-4 md:p-6">
          <div className={`flex flex-col sm:flex-row gap-3 md:gap-4 ${currentLanguage === 'ar' ? 'sm:' : ''}`}>
            <div className="flex-1">
              <div className="relative">
                <Search className={`h-4 w-4 absolute top-3 text-muted-foreground ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={t('filters.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={currentLanguage === 'ar' ? 'pr-[30px] text-right' : 'pl-[30px]'}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44 md:w-48">
                <SelectValue placeholder={t('filters.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.status.all')}</SelectItem>
                <SelectItem value="pending">{t('filters.status.pending')}</SelectItem>
                <SelectItem value="approved">{t('filters.status.approved')}</SelectItem>
                <SelectItem value="rejected">{t('filters.status.rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enrollments List/Table */}
      <Card className="border-0 shadow-modern">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className={`text-lg md:text-xl ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('table.enrollmentsCount', { count: filteredEnrollments.length })}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <Users className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm md:text-base text-muted-foreground">{t('table.noEnrollments')}</p>
            </div>
          ) : (
            <div>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredEnrollments.map(enrollment => {
                  const course = courses.find(c => c.id === enrollment.courseId);
                  const courseTitle = currentLanguage === 'ar' && course?.titleAr ? course.titleAr : course?.title;
                  return (
                    <Card key={enrollment.id} className="border border-border/50">
                      <CardContent className={`p-4 ${currentLanguage === 'ar' ? 'text-right' : ''}`}>
                          <div className="space-y-3">
                            <div className={`flex justify-between items-start ${currentLanguage === 'ar' ? '' : ''}`}>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{enrollment.studentName}</h4>
                                <p className="text-xs text-muted-foreground">{enrollment.studentEmail}</p>
                                <p className="text-xs text-muted-foreground mt-1">{courseTitle}</p>
                              </div>
                            <Badge variant={enrollment.status === 'approved' ? 'default' : enrollment.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs">
                              {t(`status.${enrollment.status}`)}
                            </Badge>
                          </div>
                          <div className={`flex justify-between items-center ${currentLanguage === 'ar' ? '' : ''}`}>
                            <span className={`text-xs text-muted-foreground ${currentLanguage === 'ar' ? '' : ''}`}>
                              <Calendar className={`h-3 w-3 inline ${currentLanguage === 'ar' ? 'ml-1' : 'mr-1'}`} />
                              {enrollment.enrollmentDate}
                            </span>
                            <div className={`flex gap-1 ${currentLanguage === 'ar' ? '' : ''}`}>
                              <Select value={enrollment.status} onValueChange={value => handleStatusChange(enrollment.id, value)}>
                                <SelectTrigger className="h-7 w-20 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">{t('status.pending')}</SelectItem>
                                  <SelectItem value="approved">{t('status.approved')}</SelectItem>
                                  <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                                onClick={() => handleDelete(enrollment.id)}
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.student')}</TableHead>
                      <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.course')}</TableHead>
                      <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.enrollmentDate')}</TableHead>
                      <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.status')}</TableHead>
                      <TableHead className={currentLanguage === 'ar' ? 'text-left' : 'text-right'}>{t('table.headers.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnrollments.map(enrollment => {
                      const course = courses.find(c => c.id === enrollment.courseId);
                      const courseTitle = currentLanguage === 'ar' && course?.titleAr ? course.titleAr : course?.title;
                      return (
                        <TableRow key={enrollment.id}>
                          <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                            <div>
                              <p className="font-medium">{enrollment.studentName}</p>
                              <p className="text-sm text-muted-foreground">{enrollment.studentEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                            <div>
                              <p className="font-medium">{courseTitle}</p>
                              <p className="text-sm text-muted-foreground">{course?.instructor}</p>
                            </div>
                          </TableCell>
                          <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                            <div className={`flex items-center ${currentLanguage === 'ar' ? '' : ''}`}>
                              <Calendar className={`h-4 w-4 text-muted-foreground ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
                              {enrollment.enrollmentDate}
                            </div>
                          </TableCell>
                          <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                            <Badge variant={enrollment.status === 'approved' ? 'default' : enrollment.status === 'pending' ? 'secondary' : 'destructive'}>
                              {t(`status.${enrollment.status}`)}
                            </Badge>
                          </TableCell>
                          <TableCell className={currentLanguage === 'ar' ? 'text-left' : 'text-right'}>
                            <div className={`flex gap-2 ${currentLanguage === 'ar' ? 'justify-start ' : 'justify-end'}`}>
                              <Select value={enrollment.status} onValueChange={(value) => handleStatusChange(enrollment.id, value)}>
                                <SelectTrigger className="w-28">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">{t('status.pending')}</SelectItem>
                                  <SelectItem value="approved">{t('status.approved')}</SelectItem>
                                  <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDelete(enrollment.id)}
                                title={t('actions.delete')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;