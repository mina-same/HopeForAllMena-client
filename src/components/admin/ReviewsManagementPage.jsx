import React, { useState } from 'react';
import { Star, Filter, Search, Eye, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';


const mockReviews = [
  {
    id: '1',
    bookTitle: 'Clean Code',
    reviewer: 'John Doe',
    rating: 5,
    comment: 'Excellent book! Really helped me improve my coding practices.',
    date: '2024-01-15',
    status: 'pending',
    isNew: true
  },
  {
    id: '2',
    bookTitle: 'JavaScript: The Good Parts',
    reviewer: 'Jane Smith',
    rating: 4,
    comment: 'Great insights into JavaScript, though a bit dated now.',
    date: '2024-01-14',
    status: 'approved',
    isNew: false
  },
  {
    id: '3',
    bookTitle: 'Design Patterns',
    reviewer: 'Mike Johnson',
    rating: 5,
    comment: 'Essential reading for any serious developer.',
    date: '2024-01-13',
    status: 'pending',
    isNew: true
  },
  {
    id: '4',
    bookTitle: 'Clean Architecture',
    reviewer: 'Sarah Wilson',
    rating: 3,
    comment: 'Good concepts but could be more practical.',
    date: '2024-01-12',
    status: 'rejected',
    isNew: false
  },
  {
    id: '5',
    bookTitle: 'The Pragmatic Programmer',
    reviewer: 'Alex Brown',
    rating: 5,
    comment: 'Life-changing book for developers!',
    date: '2024-01-11',
    status: 'pending',
    isNew: true
  }
];

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

  const handleStatusChange = (reviewId , newStatus ) => {
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

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Reviews Management</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Manage and moderate user reviews for your books
          </p>
        </div>
        <div className="flex items-center gap-4">
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
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews, books, or reviewers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-[30px]"
              />
            </div>
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
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <h3 className="font-semibold text-base md:text-lg">{review.bookTitle}</h3>
                    {review.isNew && (
                      <Badge className="bg-red-500 text-white animate-pulse text-xs">New</Badge>
                    )}
                    <Badge className={getStatusColor(review.status) + " text-xs"}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                    <span className="font-medium">{review.reviewer}</span>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="ml-1 font-medium">{review.rating}/5</span>
                    </div>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  
                  <p className="text-foreground leading-relaxed text-sm md:text-base line-clamp-3 md:line-clamp-none">{review.comment}</p>
                </div>
                
                <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-auto">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedReview(review)}
                        className="flex-1 md:flex-none"
                      >
                        <Eye className="h-4 w-4 md:mr-0" />
                        <span className="md:hidden ml-2">View</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Review Details</DialogTitle>
                      </DialogHeader>
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
                          <div className="flex justify-end gap-2">
                            {selectedReview.status === 'pending' && (
                              <>
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
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  {review.status === 'pending' && (
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(review.id, 'rejected')}
                        className="text-red-600 hover:bg-red-50 flex-1 md:flex-none"
                      >
                        <span className="md:hidden">Reject</span>
                        <span className="hidden md:inline">Reject</span>
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleStatusChange(review.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="md:hidden">Approve</span>
                        <span className="hidden md:inline">Approve</span>
                      </Button>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                    className="text-red-600 hover:bg-red-50 w-full md:w-auto"
                  >
                    <Trash2 className="h-4 w-4 md:mr-0" />
                    <span className="md:hidden ml-2">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No reviews found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No reviews have been submitted yet.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReviewsManagementPage;