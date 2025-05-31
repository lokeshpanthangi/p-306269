
import React, { useState, useEffect } from 'react';
import { Search, Grid, List, Filter, Plus, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageTemplate, DatabaseTemplate, TemplateCategory } from '@/types/templates';
import { templateService } from '@/services/templateService';
import TemplateCard from './TemplateCard';

interface TemplateGalleryProps {
  onSelectTemplate: (template: PageTemplate | DatabaseTemplate) => void;
  onClose: () => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate, onClose }) => {
  const [pageTemplates, setPageTemplates] = useState<PageTemplate[]>([]);
  const [databaseTemplates, setDatabaseTemplates] = useState<DatabaseTemplate[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [templateType, setTemplateType] = useState<'all' | 'page' | 'database'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const [pageTemps, dbTemps, cats] = await Promise.all([
        templateService.getPageTemplates(),
        templateService.getDatabaseTemplates(),
        templateService.getTemplateCategories()
      ]);
      setPageTemplates(pageTemps);
      setDatabaseTemplates(dbTemps);
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const filteredTemplates = React.useMemo(() => {
    const allTemplates = [
      ...(templateType === 'database' ? [] : pageTemplates),
      ...(templateType === 'page' ? [] : databaseTemplates)
    ];

    return allTemplates.filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [pageTemplates, databaseTemplates, searchQuery, selectedCategory, templateType]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Template Gallery</h2>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
          
          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={templateType} onValueChange={(value: any) => setTemplateType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="page">Pages</SelectItem>
                <SelectItem value="database">Databases</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border border-gray-200 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  viewMode={viewMode}
                  onClick={() => onSelectTemplate(template)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
