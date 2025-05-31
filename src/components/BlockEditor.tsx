import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BaseBlock, BlockType } from '@/types/blocks';
import BlockRenderer from './BlockRenderer';
import SlashCommandMenu from './SlashCommandMenu';

interface BlockEditorProps {
  pageId: string;
}

const initialBlock: BaseBlock = {
  id: uuidv4(),
  type: 'paragraph',
  content: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const BlockEditor: React.FC<BlockEditorProps> = ({ pageId }) => {
  const [blocks, setBlocks] = useState<BaseBlock[]>([initialBlock]);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(initialBlock.id);
  const [slashMenuVisible, setSlashMenuVisible] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Load blocks from local storage or database based on pageId
    // For now, let's just use the initial block
  }, [pageId]);

  const addBlock = (blockType: BlockType, index: number) => {
    const newBlock: BaseBlock = {
      id: uuidv4(),
      type: blockType,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks];
      newBlocks.splice(index, 0, newBlock);
      return newBlocks;
    });

    setFocusedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === id ? { ...block, content, updatedAt: new Date().toISOString() } : block
      )
    );
  };

  const changeBlockType = (id: string, newType: BlockType) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === id ? { ...block, type: newType, updatedAt: new Date().toISOString() } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
    setFocusedBlockId(null);
  };

  return (
    <div className="block-editor">
      {blocks.map((block, index) => (
        <BlockRenderer
          key={block.id}
          block={block}
          isLast={index === blocks.length - 1}
          isFocused={focusedBlockId === block.id}
          onUpdate={(content) => updateBlock(block.id, content)}
          onTypeChange={(newType) => changeBlockType(block.id, newType)}
          onAddBlock={(blockType) => addBlock(blockType, index + 1)}
          onDeleteBlock={() => deleteBlock(block.id)}
          onFocus={() => setFocusedBlockId(block.id)}
          onSlashCommand={(command) => {
            changeBlockType(block.id, command.type);
            setSlashMenuVisible(false);
          }}
          onShowSlashMenu={(show, position) => {
            setSlashMenuVisible(show);
            if (position) setSlashMenuPosition(position);
          }}
        />
      ))}

      {slashMenuVisible && (
        <SlashCommandMenu
          position={slashMenuPosition}
          onSelectCommand={(command) => {
            if (focusedBlockId) {
              changeBlockType(focusedBlockId, command.type);
            }
            setSlashMenuVisible(false);
          }}
          onClose={() => setSlashMenuVisible(false)}
        />
      )}
    </div>
  );
};

export default BlockEditor;
