import { useEffect } from 'react';
import useThemeStore from '../store/useThemeStore';

export const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return { theme, toggleTheme, setTheme };
};

export default useTheme;
