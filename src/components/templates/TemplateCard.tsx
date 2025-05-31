
import React from 'react';
import { FileText, Database, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageTemplate, DatabaseTemplate } from '@/types/templates';

interface TemplateCardProps {
  template: PageTemplate | DatabaseTemplate;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, viewMode, onClick }) => {
  const isPageTemplate = 'blocks' in template;
  const templateType = isPageTemplate ? 'page' : 'database';

  if (viewMode === 'list') {
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
           onClick={onClick}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
            {template.icon || (isPageTemplate ? '📄' : '🗄️')}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900 truncate">{template.title}</h3>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {isPageTemplate ? <FileText className="w-3 h-3" /> : <Database className="w-3 h-3" />}
                {templateType}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">{template.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {template.createdBy}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(template.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Button variant="outline" size="sm">
            Use Template
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
         onClick={onClick}>
      <div className="p-6">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl mb-4">
          {template.icon || (isPageTemplate ? '📄' : '🗄️')}
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-medium text-gray-900">{template.title}</h3>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {isPageTemplate ? <FileText className="w-3 h-3" /> : <Database className="w-3 h-3" />}
            {templateType}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{template.description}</p>
        
        {isPageTemplate && (template as PageTemplate).metadata?.tags && (
          <div className="flex flex-wrap gap-1 mb-4">
            {(template as PageTemplate).metadata!.tags!.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {template.createdBy}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(template.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <Button variant="outline" size="sm" className="w-full">
          Use Template
        </Button>
      </div>
    </div>
  );
};

export default TemplateCard;
