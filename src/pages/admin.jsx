import React, { useState } from 'react';
import { navigate } from 'gatsby';
import { Book, Users, MessageSquare, Star, BarChart3, TrendingUp, Clock, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AuthorsSection } from '../components/admin/AuthorsSection';
import { CategoriesSection } from '../components/admin/CategoriesSection';
import { BooksSection } from '../components/admin/BooksSection';
import { CoursesSection } from '../components/admin/CoursesSection';
import { EnrollmentsSection } from '../components/admin/EnrollmentsSection';
import { MagazinesSection } from '../components/admin/MagazinesSection';
import ReviewsManagementPage from '../components/admin/ReviewsManagementPage';
import ContactMessagesPage from '../components/admin/ContactMessagesPage';
import TrainingBooksSection from '../components/admin/TrainingBooksSection';
import TrainingRequestsSection from '../components/admin/TrainingRequestsSection';
import TrainingFollowUpRequestsSection from '../components/admin/TrainingFollowUpRequestsSection';
import CalendarSection from '../components/admin/CalendarSection';
import { UserManagementSection } from '../components/admin/UserManagementSection';
import { useBookstore } from '../context/BookstoreContext';
import { useToast } from '../hooks/use-toast';
import Layout from '../components/layout';

const AdminDashboard = () => {
  const {
    books,
    reviews,
    contacts,
    isAdmin,
    deleteReview
  } = useBookstore();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('dashboard');

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }


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
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/admin/login');
    }
  };

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'authors':
        return <AuthorsSection />;
      case 'categories':
        return <CategoriesSection />;
      case 'books':
        return <BooksSection />;
      case 'courses':
        return <CoursesSection />;
      case 'enrollments':
        return <EnrollmentsSection />;
      case 'magazines':
        return <MagazinesSection />;
      case 'reviews':
        return <ReviewsManagementPage />;
      case 'contact-messages':
        return <ContactMessagesPage />;
      case 'training-books':
        return <TrainingBooksSection />;
      case 'training-requests':
        return <TrainingRequestsSection />;
      case 'training-followup-requests':
        return <TrainingFollowUpRequestsSection />;
      case 'messages':
        return renderContactMessages();
      case 'calendar':
        return <CalendarSection />;
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-theme-base">
            Publishing House Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Welcome back! Here's an overview of your publishing house.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20 hover:shadow-elegant transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Books</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-theme-base to-theme-primary bg-clip-text text-transparent">
                  {books.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +2 this month
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-theme-base/20 to-theme-primary/20">
                <Book className="h-8 w-8 text-theme-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20 hover:shadow-elegant transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Authors</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-theme-base to-theme-primary bg-clip-text text-transparent">
                  {[...new Set(books.map(book => book.author))].length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Active authors
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-theme-base/20 to-theme-primary/20">
                <Users className="h-8 w-8 text-theme-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20 hover:shadow-elegant transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-theme-base to-theme-primary bg-clip-text text-transparent">
                  {reviews.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <Star className="h-3 w-3 inline mr-1" />
                  Avg 4.5 rating
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-theme-base/20 to-theme-primary/20">
                <Star className="h-8 w-8 text-theme-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20 hover:shadow-elegant transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-theme-base to-theme-primary bg-clip-text text-transparent">
                  {contacts.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <MessageSquare className="h-3 w-3 inline mr-1" />
                  Customer inquiries
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-theme-base/20 to-theme-primary/20">
                <MessageSquare className="h-8 w-8 text-theme-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-muted/30">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {books.slice(0, 5).map((book) => (
                <div key={book.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-12 rounded-md overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{book.title}</p>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <Badge variant="secondary" className="bg-theme-light text-theme-primary">
                    {book.category}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-muted/30">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => {
                const book = books.find(b => b.id === review.bookId);
                return (
                  <div key={review.id} className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="font-medium text-foreground">{review.name}</p>
                      <div className="flex items-center">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{book?.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContactMessages = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Contact Messages</h2>
        <p className="text-muted-foreground">Customer inquiries and feedback</p>
      </div>
      <div className="space-y-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="border-l-4 border-l-theme-base shadow-modern bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">{contact.name}</h4>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                  {contact.bookTitle && (
                    <Badge variant="outline" className="mt-1 border-theme-primary/20 text-theme-primary">
                      Book: {contact.bookTitle}
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{contact.date}</span>
              </div>
              <p className="text-muted-foreground">{contact.message}</p>
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
    </div>
  );

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
          <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-14 md:h-16 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
              <div className="flex h-full items-center px-4 md:px-6 gap-4">
                <SidebarTrigger className="text-sidebar-foreground" />
                <div className="flex-1" />
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Welcome back, Admin</span>
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
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              {renderDashboardContent()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </Layout>
  );
};

export default AdminDashboard;