import React, { useState } from 'react';
import {
  Book,
  Users,
  FolderOpen,
  LibraryBig,
  ChevronDown,
  ChevronRight,
  Home,
  Settings,
  MessageSquare,
  BarChart3,
  GraduationCap,
  UserCheck,
  BookOpen,
  Calendar,
  Star,
  ShieldCheck
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  useSidebar,
} from '../ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { cn } from '../../lib/utils';

// interface AdminSidebarProps {
//   activeSection: string;
//   onSectionChange: (section: string) => void;
// }

export function AdminSidebar({ activeSection, onSectionChange }) {
  const { isOpen } = useSidebar();
  const [publishingHouseOpen, setPublishingHouseOpen] = useState(true);
  const [coursesOpen, setCoursesOpen] = useState(true);
  const [magazinesOpen, setMagazinesOpen] = useState(true);
  const [trainingOpen, setTrainingOpen] = useState(true);

  const mainItems = [
    {
      title: 'Dashboard',
      icon: Home,
      id: 'dashboard'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      id: 'analytics'
    },
    {
      title: 'Messages',
      icon: MessageSquare,
      id: 'messages'
    },
    {
      title: 'Calendar',
      icon: Calendar,
      id: 'calendar'
    },
    {
      title: 'User Management',
      icon: ShieldCheck,
      id: 'user-management'
    },
    {
      title: 'Settings',
      icon: Settings,
      id: 'settings'
    }
  ];

  const publishingHouseItems = [
    {
      title: 'Authors',
      icon: Users,
      id: 'authors'
    },
    {
      title: 'Categories',
      icon: FolderOpen,
      id: 'categories'
    },
    {
      title: 'Books',
      icon: Book,
      id: 'books'
    },
    {
      title: 'Reviews',
      icon: Star,
      id: 'reviews',
      unseenCount: 12
    },
    {
      title: 'Contact Messages',
      icon: MessageSquare,
      id: 'contact-messages',
      unseenCount: 5
    }
  ];

  const coursesItems = [
    {
      title: 'Courses',
      icon: GraduationCap,
      id: 'courses'
    },
    {
      title: 'Enrollments',
      icon: UserCheck,
      id: 'enrollments'
    }
  ];

  const magazineItems = [
    {
      title: 'Magazines',
      icon: BookOpen,
      id: 'magazines'
    }
  ];

  const trainingItems = [
    {
      title: 'Training Books',
      icon: Book,
      id: 'training-books'
    },
    {
      title: 'Training Requests',
      icon: Users,
      id: 'training-requests'
    },
    {
      title: 'Training Follow-up',
      icon: GraduationCap,
      id: 'training-followup-requests'
    }
  ];


  const handleItemClick = (id) => {
    onSectionChange(id);
  };

  return (
    <Sidebar className="bg-white dark:bg-gray-900">
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
            <LibraryBig className="h-6 w-6 text-white" />
          </div>
          {isOpen && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Publishing House</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleItemClick(item.id)}
                    isActive={activeSection === item.id}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {isOpen && <span className="font-medium">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Sections */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Books & Publishing */}
              <SidebarMenuItem>
                <Collapsible open={publishingHouseOpen} onOpenChange={setPublishingHouseOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="justify-between">
                      <div className="flex items-center gap-3">
                        <LibraryBig className="h-4 w-4 flex-shrink-0" />
                        {isOpen && <span className="font-medium">Books & Publishing</span>}
                      </div>
                      {isOpen && (
                        <ChevronRight className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          publishingHouseOpen && "rotate-90"
                        )} />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {publishingHouseItems.map((item) => (
                        <SidebarMenuSubItem key={item.id}>
                          <SidebarMenuSubButton
                            onClick={() => handleItemClick(item.id)}
                            isActive={activeSection === item.id}
                          >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            <div className="flex items-center justify-between w-full min-w-0">
                              <span className="truncate">{item.title}</span>
                              {'unseenCount' in item && item.unseenCount > 0 && (
                                <div className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 font-medium ml-2 flex-shrink-0">
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

              {/* Course Management */}
              <SidebarMenuItem>
                <Collapsible open={coursesOpen} onOpenChange={setCoursesOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="justify-between">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-4 w-4 flex-shrink-0" />
                        {isOpen && <span className="font-medium">Course Management</span>}
                      </div>
                      {isOpen && (
                        <ChevronRight className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          coursesOpen && "rotate-90"
                        )} />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {coursesItems.map((item) => (
                        <SidebarMenuSubItem key={item.id}>
                          <SidebarMenuSubButton
                            onClick={() => handleItemClick(item.id)}
                            isActive={activeSection === item.id}
                          >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            <span>{item.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Magazine Management */}
              <SidebarMenuItem>
                <Collapsible open={magazinesOpen} onOpenChange={setMagazinesOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 flex-shrink-0" />
                        {isOpen && <span className="font-medium">Magazine Management</span>}
                      </div>
                      {isOpen && (
                        <ChevronRight className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          magazinesOpen && "rotate-90"
                        )} />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {magazineItems.map((item) => (
                        <SidebarMenuSubItem key={item.id}>
                          <SidebarMenuSubButton
                            onClick={() => handleItemClick(item.id)}
                            isActive={activeSection === item.id}
                          >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            <span>{item.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Training Management */}
              <SidebarMenuItem>
                <Collapsible open={trainingOpen} onOpenChange={setTrainingOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="justify-between">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-4 w-4 flex-shrink-0" />
                        {isOpen && <span className="font-medium">Training Management</span>}
                      </div>
                      {isOpen && (
                        <ChevronRight className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          trainingOpen && "rotate-90"
                        )} />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {trainingItems.map((item) => (
                        <SidebarMenuSubItem key={item.id}>
                          <SidebarMenuSubButton
                            onClick={() => handleItemClick(item.id)}
                            isActive={activeSection === item.id}
                          >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            <span>{item.title}</span>
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
  );
}