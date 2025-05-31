
import React, { useState, useEffect } from 'react';
import { Search, Star, Clock, FileText, Menu, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { Page, PageHierarchy } from '@/types/pages';
import { pageService } from '@/services/pageService';
import PageTreeView from './page/PageTreeView';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  selectedPageId?: string;
  onPageSelect: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, selectedPageId, onPageSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageHierarchy, setPageHierarchy] = useState<PageHierarchy>({
    pages: [],
    favorites: [],
    recentPages: []
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    loadPageHierarchy();
  }, []);

  const loadPageHierarchy = async () => {
    try {
      const hierarchy = await pageService.getPageHierarchy();
      setPageHierarchy(hierarchy);
    } catch (error) {
      console.error('Failed to load page hierarchy:', error);
    }
  };

  const handlePageToggleFavorite = async (pageId: string) => {
    try {
      await pageService.toggleFavorite(pageId);
      await loadPageHierarchy();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handlePageDelete = async (pageId: string) => {
    try {
      await pageService.deletePage(pageId);
      await loadPageHierarchy();
    } catch (error) {
      console.error('Failed to delete page:', error);
    }
  };

  const handlePageCreate = async (parentId?: string) => {
    try {
      const newPage = await pageService.createPage('Untitled', parentId);
      await loadPageHierarchy();
      onPageSelect(newPage);
    } catch (error) {
      console.error('Failed to create page:', error);
    }
  };

  const handlePageMove = async (pageId: string, newParentId?: string) => {
    try {
      await pageService.movePage(pageId, newParentId);
      await loadPageHierarchy();
    } catch (error) {
      console.error('Failed to move page:', error);
    }
  };

  const handlePageSelect = async (page: Page) => {
    try {
      await pageService.addToRecent(page.id);
      await loadPageHierarchy();
      onPageSelect(page);
    } catch (error) {
      console.error('Failed to select page:', error);
    }
  };

  if (isCollapsed && !isMobile) {
    return (
      <div className="w-12 bg-white border-r border-notion-border h-full flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-8 h-8 p-0 hover:bg-notion-hover"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      {isMobile && !isCollapsed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onToggle} />
      )}
      
      <div className={`
        ${isMobile ? 'fixed left-0 top-0 z-50' : 'relative'} 
        w-sidebar-width bg-white border-r border-notion-border h-full flex flex-col 
        sidebar-transition
        ${isMobile && isCollapsed ? 'transform -translate-x-full' : ''}
      `}>
        {/* Header */}
        <div className="p-3 border-b border-notion-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded text-white text-xs flex items-center justify-center font-semibold">
                N
              </div>
              <span className="font-semibold text-notion-text">Notion Clone</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="w-6 h-6 p-0 hover:bg-notion-hover"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-notion-text-secondary" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-notion-hover border-0 text-sm placeholder-notion-text-secondary focus:ring-1 focus:ring-notion-blue"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-1.5 py-0.5 text-xs text-notion-text-secondary bg-white border border-notion-border rounded">
                ⌘P
              </kbd>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {/* Favorites */}
          {pageHierarchy.favorites.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-2">
                <div className="flex items-center gap-2 text-xs font-medium text-notion-text-secondary uppercase tracking-wider">
                  <Star className="w-3 h-3" />
                  Favorites
                </div>
              </div>
              <div className="px-1">
                <PageTreeView
                  pages={pageHierarchy.favorites}
                  selectedPageId={selectedPageId}
                  onPageSelect={handlePageSelect}
                  onPageToggleFavorite={handlePageToggleFavorite}
                  onPageDelete={handlePageDelete}
                  onPageCreate={handlePageCreate}
                  onPageMove={handlePageMove}
                />
              </div>
            </div>
          )}

          {/* Recently Viewed */}
          {pageHierarchy.recentPages.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-2">
                <div className="flex items-center gap-2 text-xs font-medium text-notion-text-secondary uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  Recently Viewed
                </div>
              </div>
              <div className="px-1">
                <PageTreeView
                  pages={pageHierarchy.recentPages}
                  selectedPageId={selectedPageId}
                  onPageSelect={handlePageSelect}
                  onPageToggleFavorite={handlePageToggleFavorite}
                  onPageDelete={handlePageDelete}
                  onPageCreate={handlePageCreate}
                  onPageMove={handlePageMove}
                />
              </div>
            </div>
          )}

          {/* All Pages */}
          <div className="mb-4">
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-medium text-notion-text-secondary uppercase tracking-wider">
                <FileText className="w-3 h-3" />
                Pages
              </div>
            </div>
            <div className="px-1">
              <PageTreeView
                pages={pageHierarchy.pages}
                selectedPageId={selectedPageId}
                onPageSelect={handlePageSelect}
                onPageToggleFavorite={handlePageToggleFavorite}
                onPageDelete={handlePageDelete}
                onPageCreate={handlePageCreate}
                onPageMove={handlePageMove}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-notion-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-notion-text-secondary hover:text-notion-text hover:bg-notion-hover notion-button"
            onClick={() => handlePageCreate()}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
