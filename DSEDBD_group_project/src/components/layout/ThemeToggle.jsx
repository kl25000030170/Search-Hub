
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-secondary/50 border border-border/80 text-foreground hover:bg-secondary hover:text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 relative overflow-hidden"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ y: theme === 'dark' ? 30 : 0, opacity: theme === 'dark' ? 0 : 1 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex items-center justify-center"
      >
        <Sun className="w-5 h-5 text-amber-500 fill-amber-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ y: theme === 'dark' ? 0 : -30, opacity: theme === 'dark' ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-5 h-5 text-indigo-400 fill-indigo-400" />
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
