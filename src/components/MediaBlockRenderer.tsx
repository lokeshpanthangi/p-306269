
import React, { useState } from 'react';
import { BaseBlock } from '@/types/blocks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Link, Play, Download, ExternalLink } from 'lucide-react';

interface MediaBlockRendererProps {
  block: BaseBlock;
  onUpdate: (content: any) => void;
  onFocus: () => void;
}

const MediaBlockRenderer: React.FC<MediaBlockRendererProps> = ({
  block,
  onUpdate,
  onFocus
}) => {
  const [showUrlInput, setShowUrlInput] = useState(!block.content?.url);

  const handleUrlSubmit = (url: string) => {
    onUpdate({ ...block.content, url });
    setShowUrlInput(false);
  };

  const handleCaptionChange = (caption: string) => {
    onUpdate({ ...block.content, caption });
  };

  if (showUrlInput || !block.content?.url) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            {block.type === 'image' && <Upload className="w-8 h-8 text-gray-400" />}
            {block.type === 'video' && <Play className="w-8 h-8 text-gray-400" />}
            {block.type === 'audio' && <Play className="w-8 h-8 text-gray-400" />}
            {(block.type === 'file' || block.type === 'pdf') && <Upload className="w-8 h-8 text-gray-400" />}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Add {block.type}
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder={`Paste ${block.type} URL...`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlSubmit(e.currentTarget.value);
                  }
                }}
                onFocus={onFocus}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderMedia = () => {
    switch (block.type) {
      case 'image':
        return (
          <img
            src={block.content.url}
            alt={block.content.caption || ''}
            className="max-w-full h-auto rounded"
            style={{ 
              width: block.content.width ? `${block.content.width}px` : 'auto',
              height: block.content.height ? `${block.content.height}px` : 'auto'
            }}
          />
        );
        
      case 'video':
        return (
          <div className="relative">
            <video
              src={block.content.url}
              controls
              className="w-full rounded"
              style={{ 
                maxHeight: '400px'
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
        
      case 'audio':
        return (
          <audio
            src={block.content.url}
            controls
            className="w-full"
          >
            Your browser does not support the audio tag.
          </audio>
        );
        
      case 'pdf':
        return (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                  <span className="text-red-600 font-bold text-xs">PDF</span>
                </div>
                <div>
                  <div className="font-medium">
                    {block.content.filename || 'PDF Document'}
                  </div>
                  {block.content.size && (
                    <div className="text-sm text-gray-500">
                      {Math.round(block.content.size / 1024)} KB
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'file':
        return (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">
                    {block.content.filename || 'File'}
                  </div>
                  {block.content.size && (
                    <div className="text-sm text-gray-500">
                      {Math.round(block.content.size / 1024)} KB
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {renderMedia()}
      <Input
        value={block.content?.caption || ''}
        onChange={(e) => handleCaptionChange(e.target.value)}
        placeholder="Add a caption..."
        className="text-sm text-gray-600 border-none p-0 bg-transparent"
        onFocus={onFocus}
      />
    </div>
  );
};

export default MediaBlockRenderer;
