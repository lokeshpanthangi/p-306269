
import React, { useState, useEffect } from 'react';
import { Search, Clock, TrendingUp, FileText, Database, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from '@/components/ui/command';
import { SearchResult, SearchSuggestion } from '@/types/search';
import { searchService } from '@/services/searchService';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: SearchResult) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRecentSearches();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
      loadSuggestions();
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [query]);

  const loadRecentSearches = async () => {
    try {
      const recent = await searchService.getRecentSearches();
      setRecentSearches(recent);
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  const performSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const searchResults = await searchService.search({ query });
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      const searchSuggestions = await searchService.getSuggestions(query);
      setSuggestions(searchSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    onSelectResult(result);
    onClose();
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'page':
        return <FileText className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="w-4 h-4" />;
      case 'popular':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <Command className="border-0">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search pages, blocks, and databases..."
              value={query}
              onValueChange={setQuery}
              className="border-0 focus:ring-0"
            />
          </div>
          
          <CommandList className="max-h-96 overflow-y-auto">
            {!query && recentSearches.length > 0 && (
              <CommandGroup heading="Recent searches">
                {recentSearches.map((search, index) => (
                  <CommandItem
                    key={`recent-${index}`}
                    onSelect={() => setQuery(search)}
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{search}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {query && suggestions.length > 0 && (
              <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion.id}
                    onSelect={() => handleSelectSuggestion(suggestion)}
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    {getSuggestionIcon(suggestion.type)}
                    <span>{suggestion.text}</span>
                    {suggestion.type === 'recent' && (
                      <span className="ml-auto text-xs text-gray-400">Recent</span>
                    )}
                    {suggestion.type === 'popular' && (
                      <span className="ml-auto text-xs text-gray-400">Popular</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {query && results.length > 0 && (
              <CommandGroup heading="Search results">
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelectResult(result)}
                    className="flex items-start gap-3 px-3 py-3"
                  >
                    <div className="flex items-center gap-2 mt-0.5">
                      {result.pageIcon && (
                        <span className="text-sm">{result.pageIcon}</span>
                      )}
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{result.title}</div>
                      <div className="text-xs text-gray-500 truncate">
                        in {result.pageTitle}
                      </div>
                      {result.highlight && (
                        <div 
                          className="text-xs text-gray-600 mt-1 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: result.highlight }}
                        />
                      )}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {result.type}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {query && !isLoading && results.length === 0 && (
              <CommandEmpty>
                <div className="text-center py-6">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <div className="text-gray-500">No results found for "{query}"</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Try different keywords or check your spelling
                  </div>
                </div>
              </CommandEmpty>
            )}

            {isLoading && (
              <div className="px-3 py-6 text-center text-gray-500">
                Searching...
              </div>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
