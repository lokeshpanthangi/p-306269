import { Page, PageHierarchy, BreadcrumbItem } from '@/types/pages';

// Mock data - in a real app this would connect to a backend
const mockPages: Page[] = [
  {
    id: '1',
    title: 'Getting Started',
    icon: '🚀',
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user',
    children: [
      {
        id: '1-1',
        title: 'Welcome',
        icon: '👋',
        parentId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user'
      },
      {
        id: '1-2',
        title: 'Quick Start Guide',
        icon: '⚡',
        parentId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user'
      }
    ]
  },
  {
    id: '2',
    title: 'Projects',
    icon: '📁',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user',
    children: [
      {
        id: '2-1',
        title: 'Web App',
        icon: '💻',
        parentId: '2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user'
      },
      {
        id: '2-2',
        title: 'Mobile App',
        icon: '📱',
        parentId: '2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user'
      },
      {
        id: '2-3',
        title: 'API Documentation',
        icon: '📚',
        parentId: '2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user'
      }
    ]
  },
  {
    id: '3',
    title: 'Meeting Notes',
    icon: '📝',
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user'
  }
];

const recentPages: Page[] = [
  {
    id: 'r1',
    title: 'Project Roadmap',
    icon: '🗺️',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user'
  },
  {
    id: 'r2',
    title: 'Team Meeting',
    icon: '👥',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user'
  },
  {
    id: 'r3',
    title: 'Product Specs',
    icon: '📋',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user'
  }
];

class PageService {
  private pages: Page[] = mockPages;
  private recent: Page[] = recentPages;

  async getPageHierarchy(): Promise<PageHierarchy> {
    const favorites = this.getAllPages().filter(page => page.isFavorite);
    
    return {
      pages: this.pages,
      favorites,
      recentPages: this.recent
    };
  }

  async getPage(id: string): Promise<Page | null> {
    return this.findPageById(id) || null;
  }

  async createPage(title: string, parentId?: string, icon?: string): Promise<Page> {
    const newPage: Page = {
      id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      icon: icon || '📄',
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user'
    };

    if (parentId) {
      const parent = this.findPageById(parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(newPage);
      }
    } else {
      this.pages.push(newPage);
    }

    return newPage;
  }

  async updatePage(id: string, updates: Partial<Page>): Promise<Page | null> {
    const page = this.findPageById(id);
    if (!page) return null;

    Object.assign(page, { ...updates, updatedAt: new Date().toISOString() });
    return page;
  }

  async deletePage(id: string): Promise<boolean> {
    return this.deletePageRecursive(this.pages, id);
  }

  async movePage(pageId: string, newParentId?: string): Promise<boolean> {
    const page = this.findPageById(pageId);
    if (!page) return false;

    // Remove from current location
    this.deletePageRecursive(this.pages, pageId);

    // Add to new location
    page.parentId = newParentId;
    if (newParentId) {
      const newParent = this.findPageById(newParentId);
      if (newParent) {
        if (!newParent.children) newParent.children = [];
        newParent.children.push(page);
      }
    } else {
      this.pages.push(page);
    }

    return true;
  }

  async toggleFavorite(id: string): Promise<boolean> {
    const page = this.findPageById(id);
    if (!page) return false;

    page.isFavorite = !page.isFavorite;
    page.updatedAt = new Date().toISOString();
    return true;
  }

  async getBreadcrumbs(pageId: string): Promise<BreadcrumbItem[]> {
    const page = this.findPageById(pageId);
    if (!page) return [];

    const breadcrumbs: BreadcrumbItem[] = [];
    let current = page;

    while (current) {
      breadcrumbs.unshift({
        id: current.id,
        title: current.title,
        icon: current.icon
      });

      if (current.parentId) {
        current = this.findPageById(current.parentId) || null;
      } else {
        current = null;
      }
    }

    return breadcrumbs;
  }

  async addToRecent(pageId: string): Promise<void> {
    const page = this.findPageById(pageId);
    if (!page) return;

    // Remove if already in recent
    this.recent = this.recent.filter(p => p.id !== pageId);
    
    // Add to beginning
    this.recent.unshift({ ...page });
    
    // Keep only last 10
    this.recent = this.recent.slice(0, 10);
  }

  private findPageById(id: string): Page | null {
    const searchInPages = (pages: Page[]): Page | null => {
      for (const page of pages) {
        if (page.id === id) return page;
        if (page.children) {
          const found = searchInPages(page.children);
          if (found) return found;
        }
      }
      return null;
    };

    return searchInPages(this.pages) || this.recent.find(p => p.id === id) || null;
  }

  private getAllPages(): Page[] {
    const allPages: Page[] = [];
    
    const collectPages = (pages: Page[]) => {
      for (const page of pages) {
        allPages.push(page);
        if (page.children) {
          collectPages(page.children);
        }
      }
    };

    collectPages(this.pages);
    return allPages;
  }

  private deletePageRecursive(pages: Page[], id: string): boolean {
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].id === id) {
        pages.splice(i, 1);
        return true;
      }
      if (pages[i].children && this.deletePageRecursive(pages[i].children!, id)) {
        return true;
      }
    }
    return false;
  }
}

export const pageService = new PageService();
