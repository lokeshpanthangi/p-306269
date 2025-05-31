
export interface BaseBlock {
  id: string;
  type: BlockType;
  content: any;
  properties?: BlockProperties;
  children?: BaseBlock[];
  parentId?: string;
}

export type BlockType = 
  | 'paragraph'
  | 'heading-1'
  | 'heading-2' 
  | 'heading-3'
  | 'bulleted-list'
  | 'numbered-list'
  | 'quote'
  | 'callout'
  | 'image'
  | 'video'
  | 'audio'
  | 'file'
  | 'pdf'
  | 'bookmark'
  | 'link-preview'
  | 'checkbox'
  | 'code'
  | 'math'
  | 'columns'
  | 'divider'
  | 'toggle'
  | 'breadcrumb'
  | 'table-of-contents'
  | 'database-full'
  | 'database-inline'
  | 'table';

export interface BlockProperties {
  backgroundColor?: string;
  textColor?: string;
  alignment?: 'left' | 'center' | 'right';
  checked?: boolean;
  language?: string;
  url?: string;
  caption?: string;
  icon?: string;
  columnCount?: number;
  isOpen?: boolean;
  formatting?: TextFormatting[];
  size?: 'small' | 'medium' | 'large';
  style?: string;
  columns?: number;
}

export interface TextBlock extends BaseBlock {
  type: 'paragraph' | 'heading-1' | 'heading-2' | 'heading-3' | 'bulleted-list' | 'numbered-list' | 'quote';
  content: {
    text: string;
    formatting?: TextFormatting[];
  };
}

export interface TextFormatting {
  type: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link';
  start: number;
  end: number;
  value?: string; // for links
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  content: {
    text: string;
    icon: string;
    formatting?: TextFormatting[];
  };
}

export interface MediaBlock extends BaseBlock {
  type: 'image' | 'video' | 'audio' | 'file' | 'pdf';
  content: {
    url: string;
    caption?: string;
    filename?: string;
    size?: number;
    width?: number;
    height?: number;
  };
}

export interface BookmarkBlock extends BaseBlock {
  type: 'bookmark' | 'link-preview';
  content: {
    url: string;
    title?: string;
    description?: string;
    favicon?: string;
    image?: string;
  };
}

export interface CheckboxBlock extends BaseBlock {
  type: 'checkbox';
  content: {
    text: string;
    checked: boolean;
    formatting?: TextFormatting[];
  };
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  content: {
    code: string;
    language: string;
  };
}

export interface ToggleBlock extends BaseBlock {
  type: 'toggle';
  content: {
    text: string;
    isOpen: boolean;
    formatting?: TextFormatting[];
  };
}

export interface ColumnsBlock extends BaseBlock {
  type: 'columns';
  content: {
    columnCount: number;
    columns: BaseBlock[][];
  };
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  content: {
    headers: string[];
    rows: string[][];
    hasHeader: boolean;
  };
}

export interface DatabaseBlock extends BaseBlock {
  type: 'database-full' | 'database-inline';
  content: {
    title: string;
    description?: string;
    properties: DatabaseProperty[];
    rows: DatabaseRow[];
    views: DatabaseView[];
    currentView?: string;
  };
}

export interface DatabaseProperty {
  id: string;
  name: string;
  type: 'title' | 'text' | 'number' | 'select' | 'multi-select' | 'date' | 'person' | 'files' | 'checkbox' | 'url' | 'email' | 'phone' | 'formula' | 'relation' | 'rollup' | 'created-time' | 'created-by' | 'last-edited-time' | 'last-edited-by';
  options?: any;
}

export interface DatabaseRow {
  id: string;
  properties: Record<string, any>;
}

export interface DatabaseView {
  id: string;
  name: string;
  type: 'table' | 'board' | 'calendar' | 'timeline' | 'gallery' | 'list';
  filters: any[];
  sorts: any[];
  groupBy?: string;
}
