import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Star, Heart, ShoppingCart, Minus, Plus, ChevronLeft, ChevronRight, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import Layout from '../components/layout'
import HeaderTwo from '../components/header/header-two'
import StickyHeader from '../components/header/sticky-header'
import Footer from '../components/footer'
import { useBookstore } from '../context/BookstoreContext'
import { booksAPI, reviewsAPI } from '../services/api'
import { useToast } from '../hooks/use-toast'
import { navigate } from 'gatsby'

export default function BookDetail() {
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("reviews")
  const [book, setBook] = useState(null)
  const [relatedBooks, setRelatedBooks] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [relatedLoading, setRelatedLoading] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: '',
    name: '',
    email: ''
  })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewError, setReviewError] = useState(null)

  // Get book ID from URL and fetch book data
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true)
        setError(null)
        // Reset related data when fetching new book
        setRelatedBooks([])
        setReviews([])
        setReviewSubmitted(false)
        setReviewError(null)

        const path = window.location.pathname
        const bookId = path.split('/book/')[1]

        if (bookId) {
          console.log('Fetching book with ID:', bookId)
          const response = await booksAPI.getBookById(bookId)
          console.log('API Response:', response)
          if (response.status === 'success' && response.data) {
            console.log('Book data received:', response.data)
            // API returns { status: 'success', data: { book: {...} } }
            const bookData = response.data.book || response.data
            setBook(bookData)
          } else {
            console.log('Book not found in API response')
            setError('Book not found')
          }
        } else {
          setError('No book ID provided')
        }
      } catch (err) {
        console.error('Error fetching book:', err)
        console.error('Error details:', err.response || err.message)

        // Check if it's a network error or 404
        if (err.response?.status === 404) {
          setError('Book not found')
        } else {
          setError('Failed to load book details')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBookData()
  }, [typeof window !== 'undefined' ? window.location.pathname : ''])

  // Fetch related books when book data is loaded
  useEffect(() => {
    const fetchRelatedBooks = async () => {
      if (!book || !book.category) return

      try {
        setRelatedLoading(true)
        const categoryId = book.category?._id || book.category?.id || book.category
        console.log('Fetching related books for category:', categoryId)
        const response = await booksAPI.getBooks({
          category: categoryId,
          limit: 8,
          status: 'published'
        })
        console.log('Related books response:', response)

        if (response.status === 'success') {
          // API returns { status: 'success', data: { books: [...] } }
          const books = response.data.books || []
          // Filter out current book from related books
          const filtered = books.filter(relatedBook => relatedBook._id !== book._id)
          setRelatedBooks(filtered.slice(0, 6)) // Show max 6 related books
        }
      } catch (err) {
        console.error('Error fetching related books:', err)
        // Keep empty array on error
        setRelatedBooks([])
      } finally {
        setRelatedLoading(false)
      }
    }

    fetchRelatedBooks()
  }, [book])

  // Fetch reviews when book data is loaded
  useEffect(() => {
    const fetchReviews = async () => {
      if (!book || !book._id) return

      try {
        setReviewsLoading(true)
        const response = await reviewsAPI.getReviewsByBook(book._id, {
          status: 'approved,pending',
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        })

        if (response.status === 'success') {
          // API returns { status: 'success', data: { reviews: [...] } }
          const reviews = response.data.reviews || []
          setReviews(reviews)
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
        // Keep empty reviews array on error
        setReviews([])
      } finally {
        setReviewsLoading(false)
      }
    }

    fetchReviews()
  }, [book])

  const handleAddToCart = () => {
    if (!book) return;
    
    // Navigate to order page with book information
    navigate('/order', {
      state: {
        bookTitle: book.title,
        bookId: book._id,
        author: book.author?.name,
        price: book.price,
        quantity: quantity,
        preFilledMessage: `I would like to order ${quantity} copy/copies of "${book.title}" by ${book.author?.name}.\n\nBook Details:\n- Title: ${book.title}\n- Author: ${book.author?.name}\n- Price: $${book.price}\n- Quantity: ${quantity}\n- Total: $${(book.price * quantity).toFixed(2)}\n\nPlease let me know about availability and shipping details.`
      }
    });
  }

  const handleAddToWishlist = () => {
    console.log("Adding book to wishlist:", book.id)
  }

  // Handle review form changes
  const handleReviewFormChange = (field, value) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear any previous errors when user starts typing
    if (reviewError) setReviewError(null)
  }

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault()

    if (!book?._id) {
      setReviewError('Book information not available')
      return
    }

    // Validate form
    if (reviewForm.rating === 0) {
      setReviewError('Please select a rating')
      return
    }
    if (!reviewForm.title.trim()) {
      setReviewError('Please enter a review title')
      return
    }
    if (!reviewForm.content.trim()) {
      setReviewError('Please enter your review')
      return
    }
    if (!reviewForm.name.trim()) {
      setReviewError('Please enter your name')
      return
    }
    if (!reviewForm.email.trim()) {
      setReviewError('Please enter your email')
      return
    }

    try {
      setReviewSubmitting(true)
      setReviewError(null)

      const reviewData = {
        book: book._id,
        rating: reviewForm.rating,
        title: reviewForm.title.trim(),
        content: reviewForm.content.trim(),
        // For guest reviews, we'll store name/email in the content or handle differently
        guestName: reviewForm.name.trim(),
        guestEmail: reviewForm.email.trim()
      }

      const response = await reviewsAPI.createReview(reviewData)

      if (response.status === 'success') {
        setReviewSubmitted(true)
        setReviewForm({
          rating: 0,
          title: '',
          content: '',
          name: '',
          email: ''
        })

        // Refresh reviews to show the new one (if approved immediately)
        if (book._id) {
          try {
            const reviewsResponse = await reviewsAPI.getReviewsByBook(book._id, {
              status: 'approved,pending',
              limit: 10,
              sortBy: 'createdAt',
              sortOrder: 'desc'
            })

            if (reviewsResponse.status === 'success') {
              setReviews(reviewsResponse.data.reviews || [])
            }
          } catch (err) {
            console.error('Error refreshing reviews:', err)
          }
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err)

      if (err.response?.data?.message) {
        setReviewError(err.response.data.message)
      } else if (err.response?.status === 401) {
        setReviewError('You need to be logged in to submit a review')
      } else if (err.response?.status === 400) {
        setReviewError('Invalid review data. Please check your input.')
      } else {
        setReviewError('Failed to submit review. Please try again.')
      }
    } finally {
      setReviewSubmitting(false)
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating)
          ? "fill-[#2194D1] text-[#2194D1]"
          : "text-muted-foreground"
          }`}
      />
    ))
  }

  if (loading) {
    return (
      <Layout>
        <HeaderTwo />
        <StickyHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2194D1]"></div>
        </div>
        <Footer />
      </Layout>
    )
  }

  if (error || !book) {
    return (
      <Layout>
        <HeaderTwo />
        <StickyHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h1>
            <p className="text-gray-600 mb-4">{error || 'The requested book could not be found.'}</p>
            <Link to="/books" className="text-[#2194D1] hover:underline">← Back to Books</Link>
          </div>
        </div>
        <Footer />
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Header */}
      <HeaderTwo />
      <StickyHeader />
      <div className="min-h-screen bg-background">

        {/* Book Details */}
        <div className="container py-10 pt-[150px]">
          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Gallery */}
            <div className="space-y-4">
              <div className="relative group bg-[#2194D1]/10 rounded-xl p-3 shadow-card">
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                  <img
                    src={book.coverImageUrl || '/default-book-cover.jpg'}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />

                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title & Author */}
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-relaxed">{book.title}</h1>
                <div className="text-muted-foreground">
                  Author: <Link to="#" className="text-[#2194D1] hover:underline">{book.author?.name || book.author || 'Unknown Author'}</Link>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {renderStars(book.averageRating || book.rating || 0)}
                    <span className="text-sm text-muted-foreground ml-1">
                      Rated {book.averageRating || book.rating || 0} out of 5
                    </span>
                  </div>
                  <Link to="#reviews" className="text-sm text-[#2194D1] hover:underline">
                    <span className="bg-[#2194D1] text-white px-2 py-1 rounded text-xs">
                      {book.totalReviews || book.reviews || 0}
                    </span>
                  </Link>
                </div>
              </div>

              {/* Description */}
              <div className="text-muted-foreground">
                {book.description || book.shortDescription || 'No description available.'}
              </div>

              {/* Add to Cart Form */}
              <div className="space-y-4 border-t border-border pt-6">

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="cart"
                    size="lg"
                    className="flex-1 bg-[#2194D1] text-white"
                    onClick={handleAddToCart}
                  >
                    Order Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleAddToWishlist}
                  >
                    Add to wishlist
                  </Button>
                </div>
              </div>

              {/* Product Meta */}
              <div className="space-y-2 text-sm border-t border-border pt-6">
                <div>
                  <span className="text-muted-foreground">Category: </span>
                  {book.category && (
                    <Link to="#" className="text-[#2194D1] hover:underline">
                      {book.category.name_en || book.category.name || 'Unknown Category'}
                    </Link>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Tags: </span>
                  {(book.tags || []).map((tag, index) => (
                    <span key={tag}>
                      <Link to="#" className="text-[#2194D1] hover:underline">{tag}</Link>
                      {index < (book.tags || []).length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Share */}
              <div className="flex items-center gap-4 border-t border-border pt-6">
                <span className="text-sm font-medium">Share:</span>
                <div className="flex items-center gap-3">
                  <Link to="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#2194D1] transition-colors">
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#2194D1] transition-colors">
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#2194D1] transition-colors">
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#2194D1] transition-colors">
                    <Instagram className="w-4 h-4" />
                    <span>Pinterest</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="border-t w-full">
            <div className="flex justify-center gap-3 border-b py-4">
              {[
                { key: "description", label: "Description" },
                { key: "reviews", label: `Reviews (${book.totalReviews || reviews.length || 0})` }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${activeTab === tab.key
                    ? "bg-[#2194D1] text-white border-[#2194D1]"
                    : "bg-secondary text-white border-border hover:bg-secondary-hover"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-8 max-w-4xl mx-auto">
              {activeTab === "description" && (
                <div className="max-w-3xl space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <div className="prose text-muted-foreground leading-relaxed space-y-4">
                    {(book.fullDescription || book.description || book.shortDescription || 'No description available.').split('. ').map((sentence, index) => (
                      <p key={index}>{sentence}{index < (book.fullDescription || book.description || book.shortDescription || '').split('. ').length - 1 ? '.' : ''}</p>
                    ))}
                  </div>
                </div>
              )}

              {false && <div />}

              {activeTab === "reviews" && (
                <div className="max-w-4xl space-y-8">
                  <div className="space-y-6">
                    {/* Reviews List */}
                    {reviewsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2194D1]"></div>
                      </div>
                    ) : reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review._id} className="flex gap-4 p-6 border border-border rounded-lg">
                            <div className="w-12 h-12 bg-[#2194D1] rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium text-white">
                                {(review.user?.name || review.guestInfo?.name || 'Anonymous').split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating || 0)}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">{review.user?.name || review.guestInfo?.name || 'Anonymous'}</span>
                                {(review.user?.email || review.guestInfo?.email) && (
                                  <>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-muted-foreground text-xs">{review.user?.email || review.guestInfo?.email}</span>
                                  </>
                                )}
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">
                                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : review.date}
                                </span>
                              </div>
                              <p className="text-muted-foreground leading-relaxed">{review.content || review.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border border-gray-300 rounded-lg bg-gray-50">
                        <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No approved reviews yet</h3>
                        <p className="text-gray-500 text-sm mb-4">Be the first to share your thoughts about this book</p>
                        <p className="text-gray-400 text-xs">Reviews are moderated and will appear after approval</p>
                      </div>
                    )}

                    {/* Review Form */}
                    <div className="border-t border-border pt-8">
                      <h3 className="text-lg font-semibold mb-6">Add a review</h3>

                      {reviewSubmitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                          <div className="text-green-600 mb-2">
                            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-semibold text-green-800 mb-2">Review Submitted Successfully!</h4>
                          <p className="text-green-700 mb-4">
                            Thank you for your review. It has been submitted and is pending approval by our moderators.
                          </p>
                          <button
                            onClick={() => setReviewSubmitted(false)}
                            className="text-[#2194D1] hover:underline font-medium border-none"
                          >
                            Submit Another Review
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                          {reviewError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <p className="text-red-700 text-sm">{reviewError}</p>
                            </div>
                          )}

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Your rating <span className="text-destructive">*</span>
                            </label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => handleReviewFormChange('rating', star)}
                                  className={`transition-colors border-none bg-transparent p-1 ${star <= reviewForm.rating
                                    ? 'text-[#2194D1]'
                                    : 'text-[#bcbec0] hover:text-[#2194D1]'
                                    }`}
                                >
                                  <Star className={`w-5 h-5 ${star <= reviewForm.rating ? 'fill-current' : ''}`} />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Review title <span className="text-destructive">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Give your review a title"
                              value={reviewForm.title}
                              onChange={(e) => handleReviewFormChange('title', e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2194D1] placeholder:text-gray-300"
                              maxLength={100}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Your review <span className="text-destructive">*</span>
                            </label>
                            <textarea
                              placeholder="Tell us what you think about this book..."
                              rows={6}
                              value={reviewForm.content}
                              onChange={(e) => handleReviewFormChange('content', e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2194D1] resize-none placeholder:text-gray-300"
                              maxLength={1000}
                            />
                            <div className="text-xs text-gray-300 text-right">
                              {reviewForm.content.length}/1000 characters
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Name <span className="text-destructive">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Your name"
                                value={reviewForm.name}
                                onChange={(e) => handleReviewFormChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2194D1] placeholder:text-gray-300"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Email <span className="text-destructive">*</span>
                              </label>
                              <input
                                type="email"
                                placeholder="Your email"
                                value={reviewForm.email}
                                onChange={(e) => handleReviewFormChange('email', e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2194D1] placeholder:text-gray-300"
                              />
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <input type="checkbox" id="save-info" className="mt-1" />
                            <label htmlFor="save-info" className="text-sm text-muted-foreground">
                              Save my name, email, and website in this browser for the next time I comment.
                            </label>
                          </div>

                          <Button
                            type="submit"
                            variant="default"
                            disabled={reviewSubmitting}
                            className="bg-[#2194D1] hover:bg-[#1e7fb8]"
                          >
                            {reviewSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Submitting...
                              </>
                            ) : (
                              'Submit Review'
                            )}
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <section className="py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">
                {book.category?.name_en || book.category?.name ? `More books in ${book.category.name_en || book.category.name}` : 'Related products'}
              </h2>
              {relatedBooks.length > 0 && (
                <div className="flex gap-2">
                  <div className="swiper-button-prev-custom w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                  <div className="swiper-button-next-custom w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              )}
            </div>
            {relatedLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2194D1]"></div>
              </div>
            ) : relatedBooks.length > 0 ? (
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation={{
                  prevEl: '.swiper-button-prev-custom',
                  nextEl: '.swiper-button-next-custom',
                }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                spaceBetween={20}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 4 },
                }}
                className="pb-5"
              >
                {relatedBooks.map((relatedBook) => (
                  <SwiperSlide key={`related-${relatedBook._id}`}>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <Link to={`/book/${relatedBook._id}`}>
                        <div className="aspect-[3/4] relative overflow-hidden">
                          <img
                            src={relatedBook.coverImageUrl || '/default-book-cover.jpg'}
                            alt={relatedBook.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      </Link>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          <Link to={`/book/${relatedBook._id}`} className="text-gray-900 hover:text-[#2194D1] transition-colors">
                            {relatedBook.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          by {relatedBook.author?.name || 'Unknown Author'}
                        </p>
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(relatedBook.averageRating || 0)}
                          <span className="text-xs text-gray-500 ml-1">
                            ({relatedBook.totalReviews || 0})
                          </span>
                        </div>
                        {relatedBook.price && (
                          <p className="text-lg font-bold text-[#2194D1]">
                            ${relatedBook.price}
                          </p>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No related books found in this category.</p>
              </div>
            )}
          </section>
        </div>

        {/*  footer */}
      </div>
      <Footer />
    </Layout>
  )
}