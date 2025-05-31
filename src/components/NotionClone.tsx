
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import PageBreadcrumb from './page/PageBreadcrumb';
import GlobalSearch from './search/GlobalSearch';
import QuickFind from './search/QuickFind';
import { useIsMobile } from '@/hooks/use-mobile';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Page, BreadcrumbItem } from '@/types/pages';
import { SearchResult } from '@/types/search';
import { pageService } from '@/services/pageService';

const NotionClone: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showQuickFind, setShowQuickFind] = useState(false);
  const isMobile = useIsMobile();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onQuickFind: () => setShowQuickFind(true),
    onGlobalSearch: () => setShowGlobalSearch(true)
  });

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

  const handleSearchResult = async (result: SearchResult) => {
    try {
      const page = await pageService.getPage(result.pageId);
      if (page) {
        handlePageSelect(page);
      }
    } catch (error) {
      console.error('Failed to navigate to search result:', error);
    }
  };

  return (
    <div className="flex h-screen bg-notion-bg overflow-hidden">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
        selectedPageId={currentPage?.id}
        onPageSelect={handlePageSelect}
        onOpenGlobalSearch={() => setShowGlobalSearch(true)}
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

      <GlobalSearch
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
        onSelectResult={handleSearchResult}
      />

      <QuickFind
        isOpen={showQuickFind}
        onClose={() => setShowQuickFind(false)}
        onSelectPage={handlePageSelect}
      />
    </div>
  );
};

export default NotionClone;
