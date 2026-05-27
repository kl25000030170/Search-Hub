import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Home, Boxes, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/useAuthStore';

const SidebarContent = ({ collapsible, onClose, navItems, userInitials, user, handleLogout }) => (
  <div className="w-64 bg-card border-r border-border h-full flex flex-col relative z-30">
    {/* Sidebar Header */}
    <div className="h-16 flex items-center justify-between px-6 border-b border-border">
      <span className="text-xl font-black text-primary flex items-center gap-2">
        <Boxes className="w-7 h-7 text-primary" />
        <span className="tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">MultiSearch</span>
      </span>
      {collapsible && (
        <button 
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
    
    {/* Navigation Items */}
    <div className="flex-1 overflow-y-auto py-6 px-4">
      <nav className="space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )
            }
          >
            <item.icon className="mr-3 w-5 h-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
    
    {/* User Session profile panel */}
    <div className="p-4 border-t border-border flex flex-col gap-3">
      <div className="flex items-center gap-3 px-3 py-2 bg-secondary/30 rounded-2xl border border-border/50">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
          {userInitials}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-bold truncate text-foreground">{user?.name || 'User Account'}</span>
          <span className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</span>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-all duration-200"
      >
        <LogOut className="mr-3 w-5 h-5 flex-shrink-0" />
        Log Out
      </button>
    </div>
  </div>
);

export const Sidebar = ({ isOpen, onClose, collapsible = false }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search }
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: LayoutDashboard });
  }

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:flex w-64 h-full flex-col flex-shrink-0 border-r border-border">
        <SidebarContent 
          collapsible={collapsible}
          onClose={onClose}
          navItems={navItems}
          userInitials={userInitials}
          user={user}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-40 h-full"
            >
              <SidebarContent 
                collapsible={collapsible}
                onClose={onClose}
                navItems={navItems}
                userInitials={userInitials}
                user={user}
                handleLogout={handleLogout}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
