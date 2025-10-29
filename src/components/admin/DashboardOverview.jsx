import React, { useState, useEffect } from 'react';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useBookstore } from '../../context/BookstoreContext';
import { reviewsAPI, usersAPI } from '../../services/api';
import blogAPI from '../../services/blogAPI';
import { categoriesAPI, contactMessagesAPI } from '../../services/publishingAPI';
import factCounterService from '../../services/factCounterService';
import { 
  Book, 
  Star, 
  MessageSquare, 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Activity,
  Globe,
  GraduationCap,
  BookMarked
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

const DashboardOverview = () => {
  const { t } = useTranslation('Admin');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  const { user, token } = useAuth();
  const { books, reviews, contacts } = useBookstore();
  
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalReviews: 0,
    totalMessages: 0,
    totalCountries: 0,
    totalBlogs: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingReviews: 0,
    unreadMessages: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    acceptedTraining: 0,
    publishedBooks: 0,
    givenMagazines: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all statistics in parallel using optimized stats endpoints
        const API_URL = process.env.GATSBY_API_URL || 'http://localhost:5001/api';
        const headers = { 
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        };

        const [
          blogsResponse,
          coursesStatsResponse,
          enrollmentsStatsResponse,
          reviewsStatsResponse,
          recentReviewsResponse,
          recentMessagesResponse,
          contactStatsResponse,
          trainingStatsResponse,
          magazineStatsResponse,
          booksResponse,
          factCounterResponse
        ] = await Promise.allSettled([
          blogAPI.getAllBlogs({ limit: 1000 }, token).catch(err => {
            console.warn('Failed to fetch blogs:', err);
            return { blogs: [] };
          }),
          fetch(`${API_URL}/courses/stats`, { headers }).then(r => r.json()).catch(err => {
            console.warn('Failed to fetch courses stats:', err);
            return { data: { stats: { total: 0, published: 0, draft: 0 } } };
          }),
          fetch(`${API_URL}/enrollments/stats`, { headers }).then(r => r.json()).catch(err => {
            console.warn('Failed to fetch enrollments stats:', err);
            return { data: { stats: { total: 0, approved: 0, pending: 0 } } };
          }),
          reviewsAPI.getReviews({ limit: 1, status: 'pending' }).catch(err => {
            console.warn('Failed to fetch pending reviews count:', err);
            return { data: { reviews: [], pagination: { totalReviews: 0 } } };
          }),
          reviewsAPI.getReviews({ limit: 3 }).catch(err => {
            console.warn('Failed to fetch recent reviews:', err);
            return { data: { reviews: [] } };
          }),
          fetch(`${API_URL}/contact-messages/recent`, { headers }).then(r => r.json()).catch(err => {
            console.warn('Failed to fetch recent messages:', err);
            return { data: { messages: [] } };
          }),
          fetch(`${API_URL}/contact-messages/stats`, { headers }).then(r => r.json()).catch(err => {
            console.warn('Failed to fetch contact stats:', err);
            return { data: { total: 0, new: 0, unread: 0 } };
          }),
          fetch(`${API_URL}/training-requests/stats`, { headers }).then(r => r.json()).catch(err => {
            console.warn('Failed to fetch training stats:', err);
            return { total: 0, byStatus: {} };
          }),
          fetch(`${API_URL}/magazine-requests/statistics`, { headers }).then(r => r.json()).catch(err => {
            console.warn('Failed to fetch magazine stats:', err);
            return { success: true, data: { totalRequests: 0, approvedCount: 0, totalCopiesApproved: 0 } };
          }),
          fetch(`${API_URL}/books?limit=1`, { headers }).then(r => r.json()).catch(err => {
            console.warn('Failed to fetch books count:', err);
            return { data: { pagination: { totalBooks: 0 } } };
          }),
          factCounterService.getStats().catch(err => {
            console.warn('Failed to fetch fact counter:', err);
            return { data: { countries: 0, leadersTraining: 0, publishedBooks: 0, givenMagazines: 0 } };
          })
        ]);

        // Extract data with proper error handling
        const blogs = blogsResponse.status === 'fulfilled' ? (blogsResponse.value.blogs || blogsResponse.value || []) : [];
        const coursesStats = coursesStatsResponse.status === 'fulfilled' ? (coursesStatsResponse.value.data?.stats || coursesStatsResponse.value.stats || {}) : { total: 0 };
        const enrollmentsStats = enrollmentsStatsResponse.status === 'fulfilled' ? (enrollmentsStatsResponse.value.data?.stats || enrollmentsStatsResponse.value.stats || {}) : { total: 0 };
        const reviewsData = reviewsStatsResponse.status === 'fulfilled' ? reviewsStatsResponse.value : { data: { pagination: { totalReviews: 0 } } };
        const reviews = recentReviewsResponse.status === 'fulfilled' ? (recentReviewsResponse.value.data?.reviews || recentReviewsResponse.value?.reviews || []) : [];
        const messagesData = recentMessagesResponse.status === 'fulfilled' ? recentMessagesResponse.value : { data: { messages: [] } };
        const messages = messagesData.data?.messages || messagesData.messages || [];
        const contactStats = contactStatsResponse.status === 'fulfilled' ? (contactStatsResponse.value.data || contactStatsResponse.value || {}) : {};
        const trainingStats = trainingStatsResponse.status === 'fulfilled' ? trainingStatsResponse.value : { total: 0, byStatus: {} };
        const magazineStats = magazineStatsResponse.status === 'fulfilled' ? (magazineStatsResponse.value.data || {}) : {};
        const booksCount = booksResponse.status === 'fulfilled' ? (booksResponse.value.data?.pagination?.totalBooks || booksResponse.value.pagination?.totalBooks || 0) : 0;
        const factCounterData = factCounterResponse.status === 'fulfilled' ? (factCounterResponse.value.data || factCounterResponse.value || {}) : {};

        // Get countries from Analytics (FactCounter) - same as Analytics section
        const countriesFromAnalytics = factCounterData.countries || factCounterData.members || 0;

        // Count accepted/approved training requests from stats
        const approvedCount = trainingStats.byStatus?.approved || 0;
        const scheduledCount = trainingStats.byStatus?.scheduled || 0;
        const completedCount = trainingStats.byStatus?.completed || 0;
        const acceptedTraining = approvedCount + scheduledCount + completedCount;

        // Get total approved magazines from magazine stats
        // The magazine model has a getStatistics method that returns totalCopiesApproved
        const totalMagazinesGiven = magazineStats.totalCopiesApproved || 0;

        // Count unread messages from stats (new + unread status)
        const unreadMessagesCount = (contactStats.new || 0) + (contactStats.unread || 0);

        // Count pending reviews from pagination
        const pendingReviewsCount = reviewsData.data?.pagination?.totalReviews || 0;

        const newStats = {
          totalBooks: booksCount,
          totalReviews: contactStats.total || 0,
          totalMessages: contactStats.total || 0,
          totalCountries: countriesFromAnalytics,
          totalBlogs: blogs.length,
          totalCourses: coursesStats.total || 0,
          totalEnrollments: enrollmentsStats.total || 0,
          pendingReviews: pendingReviewsCount,
          unreadMessages: unreadMessagesCount,
          publishedBlogs: blogs.filter(b => b.status === 'published').length,
          draftBlogs: blogs.filter(b => b.status === 'draft').length,
          acceptedTraining: acceptedTraining,
          publishedBooks: booksCount, // Total number of books in the system
          givenMagazines: totalMagazinesGiven
        };

        setStats(newStats);

        // Prepare recent activity
        const activity = [];
        
        // Add recent reviews
        reviews.slice(0, 3).forEach(review => {
          activity.push({
            id: `review-${review._id}`,
            type: 'review',
            title: `New review for "${review.bookTitle || review.book?.title || 'Book'}"`,
            description: `${review.rating} stars - ${(review.comment || review.review || '').substring(0, 50)}...`,
            time: new Date(review.createdAt || review.date).toLocaleDateString(),
            icon: Star,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50'
          });
        });

        // Add recent messages
        messages.slice(0, 2).forEach(message => {
          activity.push({
            id: `message-${message._id}`,
            type: 'message',
            title: `New message from ${message.name || message.sender || 'Unknown'}`,
            description: (message.message || message.content || '').substring(0, 50) + '...',
            time: new Date(message.createdAt || message.date).toLocaleDateString(),
            icon: MessageSquare,
            color: 'text-green-500',
            bgColor: 'bg-green-50'
          });
        });

        // Add recent blogs if available
        blogs.slice(0, 2).forEach(blog => {
          activity.push({
            id: `blog-${blog._id}`,
            type: 'blog',
            title: `New blog: "${blog.title}"`,
            description: (blog.excerpt || blog.content || '').substring(0, 50) + '...',
            time: new Date(blog.createdAt || blog.publishedAt).toLocaleDateString(),
            icon: FileText,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50'
          });
        });

        setRecentActivity(activity.slice(0, 5));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback stats with actual data from context
        setStats({
          totalBooks: books.length,
          totalReviews: reviews.length,
          totalMessages: contacts.length,
          totalCountries: 0,
          totalBlogs: 0,
          totalCategories: 0,
          pendingReviews: 0,
          unreadMessages: 0,
          publishedBlogs: 0,
          draftBlogs: 0,
          acceptedTraining: 0,
          publishedBooks: books.length,
          givenMagazines: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [books.length, reviews.length, contacts.length, token]);

  const statCards = [
    {
      title: 'Countries',
      value: stats.totalCountries,
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: 'From Analytics'
    },
    {
      title: 'Leaders Training',
      value: stats.acceptedTraining,
      icon: GraduationCap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      trend: 'Accepted'
    },
    {
      title: 'Published Books',
      value: stats.publishedBooks,
      icon: BookMarked,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: 'Total Books'
    },
    {
      title: 'Given Magazines',
      value: stats.givenMagazines.toLocaleString(),
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      trend: 'Approved'
    }
  ];

  const quickStats = [
    {
      title: t('dashboard.blogs'),
      value: stats.totalBlogs,
      published: stats.publishedBlogs,
      draft: stats.draftBlogs,
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      trend: `${stats.publishedBlogs} Published`
    },
    {
      title: t('dashboard.courses'),
      value: stats.totalCourses,
      icon: GraduationCap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      trend: '+12%'
    },
    {
      title: t('dashboard.courseEnrollments'),
      value: stats.totalEnrollments,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: '+18%'
    },
    {
      title: t('dashboard.unreadMessages'),
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      trend: 'Unread'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('dashboard.title')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('dashboard.subtitle')}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-sm">
            <Activity className="h-3 w-3 mr-1" />
            Last updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className={`border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${stat.borderColor} border-l-4`}>
              <CardContent className="p-6">
                <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground mb-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className={`border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${stat.borderColor} border-l-4`}>
              <CardContent className="p-6">
                <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground mb-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1">
                      {stat.published !== undefined ? (
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {stat.published} Published
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {stat.draft} Draft
                          </Badge>
                        </div>
                      ) : (
                        <>
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">
                            {stat.trend}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'text-right flex-row-reverse' : 'text-left'}`}>
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading activity...</p>
                </div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <div className={`p-2 rounded-full ${activity.bgColor}`}>
                        <IconComponent className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className={`flex-1 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                        <p className="text-sm font-medium text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-xs text-muted-foreground mt-1">Activity will appear here as users interact with the system</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'text-right flex-row-reverse' : 'text-left'}`}>
              <BarChart3 className="h-5 w-5 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Database Connection</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Online
                </Badge>
              </div>
              
              <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">API Services</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
              
              <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">File Storage</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Available
                </Badge>
              </div>
              
              <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Pending Reviews</span>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {stats.pendingReviews} items
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
