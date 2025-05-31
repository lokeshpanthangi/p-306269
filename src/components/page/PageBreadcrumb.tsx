
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '@/types/pages';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem as BreadcrumbItemComponent,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface PageBreadcrumbProps {
  breadcrumbs: BreadcrumbItem[];
  onNavigate: (pageId: string) => void;
}

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ breadcrumbs, onNavigate }) => {
  if (breadcrumbs.length === 0) return null;

  return (
    <div className="px-6 py-2 border-b border-notion-border bg-white">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItemComponent>
            <BreadcrumbLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="flex items-center gap-1 text-notion-text-secondary hover:text-notion-text"
            >
              <Home className="w-3 h-3" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItemComponent>
          
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={item.id}>
              <BreadcrumbSeparator>
                <ChevronRight className="w-3 h-3" />
              </BreadcrumbSeparator>
              <BreadcrumbItemComponent>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {item.icon && <span className="text-sm">{item.icon}</span>}
                    {item.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.id);
                    }}
                    className="flex items-center gap-1 text-notion-text-secondary hover:text-notion-text"
                  >
                    {item.icon && <span className="text-sm">{item.icon}</span>}
                    {item.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItemComponent>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default PageBreadcrumb;
