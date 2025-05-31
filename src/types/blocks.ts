
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
  | 'file'
  | 'checkbox'
  | 'code'
  | 'math'
  | 'columns'
  | 'divider'
  | 'toggle';

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
  type: 'image' | 'video' | 'file';
  content: {
    url: string;
    caption?: string;
    filename?: string;
    size?: number;
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
