
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  pageId: string;
  pageTitle: string;
  pageIcon?: string;
  type: 'page' | 'block' | 'database';
  createdAt: string;
  updatedAt: string;
  highlight?: string;
}

export interface SearchFilter {
  type?: 'page' | 'block' | 'database';
  dateRange?: {
    start: Date;
    end: Date;
  };
  author?: string;
  hasAttachments?: boolean;
}

export interface SearchQuery {
  query: string;
  filters?: SearchFilter;
  limit?: number;
  offset?: number;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'suggestion';
}
