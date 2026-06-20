import React, { useState } from 'react';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { Users, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useCourses } from '../../context/CourseContext';
import { useToast } from '../../hooks/use-toast';
import ConfirmationModal from '../ui/ConfirmationModal';
import { DataTable } from '../ui/DataTable';
import { SectionShell, SearchInput } from '../ui/SectionShell';

export const EnrollmentsSection = () => {
  const { t } = useTranslation('EnrollmentsManagement');
  const { language: currentLanguage } = useI18next();
  const { enrollments, courses, updateEnrollmentStatus, deleteEnrollment } = useCourses();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const confirmDelete = async () => {
    if (!enrollmentToDelete) return;
    setIsDeleting(true);
    try {
      deleteEnrollment(enrollmentToDelete);
      toast({
        title: t('toast.enrollmentDeleted'),
        description: t('toast.enrollmentRemoved'),
      });
      setShowDeleteModal(false);
      setEnrollmentToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const isRTL = currentLanguage === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const columns = [
    {
      key: 'student',
      label: t('table.headers.student'),
      align: 'start',
      render: (enrollment) => (
        <div>
          <p className="font-medium">{enrollment.studentName}</p>
          <p className="text-sm text-muted-foreground">{enrollment.studentEmail}</p>
        </div>
      )
    },
    {
      key: 'course',
      label: t('table.headers.course'),
      align: 'start',
      render: (enrollment) => {
        const course = courses.find(c => c.id === enrollment.courseId);
        const courseTitle = isRTL && course?.titleAr ? course.titleAr : course?.title;
        return (
          <div>
            <p className="font-medium">{courseTitle}</p>
            <p className="text-sm text-muted-foreground">{course?.instructor}</p>
          </div>
        );
      }
    },
    {
      key: 'enrollmentDate',
      label: t('table.headers.enrollmentDate'),
      align: 'start',
      render: (enrollment) => (
        <div className="flex items-center">
          <Calendar className={`h-4 w-4 text-muted-foreground ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {enrollment.enrollmentDate}
        </div>
      )
    },
    {
      key: 'status',
      label: t('table.headers.status'),
      align: 'start',
      render: (enrollment) => (
        <Badge variant={enrollment.status === 'approved' ? 'default' : enrollment.status === 'pending' ? 'secondary' : 'destructive'}>
          {t(`status.${enrollment.status}`)}
        </Badge>
      )
    },
    {
      key: '_actions',
      label: t('table.headers.actions'),
      align: 'end',
      render: (enrollment) => (
        <div className={`flex gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
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
            variant="ghost"
            size="sm"
            onClick={() => {
              setEnrollmentToDelete(enrollment.id);
              setShowDeleteModal(true);
            }}
            title={t('actions.delete')}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <SectionShell
      title={t('title')}
      subtitle={t('description')}
      dir={dir}
      filters={
        <div className={`flex flex-col sm:flex-row gap-3 md:gap-4`}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('filters.searchPlaceholder')}
            dir={dir}
          />
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
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${isRTL ? '' : 'flex-row'}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{t('stats.totalEnrollments')}</p>
                <p className="text-xl md:text-2xl font-bold bg-clip-text">
                  {enrollments.length}
                </p>
              </div>
              <Users className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className={`flex items-center justify-between ${isRTL ? '' : 'flex-row'}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
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
            <div className={`flex items-center justify-between ${isRTL ? '' : 'flex-row'}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
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
            <div className={`flex items-center justify-between ${isRTL ? '' : 'flex-row'}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
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

      <DataTable
        columns={columns}
        data={filteredEnrollments}
        loading={false}
        emptyTitle={t('table.noEnrollments')}
        emptyIcon={<Users className="h-12 w-12 text-muted-foreground opacity-50" />}
        countLabel={t('table.enrollmentsCount', { count: filteredEnrollments.length })}
        dir={dir}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setEnrollmentToDelete(null);
        }}
        onConfirm={confirmDelete}
        title={t('actions.confirmDelete')}
        confirmText={t('actions.delete')}
        variant="danger"
        isLoading={isDeleting}
      />
    </SectionShell>
  );
};
