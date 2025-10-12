import React, { useState, useEffect, useCallback } from 'react';
import { Star, Search, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { reviewsAPI } from '../../services/api';
import ConfirmationModal from '../ui/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { Link } from 'gatsby';
import '../../styles/ReviewsManagement-rtl.css';

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

  return (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'rtl reviews-management-rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 xs:gap-4">
        <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'} w-full sm:w-auto`}>
          <h2 className="text-lg xs:text-xl md:text-2xl font-bold text-foreground">{t('title')}</h2>
          <p className="text-muted-foreground text-xs xs:text-sm md:text-base mt-1">{t('description')}</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-3 xs:p-4 sm:p-6">
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${currentLanguage === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute ${currentLanguage === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${currentLanguage === 'ar' ? 'pr-[30px] text-right' : 'pl-[30px]'} h-10`}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={`w-full sm:w-40 h-10 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
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
              <SelectTrigger className={`w-full sm:w-40 h-10 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
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
        </CardContent>
      </Card>

      <Card className="border-0 shadow-modern">
        <CardHeader className="p-3 xs:p-4 sm:p-6">
          <CardTitle className={`flex items-center gap-2 text-base xs:text-lg md:text-xl ${currentLanguage === 'ar' ? '' : ''}`}>
            <MessageSquare className="h-4 w-4 xs:h-5 xs:w-5 text-theme-base" />
            {t('table.count', { count: totalReviews })}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 xs:p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-base mx-auto"></div>
              <p className="text-muted-foreground mt-2">{t('loading.reviews')}</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-3 xs:space-y-4">
              {reviews.map((review) => {
                // Dynamic content rendering based on language
                const bookTitle = currentLanguage === 'ar' && review.book.titleAr ? review.book.titleAr : review.book.title;
                const authorName = currentLanguage === 'ar' && review.book.author.nameAr ? review.book.author.nameAr : review.book.author.name;
                
                return (
                <div key={review._id} className="p-3 xs:p-4 sm:p-5 border border-border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`flex flex-col sm:flex-row items-start justify-between gap-3 mb-3 ${currentLanguage === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
                    <div className={`flex-1 w-full ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      <div className={`flex flex-wrap items-center gap-2 mb-2 ${currentLanguage === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        <h3 className="font-semibold text-sm xs:text-base text-foreground line-clamp-1">{review.title}</h3>
                        {getStatusBadge(review.status)}
                        {review.verifiedPurchase && (
                          <Badge 
                            variant="outline" 
                            className="text-xs xs:text-sm font-medium px-2 xs:px-2.5 py-1 xs:py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 hover:text-blue-800 hover:border-blue-300 transition-all duration-200"
                          >
                            {t('table.verifiedPurchase')}
                          </Badge>
                        )}
                        {!review.user && review.guestInfo && (
                          <Badge 
                            variant="outline" 
                            className="text-xs xs:text-sm font-medium px-2 xs:px-2.5 py-1 xs:py-1.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200 hover:text-orange-800 hover:border-orange-300 transition-all duration-200"
                          >
                            {t('table.guestReview')}
                          </Badge>
                        )}
                      </div>
                      <div className={`flex flex-wrap items-center gap-1 xs:gap-2 mb-2 text-xs xs:text-sm ${currentLanguage === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-center gap-1 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-muted-foreground">{t('table.by')} {review.user ? review.user.name : review.guestInfo.name}</span>
                        <span className="text-muted-foreground hidden xs:inline">•</span>
                        <span className="text-muted-foreground">{formatDate(review.createdAt)}</span>
                      </div>
                      <p className="text-xs xs:text-sm text-muted-foreground mb-2">
                        {t('table.reviewFor')} <Link to={`/book/${review.book.slug || review.book._id}`} className="font-medium text-theme-base hover:underline transition-colors">{bookTitle}</Link> {t('table.by')} {authorName}
                      </p>
                      {review.status === 'pending' && (
                        <p className="text-xs xs:text-sm text-foreground mb-2 line-clamp-2 xs:line-clamp-3" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>{review.content}</p>
                      )}
                    </div>
                  </div>

                  

                  {review.moderatorNotes && (
                    <div className="mt-3 p-2 xs:p-3 bg-slate-50 border border-slate-200 rounded-md">
                      <p className={`text-xs xs:text-sm text-slate-700 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                        <strong className="text-slate-800">{t('moderatorNotes')}</strong> {review.moderatorNotes}
                      </p>
                    </div>
                  )}
                </div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={`flex flex-col xs:flex-row justify-center items-center gap-2 xs:gap-3 mt-4 xs:mt-6 ${currentLanguage === 'ar' ? 'xs:flex-row-reverse' : ''}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-8 xs:h-9 px-3 xs:px-4 text-xs xs:text-sm transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('pagination.previous')}
                  </Button>
                  <span className="text-xs xs:text-sm text-muted-foreground px-2 py-1 bg-gray-50 rounded-md border">
                    {t('pagination.page', { current: currentPage, total: totalPages })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 xs:h-9 px-3 xs:px-4 text-xs xs:text-sm transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('pagination.next')}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 xs:py-8">
              <MessageSquare className="h-10 w-10 xs:h-12 xs:w-12 mx-auto mb-3 xs:mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm xs:text-base text-muted-foreground">{t('empty.noReviews')}</p>
            </div>
          )}
        </CardContent>
      </Card>

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
          <div className={`space-y-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>{t('moderationModal.review')}</strong> {reviewToModerate?.title}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>{t('moderationModal.author')}</strong> {reviewToModerate?.user ? reviewToModerate.user.name : reviewToModerate?.guestInfo?.name}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>{t('moderationModal.bookTitle')}</strong> {
                  currentLanguage === 'ar' && reviewToModerate?.book.titleAr 
                    ? reviewToModerate.book.titleAr 
                    : reviewToModerate?.book.title
                }
              </p>
              <p className="text-sm text-foreground" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>{reviewToModerate?.content}</p>
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('moderationModal.decision')}</label>
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
              <label className={`text-sm font-medium ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('moderationModal.notes')}</label>
              <textarea
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder={t('moderationModal.notesPlaceholder')}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-base"
                rows={3}
                dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
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
    </div>
  );
}

