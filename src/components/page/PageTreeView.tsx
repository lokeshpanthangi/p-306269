
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Star, StarOff, MoreHorizontal, Plus } from 'lucide-react';
import { Page } from '@/types/pages';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PageTreeViewProps {
  pages: Page[];
  selectedPageId?: string;
  onPageSelect: (page: Page) => void;
  onPageToggleFavorite: (pageId: string) => void;
  onPageDelete: (pageId: string) => void;
  onPageCreate: (parentId?: string) => void;
  onPageMove: (pageId: string, newParentId?: string) => void;
  level?: number;
}

const PageTreeView: React.FC<PageTreeViewProps> = ({
  pages,
  selectedPageId,
  onPageSelect,
  onPageToggleFavorite,
  onPageDelete,
  onPageCreate,
  onPageMove,
  level = 0
}) => {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [draggedPage, setDraggedPage] = useState<string | null>(null);

  const toggleExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const handleDragStart = (e: React.DragEvent, pageId: string) => {
    setDraggedPage(pageId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPageId: string) => {
    e.preventDefault();
    if (draggedPage && draggedPage !== targetPageId) {
      onPageMove(draggedPage, targetPageId);
    }
    setDraggedPage(null);
  };

  return (
    <div className="space-y-1">
      {pages.map((page) => {
        const hasChildren = page.children && page.children.length > 0;
        const isExpanded = expandedPages.has(page.id);
        const isSelected = selectedPageId === page.id;

        return (
          <div key={page.id} className="select-none">
            <div
              className={`group flex items-center py-1 px-2 rounded cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-notion-blue text-white' 
                  : 'hover:bg-notion-hover text-notion-text'
              }`}
              style={{ paddingLeft: `${8 + level * 16}px` }}
              draggable
              onDragStart={(e) => handleDragStart(e, page.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, page.id)}
              onClick={() => onPageSelect(page)}
            >
              <div className="flex items-center gap-1 flex-1 min-w-0">
                {hasChildren && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(page.id);
                    }}
                    className="p-0.5 hover:bg-gray-200 rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                )}
                {!hasChildren && <div className="w-4" />}
                
                <span className="text-sm mr-2">{page.icon || '📄'}</span>
                <span className="text-sm truncate flex-1">{page.title}</span>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPageToggleFavorite(page.id);
                    }}
                  >
                    {page.isFavorite ? (
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="w-3 h-3" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPageCreate(page.id);
                    }}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onPageCreate(page.id)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add subpage
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onPageToggleFavorite(page.id)}>
                        {page.isFavorite ? (
                          <>
                            <StarOff className="w-4 h-4 mr-2" />
                            Remove from favorites
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4 mr-2" />
                            Add to favorites
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onPageDelete(page.id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            {hasChildren && isExpanded && (
              <PageTreeView
                pages={page.children!}
                selectedPageId={selectedPageId}
                onPageSelect={onPageSelect}
                onPageToggleFavorite={onPageToggleFavorite}
                onPageDelete={onPageDelete}
                onPageCreate={onPageCreate}
                onPageMove={onPageMove}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PageTreeView;
