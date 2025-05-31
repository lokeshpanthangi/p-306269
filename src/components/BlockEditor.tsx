import React, { useState, useRef } from 'react';
import { Plus, MoreHorizontal, GripVertical } from 'lucide-react';
import { BaseBlock, BlockType } from '@/types/blocks';
import BlockRenderer from './BlockRenderer';
import SlashCommandMenu from './SlashCommandMenu';
import BlockOptionsMenu from './BlockOptionsMenu';
import { Button } from '@/components/ui/button';

interface BlockEditorProps {
  blocks: BaseBlock[];
  onBlocksChange: (blocks: BaseBlock[]) => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onBlocksChange }) => {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [dragOverBlock, setDragOverBlock] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleBlockUpdate = (blockId: string, content: any) => {
    const updatedBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, content } : block
    );
    onBlocksChange(updatedBlocks);
  };

  const handleBlockAdd = (type: BlockType, afterBlockId?: string) => {
    const newBlock: BaseBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContentForType(type),
      properties: {}
    };

    if (afterBlockId) {
      const insertIndex = blocks.findIndex(b => b.id === afterBlockId) + 1;
      const updatedBlocks = [
        ...blocks.slice(0, insertIndex),
        newBlock,
        ...blocks.slice(insertIndex)
      ];
      onBlocksChange(updatedBlocks);
    } else {
      onBlocksChange([...blocks, newBlock]);
    }

    setActiveBlockId(newBlock.id);
    setShowSlashMenu(false);
  };

  const handleBlockDelete = (blockId: string) => {
    const updatedBlocks = blocks.filter(b => b.id !== blockId);
    onBlocksChange(updatedBlocks);
  };

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    if (e.key === '/') {
      const rect = e.currentTarget.getBoundingClientRect();
      setSlashMenuPosition({ x: rect.left, y: rect.bottom });
      setShowSlashMenu(true);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlockAdd('paragraph', blockId);
    } else if (e.key === 'Backspace') {
      const block = blocks.find(b => b.id === blockId);
      if (block && isBlockEmpty(block)) {
        e.preventDefault();
        handleBlockDelete(blockId);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlock(blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    setDragOverBlock(blockId);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    if (draggedBlock && draggedBlock !== targetBlockId) {
      const draggedIndex = blocks.findIndex(b => b.id === draggedBlock);
      const targetIndex = blocks.findIndex(b => b.id === targetBlockId);
      
      const newBlocks = [...blocks];
      const [movedBlock] = newBlocks.splice(draggedIndex, 1);
      newBlocks.splice(targetIndex, 0, movedBlock);
      
      onBlocksChange(newBlocks);
    }
    setDraggedBlock(null);
    setDragOverBlock(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-1" ref={editorRef}>
      {blocks.length === 0 && (
        <div 
          className="group flex items-start gap-2 py-2 min-h-[40px]"
          onClick={() => handleBlockAdd('paragraph')}
        >
          <div className="w-6 flex justify-center pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-notion-hover"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 cursor-text">
            <div className="text-notion-text-secondary">
              Type '/' for commands, or just start writing...
            </div>
          </div>
        </div>
      )}

      {blocks.map((block, index) => (
        <div
          key={block.id}
          className={`group flex items-start gap-2 py-1 relative ${
            dragOverBlock === block.id ? 'border-t-2 border-notion-blue' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, block.id)}
          onDrop={(e) => handleDrop(e, block.id)}
        >
          {/* Drag Handle */}
          <div className="w-6 flex justify-center pt-1 relative">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-notion-hover cursor-grab active:cursor-grabbing"
              draggable
              onDragStart={(e) => handleDragStart(e, block.id)}
            >
              <GripVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* Block Content */}
          <div className="flex-1 relative">
            <BlockRenderer
              block={block}
              isActive={activeBlockId === block.id}
              onUpdate={(content) => handleBlockUpdate(block.id, content)}
              onFocus={() => setActiveBlockId(block.id)}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
            />
          </div>

          {/* Block Options */}
          <div className="w-6 flex justify-center pt-1">
            <BlockOptionsMenu
              block={block}
              onDelete={() => handleBlockDelete(block.id)}
              onDuplicate={() => {
                const duplicatedBlock = {
                  ...block,
                  id: `block-${Date.now()}`,
                };
                const insertIndex = blocks.findIndex(b => b.id === block.id) + 1;
                const updatedBlocks = [
                  ...blocks.slice(0, insertIndex),
                  duplicatedBlock,
                  ...blocks.slice(insertIndex)
                ];
                onBlocksChange(updatedBlocks);
              }}
              onTurnInto={(newType) => {
                const updatedBlocks = blocks.map(b => 
                  b.id === block.id 
                    ? { ...b, type: newType, content: getDefaultContentForType(newType) }
                    : b
                );
                onBlocksChange(updatedBlocks);
              }}
            />
          </div>

          {/* Add Block Button (between blocks) */}
          {index < blocks.length - 1 && (
            <div className="absolute left-8 bottom-0 transform translate-y-2 opacity-0 group-hover:opacity-100 z-10">
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 bg-white border border-notion-border hover:bg-notion-hover rounded-full"
                onClick={() => handleBlockAdd('paragraph', block.id)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      ))}

      {/* Add block at end */}
      <div className="group flex items-start gap-2 py-2 min-h-[40px]">
        <div className="w-6 flex justify-center pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-notion-hover"
            onClick={() => handleBlockAdd('paragraph')}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div 
          className="flex-1 cursor-text text-notion-text-secondary"
          onClick={() => handleBlockAdd('paragraph')}
        >
          Type '/' for commands
        </div>
      </div>

      {/* Slash Command Menu */}
      {showSlashMenu && (
        <SlashCommandMenu
          position={slashMenuPosition}
          onSelectBlock={(type) => handleBlockAdd(type)}
          onClose={() => setShowSlashMenu(false)}
        />
      )}
    </div>
  );
};

const getDefaultContentForType = (type: BlockType): any => {
  switch (type) {
    case 'paragraph':
    case 'heading-1':
    case 'heading-2':
    case 'heading-3':
    case 'bulleted-list':
    case 'numbered-list':
    case 'quote':
      return { text: '', formatting: [] };
    case 'callout':
      return { text: '', icon: '💡', formatting: [] };
    case 'checkbox':
      return { text: '', checked: false, formatting: [] };
    case 'code':
      return { code: '', language: 'javascript' };
    case 'math':
      return { formula: '' };
    case 'toggle':
      return { text: '', isOpen: false, formatting: [] };
    case 'divider':
      return {};
    case 'image':
    case 'video':
    case 'audio':
    case 'file':
    case 'pdf':
      return { url: '', caption: '' };
    case 'bookmark':
    case 'link-preview':
      return { url: '', title: '', description: '', favicon: '', image: '' };
    case 'table':
      return { 
        headers: ['Column 1', 'Column 2'], 
        rows: [['', '']], 
        hasHeader: true 
      };
    case 'columns':
      return { columnCount: 2, columns: [[], []] };
    case 'breadcrumb':
      return { path: ['Home', 'Current Page'] };
    case 'table-of-contents':
      return { headings: [] };
    case 'database-full':
    case 'database-inline':
      return { 
        title: 'Untitled Database',
        properties: [],
        rows: [],
        views: []
      };
    default:
      return {};
  }
};

const isBlockEmpty = (block: BaseBlock): boolean => {
  if (block.type === 'divider') return false;
  if (typeof block.content?.text === 'string') {
    return block.content.text.trim() === '';
  }
  if (typeof block.content?.code === 'string') {
    return block.content.code.trim() === '';
  }
  if (typeof block.content?.formula === 'string') {
    return block.content.formula.trim() === '';
  }
  if (typeof block.content?.url === 'string') {
    return block.content.url.trim() === '';
  }
  return false;
};

export default BlockEditor;
