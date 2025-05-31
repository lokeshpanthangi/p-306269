
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Search, Star, Clock, FileText, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface Page {
  id: string;
  title: string;
  icon?: string;
  children?: Page[];
  isFavorite?: boolean;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const samplePages: Page[] = [
  {
    id: '1',
    title: 'Getting Started',
    icon: '🚀',
    isFavorite: true,
    children: [
      { id: '1-1', title: 'Welcome', icon: '👋' },
      { id: '1-2', title: 'Quick Start Guide', icon: '⚡' }
    ]
  },
  {
    id: '2',
    title: 'Projects',
    icon: '📁',
    children: [
      { id: '2-1', title: 'Web App', icon: '💻' },
      { id: '2-2', title: 'Mobile App', icon: '📱' },
      { id: '2-3', title: 'API Documentation', icon: '📚' }
    ]
  },
  {
    id: '3',
    title: 'Meeting Notes',
    icon: '📝',
    isFavorite: true
  }
];

const recentPages = [
  { id: 'r1', title: 'Project Roadmap', icon: '🗺️' },
  { id: 'r2', title: 'Team Meeting', icon: '👥' },
  { id: 'r3', title: 'Product Specs', icon: '📋' }
];

const PageTreeItem: React.FC<{ page: Page; level: number }> = ({ page, level }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = page.children && page.children.length > 0;

  return (
    <div>
      <div 
        className="group flex items-center py-1 px-2 page-tree-item cursor-pointer"
        style={{ paddingLeft: `${8 + level * 24}px` }}
      >
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          
          <span className="text-sm mr-1">{page.icon || '📄'}</span>
          <span className="text-sm text-notion-text truncate flex-1">{page.title}</span>
          
          <div className="drag-handle">
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-0.5 h-0.5 bg-gray-400 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {page.children!.map((child) => (
            <PageTreeItem key={child.id} page={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  
  const favorites = samplePages.filter(page => page.isFavorite);

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
          {favorites.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-2">
                <div className="flex items-center gap-2 text-xs font-medium text-notion-text-secondary uppercase tracking-wider">
                  <Star className="w-3 h-3" />
                  Favorites
                </div>
              </div>
              <div className="px-1">
                {favorites.map((page) => (
                  <PageTreeItem key={page.id} page={page} level={0} />
                ))}
              </div>
            </div>
          )}

          {/* Recently Viewed */}
          <div className="mb-4">
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-medium text-notion-text-secondary uppercase tracking-wider">
                <Clock className="w-3 h-3" />
                Recently Viewed
              </div>
            </div>
            <div className="px-1">
              {recentPages.map((page) => (
                <div key={page.id} className="group flex items-center py-1 px-2 page-tree-item cursor-pointer">
                  <span className="text-sm mr-2">{page.icon}</span>
                  <span className="text-sm text-notion-text truncate">{page.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* All Pages */}
          <div className="mb-4">
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-medium text-notion-text-secondary uppercase tracking-wider">
                <FileText className="w-3 h-3" />
                Pages
              </div>
            </div>
            <div className="px-1">
              {samplePages.map((page) => (
                <PageTreeItem key={page.id} page={page} level={0} />
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="px-3 py-2">
            <div className="flex items-center justify-between text-xs font-medium text-notion-text-secondary uppercase tracking-wider">
              Templates
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-notion-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-notion-text-secondary hover:text-notion-text hover:bg-notion-hover notion-button"
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
