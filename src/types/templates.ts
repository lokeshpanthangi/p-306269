
import { BaseBlock, DatabaseProperty } from './blocks';

export interface PageTemplate {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  category: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  blocks: BaseBlock[];
  metadata?: {
    tags?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: string;
  };
}

export interface DatabaseTemplate {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  category: string;
  properties: DatabaseProperty[];
  sampleRows?: Record<string, any>[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
}

export type TemplateType = 'page' | 'database';
