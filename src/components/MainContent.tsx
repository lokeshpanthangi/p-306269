
import React, { useState } from 'react';
import { Share2, MessageCircle, ChevronRight, Smile, MoreHorizontal, Template, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BlockEditor from './BlockEditor';
import TemplateGallery from './templates/TemplateGallery';
import TemplateManager from './templates/TemplateManager';
import { BaseBlock } from '@/types/blocks';
import { PageTemplate, DatabaseTemplate } from '@/types/templates';
import { templateService } from '@/services/templateService';

const MainContent: React.FC = () => {
  const [pageTitle, setPageTitle] = useState('Untitled');
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [blocks, setBlocks] = useState<BaseBlock[]>([
    {
      id: 'block-1',
      type: 'paragraph',
      content: {
        text: 'Welcome to your new Notion clone! This is a sample paragraph. You can start typing to edit this content.',
        formatting: []
      }
    }
  ]);

  const handleUseTemplate = async (template: PageTemplate | DatabaseTemplate) => {
    if ('blocks' in template) {
      // Page template
      try {
        const templateBlocks = await templateService.createPageFromTemplate(template.id);
        setBlocks(templateBlocks);
        setPageTitle(template.title);
        setShowTemplateGallery(false);
      } catch (error) {
        console.error('Failed to load template:', error);
      }
    } else {
      // Database template - could be implemented to create a database block
      console.log('Database template selected:', template);
      setShowTemplateGallery(false);
    }
  };

  const handleSaveAsTemplate = (templateId: string) => {
    console.log('Template saved with ID:', templateId);
    setShowTemplateManager(false);
    // Could show a success toast here
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Breadcrumb */}
      <div className="px-6 py-3 border-b border-notion-border">
        <div className="flex items-center gap-2 text-sm text-notion-text-secondary">
          <span className="hover:text-notion-text cursor-pointer transition-colors">Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-notion-text">{pageTitle}</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b border-notion-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Icon Picker */}
            <Button
              variant="ghost"
              className="w-16 h-16 p-0 hover:bg-notion-hover notion-button text-4xl"
            >
              <Smile className="w-8 h-8 text-notion-text-secondary" />
            </Button>
            
            {/* Title */}
            <div className="flex-1">
              <Input
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="text-3xl font-bold border-none p-0 bg-transparent notion-input text-notion-text placeholder-notion-text-secondary focus:ring-0"
                placeholder="Untitled"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTemplateGallery(true)}
              className="hover:bg-notion-hover notion-button"
            >
              <Template className="w-4 h-4 mr-2" />
              Templates
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTemplateManager(true)}
              className="hover:bg-notion-hover notion-button"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Save as Template
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className="hover:bg-notion-hover notion-button"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Comments
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-notion-hover notion-button"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-notion-hover notion-button"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex">
        <div className="flex-1 p-6">
          <BlockEditor 
            blocks={blocks}
            onBlocksChange={setBlocks}
          />
        </div>

        {/* Comments Panel */}
        {isCommentsOpen && (
          <div className="w-80 border-l border-notion-border bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-notion-text">Comments</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCommentsOpen(false)}
                className="w-6 h-6 p-0 hover:bg-notion-hover"
              >
                ×
              </Button>
            </div>
            <div className="text-center text-notion-text-secondary py-8">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No comments yet</p>
              <p className="text-xs mt-1">Start a conversation</p>
            </div>
          </div>
        )}
      </div>

      {/* Template Gallery Modal */}
      {showTemplateGallery && (
        <TemplateGallery
          onSelectTemplate={handleUseTemplate}
          onClose={() => setShowTemplateGallery(false)}
        />
      )}

      {/* Template Manager Modal */}
      {showTemplateManager && (
        <TemplateManager
          blocks={blocks}
          onSaveTemplate={handleSaveAsTemplate}
          onClose={() => setShowTemplateManager(false)}
        />
      )}
    </div>
  );
};

export default MainContent;
