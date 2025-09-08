import React, { useState } from 'react';
import { navigate } from 'gatsby';
import { Book, Users, MessageSquare, Star, BarChart3, TrendingUp, Clock, LogOut, Home, GraduationCap, Calendar, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { SidebarProvider, SidebarTrigger, SidebarInset, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '../components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import { LibraryBig, FolderOpen, ChevronRight, ShieldCheck, UserCheck, BookOpen } from 'lucide-react';
import { AuthorsSection } from '../components/admin/AuthorsSection';
import { CategoriesSection } from '../components/admin/CategoriesSection';
import { BooksSection } from '../components/admin/BooksSection';
import { CoursesSection } from '../components/admin/CoursesSection';
import { EnrollmentsSection } from '../components/admin/EnrollmentsSection';
import { MagazinesSection } from '../components/admin/MagazinesSection';
import { ReviewsSection } from '../components/admin/ReviewsSection';
import { ContactMessagesSection } from '../components/admin/ContactMessagesSection';
import TrainingBooksSection from '../components/admin/TrainingBooksSection';
import TrainingRequestsSection from '../components/admin/TrainingRequestsSection';
import TrainingFollowUpRequestsSection from '../components/admin/TrainingFollowUpRequestsSection';
import CalendarSection from '../components/admin/CalendarSection';
import { UserManagementSection } from '../components/admin/UserManagementSection';
import ProtectedRoute from '../components/auth/ProtectedRoute.js';
import { useAuth } from '../context/AuthContext.js';
import { useBookstore } from '../context/BookstoreContext';
import { CourseProvider } from '../context/CourseContext';
import { CalendarProvider } from '../context/CalendarContext';
import { useToast } from '../hooks/use-toast.jsx';
import Layout from '../components/layout.jsx';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const AdminDashboardContent = () => {
  const {
    books,
    reviews,
    contacts,
    deleteReview
  } = useBookstore();
  const { user, logout, hasAnyPermission } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Define permission mappings for each section
  const sectionPermissions = {
    dashboard: ['books', 'authors', 'categories', 'reviews', 'courses', 'enrollments', 'magazines', 'training', 'analytics', 'settings', 'users', 'user-management', 'contact-messages', 'training-books', 'training-requests', 'training-followup-requests', 'calendar'],
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
    'training-followup-requests': ['training-followup-requests']
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

  const renderDashboardContent = () => {
    // Check if user has permission for the current section
    if (!hasSectionPermission(activeSection)) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this section.</p>
          </div>
          <Card className="border-0 shadow-modern">
            <CardContent className="text-center py-12">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-lg font-semibold mb-2">Insufficient Permissions</h3>
              <p className="text-muted-foreground">
                You need the following permissions to access this section: {sectionPermissions[activeSection]?.join(', ')}
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
        return renderContactMessages();
      case 'calendar':
        return (
          <CalendarProvider>
            <CalendarSection />
          </CalendarProvider>
        );
      case 'user-management':
        return <UserManagementSection />;
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderMainDashboard();
    }
  };

  const renderMainDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to your publishing house management dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hasSectionPermission('books') && (
          <Card className="border-0 shadow-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Books</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Reviews</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Messages</p>
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
                <p className="text-sm font-medium text-muted-foreground">User</p>
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
            <CardTitle>Recent Messages</CardTitle>
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics & Reports</h2>
        <p className="text-muted-foreground">Insights into your publishing house performance</p>
      </div>
      <Card className="border-0 shadow-modern">
        <CardContent className="text-center py-12">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );

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
    <Layout pageTitle="Admin Dashboard || Azino || Charity React Next Template">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/30">
          <Sidebar className="border-r border-sidebar-border bg-sidebar">
            <SidebarHeader className="border-b border-sidebar-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#2194D1] to-[#2194D1]/80 shadow-lg">
                  <LibraryBig className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-theme-base">Admin Panel</h2>
                  <p className="text-sm text-[#2194D1]/80">Publishing House</p>
                  {user && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.name || user.username || user.email}
                    </p>
                  )}
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
              {/* Main Navigation */}
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {[
                      { title: 'Dashboard', icon: Home, id: 'dashboard' },
                      { title: 'Analytics', icon: BarChart3, id: 'analytics' },
                      { title: 'Messages', icon: MessageSquare, id: 'messages' },
                      { title: 'Calendar', icon: Calendar, id: 'calendar' },
                      { title: 'User Management', icon: ShieldCheck, id: 'user-management' },
                      { title: 'Settings', icon: Settings, id: 'settings' }
                    ].filter(item => hasSectionPermission(item.id)).map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => setActiveSection(item.id)}
                          isActive={activeSection === item.id}
                          className="w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all duration-200"
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium whitespace-nowrap">{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Management Sections */}
              <SidebarGroup className="space-y-0">
                <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wide px-2 py-2">
                  Management Links
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {/* Books & Publishing */}
                    <SidebarMenuItem>
                      <Collapsible defaultOpen={true}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all duration-200 [&[data-state=open]>svg:last-child]:rotate-90 hover:bg-[#2194D1]">
                            <LibraryBig className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium whitespace-nowrap">Books & Publishing</span>
                            <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0 transition-transform duration-200" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {[
                              { title: 'Authors', icon: Users, id: 'authors' },
                              { title: 'Categories', icon: FolderOpen, id: 'categories' },
                              { title: 'Books', icon: Book, id: 'books' },
                              { title: 'Reviews', icon: Star, id: 'reviews' },
                              { title: 'Contact Messages', icon: MessageSquare, id: 'contact-messages' }
                            ].filter(item => hasSectionPermission(item.id)).map((item) => (
                              <SidebarMenuSubItem key={item.id}>
                                <SidebarMenuSubButton
                                  onClick={() => setActiveSection(item.id)}
                                  isActive={activeSection === item.id}
                                  className="w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all duration-200"
                                >
                                  <item.icon className="h-4 w-4 flex-shrink-0" />
                                  <span className="whitespace-nowrap">{item.title}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>

                    {/* Courses */}
                    <SidebarMenuItem>
                      <Collapsible defaultOpen={true}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all duration-200 [&[data-state=open]>svg:last-child]:rotate-90 hover:bg-[#2194D1]">
                            <GraduationCap className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium whitespace-nowrap">Courses</span>
                            <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0 transition-transform duration-200" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {[
                              { title: 'Courses', icon: GraduationCap, id: 'courses' },
                              { title: 'Enrollments', icon: UserCheck, id: 'enrollments' }
                            ].filter(item => hasSectionPermission(item.id)).map((item) => (
                              <SidebarMenuSubItem key={item.id}>
                                <SidebarMenuSubButton
                                  onClick={() => setActiveSection(item.id)}
                                  isActive={activeSection === item.id}
                                  className="w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all duration-200"
                                >
                                  <item.icon className="h-4 w-4 flex-shrink-0" />
                                  <span className="whitespace-nowrap">{item.title}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>

                    {/* Magazines */}
                    <SidebarMenuItem>
                      <Collapsible defaultOpen={true}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all duration-200 [&[data-state=open]>svg:last-child]:rotate-90 hover:bg-[#2194D1]">
                            <BookOpen className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium whitespace-nowrap">Magazine Management</span>
                            <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0 transition-transform duration-200" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {[
                              { title: 'Magazines', icon: BookOpen, id: 'magazines' }
                            ].filter(item => hasSectionPermission(item.id)).map((item) => (
                              <SidebarMenuSubItem key={item.id}>
                                <SidebarMenuSubButton
                                  onClick={() => setActiveSection(item.id)}
                                  isActive={activeSection === item.id}
                                  className="w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all duration-200"
                                >
                                  <item.icon className="h-4 w-4 flex-shrink-0" />
                                  <span className="whitespace-nowrap">{item.title}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>

                    {/* Training */}
                    <SidebarMenuItem>
                      <Collapsible defaultOpen={true}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all duration-200 [&[data-state=open]>svg:last-child]:rotate-90 hover:bg-[#2194D1]">
                            <GraduationCap className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium whitespace-nowrap">Training Management</span>
                            <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0 transition-transform duration-200" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {[
                              { title: 'Training Books', icon: Book, id: 'training-books' },
                              { title: 'Training Requests', icon: Users, id: 'training-requests' },
                              { title: 'Training Follow-up', icon: GraduationCap, id: 'training-followup-requests' }
                            ].filter(item => hasSectionPermission(item.id)).map((item) => (
                              <SidebarMenuSubItem key={item.id}>
                                <SidebarMenuSubButton
                                  onClick={() => setActiveSection(item.id)}
                                  isActive={activeSection === item.id}
                                  className="w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all duration-200"
                                >
                                  <item.icon className="h-4 w-4 flex-shrink-0" />
                                  <span className="whitespace-nowrap">{item.title}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset>
            {/* Header */}
            <header className="h-14 md:h-16 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
              <div className="flex h-full items-center px-4 md:px-6 gap-4">
                <SidebarTrigger className="text-sidebar-foreground" />
                <div className="flex-1" />
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Welcome back, {user?.name || user?.username || 'Admin'}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 overflow-auto w-full">
              {renderDashboardContent()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need to sign in again to access the admin panel."
        confirmText="Logout"
        cancelText="Cancel"
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
    </Layout>
  );
};

const AdminDashboard = () => {
  return (
    <ProtectedRoute 
      requireAuth={true} 
      requiredPermissions={['books', 'authors', 'categories', 'reviews', 'courses', 'enrollments', 'magazines', 'training', 'analytics', 'settings', 'users', 'user-management', 'contact-messages', 'training-books', 'training-requests', 'training-followup-requests', 'calendar']}
    >
      <AdminDashboardContent />
    </ProtectedRoute>
  );
};

export default AdminDashboard;