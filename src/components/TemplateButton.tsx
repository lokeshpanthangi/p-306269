
import React, { useState } from 'react';
import { Template, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { templateService } from '@/services/templateService';
import { BaseBlock } from '@/types/blocks';

interface TemplateButtonProps {
  onInsertTemplate: (blocks: BaseBlock[]) => void;
}

const TemplateButton: React.FC<TemplateButtonProps> = ({ onInsertTemplate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickTemplates = [
    {
      id: 'meeting-notes',
      name: 'Meeting Notes',
      icon: '📝',
      blocks: [
        { id: 'block-1', type: 'heading-1' as const, content: { text: 'Meeting Notes', formatting: [] } },
        { id: 'block-2', type: 'heading-2' as const, content: { text: 'Attendees', formatting: [] } },
        { id: 'block-3', type: 'bulleted-list' as const, content: { text: '', formatting: [] } },
        { id: 'block-4', type: 'heading-2' as const, content: { text: 'Action Items', formatting: [] } },
        { id: 'block-5', type: 'checkbox' as const, content: { text: '', checked: false, formatting: [] } }
      ]
    },
    {
      id: 'daily-standup',
      name: 'Daily Standup',
      icon: '📅',
      blocks: [
        { id: 'block-1', type: 'heading-1' as const, content: { text: 'Daily Standup - [Date]', formatting: [] } },
        { id: 'block-2', type: 'heading-2' as const, content: { text: 'What I did yesterday', formatting: [] } },
        { id: 'block-3', type: 'bulleted-list' as const, content: { text: '', formatting: [] } },
        { id: 'block-4', type: 'heading-2' as const, content: { text: 'What I plan to do today', formatting: [] } },
        { id: 'block-5', type: 'bulleted-list' as const, content: { text: '', formatting: [] } },
        { id: 'block-6', type: 'heading-2' as const, content: { text: 'Blockers', formatting: [] } },
        { id: 'block-7', type: 'bulleted-list' as const, content: { text: '', formatting: [] } }
      ]
    },
    {
      id: 'pros-cons',
      name: 'Pros & Cons',
      icon: '⚖️',
      blocks: [
        { id: 'block-1', type: 'heading-1' as const, content: { text: 'Decision: [Topic]', formatting: [] } },
        { id: 'block-2', type: 'columns' as const, content: { columnCount: 2, columns: [[], []] } },
        { id: 'block-3', type: 'heading-2' as const, content: { text: 'Pros', formatting: [] } },
        { id: 'block-4', type: 'bulleted-list' as const, content: { text: '', formatting: [] } },
        { id: 'block-5', type: 'heading-2' as const, content: { text: 'Cons', formatting: [] } },
        { id: 'block-6', type: 'bulleted-list' as const, content: { text: '', formatting: [] } }
      ]
    }
  ];

  const handleTemplateSelect = (template: typeof quickTemplates[0]) => {
    const blocksWithNewIds = template.blocks.map(block => ({
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    onInsertTemplate(blocksWithNewIds);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-notion-text-secondary hover:text-notion-text hover:bg-notion-hover"
        >
          <Template className="w-4 h-4 mr-2" />
          Templates
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-1">
          <div className="px-2 py-1 text-xs font-medium text-notion-text-secondary">
            Quick Templates
          </div>
          {quickTemplates.map(template => (
            <Button
              key={template.id}
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2 text-sm"
              onClick={() => handleTemplateSelect(template)}
            >
              <span className="mr-2">{template.icon}</span>
              {template.name}
            </Button>
          ))}
          <div className="border-t border-notion-border pt-1 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2 text-sm text-notion-blue"
              onClick={() => {
                setIsOpen(false);
                // This would open the full template gallery
              }}
            >
              <Template className="w-4 h-4 mr-2" />
              Browse all templates
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TemplateButton;
