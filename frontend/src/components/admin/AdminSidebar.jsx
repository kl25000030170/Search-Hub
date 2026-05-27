import { NavLink, useNavigate } from 'react-router-dom';
import {
  Users,
  Package,
  GraduationCap,
  Layers,
  User,
  LogOut,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { PLATFORM_NAME } from '../../utils/constants';

const NAV = [
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/courses', label: 'Courses', icon: GraduationCap },
  { to: '/admin/categories', label: 'Categories', icon: Layers },
  { to: '/profile', label: 'Profile', icon: User },
];

const NavContent = ({ onMobileClose, user, handleLogout }) => (
  <>
    <div className="px-5 py-6 border-b border-slate-700/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-black text-white text-sm">{PLATFORM_NAME}</p>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Admin Panel</p>
        </div>
      </div>
    </div>

    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onMobileClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>

    <div className="p-4 border-t border-slate-700/50 space-y-3">
      <div className="px-3 py-2 rounded-xl bg-slate-800/80">
        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  </>
);

const AdminSidebar = ({ mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-slate-900 text-white fixed left-0 top-0 z-40">
        <NavContent onMobileClose={onMobileClose} user={user} handleLogout={handleLogout} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={onMobileClose} />
          <aside className="relative w-72 min-h-full bg-slate-900 flex flex-col shadow-2xl">
            <button
              type="button"
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <NavContent onMobileClose={onMobileClose} user={user} handleLogout={handleLogout} />
          </aside>
        </div>
      )}
    </>
  );
};

export const AdminMobileHeader = ({ onMenuOpen }) => (
  <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white border-b border-slate-700">
    <button type="button" onClick={onMenuOpen} className="p-2 rounded-lg hover:bg-slate-800">
      <Menu className="w-5 h-5" />
    </button>
    <span className="font-bold text-sm">Admin Portal</span>
  </div>
);

export default AdminSidebar;
