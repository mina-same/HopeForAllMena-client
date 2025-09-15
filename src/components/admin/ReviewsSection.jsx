import React, { useState, useEffect } from 'react';
import { Star, Search, CheckCircle, XCircle, Clock, ThumbsUp, ThumbsDown, MessageSquare, Check, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { reviewsAPI } from '../../services/api';
import ConfirmationModal from '../ui/ConfirmationModal';

export function ReviewsSection() {
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
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter,
        rating: ratingFilter === 'all' ? '' : ratingFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
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
        title: "Error",
        description: "Failed to fetch reviews. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, searchTerm, statusFilter, ratingFilter]);

  const handleModerate = (review) => {
    setReviewToModerate(review);
    setModerationStatus('');
    setModerationNotes('');
    setShowModerateModal(true);
  };

  const handleQuickApprove = async (review) => {
    try {
      await reviewsAPI.moderateReview(review._id, { status: 'approved', notes: '' });
      toast({
        title: "Review Approved",
        description: "Review has been approved successfully.",
      });
      fetchReviews();
    } catch (error) {
      console.error('Failed to approve review:', error);
      toast({
        title: "Error",
        description: "Failed to approve review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleQuickReject = async (review) => {
    try {
      await reviewsAPI.moderateReview(review._id, { status: 'rejected', notes: 'Rejected by admin' });
      toast({
        title: "Review Rejected",
        description: "Review has been rejected successfully.",
      });
      fetchReviews();
    } catch (error) {
      console.error('Failed to reject review:', error);
      toast({
        title: "Error",
        description: "Failed to reject review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const confirmModeration = async () => {
    if (!reviewToModerate || !moderationStatus) return;

    setIsModerating(true);
    try {
      await reviewsAPI.moderateReview(reviewToModerate._id, moderationStatus, moderationNotes);
      toast({
        title: "Review Moderated",
        description: `Review has been ${moderationStatus} successfully.`,
      });
      fetchReviews();
      setShowModerateModal(false);
      setReviewToModerate(null);
    } catch (error) {
      console.error('Failed to moderate review:', error);
      toast({
        title: "Error",
        description: "Failed to moderate review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsModerating(false);
    }
  };

  const handleMarkHelpful = async (review) => {
    try {
      await reviewsAPI.markHelpful(review._id);
      toast({
        title: "Review Updated",
        description: "Review marked as helpful.",
      });
      fetchReviews();
    } catch (error) {
      console.error('Failed to mark helpful:', error);
      toast({
        title: "Error",
        description: "Failed to update review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMarkNotHelpful = async (review) => {
    try {
      await reviewsAPI.markNotHelpful(review._id);
      toast({
        title: "Review Updated",
        description: "Review marked as not helpful.",
      });
      fetchReviews();
    } catch (error) {
      console.error('Failed to mark not helpful:', error);
      toast({
        title: "Error",
        description: "Failed to update review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:text-white hover:bg-green-400"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Reviews Management</h2>
          <p className="text-muted-foreground text-sm md:text-base">Manage book reviews and moderate content</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-[30px]"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-theme-base" />
            Reviews ({totalReviews})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-base mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="p-4 border border-border rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{review.title}</h3>
                        {getStatusBadge(review.status)}
                        {review.verifiedPurchase && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Verified Purchase
                          </Badge>
                        )}
                        {!review.user && review.guestInfo && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">
                            Guest Review
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">by {review.user ? review.user.name : review.guestInfo.name}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Review for: <span className="font-medium">{review.book.title}</span> by {review.book.author.name}
                      </p>
                      {review.status === 'pending' && (
                        <p className="text-sm text-foreground mb-2">{review.content}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkHelpful(review)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {review.helpful}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkNotHelpful(review)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          {review.notHelpful}
                        </Button>
                      </div>
                      {review.helpful + review.notHelpful > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {Math.round((review.helpful / (review.helpful + review.notHelpful)) * 100)}% helpful
                        </span>
                      )}
                    </div>

                    {review.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickApprove(review)}
                          className="bg-green-200 text-green-700 hover:bg-green-400 p-2"
                          title="Approve Review"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReject(review)}
                          className="bg-red-50 text-red-700 hover:bg-red-100 p-2"
                          title="Reject Review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {review.moderatorNotes && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <strong>Moderator Notes:</strong> {review.moderatorNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No reviews found.</p>
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
        title="Moderate Review"
        description={
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Review:</strong> {reviewToModerate?.title}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>By:</strong> {reviewToModerate?.user ? reviewToModerate.user.name : reviewToModerate?.guestInfo?.name}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>For:</strong> {reviewToModerate?.book.title}
              </p>
              <p className="text-sm text-foreground">{reviewToModerate?.content}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Moderation Decision</label>
              <Select value={moderationStatus} onValueChange={setModerationStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approve</SelectItem>
                  <SelectItem value="rejected">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <textarea
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder="Add notes about the moderation decision..."
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-base"
                rows={3}
              />
            </div>
          </div>
        }
        confirmText="Moderate Review"
        cancelText="Cancel"
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
