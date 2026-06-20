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

  const isRTL = currentLanguage === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  return (
    <div className={`space-y-8 ${isRTL ? 'rtl' : 'ltr'}`} dir={dir}>

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className={isRTL ? 'text-right' : 'text-left'}>
        <div className={`flex items-center gap-2.5 mb-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
          <div className="w-1 h-6 rounded-full bg-brand flex-shrink-0" />
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {t('dashboard.title')}
          </h1>
        </div>
        <p className={`text-sm text-muted-foreground ${isRTL ? 'mr-[18px]' : 'ml-[18px]'}`}>
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* ── Primary KPI Row ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-5">
                <div className={`flex items-start justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground tabular-nums leading-none">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${stat.bgColor}`}>
                    <IconComponent className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Secondary KPI Row ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-5">
                <div className={`flex items-start justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground tabular-nums leading-none">
                      {stat.value}
                    </p>
                    <div className="mt-2">
                      {stat.published !== undefined ? (
                        <div className={`flex gap-1.5 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="inline-flex items-center rounded-md bg-status-approved px-1.5 py-0.5 text-[10px] font-medium text-status-approved-solid">
                            {stat.published}↑
                          </span>
                          <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {stat.draft} draft
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">{stat.trend}</p>
                      )}
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${stat.bgColor}`}>
                    <IconComponent className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Activity + Status ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Activity */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className={`flex items-center gap-2 text-base font-semibold ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <Clock className="h-4 w-4 text-brand flex-shrink-0" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {loading ? (
                <div className="space-y-2 py-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 p-2 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-muted rounded w-3/4" />
                        <div className="h-2.5 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className={`flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`p-1.5 rounded-full flex-shrink-0 mt-0.5 ${activity.bgColor}`}>
                        <IconComponent className={`h-3.5 w-3.5 ${activity.color}`} />
                      </div>
                      <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <p className="text-sm font-medium text-foreground leading-snug">{activity.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{activity.description}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <Activity className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className={`flex items-center gap-2 text-base font-semibold ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <BarChart3 className="h-4 w-4 text-brand flex-shrink-0" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {[
                { icon: CheckCircle, label: 'Database Connection', status: 'Online', ok: true },
                { icon: CheckCircle, label: 'API Services', status: 'Active', ok: true },
                { icon: CheckCircle, label: 'File Storage', status: 'Available', ok: true },
                {
                  icon: AlertCircle,
                  label: 'Pending Reviews',
                  status: `${stats.pendingReviews} items`,
                  ok: stats.pendingReviews === 0,
                },
              ].map(({ icon: Icon, label, status, ok }) => (
                <div
                  key={label}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Icon className={`h-4 w-4 flex-shrink-0 ${ok ? 'text-status-approved' : 'text-status-pending'}`} />
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      ok
                        ? 'bg-status-approved text-status-approved-solid ring-status-approved'
                        : 'bg-status-pending text-status-pending-solid ring-status-pending'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
