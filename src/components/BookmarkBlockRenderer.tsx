
import React, { useState, useEffect } from 'react';
import { BaseBlock } from '@/types/blocks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, ExternalLink, Globe } from 'lucide-react';

interface BookmarkBlockRendererProps {
  block: BaseBlock;
  onUpdate: (content: any) => void;
  onFocus: () => void;
}

const BookmarkBlockRenderer: React.FC<BookmarkBlockRendererProps> = ({
  block,
  onUpdate,
  onFocus
}) => {
  const [showUrlInput, setShowUrlInput] = useState(!block.content?.url);
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true);
    
    // In a real implementation, you'd fetch metadata from the URL
    // For now, we'll simulate this with basic URL parsing
    try {
      const urlObj = new URL(url);
      const mockMetadata = {
        url,
        title: urlObj.hostname,
        description: `Visit ${urlObj.hostname}`,
        favicon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}`,
        image: null
      };
      
      onUpdate(mockMetadata);
      setShowUrlInput(false);
    } catch (error) {
      console.error('Invalid URL:', error);
    }
    
    setIsLoading(false);
  };

  if (showUrlInput || !block.content?.url) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <Link className="w-5 h-5 text-gray-400" />
          <Input
            placeholder="Paste a link to create a bookmark..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUrlSubmit(e.currentTarget.value);
              }
            }}
            onFocus={onFocus}
            className="flex-1"
            disabled={isLoading}
          />
          {isLoading && <div className="text-sm text-gray-500">Loading...</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden hover:bg-gray-50 transition-colors">
      <a
        href={block.content.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4"
      >
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {block.content.title || block.content.url}
            </div>
            {block.content.description && (
              <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                {block.content.description}
              </div>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              {block.content.favicon ? (
                <img
                  src={block.content.favicon}
                  alt=""
                  className="w-4 h-4"
                />
              ) : (
                <Globe className="w-4 h-4" />
              )}
              <span className="truncate">
                {new URL(block.content.url).hostname}
              </span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
          {block.content.image && (
            <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
              <img
                src={block.content.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export default BookmarkBlockRenderer;
