
import { PageTemplate, DatabaseTemplate, TemplateCategory } from '@/types/templates';
import { BaseBlock } from '@/types/blocks';

// Mock data for demonstration - in a real app this would come from a database
const mockPageTemplates: PageTemplate[] = [
  {
    id: 'template-1',
    title: 'Meeting Notes',
    description: 'Template for taking meeting notes with agenda and action items',
    icon: '📝',
    category: 'productivity',
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: 'block-1',
        type: 'heading-1',
        content: { text: 'Meeting Notes - [Date]', formatting: [] }
      },
      {
        id: 'block-2',
        type: 'heading-2',
        content: { text: 'Attendees', formatting: [] }
      },
      {
        id: 'block-3',
        type: 'bulleted-list',
        content: { text: '', formatting: [] }
      },
      {
        id: 'block-4',
        type: 'heading-2',
        content: { text: 'Agenda', formatting: [] }
      },
      {
        id: 'block-5',
        type: 'numbered-list',
        content: { text: '', formatting: [] }
      },
      {
        id: 'block-6',
        type: 'heading-2',
        content: { text: 'Action Items', formatting: [] }
      },
      {
        id: 'block-7',
        type: 'checkbox',
        content: { text: '', checked: false, formatting: [] }
      }
    ],
    metadata: {
      tags: ['meetings', 'productivity'],
      difficulty: 'beginner'
    }
  },
  {
    id: 'template-2',
    title: 'Project Planning',
    description: 'Comprehensive project planning template with goals, timeline, and resources',
    icon: '🎯',
    category: 'project-management',
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: 'block-1',
        type: 'heading-1',
        content: { text: 'Project: [Project Name]', formatting: [] }
      },
      {
        id: 'block-2',
        type: 'callout',
        content: { text: 'Project overview and objectives', icon: '🎯', formatting: [] }
      },
      {
        id: 'block-3',
        type: 'heading-2',
        content: { text: 'Goals & Objectives', formatting: [] }
      },
      {
        id: 'block-4',
        type: 'heading-2',
        content: { text: 'Timeline', formatting: [] }
      },
      {
        id: 'block-5',
        type: 'heading-2',
        content: { text: 'Resources', formatting: [] }
      },
      {
        id: 'block-6',
        type: 'heading-2',
        content: { text: 'Risks & Mitigation', formatting: [] }
      }
    ],
    metadata: {
      tags: ['project', 'planning'],
      difficulty: 'intermediate'
    }
  }
];

const mockDatabaseTemplates: DatabaseTemplate[] = [
  {
    id: 'db-template-1',
    title: 'Task Management',
    description: 'Simple task tracking with status, priority, and assignee',
    icon: '✅',
    category: 'productivity',
    properties: [
      { id: 'prop-1', name: 'Task', type: 'title', options: {} },
      { id: 'prop-2', name: 'Status', type: 'select', options: { 
        options: ['Not Started', 'In Progress', 'Completed'] 
      }},
      { id: 'prop-3', name: 'Priority', type: 'select', options: { 
        options: ['Low', 'Medium', 'High'] 
      }},
      { id: 'prop-4', name: 'Due Date', type: 'date', options: {} },
      { id: 'prop-5', name: 'Assignee', type: 'person', options: {} }
    ],
    sampleRows: [
      {
        'Task': 'Complete project proposal',
        'Status': 'In Progress',
        'Priority': 'High',
        'Due Date': '2024-06-15'
      }
    ],
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockCategories: TemplateCategory[] = [
  { id: 'productivity', name: 'Productivity', icon: '⚡', order: 1 },
  { id: 'project-management', name: 'Project Management', icon: '📊', order: 2 },
  { id: 'personal', name: 'Personal', icon: '👤', order: 3 },
  { id: 'education', name: 'Education', icon: '📚', order: 4 },
  { id: 'business', name: 'Business', icon: '💼', order: 5 }
];

export const templateService = {
  // Page Templates
  getPageTemplates: async (): Promise<PageTemplate[]> => {
    return mockPageTemplates;
  },

  getPageTemplateById: async (id: string): Promise<PageTemplate | null> => {
    return mockPageTemplates.find(t => t.id === id) || null;
  },

  getPageTemplatesByCategory: async (category: string): Promise<PageTemplate[]> => {
    return mockPageTemplates.filter(t => t.category === category);
  },

  // Database Templates
  getDatabaseTemplates: async (): Promise<DatabaseTemplate[]> => {
    return mockDatabaseTemplates;
  },

  getDatabaseTemplateById: async (id: string): Promise<DatabaseTemplate | null> => {
    return mockDatabaseTemplates.find(t => t.id === id) || null;
  },

  // Categories
  getTemplateCategories: async (): Promise<TemplateCategory[]> => {
    return mockCategories;
  },

  // Create from template
  createPageFromTemplate: async (templateId: string): Promise<BaseBlock[]> => {
    const template = await templateService.getPageTemplateById(templateId);
    if (!template) throw new Error('Template not found');
    
    // Clone blocks and generate new IDs
    return template.blocks.map(block => ({
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
  },

  // Save as template
  savePageAsTemplate: async (
    title: string,
    description: string,
    category: string,
    blocks: BaseBlock[],
    icon?: string
  ): Promise<PageTemplate> => {
    const newTemplate: PageTemplate = {
      id: `template-${Date.now()}`,
      title,
      description,
      icon,
      category,
      isPublic: false,
      createdBy: 'user', // In real app, get from auth
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: blocks.map(block => ({
        ...block,
        id: `template-block-${Math.random().toString(36).substr(2, 9)}`
      }))
    };
    
    mockPageTemplates.push(newTemplate);
    return newTemplate;
  }
};
