import { User, ShieldCheck, Mail, Search, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-black mb-8 flex items-center gap-2">
        <User className="w-6 h-6 text-primary" /> My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-3xl font-black mb-4">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <h2 className="text-lg font-bold">{user?.name}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <Mail className="w-3.5 h-3.5" /> {user?.email}
          </p>
          <span className="mt-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
            {user?.role || 'USER'}
          </span>
          <div className="mt-4 px-3 py-1.5 bg-success/10 text-success rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg">Quick Actions</h3>
          {user?.role !== 'ADMIN' && (
            <>
              <Link
                to="/search"
                className="card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors"
              >
                <Search className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Search Platform</p>
                  <p className="text-xs text-muted-foreground">Find items across all categories</p>
                </div>
              </Link>
              <Link
                to="/categories"
                className="card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors"
              >
                <Layers className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Browse Categories</p>
                  <p className="text-xs text-muted-foreground">Explore grouped resources</p>
                </div>
              </Link>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors border-primary/20"
            >
              <ShieldCheck className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">Admin Panel</p>
                <p className="text-xs text-muted-foreground">Users, products, courses & categories</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
