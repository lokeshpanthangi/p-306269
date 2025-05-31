
import React from 'react';
import { CalendarDays, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { SearchFilter } from '@/types/search';

interface SearchFiltersProps {
  filters: SearchFilter;
  onFiltersChange: (filters: SearchFilter) => void;
  onClearFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange, onClearFilters }) => {
  const hasActiveFilters = filters.type || filters.dateRange || filters.author;

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-2 h-2" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Content type</label>
              <Select
                value={filters.type || ''}
                onValueChange={(value) => 
                  onFiltersChange({ 
                    ...filters, 
                    type: value as 'page' | 'block' | 'database' | undefined 
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="page">Pages</SelectItem>
                  <SelectItem value="block">Blocks</SelectItem>
                  <SelectItem value="database">Databases</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Date range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {filters.dateRange 
                      ? `${filters.dateRange.start.toLocaleDateString()} - ${filters.dateRange.end.toLocaleDateString()}`
                      : 'Any time'
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={filters.dateRange ? {
                      from: filters.dateRange.start,
                      to: filters.dateRange.end
                    } : undefined}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        onFiltersChange({
                          ...filters,
                          dateRange: { start: range.from, end: range.to }
                        });
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="gap-2 text-gray-500"
        >
          <X className="w-4 h-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default SearchFilters;
