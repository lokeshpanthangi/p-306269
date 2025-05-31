import React, { useState, useRef, useEffect } from 'react';
import { BaseBlock } from '@/types/blocks';
import BlockRenderer from './BlockRenderer';
import SlashCommandMenu from './SlashCommandMenu';
import TemplateButton from './TemplateButton';
import { Button } from '@/components/ui/button';

interface BlockEditorProps {
  pageId?: string;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ pageId }) => {
  const [blocks, setBlocks] = useState<BaseBlock[]>([
    {
      id: 'block-1',
      type: 'paragraph',
      content: { text: '', formatting: [] }
    }
  ]);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

  const handleBlockUpdate = (blockId: string, content: any) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, content } : block
    ));
  };

  const handleBlockTypeChange = (blockId: string, newType: BaseBlock['type']) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, type: newType } : block
    ));
  };

  const handleAddBlock = (afterBlockId: string, blockType: BaseBlock['type'] = 'paragraph') => {
    const newBlock: BaseBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: blockType,
      content: blockType === 'checkbox' 
        ? { text: '', checked: false, formatting: [] }
        : { text: '', formatting: [] }
    };

    const blockIndex = blocks.findIndex(block => block.id === afterBlockId);
    const newBlocks = [...blocks];
    newBlocks.splice(blockIndex + 1, 0, newBlock);
    setBlocks(newBlocks);
    setFocusedBlockId(newBlock.id);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(block => block.id !== blockId));
    }
  };

  const handleSlashCommand = (command: string, blockId: string) => {
    const commandMap: Record<string, BaseBlock['type']> = {
      'heading1': 'heading-1',
      'heading2': 'heading-2',
      'heading3': 'heading-3',
      'bullet': 'bulleted-list',
      'number': 'numbered-list',
      'checkbox': 'checkbox',
      'quote': 'quote',
      'code': 'code',
      'callout': 'callout',
      'toggle': 'toggle-list',
      'divider': 'divider'
    };

    const blockType = commandMap[command] || 'paragraph';
    handleBlockTypeChange(blockId, blockType);
    setShowSlashMenu(false);
  };

  const handleInsertTemplate = (templateBlocks: BaseBlock[]) => {
    const currentBlockIndex = blocks.findIndex(block => block.id === focusedBlockId);
    const newBlocks = [...blocks];
    
    if (currentBlockIndex !== -1) {
      newBlocks.splice(currentBlockIndex + 1, 0, ...templateBlocks);
    } else {
      newBlocks.push(...templateBlocks);
    }
    
    setBlocks(newBlocks);
  };

  // Load page content when pageId changes
  useEffect(() => {
    if (pageId) {
      // In a real app, this would load the page content from the backend
      console.log('Loading content for page:', pageId);
    }
  }, [pageId]);

  return (
    <div className="min-h-screen bg-white" ref={editorRef}>
      {/* Template Button */}
      <div className="mb-4">
        <TemplateButton onInsertTemplate={handleInsertTemplate} />
      </div>

      {/* Blocks */}
      <div className="space-y-1">
        {blocks.map((block, index) => (
          <BlockRenderer
            key={block.id}
            block={block}
            isFirst={index === 0}
            isLast={index === blocks.length - 1}
            isFocused={focusedBlockId === block.id}
            onUpdate={(content) => handleBlockUpdate(block.id, content)}
            onTypeChange={(newType) => handleBlockTypeChange(block.id, newType)}
            onAddBlock={(blockType) => handleAddBlock(block.id, blockType)}
            onDeleteBlock={() => handleDeleteBlock(block.id)}
            onFocus={() => setFocusedBlockId(block.id)}
            onSlashCommand={(command) => handleSlashCommand(command, block.id)}
            onShowSlashMenu={(show, position) => {
              setShowSlashMenu(show);
              if (position) setSlashMenuPosition(position);
            }}
          />
        ))}
      </div>

      {/* Slash Command Menu */}
      {showSlashMenu && (
        <SlashCommandMenu
          position={slashMenuPosition}
          onCommand={(command) => handleSlashCommand(command, focusedBlockId || '')}
          onClose={() => setShowSlashMenu(false)}
        />
      )}
    </div>
  );
};

export default BlockEditor;
