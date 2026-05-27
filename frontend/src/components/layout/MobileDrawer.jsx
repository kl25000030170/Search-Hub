import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Home,
  Search,
  Package,
  Layers,
  LayoutDashboard,
  User,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { PLATFORM_NAME } from '../../utils/constants';

const NAV_LINKS = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: Search, label: 'Search Platform', to: '/search' },
  { icon: Package, label: 'Products', to: '/products' },
  { icon: Layers, label: 'Categories', to: '/categories' },
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard', protected: true },
  { icon: User, label: 'Profile', to: '/profile', protected: true },
];

const MobileDrawer = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const links = NAV_LINKS.filter((l) => !l.protected || isAuthenticated);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="drawer-backdrop lg:hidden"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-72 bg-card border-r border-border shadow-2xl z-50 flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="font-black text-lg">{PLATFORM_NAME}</span>
              <button onClick={onClose} className="btn-icon w-8 h-8">
                <X className="w-4 h-4" />
              </button>
            </div>

            {isAuthenticated && (
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.role}</p>
                  </div>
                </div>
              </div>
            )}

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {links.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <item.icon className="w-4.5 h-4.5" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="px-3 py-4 border-t border-border">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-destructive rounded-xl hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <Link to="/login" onClick={onClose} className="btn-primary w-full justify-center">
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
