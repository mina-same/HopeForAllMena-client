import React, { useState } from 'react';
import { useLocation } from '@reach/router';
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next';
import {
  Book,
  Users,
  FolderOpen,
  LibraryBig,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Home,
  Settings,
  MessageSquare,
  BarChart3,
  GraduationCap,
  UserCheck,
  BookOpen,
  Calendar,
  Star,
  ShieldCheck,
  CreditCard,
  FileText,
  Edit3,
  MessageCircle
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
} from '../ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export function AdminSidebar({ activeSection, onSectionChange }) {
  const [publishingHouseOpen, setPublishingHouseOpen] = useState(true);
  const [coursesOpen, setCoursesOpen] = useState(true);
  const [magazinesOpen, setMagazinesOpen] = useState(true);
  const [trainingOpen, setTrainingOpen] = useState(true);
  const [blogOpen, setBlogOpen] = useState(true);
  const { user, hasPermission, hasAnyPermission } = useAuth();
  const { t } = useTranslation('Admin');
  const { i18n } = useI18next();

  const isRTL = i18n?.resolvedLanguage === 'ar';
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  // Define permission mappings for each section - using actual permission names from seed data
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
    'blog-comments': ['blogs']
  };

  // Check if user has permission for a specific section
  const hasSectionPermission = (sectionId) => {
    const requiredPermissions = sectionPermissions[sectionId] || [];
    return hasAnyPermission(requiredPermissions);
  };

  // Filter main items based on permissions
  const mainItems = [
    {
      title: t('navigation.dashboard'),
      icon: Home,
      id: 'dashboard'
    },
    {
      title: t('navigation.analytics'),
      icon: BarChart3,
      id: 'analytics'
    },
    {
      title: t('navigation.messages'),
      icon: MessageSquare,
      id: 'messages'
    },
    {
      title: t('navigation.calendar'),
      icon: Calendar,
      id: 'calendar'
    },
    {
      title: t('navigation.userManagement'),
      icon: ShieldCheck,
      id: 'user-management'
    },
    {
      title: t('navigation.settings'),
      icon: Settings,
      id: 'settings'
    }
  ].filter(item => hasSectionPermission(item.id));

  const publishingHouseItems = [
    {
      title: t('items.authors'),
      icon: Users,
      id: 'authors'
    },
    {
      title: t('items.categories'),
      icon: FolderOpen,
      id: 'categories'
    },
    {
      title: t('items.books'),
      icon: Book,
      id: 'books'
    },
    {
      title: t('items.reviews'),
      icon: Star,
      id: 'reviews',
      unseenCount: 12
    },
    {
      title: t('items.contactMessages'),
      icon: MessageSquare,
      id: 'contact-messages',
      unseenCount: 5
    }
  ].filter(item => hasSectionPermission(item.id));

  const coursesItems = [
    {
      title: t('items.courses'),
      icon: GraduationCap,
      id: 'courses'
    },
    {
      title: t('items.enrollments'),
      icon: UserCheck,
      id: 'enrollments'
    }
  ].filter(item => hasSectionPermission(item.id));

  const magazineItems = [
    {
      title: t('items.magazines'),
      icon: BookOpen,
      id: 'magazines'
    }
  ].filter(item => hasSectionPermission(item.id));

  const trainingItems = [
    {
      title: t('items.trainingBooks'),
      icon: Book,
      id: 'training-books'
    },
    {
      title: t('items.trainingRequests'),
      icon: Users,
      id: 'training-requests'
    },
    {
      title: t('items.trainingFollowUp'),
      icon: GraduationCap,
      id: 'training-followup-requests'
    },
    {
      title: t('items.generateIds'),
      icon: CreditCard,
      id: 'generate-ids'
    }
  ].filter(item => hasSectionPermission(item.id));

  const blogItems = [
    {
      title: t('items.newBlog'),
      icon: Edit3,
      id: 'new-blog'
    },
    {
      title: t('items.allBlogs'),
      icon: FileText,
      id: 'all-blogs'
    },
    {
      title: t('items.comments'),
      icon: MessageCircle,
      id: 'blog-comments'
    }
  ].filter(item => hasSectionPermission(item.id));

  const handleItemClick = (id) => {
    onSectionChange(id);
  };

  // If user has no permissions, show a message
  if (!user || (!hasAnyPermission(['books', 'authors', 'categories', 'reviews', 'courses', 'enrollments', 'magazines', 'training', 'analytics', 'settings', 'users', 'user-management', 'contact-messages', 'training-books', 'training-requests', 'training-followup-requests', 'calendar', 'generate-ids']) && mainItems.length === 0)) {
    return (
      <Sidebar className={cn("border-sidebar-border bg-sidebar", isRTL ? "border-l" : "border-r")} dir={isRTL ? "rtl" : "ltr"}>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#2194D1] to-[#2194D1]/80 shadow-lg">
                <LibraryBig className="h-6 w-6 text-white" />
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <div className={cn("text-center text-muted-foreground", isRTL && "text-right")}>
              <ShieldCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t('sidebar.noPermissions')}</p>
              <p className="text-xs opacity-75">{t('sidebar.contactAdmin')}</p>
              {user && user.permissions && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">{t('sidebar.yourPermissions')}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {user.permissions.map((permission, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SidebarContent>
        </Sidebar>
    );
  }

  return (
    <Sidebar 
      className={cn(
        "border-sidebar-border bg-sidebar h-full w-full", 
        isRTL ? "border-l" : "border-r"
      )} 
      dir={isRTL ? "rtl" : "ltr"}>
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#2194D1] to-[#2194D1]/80 shadow-lg">
              <LibraryBig className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className={cn("text-lg font-semibold text-theme-base", isRTL && "text-right")}>{t('sidebar.title')}</h2>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-2">
          {/* Main Navigation */}
          {mainItems.length > 0 && (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => handleItemClick(item.id)}
                        isActive={activeSection === item.id}
                        className={cn(
                          "w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all duration-200"
                        )}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium whitespace-nowrap">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Management Sections */}
          <SidebarGroup className="space-y-0">
            <SidebarGroupLabel className={cn("text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wide px-2 py-2", isRTL && "text-right")}>
              {t('sidebar.managementLinks')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Books & Publishing */}
                {publishingHouseItems.length > 0 && (
                  <SidebarMenuItem>
                    <Collapsible open={publishingHouseOpen} onOpenChange={setPublishingHouseOpen}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "w-full bg-sidebar gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all duration-200 [&[data-state=open]>svg:last-child]:rotate-90",
                            "hover:bg-[#2194D1]",
                            isRTL ? "justify-end" : "justify-start"
                          )}
                        >
                          <LibraryBig className="h-4 w-4 flex-shrink-0" />
                          <span className={cn("font-medium whitespace-nowrap", isRTL && "text-right")}>{t('sections.booksPublishing')}</span>
                          <ChevronIcon className={cn("h-4 w-4 flex-shrink-0 transition-transform duration-200", isRTL ? "mr-auto" : "ml-auto")} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {publishingHouseItems.map((item) => (
                            <SidebarMenuSubItem key={item.id}>
                              <SidebarMenuSubButton
                                onClick={() => handleItemClick(item.id)}
                                isActive={activeSection === item.id}
                                className={cn(
                                  "w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all duration-200"
                                )}
                              >
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                <div className="flex items-center justify-between w-full min-w-0">
                                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>
                                  {'unseenCount' in item && item.unseenCount > 0 && (
                                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 font-medium shadow-sm ml-2 flex-shrink-0">
                                      {item.unseenCount}
                                    </div>
                                  )}
                                </div>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                )}

                {/* Course Management */}
                {coursesItems.length > 0 && (
                  <SidebarMenuItem>
                    <Collapsible open={coursesOpen} onOpenChange={setCoursesOpen}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "w-full bg-sidebar gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all duration-200 [&[data-state=open]>svg:last-child]:rotate-90",
                            "hover:bg-[#2194D1]",
                            isRTL ? "justify-end" : "justify-start"
                          )}
                        >
                          <GraduationCap className="h-4 w-4 flex-shrink-0" />
                          <span className={cn("font-medium whitespace-nowrap", isRTL && "text-right")}>{t('sections.courseManagement')}</span>
                          <ChevronIcon className={cn("h-4 w-4 flex-shrink-0 transition-transform duration-200", isRTL ? "mr-auto" : "ml-auto")} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {coursesItems.map((item) => (
                            <SidebarMenuSubItem key={item.id}>
                              <SidebarMenuSubButton
                                onClick={() => handleItemClick(item.id)}
                                isActive={activeSection === item.id}
                                className={cn(
                                  "w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all duration-200"
                                )}
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
                )}

                {/* Magazine Management */}
                {magazineItems.length > 0 && (
                  <SidebarMenuItem>
                    <Collapsible open={magazinesOpen} onOpenChange={setMagazinesOpen}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "w-full bg-sidebar gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all duration-200 [&[data-state=open]>svg:last-child]:rotate-90",
                            "hover:bg-[#2194D1]",
                            isRTL ? "justify-end" : "justify-start"
                          )}
                        >
                          <BookOpen className="h-4 w-4 flex-shrink-0" />
                          <span className={cn("font-medium whitespace-nowrap", isRTL && "text-right")}>{t('sections.magazineManagement')}</span>
                          <ChevronIcon className={cn("h-4 w-4 flex-shrink-0 transition-transform duration-200", isRTL ? "mr-auto" : "ml-auto")} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {magazineItems.map((item) => (
                            <SidebarMenuSubItem key={item.id}>
                              <SidebarMenuSubButton
                                onClick={() => handleItemClick(item.id)}
                                isActive={activeSection === item.id}
                                className={cn(
                                  "w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all duration-200"
                                )}
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
                )}

                {/* Training Management */}
                {trainingItems.length > 0 && (
                  <SidebarMenuItem>
                    <Collapsible open={trainingOpen} onOpenChange={setTrainingOpen}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "w-full bg-sidebar gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all duration-200 [&[data-state=open]>svg:last-child]:rotate-90",
                            "hover:bg-[#2194D1]",
                            isRTL ? "justify-end" : "justify-start"
                          )}
                        >
                          <GraduationCap className="h-4 w-4 flex-shrink-0" />
                          <span className={cn("font-medium whitespace-nowrap", isRTL && "text-right")}>{t('sections.trainingManagement')}</span>
                          <ChevronIcon className={cn("h-4 w-4 flex-shrink-0 transition-transform duration-200", isRTL ? "mr-auto" : "ml-auto")} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {trainingItems.map((item) => (
                            <SidebarMenuSubItem key={item.id}>
                              <SidebarMenuSubButton
                                onClick={() => handleItemClick(item.id)}
                                isActive={activeSection === item.id}
                                className={cn(
                                  "w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all duration-200"
                                )}
                              >
                                <item.icon className="h-4 w-4 flex-shrink-0 text-sidebar-foreground/80" />
                                <span className="whitespace-nowrap">{item.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                )}

                {/* Blog Management */}
                {blogItems.length > 0 && (
                  <SidebarMenuItem>
                    <Collapsible open={blogOpen} onOpenChange={setBlogOpen}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "w-full bg-sidebar gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all duration-200 [&[data-state=open]>svg:last-child]:rotate-90",
                            "hover:bg-[#2194D1]",
                            isRTL ? "justify-end" : "justify-start"
                          )}
                        >
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span className={cn("font-medium whitespace-nowrap", isRTL && "text-right")}>{t('sections.blogManagement')}</span>
                          <ChevronIcon className={cn("h-4 w-4 flex-shrink-0 transition-transform duration-200", isRTL ? "mr-auto" : "ml-auto")} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {blogItems.map((item) => (
                            <SidebarMenuSubItem key={item.id}>
                              <SidebarMenuSubButton
                                onClick={() => handleItemClick(item.id)}
                                isActive={activeSection === item.id}
                                className={cn(
                                  "w-full bg-sidebar justify-start gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all duration-200"
                                )}
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
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  );
}