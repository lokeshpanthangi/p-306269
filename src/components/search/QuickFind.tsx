
import React, { useState, useEffect } from 'react';
import { Search, FileText, Clock } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from '@/components/ui/command';
import { Page } from '@/types/pages';
import { pageService } from '@/services/pageService';

interface QuickFindProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPage: (page: Page) => void;
}

const QuickFind: React.FC<QuickFindProps> = ({ isOpen, onClose, onSelectPage }) => {
  const [query, setQuery] = useState('');
  const [pages, setPages] = useState<Page[]>([]);
  const [recentPages, setRecentPages] = useState<Page[]>([]);
  const [filteredPages, setFilteredPages] = useState<Page[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadPages();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = pages.filter(page =>
        page.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPages(filtered);
    } else {
      setFilteredPages([]);
    }
  }, [query, pages]);

  const loadPages = async () => {
    try {
      const hierarchy = await pageService.getPageHierarchy();
      const allPages = flattenPages([...hierarchy.pages, ...hierarchy.favorites]);
      setPages(allPages);
      setRecentPages(hierarchy.recentPages);
    } catch (error) {
      console.error('Failed to load pages:', error);
    }
  };

  const flattenPages = (pageList: Page[]): Page[] => {
    const flattened: Page[] = [];
    
    const flatten = (pages: Page[]) => {
      for (const page of pages) {
        flattened.push(page);
        if (page.children) {
          flatten(page.children);
        }
      }
    };

    flatten(pageList);
    return flattened;
  };

  const handleSelectPage = (page: Page) => {
    onSelectPage(page);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[60vh] p-0">
        <Command className="border-0">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Quick find..."
              value={query}
              onValueChange={setQuery}
              className="border-0 focus:ring-0"
            />
          </div>
          
          <CommandList className="max-h-80 overflow-y-auto">
            {!query && recentPages.length > 0 && (
              <CommandGroup heading="Recently viewed">
                {recentPages.slice(0, 5).map((page) => (
                  <CommandItem
                    key={page.id}
                    onSelect={() => handleSelectPage(page)}
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    {page.icon && <span className="text-sm">{page.icon}</span>}
                    <span className="flex-1">{page.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {query && filteredPages.length > 0 && (
              <CommandGroup heading="Pages">
                {filteredPages.slice(0, 10).map((page) => (
                  <CommandItem
                    key={page.id}
                    onSelect={() => handleSelectPage(page)}
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <FileText className="w-4 h-4 text-gray-400" />
                    {page.icon && <span className="text-sm">{page.icon}</span>}
                    <span className="flex-1">{page.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {query && filteredPages.length === 0 && (
              <CommandEmpty>
                <div className="text-center py-6">
                  <div className="text-gray-500">No pages found for "{query}"</div>
                </div>
              </CommandEmpty>
            )}

            {!query && recentPages.length === 0 && (
              <div className="px-3 py-6 text-center text-gray-500">
                Start typing to find pages...
              </div>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default QuickFind;
