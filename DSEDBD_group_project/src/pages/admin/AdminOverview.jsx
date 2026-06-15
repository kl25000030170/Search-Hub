import { Users, Package, GraduationCap, Layers, Search, UserCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../../components/admin/StatCard';
import { useCatalogStore } from '../../store/useCatalogStore';

const AdminOverview = () => {
  const { products, courses, categories, users, totalSearchQueries, searchTrends, recentQueries } = useCatalogStore();
  const activeUsersCount = users.filter((u) => u.status === 'Active').length;
  const stats = {
    totalUsers: users.length,
    totalProducts: products.length,
    totalCourses: courses.length,
    totalCategories: categories.length,
    totalSearchQueries,
    activeUsers: activeUsersCount,
  };

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, accent: 'blue' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, accent: 'primary' },
    { label: 'Total Courses', value: stats.totalCourses, icon: GraduationCap, accent: 'violet' },
    { label: 'Total Categories', value: stats.totalCategories, icon: Layers, accent: 'emerald' },
    { label: 'Total Search Queries', value: stats.totalSearchQueries, icon: Search, accent: 'amber' },
    { label: 'Active Users', value: stats.activeUsers, icon: UserCheck, accent: 'rose' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform statistics and activity at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-base mb-4">Search Trends (7 days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={searchTrends}>
                <defs>
                  <linearGradient id="adminTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="searches" stroke="#6366f1" fill="url(#adminTrend)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-base mb-4">Recent Queries</h3>
          <ul className="space-y-3">
            {recentQueries.slice(0, 5).map((q) => (
              <li key={q.query} className="flex justify-between items-center text-sm py-2 border-b border-border/50 last:border-0">
                <span className="font-medium truncate pr-2">{q.query}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">{q.time}</span>
              </li>
            ))}
          </ul>
          <Link to="/admin/analytics" className="block mt-4 text-sm font-semibold text-primary hover:underline">
            View full analytics <ArrowRight className="inline w-4 h-4 ml-1 align-text-bottom" />
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Manage Users', to: '/admin/users' },
          { label: 'Manage Products', to: '/admin/products' },
          { label: 'Manage Courses', to: '/admin/courses' },
          { label: 'View Analytics', to: '/admin/analytics' },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="bg-card border border-border rounded-2xl p-4 text-center font-semibold text-sm hover:border-primary/40 hover:shadow-md transition-all"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
