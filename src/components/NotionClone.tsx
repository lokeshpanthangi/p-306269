
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import PageBreadcrumb from './page/PageBreadcrumb';
import { useIsMobile } from '@/hooks/use-mobile';
import { Page, BreadcrumbItem } from '@/types/pages';
import { pageService } from '@/services/pageService';

const NotionClone: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handlePageSelect = async (page: Page) => {
    setCurrentPage(page);
    
    // Load breadcrumbs for the selected page
    try {
      const pageBreadcrumbs = await pageService.getBreadcrumbs(page.id);
      setBreadcrumbs(pageBreadcrumbs);
    } catch (error) {
      console.error('Failed to load breadcrumbs:', error);
    }

    // Auto-collapse sidebar on mobile after page selection
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleBreadcrumbNavigate = async (pageId: string) => {
    if (pageId === 'home') {
      setCurrentPage(null);
      setBreadcrumbs([]);
      return;
    }

    try {
      const page = await pageService.getPage(pageId);
      if (page) {
        handlePageSelect(page);
      }
    } catch (error) {
      console.error('Failed to navigate to page:', error);
    }
  };

  return (
    <div className="flex h-screen bg-notion-bg overflow-hidden">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
        selectedPageId={currentPage?.id}
        onPageSelect={handlePageSelect}
      />
      <div className="flex-1 flex flex-col">
        {breadcrumbs.length > 0 && (
          <PageBreadcrumb 
            breadcrumbs={breadcrumbs}
            onNavigate={handleBreadcrumbNavigate}
          />
        )}
        <MainContent currentPage={currentPage} />
      </div>
    </div>
  );
};

export default NotionClone;
