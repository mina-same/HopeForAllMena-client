import React, { useState, useEffect, useCallback } from 'react';
import { navigate, graphql } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import {
  LogOut,
  Menu
} from 'lucide-react';
import { reviewsAPI } from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { SidebarProvider } from '../components/ui/sidebar';
import { Sheet, SheetContent } from '../components/ui/sheet';
import { AuthorsSection } from '../components/admin/AuthorsSection';
import { CategoriesSection } from '../components/admin/CategoriesSection';
import { BooksSection } from '../components/admin/BooksSection';
import { CoursesSection } from '../components/admin/CoursesSection';
import { EnrollmentsSection } from '../components/admin/EnrollmentsSection';
import { MagazinesSection } from '../components/admin/MagazinesSection';
import { ReviewsSection } from '../components/admin/ReviewsSection';
import { ContactMessagesSection } from '../components/admin/ContactMessagesSection';
import ContactMessagesPage from '../components/admin/ContactMessagesPage';
import TrainingBooksSection from '../components/admin/TrainingBooksSection';
import TrainingRequestsSection from '../components/admin/TrainingRequestsSection';
import DashboardOverview from '../components/admin/DashboardOverview';
import TrainingFollowUpRequestsSection from '../components/admin/TrainingFollowUpRequestsSection';
import CalendarSection from '../components/admin/CalendarSection';
import { UserManagementSection } from '../components/admin/UserManagementSection';
import IDCardGenerator from '../components/admin/IdManagment';
import AnalyticsManagement from '../components/admin/AnalyticsManngment';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import AllBlogs from '../components/admin/AllBlogs';
import NewBlog from '../components/admin/NewBlog';
import EditBlog from '../components/admin/EditBlog';
import CommentsManagement from '../components/admin/CommentsManagement';
import ProtectedRoute from '../components/auth/ProtectedRoute.js';
import { useAuth } from '../context/AuthContext.js';
import { useBookstore } from '../context/BookstoreContext';
import { CourseProvider } from '../context/CourseContext';
import { CalendarProvider } from '../context/CalendarContext';
import { useToast } from '../hooks/use-toast.jsx';
import { useSidebar } from '../components/ui/sidebar';
import Layout from '../components/layout.jsx';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import contactMessageService from '../services/contactMessageService';
import '../styles/admin-rtl.css';

const AdminDashboardInner = () => {
  const { t, i18n } = useTranslation('Admin');
  const currentLanguage = i18n.language;
  // Use the sidebar context for proper mobile handling
  const { openMobile, setOpenMobile, isMobile } = useSidebar();
  // Hide sidebar by default on mobile/tablet, show on desktop
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize mobile sidebar state and desktop sidebar visibility
  React.useEffect(() => {
    if (isMobile && openMobile === undefined) {
      setOpenMobile(false);
    }
    // Set sidebar open by default on desktop, closed on mobile/tablet
    if (isMobile !== undefined) {
      setSidebarOpen(!isMobile);
    }
  }, [isMobile, openMobile, setOpenMobile]);
  const [activeSection, setActiveSection] = useState(() => {
    // Initialize from URL on first load
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('section') || 'dashboard';
    }
    return 'dashboard';
  });
  const [editBlogId, setEditBlogId] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  useBookstore();
  const { user, logout, hasAnyPermission } = useAuth();
  const { toast } = useToast();
  const [, setUnreadMessagesCount] = useState(0);
  const [, setPendingReviewsCount] = useState(0);

  // Define permission mappings for each section
  const sectionPermissions = {
    dashboard: ['books', 'authors', 'categories', 'reviews', 'courses', 'enrollments', 'magazines', 'training', 'analytics', 'users', 'user-management', 'contact-messages', 'training-books', 'training-requests', 'training-followup-requests', 'calendar', 'generate-ids', 'blogs'],
    analytics: ['analytics'],
    messages: ['contact-messages'],
    calendar: ['calendar'],
    'user-management': ['users', 'user-management'],
    authors: ['authors'],
    categories: ['categories'],
    books: ['books'],
    reviews: ['reviews'],
    'contact-messages': ['contact-messages'],
    courses: ['courses'],
    enrollments: ['enrollments'],
    magazines: ['magazines'],
    'training-books': ['training-books'],
    'training-requests': ['training-requests'],
    'training-followup-requests': ['training-followup-requests'],
    'generate-ids': ['generate-ids'],
    'new-blog': ['blogs'],
    'all-blogs': ['blogs'],
    'edit-blog': ['blogs'],
    'blog-comments': ['blogs'],
    'tutorial-videos': ['blogs']
  };

  // Check if user has permission for a specific section
  const hasSectionPermission = useCallback((sectionId) => {
    const requiredPermissions = sectionPermissions[sectionId] || [];
    return hasAnyPermission(requiredPermissions);
  }, [hasAnyPermission, sectionPermissions]);

  // Fetch unread messages and pending reviews count
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const promises = [];

        // Fetch unread messages if user has permission
        if (hasSectionPermission('contact-messages')) {
          promises.push(
            Promise.all([
              contactMessageService.getContactMessages({ status: 'new' }),
              contactMessageService.getContactMessages({ status: 'unread' })
            ]).then(([newResponse, unreadResponse]) => {
              const totalUnread = newResponse.data.pagination.totalMessages + unreadResponse.data.pagination.totalMessages;
              setUnreadMessagesCount(totalUnread);
            })
          );
        }

        // Fetch pending reviews if user has permission
        if (hasSectionPermission('reviews')) {
          promises.push(
            reviewsAPI.getReviews({ status: 'pending', limit: 1 }).then(response => {
              if (response.status === 'success') {
                setPendingReviewsCount(response.data.pagination.totalReviews || 0);
              }
            })
          );
        }

        await Promise.all(promises);
      } catch (error) {
        console.error('Failed to fetch notification counts:', error);
      }
    };

    fetchCounts();
    // Refresh counts every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [hasSectionPermission]);


  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to logout properly. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  // Handle URL-based routing for sections and edit blog (runs once on mount)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const sectionFromUrl = params.get('section');
      
      // Check for blog edit URL pattern
      const editMatch = path.match(/\/admin\/blog\/edit\/([a-f\d]{24})/);

      if (editMatch) {
        const blogId = editMatch[1];
        setEditBlogId(blogId);
        setActiveSection('edit-blog');
      } else if (sectionFromUrl) {
        // Update active section from URL parameter
        setActiveSection(sectionFromUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when section changes
  useEffect(() => {
    if (typeof window !== 'undefined' && activeSection !== 'edit-blog') {
      const currentParams = new URLSearchParams(window.location.search);
      const currentSection = currentParams.get('section');
      
      // Only update URL if section has changed
      if (currentSection !== activeSection) {
        const newUrl = activeSection === 'dashboard' 
          ? '/admin' 
          : `/admin?section=${activeSection}`;
        window.history.pushState({}, '', newUrl);
      }
    }
  }, [activeSection]);

  const handleBackToBlogs = () => {
    setEditBlogId(null);
    setActiveSection('all-blogs');
    // URL will be updated automatically by the useEffect
  };

  const renderDashboardContent = () => {
    // Check if user has permission for the current section
    if (!hasSectionPermission(activeSection)) {
      return (
        <div className="space-y-6" dir={i18n?.resolvedLanguage === 'ar' ? 'rtl' : 'ltr'}>
          <div>
            <h2 className={`text-2xl font-bold text-foreground ${i18n?.resolvedLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('dashboard.accessDenied')}</h2>
            <p className={`text-muted-foreground ${i18n?.resolvedLanguage === 'ar' ? 'text-right' : 'text-left'}`}>You don't have permission to access this section.</p>
          </div>
          <Card className="border-0 shadow-modern">
            <CardContent className="text-center py-12">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-lg font-semibold mb-2">{t('dashboard.insufficientPermissions')}</h3>
              <p className="text-muted-foreground">
                {t('dashboard.needPermissions')} {sectionPermissions[activeSection]?.join(', ')}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    switch (activeSection) {
      case 'authors':
        return <AuthorsSection />;
      case 'categories':
        return <CategoriesSection />;
      case 'books':
        return <BooksSection />;
      case 'courses':
        return (
          <CourseProvider>
            <CoursesSection />
          </CourseProvider>
        );
      case 'enrollments':
        return (
          <CourseProvider>
            <EnrollmentsSection />
          </CourseProvider>
        );
      case 'magazines':
        return <MagazinesSection />;
      case 'reviews':
        return <ReviewsSection />;
      case 'contact-messages':
        return <ContactMessagesSection />;
      case 'training-books':
        return <TrainingBooksSection />;
      case 'training-requests':
        return (
          <CalendarProvider>
            <TrainingRequestsSection />
          </CalendarProvider>
        );
      case 'training-followup-requests':
        return <TrainingFollowUpRequestsSection />;
      case 'messages':
        return <ContactMessagesPage />;
      case 'calendar':
        return (
          <CalendarProvider>
            <CalendarSection />
          </CalendarProvider>
        );
      case 'user-management':
        return <UserManagementSection />;
      case 'generate-ids':
        return <IDCardGenerator />;
      case 'analytics':
        return renderAnalytics();
      case 'new-blog':
        return <NewBlog />;
      case 'all-blogs':
        return <AllBlogs />;
      case 'edit-blog':
        return editBlogId ? <EditBlog blogId={editBlogId} onBack={handleBackToBlogs} /> : <AllBlogs />;
      case 'blog-comments':
        return <CommentsManagement />;
      case 'tutorial-videos':
        return renderTutorialVideos();
      default:
        return renderMainDashboard();
    }
  };

  const renderMainDashboard = () => <DashboardOverview />;


  const renderAnalytics = () => <AnalyticsManagement />;


  const renderTutorialVideos = () => (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('dashboard.tutorialVideos')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('dashboard.tutorialVideosSubtitle')}
        </p>
      </div>

      {/* Video Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className={`flex items-center gap-4 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className="p-3 rounded-xl bg-red-50">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {t('dashboard.gettingStarted')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.gettingStartedDesc')}
                </p>
                <Badge variant="outline" className="mt-2">
                  0 {t('dashboard.videos')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className={`flex items-center gap-4 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className="p-3 rounded-xl bg-blue-50">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {t('dashboard.contentManagement')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.contentManagementDesc')}
                </p>
                <Badge variant="outline" className="mt-2">
                  0 {t('dashboard.videos')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className={`flex items-center gap-4 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className="p-3 rounded-xl bg-green-50">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {t('dashboard.analytics')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.analyticsDesc')}
                </p>
                <Badge variant="outline" className="mt-2">
                  0 {t('dashboard.videos')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className={`flex items-center gap-4 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className="p-3 rounded-xl bg-purple-50">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {t('dashboard.userManagement')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.userManagementDesc')}
                </p>
                <Badge variant="outline" className="mt-2">
                  0 {t('dashboard.videos')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className={`flex items-center gap-4 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className="p-3 rounded-xl bg-orange-50">
                <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {t('dashboard.training')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.trainingDesc')}
                </p>
                <Badge variant="outline" className="mt-2">
                  0 {t('dashboard.videos')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className={`flex items-center gap-4 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className="p-3 rounded-xl bg-indigo-50">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {t('dashboard.advancedFeatures')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.advancedFeaturesDesc')}
                </p>
                <Badge variant="outline" className="mt-2">
                  0 {t('dashboard.videos')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Notice */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="text-center py-12">
          <div className="p-4 rounded-full bg-red-50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {t('dashboard.tutorialVideosComingSoon')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t('dashboard.tutorialVideosComingSoonDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {t('dashboard.videoCategories')}: 6
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {t('dashboard.totalVideos')}: 0
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {t('dashboard.estimatedDuration')}: 0 {t('dashboard.minutes')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      {i18n?.resolvedLanguage === 'ar' ? (
        /* Arabic Layout */
        <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted/30 flex" dir="rtl">
          {/* Sidebar for Arabic - using proper Sidebar component */}
          {isMobile ? (
            <Sheet open={openMobile || false} onOpenChange={setOpenMobile}>
              <SheetContent
                side="right"
                className="w-64 p-0 bg-gray-100 dark:bg-gray-900 overflow-y-auto"
                dir="rtl"
              >
                <AdminSidebar
                  activeSection={activeSection}
                  onSectionChange={(section) => {
                    setActiveSection(section);
                    setOpenMobile(false); // Close mobile sidebar after selection
                  }}
                />
              </SheetContent>
            </Sheet>
          ) : (
            <div
              className="h-screen bg-gray-100 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 fixed right-0 top-0 z-50 overflow-y-auto transition-all duration-300 w-64"
              style={{
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
                opacity: sidebarOpen ? 1 : 0,
                visibility: sidebarOpen ? 'visible' : 'hidden'
              }}
            >
              <AdminSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>
          )}

          {/* Main Content Area with margin for sidebar */}
          <div
            className="min-h-screen transition-all duration-300"
            style={{
              marginRight: !isMobile && sidebarOpen ? '256px' : '0px',
              width: !isMobile && sidebarOpen ? 'calc(100% - 256px)' : '100vw',
              marginLeft: '0px'
            }}
          >
            {/* Header */}
            <header className="h-14 md:h-16 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40" dir="rtl">
              <div className={`flex h-full items-center px-4 md:px-6 gap-4 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                {/* Far left: Logout button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors flex items-center"
                >
                  <span className="hidden sm:inline ml-2">{t('modal.logout')}</span>
                  <LogOut className="h-4 w-4" />
                </Button>

                {/* Middle-left: Other items */}
                <div className="flex items-center gap-4">
                  <LanguageSwitcher variant="admin" className="hidden sm:flex" />
                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{t('header.welcomeBack')}, {user?.name || user?.username || 'Admin'}</span>
                  </div>
                </div>

                <div className="flex-1" />

                {/* Far right: Toggle menu */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => isMobile ? setOpenMobile(!openMobile) : setSidebarOpen(!sidebarOpen)}
                  className="text-sidebar-foreground"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 overflow-auto w-full text-right" dir="rtl">
              {renderDashboardContent()}
            </main>
          </div>

          {/* Logout Confirmation Modal */}
          <ConfirmationModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={confirmLogout}
            title={t('modal.confirmLogout')}
            description={t('modal.logoutDescription')}
            confirmText={t('modal.logout')}
            cancelText={t('modal.cancel')}
            variant="warning"
            isLoading={isLoggingOut}
            icon={
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 border-yellow-200 border-2">
                <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            }
          />
        </div>
      ) : (
        /* English Layout - Custom with SidebarProvider */
        <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted/30 flex" dir="ltr">
          {/* Sidebar for English - using proper Sidebar component */}
          {isMobile ? (
            <Sheet open={openMobile || false} onOpenChange={setOpenMobile}>
              <SheetContent
                side="left"
                className="w-64 p-0 bg-gray-100 dark:bg-gray-900 overflow-y-auto"
              >
                <AdminSidebar
                  activeSection={activeSection}
                  onSectionChange={(section) => {
                    setActiveSection(section);
                    setOpenMobile(false); // Close mobile sidebar after selection
                  }}
                />
              </SheetContent>
            </Sheet>
          ) : (
            <div
              className="h-screen bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 z-50 overflow-y-auto transition-all duration-300 w-64"
              style={{
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                opacity: sidebarOpen ? 1 : 0,
                visibility: sidebarOpen ? 'visible' : 'hidden'
              }}
            >
              <AdminSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>
          )}

          {/* Main Content Area with margin for sidebar */}
          <div
            className="min-h-screen transition-all duration-300"
            style={{
              marginLeft: !isMobile && sidebarOpen ? '256px' : '0px',
              width: !isMobile && sidebarOpen ? 'calc(100% - 256px)' : '100vw',
              marginRight: '0px'
            }}
          >
            {/* Header */}
            <header className="h-14 md:h-16 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40" dir="ltr">
              <div className={`flex h-full items-center px-4 md:px-6 gap-4 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                {/* Left side items */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => isMobile ? setOpenMobile(!openMobile) : setSidebarOpen(!sidebarOpen)}
                  className="text-sidebar-foreground"
                >
                  <Menu className="h-4 w-4" />
                </Button>

                <div className="flex-1" />

                {/* Right side items */}
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{t('header.welcomeBack')}, {user?.name || user?.username || 'Admin'}</span>
                  </div>
                  <LanguageSwitcher variant="admin" className="hidden sm:flex" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{t('modal.logout')}</span>
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 overflow-auto w-full text-left" dir="ltr">
              {renderDashboardContent()}
            </main>
          </div>

          {/* Logout Confirmation Modal */}
          <ConfirmationModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={confirmLogout}
            title={t('modal.confirmLogout')}
            description={t('modal.logoutDescription')}
            confirmText={t('modal.logout')}
            cancelText={t('modal.cancel')}
            variant="warning"
            isLoading={isLoggingOut}
            icon={
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 border-yellow-200 border-2">
                <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            }
          />
        </div>
      )}
    </>
  );
};

const AdminDashboardContent = () => {
  return (
    <SidebarProvider>
      <AdminDashboardInner />
    </SidebarProvider>
  );
};

const AdminDashboard = () => {
  return (
    <ProtectedRoute
      requireAuth={true}
      requiredPermissions={['books', 'authors', 'categories', 'reviews', 'courses', 'enrollments', 'magazines', 'training', 'analytics', 'settings', 'users', 'user-management', 'contact-messages', 'training-books', 'training-requests', 'training-followup-requests', 'calendar', 'generate-ids']}
    >
      <Layout pageTitle="Admin Dashboard || Hope for All Mena || Charity React Next Template">
        <AdminDashboardContent />
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;