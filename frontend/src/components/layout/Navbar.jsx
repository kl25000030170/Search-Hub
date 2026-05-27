import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Menu,
  Package,
  LayoutDashboard,
  ChevronDown,
  LogOut,
  Settings,
  Layers,
  Home,
  Sun,
  Moon,
  Compass,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useTheme } from '../../hooks/useTheme';
import { useSearchStore } from '../../store/useSearchStore';
import { PLATFORM_NAME } from '../../utils/constants';
import { useCatalogStore } from '../../store/useCatalogStore';

const NAV_LINKS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Search Platform', to: '/search', icon: Search },
  { label: 'Products', to: '/products', icon: Package },
  { label: 'Categories', to: '/categories', icon: Layers },
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, protected: true },
  { label: 'Profile', to: '/profile', icon: Settings, protected: true },
];

const Navbar = ({ onMobileMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useTheme();
  const { updateQuery, updateFilters } = useSearchStore();
  const catalogCategories = useCatalogStore((s) => s.categories);

  const [searchInput, setSearchInput] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setShowUserMenu(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSearch(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      updateQuery(searchInput.trim());
      navigate('/search');
      setShowSearch(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const handleCategoryClick = (cat) => {
    updateFilters({ category: [cat] });
    navigate('/search');
    setShowCatMenu(false);
  };

  const visibleLinks = NAV_LINKS.filter((link) => {
    if (link.protected && !isAuthenticated) return false;
    if (link.label === 'Categories') return false;
    if (link.label === 'Dashboard' && user?.role !== 'ADMIN') return false;
    return true;
  });

  const dashboardPath = user?.role === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <nav className="sticky top-0 z-30 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          <button
            onClick={onMobileMenuOpen}
            className="btn-icon lg:hidden flex-shrink-0"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
              <Compass className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight hidden sm:block">
              {PLATFORM_NAME}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {visibleLinks.map((link) => {
              const to = link.label === 'Dashboard' && isAuthenticated ? dashboardPath : link.to;
              const active = location.pathname === to || (to === '/admin' && location.pathname.startsWith('/admin'));
              return (
                <Link
                  key={link.to}
                  to={to}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  {link.label === 'Dashboard' && user?.role === 'ADMIN' ? 'Admin Panel' : link.label}
                </Link>
              );
            })}
          </div>



          <form onSubmit={handleSearch} ref={searchRef} className="flex-1 max-w-md hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search items..."
                className="input-field pl-10 pr-4 h-10 text-sm"
              />
            </div>
          </form>

          <div className="flex items-center gap-1">
            <button onClick={() => setShowSearch(!showSearch)} className="btn-icon md:hidden" aria-label="Search">
              <Search className="w-4.5 h-4.5" />
            </button>

            <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle theme">
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-secondary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-semibold hidden lg:block">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 hidden lg:block transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl p-2 z-50"
                    >
                      <div className="px-3 py-2 mb-1 border-b border-border">
                        <p className="text-sm font-bold">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        <span className="text-[10px] font-bold uppercase text-primary mt-1 inline-block">
                          {user?.role}
                        </span>
                      </div>
                      {[
                        { icon: LayoutDashboard, label: user?.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard', to: dashboardPath },
                        { icon: Settings, label: 'Profile', to: '/profile' },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      ))}
                      <div className="mt-1 pt-1 border-t border-border">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-destructive rounded-xl hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-primary ml-1 px-4 py-2 text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-3 md:hidden"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search items..."
                  className="input-field pl-10 text-sm"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
