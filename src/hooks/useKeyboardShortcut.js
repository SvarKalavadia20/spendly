import { useEffect } from 'react';

/**
 * Global keyboard shortcuts hook
 * e.g., 'n' to focus transaction input, 'Escape' to dismiss modals
 */
export function useKeyboardShortcut(key, callback, node = null) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Avoid triggering when user is actively typing inside an input/textarea
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      if (event.key.toLowerCase() === key.toLowerCase()) {
        if (key.toLowerCase() === 'escape') {
          callback(event);
        } else if (!isInputActive) {
          event.preventDefault();
          callback(event);
        }
      }
    };

    const targetNode = node || document;
    targetNode.addEventListener('keydown', handleKeyDown);

    return () => targetNode.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, node]);
}