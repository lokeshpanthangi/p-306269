
import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { BlockType } from '@/types/blocks';
import { 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  MessageSquare, 
  Image, 
  Video, 
  Music,
  FileText, 
  CheckSquare, 
  Code, 
  Calculator,
  Columns,
  Minus,
  ChevronRight,
  Bookmark,
  Link,
  Grid3X3,
  Database,
  Table,
  Navigation,
  List as ListIcon,
  Layers
} from 'lucide-react';

interface SlashCommandMenuProps {
  position: { x: number; y: number };
  onSelectBlock: (type: BlockType) => void;
  onClose: () => void;
}

const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  position,
  onSelectBlock,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('[data-slash-menu]')) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const blockTypes = [
    {
      group: 'Basic blocks',
      items: [
        { type: 'paragraph' as BlockType, icon: Type, label: 'Text', description: 'Just start writing with plain text.' },
        { type: 'heading-1' as BlockType, icon: Heading1, label: 'Heading 1', description: 'Big section heading.' },
        { type: 'heading-2' as BlockType, icon: Heading2, label: 'Heading 2', description: 'Medium section heading.' },
        { type: 'heading-3' as BlockType, icon: Heading3, label: 'Heading 3', description: 'Small section heading.' },
        { type: 'bulleted-list' as BlockType, icon: List, label: 'Bulleted list', description: 'Create a simple bulleted list.' },
        { type: 'numbered-list' as BlockType, icon: ListOrdered, label: 'Numbered list', description: 'Create a list with numbering.' },
        { type: 'checkbox' as BlockType, icon: CheckSquare, label: 'To-do list', description: 'Track tasks with a to-do list.' },
        { type: 'toggle' as BlockType, icon: ChevronRight, label: 'Toggle list', description: 'Toggles can hide and show content inside.' }
      ]
    },
    {
      group: 'Text formatting',
      items: [
        { type: 'quote' as BlockType, icon: Quote, label: 'Quote', description: 'Capture a quote.' },
        { type: 'callout' as BlockType, icon: MessageSquare, label: 'Callout', description: 'Make writing stand out.' },
        { type: 'code' as BlockType, icon: Code, label: 'Code', description: 'Capture a code snippet.' },
        { type: 'math' as BlockType, icon: Calculator, label: 'Math equation', description: 'Display mathematical expressions.' }
      ]
    },
    {
      group: 'Media',
      items: [
        { type: 'image' as BlockType, icon: Image, label: 'Image', description: 'Upload or embed with a link.' },
        { type: 'video' as BlockType, icon: Video, label: 'Video', description: 'Embed from YouTube, Vimeo, etc.' },
        { type: 'audio' as BlockType, icon: Music, label: 'Audio', description: 'Embed audio files.' },
        { type: 'file' as BlockType, icon: FileText, label: 'File', description: 'Upload a file.' },
        { type: 'pdf' as BlockType, icon: FileText, label: 'PDF', description: 'Embed a PDF document.' },
        { type: 'bookmark' as BlockType, icon: Bookmark, label: 'Web bookmark', description: 'Save a link as a visual bookmark.' },
        { type: 'link-preview' as BlockType, icon: Link, label: 'Link preview', description: 'Create a visual preview of any link.' }
      ]
    },
    {
      group: 'Database',
      items: [
        { type: 'database-full' as BlockType, icon: Database, label: 'Database - Full page', description: 'Create a database.' },
        { type: 'database-inline' as BlockType, icon: Grid3X3, label: 'Database - Inline', description: 'Create a database inside this page.' },
        { type: 'table' as BlockType, icon: Table, label: 'Simple table', description: 'Add a simple table.' }
      ]
    },
    {
      group: 'Layout',
      items: [
        { type: 'columns' as BlockType, icon: Columns, label: 'Columns', description: 'Create columns of content.' },
        { type: 'divider' as BlockType, icon: Minus, label: 'Divider', description: 'Visually divide blocks.' },
        { type: 'breadcrumb' as BlockType, icon: Navigation, label: 'Breadcrumb', description: 'Show page hierarchy.' },
        { type: 'table-of-contents' as BlockType, icon: ListIcon, label: 'Table of contents', description: 'Auto-generate table of contents.' }
      ]
    }
  ];

  const filteredBlockTypes = blockTypes.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <div
      data-slash-menu
      className="fixed z-50 w-80 bg-white border border-notion-border rounded-lg shadow-lg"
      style={{
        left: position.x,
        top: position.y,
        maxHeight: '400px'
      }}
    >
      <Command className="rounded-lg border-0">
        <CommandInput
          placeholder="Search for blocks..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="border-0 border-b border-notion-border rounded-none"
        />
        <CommandList className="max-h-[300px]">
          <CommandEmpty>No blocks found.</CommandEmpty>
          {filteredBlockTypes.map((group) => (
            <CommandGroup key={group.group} heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.type}
                  onSelect={() => {
                    onSelectBlock(item.type);
                    onClose();
                  }}
                  className="flex items-start gap-3 p-3 cursor-pointer hover:bg-notion-hover"
                >
                  <item.icon className="w-5 h-5 mt-0.5 text-notion-text-secondary" />
                  <div className="flex-1">
                    <div className="font-medium text-notion-text">{item.label}</div>
                    <div className="text-sm text-notion-text-secondary">{item.description}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </div>
  );
};

export default SlashCommandMenu;
