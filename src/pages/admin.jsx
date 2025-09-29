import React, { useState, useEffect } from 'react';
import { navigate, graphql } from 'gatsby';
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next';
import {
  BarChart3,
  Book,
  Calendar,
  ChevronRight,
  CreditCard,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquare,
  Plus,
  Settings,
  Star,
  Users,
  UserCheck,
  BookOpen,
  ShieldCheck,
  Edit3,
  LibraryBig
} from 'lucide-react';
import { reviewsAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { SidebarProvider, SidebarTrigger, SidebarInset, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '../components/ui/sidebar';
import { Sheet, SheetContent } from '../components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
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
  const { toggleSidebar, openMobile, setOpenMobile, isMobile } = useSidebar();
  // Hide sidebar by default on mobile/tablet, show on desktop
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize mobile sidebar state
  React.useEffect(() => {
    if (isMobile && openMobile === undefined) {
      setOpenMobile(false);
    }
  }, [isMobile, openMobile, setOpenMobile]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [editBlogId, setEditBlogId] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {
    books,
    reviews,
    contacts,
    deleteReview
  } = useBookstore();
  const { user, logout, hasAnyPermission } = useAuth();
  const { toast } = useToast();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);

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
  }, []);

  // Define permission mappings for each section
  const sectionPermissions = {
    dashboard: ['books', 'authors', 'categories', 'reviews', 'courses', 'enrollments', 'magazines', 'training', 'analytics', 'settings', 'users', 'user-management', 'contact-messages', 'training-books', 'training-requests', 'training-followup-requests', 'calendar', 'generate-ids', 'blogs'],
    analytics: ['analytics'],
    messages: ['contact-messages'],
    calendar: ['calendar'],
    'user-management': ['users', 'user-management'],
    settings: ['settings'],
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
    'blog-comments': ['blogs']
  };

  // Check if user has permission for a specific section
  const hasSectionPermission = (sectionId) => {
    const requiredPermissions = sectionPermissions[sectionId] || [];
    return hasAnyPermission(requiredPermissions);
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
      toast({
        title: "Review Deleted",
        description: "The review has been removed.",
      });
    }
  };

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

  // Handle URL-based routing for edit blog
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const editMatch = path.match(/\/admin\/blog\/edit\/([a-f\d]{24})/);

      if (editMatch) {
        const blogId = editMatch[1];
        setEditBlogId(blogId);
        setActiveSection('edit-blog');
      }
    }
  }, []);

  const handleBackToBlogs = () => {
    setEditBlogId(null);
    setActiveSection('all-blogs');
    // Update URL without page reload
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/admin');
    }
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
      case 'settings':
        return renderSettings();
      case 'new-blog':
        return <NewBlog />;
      case 'all-blogs':
        return <AllBlogs />;
      case 'edit-blog':
        return editBlogId ? <EditBlog blogId={editBlogId} onBack={handleBackToBlogs} /> : <AllBlogs />;
      case 'blog-comments':
        return <CommentsManagement />;
      default:
        return renderMainDashboard();
    }
  };

  const renderMainDashboard = () => (
    <div className="space-y-6" dir={i18n?.resolvedLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div>
        <h2 className={`text-2xl font-bold text-foreground ${i18n?.resolvedLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('dashboard.title')}</h2>
        <p className={`text-muted-foreground ${i18n?.resolvedLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('dashboard.subtitle')}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hasSectionPermission('books') && (
          <Card className="border-0 shadow-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-muted-foreground ${i18n?.resolvedLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('dashboard.totalBooks')}</p>
                  <p className="text-2xl font-bold">{books.length}</p>
                </div>
                <Book className="h-8 w-8 text-[#2194D1]" />
              </div>
            </CardContent>
          </Card>
        )}

        {hasSectionPermission('reviews') && (
          <Card className="border-0 shadow-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-muted-foreground ${i18n?.resolvedLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('dashboard.reviews')}</p>
                  <p className="text-2xl font-bold">{reviews.length}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        )}

        {hasSectionPermission('contact-messages') && (
          <Card className="border-0 shadow-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-muted-foreground ${i18n?.resolvedLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('dashboard.messages')}</p>
                  <p className="text-2xl font-bold">{contacts.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-modern">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium text-muted-foreground ${i18n?.resolvedLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('dashboard.user')}</p>
                <p className="text-2xl font-bold">{user?.name || user?.username || 'Admin'}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {hasSectionPermission('contact-messages') && contacts.length > 0 && (
        <Card className="border-0 shadow-modern">
          <CardHeader>
            <CardTitle className={i18n?.resolvedLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('dashboard.recentMessages')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts.slice(0, 3).map((contact, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.date}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{contact.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderContactMessages = () => {
    if (!hasSectionPermission('contact-messages')) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Messages</h2>
            <p className="text-muted-foreground">Access denied</p>
          </div>
          <Card className="border-0 shadow-modern">
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">You don't have permission to view messages.</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Contact Messages</h2>
          <p className="text-muted-foreground">Manage incoming messages from visitors</p>
        </div>
        {contacts.map((contact, index) => (
          <Card key={index} className="border-0 shadow-modern">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{contact.name}</h3>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                </div>
                {contact.bookTitle && (
                  <Badge variant="secondary" className="ml-2">
                    Book: {contact.bookTitle}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{contact.message}</p>
              <div className="mt-4 text-sm text-muted-foreground">{contact.date}</div>
            </CardContent>
          </Card>
        ))}
        {contacts.length === 0 && (
          <Card className="border-0 shadow-modern">
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No contact messages yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderAnalytics = () => <AnalyticsManagement />;

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your publishing house preferences</p>
      </div>
      <Card className="border-0 shadow-modern">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Settings panel coming soon...</p>
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
      <Layout pageTitle="Admin Dashboard || Azino || Charity React Next Template">
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