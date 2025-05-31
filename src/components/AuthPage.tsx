
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface AuthPageProps {
  onAuth: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, we'll just call onAuth
    onAuth();
  };

  const handleGoogleAuth = () => {
    // For demo purposes, we'll just call onAuth
    onAuth();
  };

  return (
    <div className="min-h-screen bg-notion-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg border-notion-border bg-white">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-notion-text mb-2">
            {isLogin ? 'Log in to Notion' : 'Sign up for Notion'}
          </h1>
          <p className="text-notion-text-secondary text-sm">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-notion-text">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border border-notion-border rounded-md focus:ring-2 focus:ring-notion-blue focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-notion-text">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-notion-border rounded-md focus:ring-2 focus:ring-notion-blue focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-notion-text hover:bg-notion-text/90 text-white p-3 rounded-md font-medium transition-all duration-200"
          >
            {isLogin ? 'Log in' : 'Sign up'}
          </Button>
        </form>

        <div className="my-6">
          <div className="relative">
            <Separator className="bg-notion-border" />
            <div className="absolute inset-0 flex justify-center">
              <span className="bg-white px-2 text-notion-text-secondary text-sm">or</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleGoogleAuth}
          variant="outline"
          className="w-full p-3 border border-notion-border hover:bg-notion-hover transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-notion-text-secondary hover:text-notion-text transition-colors duration-200"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
