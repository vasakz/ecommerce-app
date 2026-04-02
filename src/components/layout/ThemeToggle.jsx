import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-stone-500"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon size={20} className="stroke-[2.5]" />
      ) : (
        <Sun size={20} className="stroke-[2.5]" />
      )}
    </button>
  );
};

export default ThemeToggle;
