
export interface Page {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  parentId?: string;
  children?: Page[];
  isFavorite?: boolean;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  content?: any; // Block content
  metadata?: {
    tags?: string[];
    description?: string;
  };
}

export interface PageHierarchy {
  pages: Page[];
  favorites: Page[];
  recentPages: Page[];
}

export interface BreadcrumbItem {
  id: string;
  title: string;
  icon?: string;
}
