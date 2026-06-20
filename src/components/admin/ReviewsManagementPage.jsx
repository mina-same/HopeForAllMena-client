import React, { useState } from 'react';
import { Star, Eye, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { DataTable } from '../ui/DataTable';
import { AdminModal } from '../ui/AdminModal';
import { SectionShell, SearchInput } from '../ui/SectionShell';


const ReviewsManagementPage = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const newCount = reviews.filter(r => r.isNew).length;

  const handleStatusChange = (reviewId, newStatus) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? { ...review, status: newStatus, isNew: false }
        : review
    ));
  };

  const handleDelete = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
      />
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isRTL = false;
  const dir = 'ltr';

  const columns = [
    {
      key: 'reviewer',
      label: 'Reviewer',
      align: 'start',
      render: (review) => (
        <div>
          <p className="font-medium">{review.reviewer}</p>
        </div>
      )
    },
    {
      key: 'book',
      label: 'Book',
      align: 'start',
      render: (review) => (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-base">{review.bookTitle}</span>
          {review.isNew && (
            <Badge className="bg-red-500 text-white animate-pulse text-xs">New</Badge>
          )}
          <Badge className={getStatusColor(review.status) + " text-xs"}>
            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
          </Badge>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      align: 'start',
      render: (review) => (
        <div className="flex items-center gap-1">
          {renderStars(review.rating)}
          <span className="ml-1 font-medium text-sm">{review.rating}/5</span>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      align: 'start',
      render: (review) => (
        <span className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
      )
    },
    {
      key: '_actions',
      label: 'Actions',
      align: 'end',
      render: (review) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedReview(review)}
            className="hover:bg-muted rounded-md"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {review.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStatusChange(review.id, 'rejected')}
                className="text-red-600 hover:bg-red-50"
              >
                Reject
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStatusChange(review.id, 'approved')}
                className="text-green-600 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(review.id)}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <SectionShell
      title="Reviews Management"
      subtitle="Manage and moderate user reviews for your books"
      dir={dir}
      actions={
        <div className="bg-card border rounded-lg p-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">{pendingCount} Pending</span>
            </div>
            {newCount > 0 && (
              <>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-red-600">{newCount} New</span>
                </div>
              </>
            )}
          </div>
        </div>
      }
      filters={
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search reviews, books, or reviewers..."
            dir={dir}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      <DataTable
        columns={columns}
        data={filteredReviews}
        loading={false}
        emptyTitle="No reviews found"
        emptyDescription={searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filter criteria.' : 'No reviews have been submitted yet.'}
        emptyIcon={<Star className="h-8 w-8 text-muted-foreground" />}
        dir={dir}
      />

      {/* Review Detail Modal */}
      <AdminModal
        open={!!selectedReview}
        onClose={setSelectedReview}
        title="Review Details"
        size="lg"
        dir={dir}
        footer={
          selectedReview?.status === 'pending' ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  handleStatusChange(selectedReview.id, 'rejected');
                  setSelectedReview(null);
                }}
                className="text-red-600 hover:bg-red-50"
              >
                Reject
              </Button>
              <Button
                onClick={() => {
                  handleStatusChange(selectedReview.id, 'approved');
                  setSelectedReview(null);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setSelectedReview(null)}>
              Close
            </Button>
          )
        }
      >
        {selectedReview && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Book</label>
              <p className="text-lg font-semibold">{selectedReview.bookTitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reviewer</label>
                <p className="font-medium">{selectedReview.reviewer}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Rating</label>
                <div className="flex items-center gap-2">
                  {renderStars(selectedReview.rating)}
                  <span className="font-medium">{selectedReview.rating}/5</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Review</label>
              <Textarea
                value={selectedReview.comment}
                readOnly
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>
        )}
      </AdminModal>
    </SectionShell>
  );
};

export default ReviewsManagementPage;
