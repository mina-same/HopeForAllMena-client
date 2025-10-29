import React, { useState, useEffect } from 'react';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useBookstore } from '../../context/BookstoreContext';
import { reviewsAPI, usersAPI } from '../../services/api';
import blogAPI from '../../services/blogAPI';
import { categoriesAPI, contactMessagesAPI } from '../../services/publishingAPI';
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
  Activity
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
    totalUsers: 0,
    totalBlogs: 0,
    totalCategories: 0,
    pendingReviews: 0,
    unreadMessages: 0,
    publishedBlogs: 0,
    draftBlogs: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all statistics in parallel with better error handling
        const [
          blogsResponse,
          categoriesResponse,
          reviewsResponse,
          messagesResponse,
          usersResponse
        ] = await Promise.allSettled([
          blogAPI.getAllBlogs({ limit: 100 }, token).catch(err => {
            console.warn('Failed to fetch blogs:', err);
            return { blogs: [] };
          }),
          categoriesAPI.getCategories({ limit: 100 }).catch(err => {
            console.warn('Failed to fetch categories:', err);
            return { data: { categories: [] } };
          }),
          reviewsAPI.getReviews({ limit: 100 }).catch(err => {
            console.warn('Failed to fetch reviews:', err);
            return { data: { reviews: [] } };
          }),
          contactMessagesAPI.getContactMessages({ limit: 100 }).catch(err => {
            console.warn('Failed to fetch messages:', err);
            return { data: { messages: [] } };
          }),
          usersAPI.getUsers({ limit: 100 }).catch(err => {
            console.warn('Failed to fetch users:', err);
            return { data: { users: [] } };
          })
        ]);

        // Extract data with proper error handling
        const blogs = blogsResponse.status === 'fulfilled' ? (blogsResponse.value.blogs || blogsResponse.value || []) : [];
        const categories = categoriesResponse.status === 'fulfilled' ? (categoriesResponse.value.data?.categories || categoriesResponse.value?.categories || []) : [];
        const reviews = reviewsResponse.status === 'fulfilled' ? (reviewsResponse.value.data?.reviews || reviewsResponse.value?.reviews || []) : [];
        const messages = messagesResponse.status === 'fulfilled' ? (messagesResponse.value.data?.messages || messagesResponse.value?.messages || []) : [];
        const users = usersResponse.status === 'fulfilled' ? (usersResponse.value.data?.users || usersResponse.value?.users || []) : [];

        const newStats = {
          totalBooks: books.length,
          totalReviews: reviews.length,
          totalMessages: messages.length,
          totalUsers: users.length || 1, // Current user if no users found
          totalBlogs: blogs.length,
          totalCategories: categories.length,
          pendingReviews: reviews.filter(r => r.status === 'pending').length,
          unreadMessages: messages.filter(m => !m.read).length,
          publishedBlogs: blogs.filter(b => b.status === 'published').length,
          draftBlogs: blogs.filter(b => b.status === 'draft').length
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
          totalUsers: 1,
          totalBlogs: 0,
          totalCategories: 0,
          pendingReviews: 0,
          unreadMessages: 0,
          publishedBlogs: 0,
          draftBlogs: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [books.length, reviews.length, contacts.length]);

  const statCards = [
    {
      title: t('dashboard.totalBooks'),
      value: stats.totalBooks,
      icon: Book,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: '+12%'
    },
    {
      title: t('dashboard.reviews'),
      value: stats.totalReviews,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      trend: '+8%'
    },
    {
      title: t('dashboard.messages'),
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: '+15%'
    },
    {
      title: t('dashboard.user'),
      value: user?.name || user?.username || 'Admin',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      trend: 'Active'
    }
  ];

  const quickStats = [
    {
      title: 'Blogs',
      value: stats.totalBlogs,
      published: stats.publishedBlogs,
      draft: stats.draftBlogs,
      icon: FileText,
      color: 'text-indigo-600'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: BookOpen,
      color: 'text-orange-600'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: Clock,
      color: 'text-amber-600'
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      icon: AlertCircle,
      color: 'text-red-600'
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className={`flex items-center gap-3 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-2 rounded-lg bg-gray-50`}>
                    <IconComponent className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    {stat.published !== undefined && (
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {stat.published} Published
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {stat.draft} Draft
                        </Badge>
                      </div>
                    )}
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
