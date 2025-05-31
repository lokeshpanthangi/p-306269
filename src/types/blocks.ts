export interface BaseBlock {
  id: string;
  type: string;
  pageId: string;
  order: number;
  content?: any;
  properties?: any;
  metadata?: any;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading1' | 'heading2' | 'heading3';
  content: string;
}

export interface BulletedListBlock extends BaseBlock {
  type: 'bulleted-list';
  content: string[];
}

export interface NumberedListBlock extends BaseBlock {
  type: 'numbered-list';
  content: string[];
}

export interface ToggleListBlock extends BaseBlock {
  type: 'toggle-list';
  content: {
    title: string;
    items: string[];
  };
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  content: string;
  citation?: string;
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  content: string;
  icon?: string;
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  content: string;
  language?: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string;
  alt?: string;
  caption?: string;
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  url: string;
  caption?: string;
}

export interface AudioBlock extends BaseBlock {
  type: 'audio';
  url: string;
  caption?: string;
}

export interface FileBlock extends BaseBlock {
  type: 'file';
  url: string;
  name: string;
}

export interface BookmarkBlock extends BaseBlock {
  type: 'bookmark';
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface LinkPreviewBlock extends BaseBlock {
  type: 'link-preview';
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface DatabaseFullBlock extends BaseBlock {
  type: 'database-full';
  databaseId: string;
}

export interface DatabaseInlineBlock extends BaseBlock {
  type: 'database-inline';
  databaseId: string;
}

export interface ColumnsBlock extends BaseBlock {
  type: 'columns';
  columns: BaseBlock[][];
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
}

export interface BreadcrumbBlock extends BaseBlock {
  type: 'breadcrumb';
}

export interface TableOfContentsBlock extends BaseBlock {
  type: 'table-of-contents';
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  rows: string[][];
}

export interface MathBlock extends BaseBlock {
  type: 'math';
  expression: string;
}

export interface TemplateBlock extends BaseBlock {
  type: 'template';
  name: string;
  description?: string;
  icon?: string;
  content: BaseBlock[];
}

export type BlockType = 
  | 'paragraph' 
  | 'heading1' 
  | 'heading2' 
  | 'heading3'
  | 'bulleted-list'
  | 'numbered-list'
  | 'toggle-list'
  | 'quote'
  | 'callout'
  | 'code'
  | 'image'
  | 'video'
  | 'audio'
  | 'file'
  | 'bookmark'
  | 'link-preview'
  | 'database-full'
  | 'database-inline'
  | 'columns'
  | 'divider'
  | 'breadcrumb'
  | 'table-of-contents'
  | 'table'
  | 'math'
  | 'template';

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | BulletedListBlock
  | NumberedListBlock
  | ToggleListBlock
  | QuoteBlock
  | CalloutBlock
  | CodeBlock
  | ImageBlock
  | VideoBlock
  | AudioBlock
  | FileBlock
  | BookmarkBlock
  | LinkPreviewBlock
  | DatabaseFullBlock
  | DatabaseInlineBlock
  | ColumnsBlock
  | DividerBlock
  | BreadcrumbBlock
  | TableOfContentsBlock
  | TableBlock
  | MathBlock
  | TemplateBlock;
