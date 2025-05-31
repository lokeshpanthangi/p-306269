
import React, { useState } from 'react';
import AuthPage from '@/components/AuthPage';
import NotionClone from '@/components/NotionClone';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthPage onAuth={handleAuth} />;
  }

  return <NotionClone />;
};

export default Index;
