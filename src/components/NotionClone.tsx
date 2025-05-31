
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { useIsMobile } from '@/hooks/use-mobile';

const NotionClone: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-notion-bg overflow-hidden">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <MainContent />
    </div>
  );
};

export default NotionClone;
