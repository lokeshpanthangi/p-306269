
import React, { useState } from 'react';
import { Plus, Search, FileText, Star, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BlockEditor from './BlockEditor';
import TemplateGallery from './templates/TemplateGallery';
import { Page } from '@/types/pages';

interface MainContentProps {
  currentPage?: Page | null;
}

const MainContent: React.FC<MainContentProps> = ({ currentPage }) => {
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [pageTitle, setPageTitle] = useState(currentPage?.title || 'Untitled');

  React.useEffect(() => {
    setPageTitle(currentPage?.title || 'Untitled');
  }, [currentPage]);

  return (
    <div className="flex-1 flex flex-col h-full bg-notion-bg">
      {/* Page Cover */}
      {currentPage?.cover && (
        <div className="h-64 bg-gray-100 relative overflow-hidden">
          <img 
            src={currentPage.cover} 
            alt="Page cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
        </div>
      )}

      {/* Header */}
      <div className="border-b border-notion-border bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 flex-1">
              {/* Page Icon */}
              <div className="text-4xl cursor-pointer hover:bg-notion-hover rounded p-1">
                {currentPage?.icon || '📄'}
              </div>
              
              {/* Page Title */}
              <Input
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="text-xl font-semibold border-0 bg-transparent text-notion-text placeholder-notion-text-secondary focus:ring-0 flex-1"
                placeholder="Untitled"
              />
              
              {/* Favorite Button */}
              {currentPage && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-notion-text-secondary hover:text-notion-text"
                >
                  <Star className={`w-4 h-4 ${currentPage.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {!currentPage?.cover && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-notion-text-secondary hover:text-notion-text"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Add cover
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplateGallery(true)}
                className="text-notion-text-secondary hover:text-notion-text"
              >
                <FileText className="w-4 h-4 mr-2" />
                Templates
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-notion-text-secondary hover:text-notion-text"
              >
                <Search className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {showTemplateGallery ? (
          <TemplateGallery onClose={() => setShowTemplateGallery(false)} />
        ) : (
          <div className="max-w-4xl mx-auto p-6">
            {currentPage ? (
              <BlockEditor pageId={currentPage.id} />
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h2 className="text-xl font-medium text-notion-text mb-2">Welcome to Notion Clone</h2>
                <p className="text-notion-text-secondary mb-6">Select a page from the sidebar or create a new one to get started.</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Page
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
