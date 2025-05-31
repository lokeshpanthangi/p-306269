import { SearchResult, SearchQuery, SearchSuggestion, SearchFilter } from '@/types/search';
import { pageService } from './pageService';

class SearchService {
  private recentSearches: string[] = [];
  private popularSearches: string[] = ['meeting notes', 'project plan', 'todo', 'dashboard'];

  async search(query: SearchQuery): Promise<SearchResult[]> {
    const { query: searchQuery, filters, limit = 50 } = query;
    
    if (!searchQuery.trim()) return [];

    // Add to recent searches
    this.addToRecentSearches(searchQuery);

    // Get all pages and their content
    const hierarchy = await pageService.getPageHierarchy();
    const allPages = [
      ...hierarchy.pages,
      ...hierarchy.favorites,
      ...hierarchy.recentPages
    ];

    const results: SearchResult[] = [];

    // Search through pages
    for (const page of this.flattenPages(allPages)) {
      // Search in page title
      if (page.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({
          id: `page-${page.id}`,
          title: page.title,
          content: page.title,
          pageId: page.id,
          pageTitle: page.title,
          pageIcon: page.icon,
          type: 'page',
          createdAt: page.createdAt,
          updatedAt: page.updatedAt,
          highlight: this.highlightMatch(page.title, searchQuery)
        });
      }

      // Search in page content (mock content search)
      const mockContent = `Sample content for ${page.title}. This includes various text blocks and information.`;
      if (mockContent.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({
          id: `content-${page.id}`,
          title: `Content in ${page.title}`,
          content: mockContent,
          pageId: page.id,
          pageTitle: page.title,
          pageIcon: page.icon,
          type: 'block',
          createdAt: page.createdAt,
          updatedAt: page.updatedAt,
          highlight: this.highlightMatch(mockContent, searchQuery)
        });
      }
    }

    // Apply filters
    let filteredResults = results;
    if (filters) {
      filteredResults = this.applyFilters(results, filters);
    }

    // Sort by relevance (title matches first, then content matches)
    filteredResults.sort((a, b) => {
      if (a.type === 'page' && b.type !== 'page') return -1;
      if (a.type !== 'page' && b.type === 'page') return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return filteredResults.slice(0, limit);
  }

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    const suggestions: SearchSuggestion[] = [];

    // Add recent searches that match
    this.recentSearches
      .filter(search => search.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .forEach(search => {
        suggestions.push({
          id: `recent-${search}`,
          text: search,
          type: 'recent'
        });
      });

    // Add popular searches that match
    this.popularSearches
      .filter(search => search.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .forEach(search => {
        suggestions.push({
          id: `popular-${search}`,
          text: search,
          type: 'popular'
        });
      });

    // Add page title suggestions
    const hierarchy = await pageService.getPageHierarchy();
    const allPages = this.flattenPages([
      ...hierarchy.pages,
      ...hierarchy.favorites,
      ...hierarchy.recentPages
    ]);

    allPages
      .filter(page => page.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
      .forEach(page => {
        suggestions.push({
          id: `suggestion-${page.id}`,
          text: page.title,
          type: 'suggestion'
        });
      });

    return suggestions.slice(0, 8);
  }

  async getRecentSearches(): Promise<string[]> {
    return this.recentSearches.slice(0, 10);
  }

  private addToRecentSearches(query: string) {
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(search => search !== query);
    // Add to beginning
    this.recentSearches.unshift(query);
    // Keep only last 10
    this.recentSearches = this.recentSearches.slice(0, 10);
  }

  private flattenPages(pages: any[]): any[] {
    const flattened: any[] = [];
    
    const flatten = (pageList: any[]) => {
      for (const page of pageList) {
        flattened.push(page);
        if (page.children) {
          flatten(page.children);
        }
      }
    };

    flatten(pages);
    return flattened;
  }

  private applyFilters(results: SearchResult[], filters: SearchFilter): SearchResult[] {
    return results.filter(result => {
      if (filters.type && result.type !== filters.type) return false;
      
      if (filters.dateRange) {
        const resultDate = new Date(result.updatedAt);
        if (resultDate < filters.dateRange.start || resultDate > filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  }

  private highlightMatch(text: string, query: string): string {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}

export const searchService = new SearchService();
