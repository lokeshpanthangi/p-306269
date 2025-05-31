
import { useEffect } from 'react';

interface KeyboardShortcuts {
  onQuickFind: () => void;
  onGlobalSearch: () => void;
}

export const useKeyboardShortcuts = ({ onQuickFind, onGlobalSearch }: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifierKey = isMac ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl + P for Quick Find
      if (modifierKey && event.key === 'p') {
        event.preventDefault();
        onQuickFind();
        return;
      }

      // Cmd/Ctrl + K for Global Search
      if (modifierKey && event.key === 'k') {
        event.preventDefault();
        onGlobalSearch();
        return;
      }

      // Cmd/Ctrl + Shift + F for Global Search (alternative)
      if (modifierKey && event.shiftKey && event.key === 'F') {
        event.preventDefault();
        onGlobalSearch();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onQuickFind, onGlobalSearch]);
};
