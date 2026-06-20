import React, { useState, useEffect, useCallback } from 'react';
import { Star, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { reviewsAPI } from '../../services/api';
import ConfirmationModal from '../ui/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { Link } from 'gatsby';
import '../../styles/ReviewsManagement-rtl.css';
import { DataTable } from '../ui/DataTable';
import { SectionShell, SearchInput } from '../ui/SectionShell';

export function ReviewsSection() {
  const { t } = useTranslation('ReviewsManagement');
  const { language: currentLanguage } = useI18next();
  const { toast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  // Moderation modal state
  const [showModerateModal, setShowModerateModal] = useState(false);
  const [reviewToModerate, setReviewToModerate] = useState(null);
  const [moderationStatus, setModerationStatus] = useState('');
  const [moderationNotes, setModerationNotes] = useState('');
  const [isModerating, setIsModerating] = useState(false);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter,
        rating: ratingFilter === 'all' ? '' : ratingFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        language: currentLanguage
      };

      const response = await reviewsAPI.getReviews(params);
      if (response.status === 'success') {
        setReviews(response.data.reviews);
        setTotalPages(response.data.pagination.totalPages);
        setTotalReviews(response.data.pagination.totalReviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast({
        title: t('toast.error'),
        description: t('toast.fetchError'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, ratingFilter, currentLanguage, toast, t]);

  useEffect(() => {
    fetchReviews();
  }, [currentPage, searchTerm, statusFilter, ratingFilter, currentLanguage, fetchReviews]);

  const confirmModeration = async () => {
    if (!reviewToModerate || !moderationStatus) return;

    setIsModerating(true);
    try {
      await reviewsAPI.moderateReview(reviewToModerate._id, moderationStatus, moderationNotes);
      toast({
        title: t('toast.reviewModerated'),
        description: t('toast.reviewModeratedDesc', { status: t(`status.${moderationStatus}`) }),
      });
      fetchReviews();
      setShowModerateModal(false);
      setReviewToModerate(null);
    } catch (error) {
      console.error('Failed to moderate review:', error);
      toast({
        title: t('toast.error'),
        description: t('toast.moderateError'),
        variant: "destructive"
      });
    } finally {
      setIsModerating(false);
    }
  };

  const formatDate = (dateString) => {
    const locale = currentLanguage === 'ar' ? 'ar-EG' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  };

  const getStatusBadge = (status) => {
    const iconClass = currentLanguage === 'ar' ? 'h-3 w-3 xs:h-3.5 xs:w-3.5 mr-1' : 'h-3 w-3 xs:h-3.5 xs:w-3.5 ml-1';
    const baseClasses = `text-xs xs:text-sm font-medium px-2 xs:px-2.5 py-1 xs:py-1.5 rounded-full transition-all duration-200 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`;

    switch (status) {
      case 'approved':
        return (
          <Badge
            variant="default"
            className={`${baseClasses} bg-emerald-400 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-emerald-800 hover:border-emerald-300`}
          >
            <CheckCircle className={iconClass} />
            {t('status.approved')}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge
            variant="destructive"
            className={`${baseClasses} bg-red-400 text-red-700 border border-red-200 hover:bg-red-600 hover:text-red-800 hover:border-red-300`}
          >
            <XCircle className={iconClass} />
            {t('status.rejected')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge
            variant="secondary"
            className={`${baseClasses} bg-amber-400 text-amber-700 border border-amber-200 hover:bg-amber-600 hover:text-amber-800 hover:border-amber-300`}
          >
            <Clock className={iconClass} />
            {t('status.pending')}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className={`${baseClasses} bg-gray-400 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:text-gray-500 hover:border-gray-300`}
          >
            {t(`status.${status}`)}
          </Badge>
        );
    }
  };

  const isRTL = currentLanguage === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const columns = [
    {
      key: 'reviewer',
      label: t('table.headers.reviewer') || 'Reviewer / Book',
      align: 'start',
      render: (review) => {
        const bookTitle = isRTL && review.book.titleAr ? review.book.titleAr : review.book.title;
        const authorName = isRTL && review.book.author.nameAr ? review.book.author.nameAr : review.book.author.name;
        return (
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="font-semibold text-foreground line-clamp-1">{review.title}</p>
            <p className="text-sm text-muted-foreground">
              {t('table.by')} {review.user ? review.user.name : review.guestInfo?.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('table.reviewFor')}{' '}
              <Link to={`/book/${review.book.slug || review.book._id}`} className="font-medium text-theme-base hover:underline transition-colors">
                {bookTitle}
              </Link>{' '}
              {t('table.by')} {authorName}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {getStatusBadge(review.status)}
              {review.verifiedPurchase && (
                <Badge
                  variant="outline"
                  className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200"
                >
                  {t('table.verifiedPurchase')}
                </Badge>
              )}
              {!review.user && review.guestInfo && (
                <Badge
                  variant="outline"
                  className="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200"
                >
                  {t('table.guestReview')}
                </Badge>
              )}
            </div>
          </div>
        );
      }
    },
    {
      key: 'rating',
      label: t('table.headers.rating') || 'Rating',
      align: 'start',
      render: (review) => (
        <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {renderStars(review.rating)}
        </div>
      )
    },
    {
      key: 'date',
      label: t('table.headers.date') || 'Date',
      align: 'start',
      render: (review) => (
        <span className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</span>
      )
    },
    {
      key: 'moderatorNotes',
      label: t('moderatorNotes') || 'Notes',
      align: 'start',
      render: (review) => review.moderatorNotes ? (
        <p className="text-sm text-muted-foreground line-clamp-2" dir={dir}>{review.moderatorNotes}</p>
      ) : null
    },
    {
      key: '_actions',
      label: t('table.headers.actions') || 'Actions',
      align: 'end',
      render: (review) => (
        <div className="flex items-center gap-2 justify-end">
          {review.status === 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReviewToModerate(review);
                setModerationStatus('');
                setModerationNotes('');
                setShowModerateModal(true);
              }}
              className="hover:bg-muted rounded-md"
              title={t('actions.moderate') || 'Moderate'}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}
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
        <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('searchPlaceholder')}
            dir={dir}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className={`w-full sm:w-40 h-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <SelectValue placeholder={t('filters.status.all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.status.all')}</SelectItem>
              <SelectItem value="pending">{t('filters.status.pending')}</SelectItem>
              <SelectItem value="approved">{t('filters.status.approved')}</SelectItem>
              <SelectItem value="rejected">{t('filters.status.rejected')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className={`w-full sm:w-40 h-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <SelectValue placeholder={t('filters.rating.all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.rating.all')}</SelectItem>
              <SelectItem value="5">{t('filters.rating.5')}</SelectItem>
              <SelectItem value="4">{t('filters.rating.4')}</SelectItem>
              <SelectItem value="3">{t('filters.rating.3')}</SelectItem>
              <SelectItem value="2">{t('filters.rating.2')}</SelectItem>
              <SelectItem value="1">{t('filters.rating.1')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      <DataTable
        columns={columns}
        data={reviews}
        loading={loading}
        emptyTitle={t('empty.noReviews')}
        emptyIcon={<MessageSquare className="h-12 w-12 text-muted-foreground opacity-50" />}
        countLabel={t('table.count', { count: totalReviews })}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        dir={dir}
      />

      {/* Moderation Modal */}
      <ConfirmationModal
        isOpen={showModerateModal}
        onClose={() => {
          setShowModerateModal(false);
          setReviewToModerate(null);
        }}
        onConfirm={confirmModeration}
        title={t('moderationModal.title')}
        description={
          <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`} dir={dir}>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>{t('moderationModal.review')}</strong> {reviewToModerate?.title}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>{t('moderationModal.author')}</strong> {reviewToModerate?.user ? reviewToModerate.user.name : reviewToModerate?.guestInfo?.name}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>{t('moderationModal.bookTitle')}</strong> {
                  isRTL && reviewToModerate?.book.titleAr
                    ? reviewToModerate.book.titleAr
                    : reviewToModerate?.book.title
                }
              </p>
              <p className="text-sm text-foreground" dir={dir}>{reviewToModerate?.content}</p>
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('moderationModal.decision')}</label>
              <Select value={moderationStatus} onValueChange={setModerationStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t('moderationModal.selectDecision')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">{t('moderationModal.approve')}</SelectItem>
                  <SelectItem value="rejected">{t('moderationModal.reject')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('moderationModal.notes')}</label>
              <textarea
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder={t('moderationModal.notesPlaceholder')}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-base"
                rows={3}
                dir={dir}
              />
            </div>
          </div>
        }
        confirmText={t('moderationModal.confirmText')}
        cancelText={t('moderationModal.cancelText')}
        variant="info"
        isLoading={isModerating}
        icon={
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 border-blue-200 border-2">
            <MessageSquare className="h-6 w-6 text-blue-500" />
          </div>
        }
      />
    </SectionShell>
  );
}
