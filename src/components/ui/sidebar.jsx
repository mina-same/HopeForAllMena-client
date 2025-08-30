import React, { useState, createContext, useContext, useCallback, useMemo, useEffect } from 'react';
import { PanelLeft, X } from 'lucide-react';
import { cn } from "../../lib/utils";
import { Button } from '../../components/ui/button';

// Custom Sidebar Context
const SidebarContext = createContext(null);

// Hook to use sidebar context
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

// Sidebar Provider Component
export const SidebarProvider = ({ children, defaultOpen = true, className }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const contextValue = useMemo(() => ({
    isOpen,
    setIsOpen,
    toggleSidebar,
    isMobile,
    state: isOpen ? 'expanded' : 'collapsed'
  }), [isOpen, toggleSidebar, isMobile]);

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className={cn("flex min-h-screen w-full", className)}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

// Main Sidebar Component
export const Sidebar = ({ children, className }) => {
  const { isOpen, isMobile, toggleSidebar } = useSidebar();

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={cn(
          "fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className={cn(
      "hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
      isOpen ? "w-72" : "w-16",
      className
    )}>
      {children}
    </div>
  );
};

// Sidebar Trigger Component
export const SidebarTrigger = ({ className, onClick, ...props }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('h-8 w-8 p-0', className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

// Sidebar Header
export const SidebarHeader = ({ children, className }) => {
  return (
    <div className={cn("p-4 border-b border-gray-200 dark:border-gray-700", className)}>
      {children}
    </div>
  );
};

// Sidebar Content
export const SidebarContent = ({ children, className }) => {
  return (
    <div className={cn("flex-1 overflow-y-auto p-2", className)}>
      {children}
    </div>
  );
};

// Sidebar Group
export const SidebarGroup = ({ children, className }) => {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
};

// Sidebar Group Content
export const SidebarGroupContent = ({ children, className }) => {
  return (
    <div className={cn("space-y-1", className)}>
      {children}
    </div>
  );
};

// Sidebar Menu
export const SidebarMenu = ({ children, className }) => {
  return (
    <ul className={cn("space-y-1", className)}>
      {children}
    </ul>
  );
};

// Sidebar Menu Item
export const SidebarMenuItem = ({ children, className }) => {
  return (
    <li className={cn("", className)}>
      {children}
    </li>
  );
};

// Sidebar Menu Button
export const SidebarMenuButton = ({ children, onClick, className, isActive = false, ...props }) => {
  const { isOpen } = useSidebar();
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200",
        isActive 
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-2 border-blue-600" 
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
        !isOpen && "justify-center px-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Sidebar Menu Sub
export const SidebarMenuSub = ({ children, className }) => {
  const { isOpen } = useSidebar();
  
  if (!isOpen) return null;
  
  return (
    <ul className={cn("ml-6 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4", className)}>
      {children}
    </ul>
  );
};

// Sidebar Menu Sub Item
export const SidebarMenuSubItem = ({ children, className }) => {
  return (
    <li className={cn("", className)}>
      {children}
    </li>
  );
};

// Sidebar Menu Sub Button
export const SidebarMenuSubButton = ({ children, onClick, className, isActive = false, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 text-left text-sm rounded-lg transition-all duration-200",
        isActive 
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};