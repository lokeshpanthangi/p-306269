import React, { useState, useEffect } from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command"

interface CommandItemType {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: string;
}

const defaultCommands = {
  basic: [
    { id: 'paragraph', title: 'Paragraph', description: 'Plain text', icon: '📄', type: 'paragraph' },
    { id: 'heading1', title: 'Heading 1', description: 'Large title', icon: 'H1', type: 'heading1' },
    { id: 'heading2', title: 'Heading 2', description: 'Medium title', icon: 'H2', type: 'heading2' },
    { id: 'heading3', title: 'Heading 3', description: 'Small title', icon: 'H3', type: 'heading3' },
    { id: 'bulleted-list', title: 'Bulleted list', description: 'List with bullets', icon: '•', type: 'bulleted-list' },
    { id: 'numbered-list', title: 'Numbered list', description: 'List with numbers', icon: '1.', type: 'numbered-list' },
    { id: 'toggle-list', title: 'Toggle list', description: 'Collapsible list', icon: '▶', type: 'toggle-list' },
    { id: 'quote', title: 'Quote', description: 'Emphasized text', icon: '❝', type: 'quote' },
    { id: 'callout', title: 'Callout', description: 'Highlighted message', icon: '📢', type: 'callout' },
    { id: 'code', title: 'Code', description: 'Code block', icon: '<>', type: 'code' },
    { id: 'divider', title: 'Divider', description: 'Horizontal line', icon: '---', type: 'divider' },
  ],
  media: [
    { id: 'image', title: 'Image', description: 'Add an image', icon: '🖼️', type: 'image' },
    { id: 'video', title: 'Video', description: 'Embed a video', icon: '🎬', type: 'video' },
    { id: 'audio', title: 'Audio', description: 'Add an audio file', icon: '🎵', type: 'audio' },
    { id: 'file', title: 'File', description: 'Attach a file', icon: '📎', type: 'file' },
    { id: 'bookmark', title: 'Bookmark', description: 'Link preview', icon: '🔗', type: 'bookmark' },
  ],
  database: [
    { id: 'database-inline', title: 'Database inline', description: 'Create a table', icon: '📊', type: 'database-inline' },
    { id: 'database-full', title: 'Database full page', description: 'Full page table', icon: '🗄️', type: 'database-full' },
  ],
  advanced: [
    { id: 'table', title: 'Table', description: 'Insert a table', icon: 'table', type: 'table' },
    { id: 'math', title: 'Math equation', description: 'Insert an equation', icon: '∑', type: 'math' },
    { id: 'template', title: 'Template button', description: 'Insert a template button', icon: 'T', type: 'template' },
  ]
};

export interface SlashCommandMenuProps {
  position: { x: number; y: number };
  onSelectCommand: (command: any) => void;
  onClose: () => void;
}

const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({ position, onSelectCommand, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [commands, setCommands] = useState(defaultCommands);
  const [filteredCommands, setFilteredCommands] = useState(commands);

  useEffect(() => {
    // Filter commands based on search query
    const filtered = {
      basic: commands.basic.filter(cmd => cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) || cmd.description.toLowerCase().includes(searchQuery.toLowerCase())),
      media: commands.media.filter(cmd => cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) || cmd.description.toLowerCase().includes(searchQuery.toLowerCase())),
      database: commands.database.filter(cmd => cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) || cmd.description.toLowerCase().includes(searchQuery.toLowerCase())),
      advanced: commands.advanced.filter(cmd => cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) || cmd.description.toLowerCase().includes(searchQuery.toLowerCase())),
    };
    setFilteredCommands(filtered);
  }, [searchQuery, commands]);

  return (
    <div 
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
      style={{ 
        left: position.x, 
        top: position.y,
        minWidth: '280px'
      }}
    >
      <Command>
        <CommandInput 
          placeholder="Type a command..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
          autoFocus
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {/* Basic Blocks */}
          <CommandGroup heading="Basic blocks">
            {filteredCommands.basic.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => {
                  onSelectCommand(command);
                  onClose();
                }}
                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100"
              >
                <span className="text-lg">{command.icon}</span>
                <div>
                  <div className="font-medium">{command.title}</div>
                  <div className="text-sm text-gray-500">{command.description}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          {/* Media */}
          <CommandGroup heading="Media">
            {filteredCommands.media.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => {
                  onSelectCommand(command);
                  onClose();
                }}
                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100"
              >
                <span className="text-lg">{command.icon}</span>
                <div>
                  <div className="font-medium">{command.title}</div>
                  <div className="text-sm text-gray-500">{command.description}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          {/* Database */}
          <CommandGroup heading="Database">
            {filteredCommands.database.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => {
                  onSelectCommand(command);
                  onClose();
                }}
                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100"
              >
                <span className="text-lg">{command.icon}</span>
                <div>
                  <div className="font-medium">{command.title}</div>
                  <div className="text-sm text-gray-500">{command.description}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          {/* Advanced */}
          <CommandGroup heading="Advanced">
            {filteredCommands.advanced.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => {
                  onSelectCommand(command);
                  onClose();
                }}
                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100"
              >
                <span className="text-lg">{command.icon}</span>
                <div>
                  <div className="font-medium">{command.title}</div>
                  <div className="text-sm text-gray-500">{command.description}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default SlashCommandMenu;
