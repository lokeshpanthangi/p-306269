
import React from 'react';
import { MoreHorizontal, Trash, Copy, Palette, ArrowUp, ArrowDown } from 'lucide-react';
import { BaseBlock, BlockType } from '@/types/blocks';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BlockOptionsMenuProps {
  block: BaseBlock;
  onDelete: () => void;
  onDuplicate: () => void;
  onTurnInto: (type: BlockType) => void;
}

const BlockOptionsMenu: React.FC<BlockOptionsMenuProps> = ({
  block,
  onDelete,
  onDuplicate,
  onTurnInto
}) => {
  const turnIntoOptions: { type: BlockType; label: string }[] = [
    { type: 'paragraph', label: 'Text' },
    { type: 'heading-1', label: 'Heading 1' },
    { type: 'heading-2', label: 'Heading 2' },
    { type: 'heading-3', label: 'Heading 3' },
    { type: 'bulleted-list', label: 'Bulleted list' },
    { type: 'numbered-list', label: 'Numbered list' },
    { type: 'checkbox', label: 'To-do list' },
    { type: 'quote', label: 'Quote' },
    { type: 'callout', label: 'Callout' },
    { type: 'code', label: 'Code' }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-notion-hover"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1" align="end">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 px-2 text-sm"
            onClick={onDuplicate}
          >
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          
          <div className="px-2 py-1">
            <div className="text-xs font-medium text-notion-text-secondary mb-1">Turn into</div>
            <div className="space-y-1">
              {turnIntoOptions.map((option) => (
                <Button
                  key={option.type}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-7 px-2 text-xs"
                  onClick={() => onTurnInto(option.type)}
                  disabled={option.type === block.type}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t border-notion-border pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onDelete}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BlockOptionsMenu;
