import React from 'react';
import { BaseBlock } from '@/types/blocks';
import MediaBlockRenderer from './MediaBlockRenderer';
import BookmarkBlockRenderer from './BookmarkBlockRenderer';
import TableBlockRenderer from './TableBlockRenderer';
import TemplateButton from './TemplateButton';

export interface BlockRendererProps {
  block: BaseBlock;
  isLast: boolean;
  isFocused: boolean;
  onUpdate: (content: any) => void;
  onTypeChange: (newType: any) => void;
  onAddBlock: (blockType: any) => void;
  onDeleteBlock: () => void;
  onFocus: () => void;
  onSlashCommand: (command: any) => void;
  onShowSlashMenu: (show: boolean, position?: { x: number; y: number }) => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isLast,
  isFocused,
  onUpdate,
  onTypeChange,
  onAddBlock,
  onDeleteBlock,
  onFocus,
  onSlashCommand,
  onShowSlashMenu
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter key to create a new block
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAddBlock('paragraph');
    }
    
    // Handle Backspace on empty block to delete it
    if (e.key === 'Backspace' && !block.content) {
      e.preventDefault();
      onDeleteBlock();
    }
    
    // Handle slash command
    if (e.key === '/' && !block.content) {
      e.preventDefault();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      onShowSlashMenu(true, { 
        x: rect.left, 
        y: rect.bottom + window.scrollY 
      });
    }
    
    // Handle Escape to close slash menu
    if (e.key === 'Escape') {
      onShowSlashMenu(false);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = (e.target as HTMLDivElement).innerHTML;
    onUpdate(content);
    
    // Check for slash command
    if (content === '/') {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      onShowSlashMenu(true, { 
        x: rect.left, 
        y: rect.bottom + window.scrollY 
      });
    }
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'heading1':
        return (
          <h1
            contentEditable
            suppressContentEditableWarning
            className="text-3xl font-bold mt-6 mb-2 outline-none"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            dangerouslySetInnerHTML={{ __html: block.content || '' }}
          />
        );
      case 'heading2':
        return (
          <h2
            contentEditable
            suppressContentEditableWarning
            className="text-2xl font-bold mt-5 mb-2 outline-none"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            dangerouslySetInnerHTML={{ __html: block.content || '' }}
          />
        );
      case 'heading3':
        return (
          <h3
            contentEditable
            suppressContentEditableWarning
            className="text-xl font-bold mt-4 mb-2 outline-none"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            dangerouslySetInnerHTML={{ __html: block.content || '' }}
          />
        );
      case 'bulleted-list':
        return (
          <ul className="list-disc pl-6 my-2">
            <li
              contentEditable
              suppressContentEditableWarning
              className="outline-none"
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              dangerouslySetInnerHTML={{ __html: block.content || '' }}
            />
          </ul>
        );
      case 'numbered-list':
        return (
          <ol className="list-decimal pl-6 my-2">
            <li
              contentEditable
              suppressContentEditableWarning
              className="outline-none"
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              dangerouslySetInnerHTML={{ __html: block.content || '' }}
            />
          </ol>
        );
      case 'toggle-list':
        return (
          <details className="my-2">
            <summary
              contentEditable
              suppressContentEditableWarning
              className="outline-none cursor-pointer"
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              dangerouslySetInnerHTML={{ __html: block.content || '' }}
            />
          </details>
        );
      case 'quote':
        return (
          <blockquote
            contentEditable
            suppressContentEditableWarning
            className="border-l-4 border-gray-300 pl-4 py-1 my-2 italic outline-none"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            dangerouslySetInnerHTML={{ __html: block.content || '' }}
          />
        );
      case 'callout':
        return (
          <div className="bg-gray-100 p-4 rounded-md my-2 flex">
            <div className="mr-2">💡</div>
            <div
              contentEditable
              suppressContentEditableWarning
              className="outline-none flex-1"
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              dangerouslySetInnerHTML={{ __html: block.content || '' }}
            />
          </div>
        );
      case 'code':
        return (
          <pre className="bg-gray-800 text-white p-4 rounded-md my-2 overflow-x-auto">
            <code
              contentEditable
              suppressContentEditableWarning
              className="outline-none font-mono"
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              dangerouslySetInnerHTML={{ __html: block.content || '' }}
            />
          </pre>
        );
      case 'image':
      case 'video':
      case 'audio':
      case 'file':
        return (
          <MediaBlockRenderer
            block={block}
            onUpdate={onUpdate}
            onFocus={onFocus}
          />
        );
      case 'bookmark':
      case 'link-preview':
        return (
          <BookmarkBlockRenderer
            block={block}
            onUpdate={onUpdate}
            onFocus={onFocus}
          />
        );
      case 'table':
        return (
          <TableBlockRenderer
            block={block}
            onUpdate={onUpdate}
            onFocus={onFocus}
          />
        );
      case 'divider':
        return (
          <div className="my-4 cursor-pointer" onClick={onFocus}>
            <hr className="border-t border-gray-300" />
          </div>
        );
      case 'template':
        return (
          <div className="my-2" onClick={onFocus}>
            <TemplateButton />
          </div>
        );
      default:
        return (
          <div
            contentEditable
            suppressContentEditableWarning
            className="outline-none"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            dangerouslySetInnerHTML={{ __html: block.content || '' }}
          />
        );
    }
  };

  return (
    <div className="block-container">
      {renderBlock()}
    </div>
  );
};

export default BlockRenderer;
