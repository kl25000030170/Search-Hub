import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import StatCard from '../../components/admin/StatCard';
import { Search, TrendingUp, Layers, Filter } from 'lucide-react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useSearchStore } from '../../store/useSearchStore';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f97316'];

const AdminAnalytics = () => {
  const { products, courses, categories, users, totalSearchQueries, searchTrends, popularCategoryChart, recentQueries } = useCatalogStore();
  const filterUsage = useSearchStore((s) => s.filterUsage) || {};

  const stats = {
    totalUsers: users.length,
    totalProducts: products.length,
    totalCourses: courses.length,
    totalCategories: categories.length,
    totalSearchQueries,
  };

  // Merge static fallback filter usage with dynamic searchStore filter usage
  const defaultFilters = {
    'category:Electronics': 24,
    'rating:4★+': 18,
    'difficulty:Beginner': 12,
    'price:under-$100': 9,
    'category:Courses': 7,
  };

  const combinedFilters = { ...defaultFilters };
  Object.entries(filterUsage).forEach(([key, val]) => {
    combinedFilters[key] = (combinedFilters[key] || 0) + val;
  });

  const sortedFilters = Object.entries(combinedFilters)
    .map(([filter, count]) => {
      const [type, value] = filter.split(':');
      return { filter, type, value, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxCount = Math.max(...sortedFilters.map((f) => f.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black">Query Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Search trends and category performance (frontend demo data)</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Total Searches" value={stats.totalSearchQueries} icon={Search} accent="primary" />
        <StatCard label="Search Trends" value="7-day" icon={TrendingUp} accent="violet" />
        <StatCard label="Categories Tracked" value={stats.totalCategories} icon={Layers} accent="emerald" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-base mb-6">Search Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={searchTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="searches" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-base mb-6">Popular Categories</h3>
          <div className="h-72 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={popularCategoryChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {popularCategoryChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm lg:col-span-1">
          <h3 className="font-bold text-base mb-6">Searches by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularCategoryChart}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm lg:col-span-1">
          <h3 className="font-bold text-base mb-4">Recent Queries</h3>
          <ul className="space-y-3">
            {recentQueries.map((q) => (
              <li key={q.query} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
                <div>
                  <p className="font-semibold text-sm">{q.query}</p>
                  <p className="text-xs text-muted-foreground">{q.time}</p>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {q.count} hits
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm lg:col-span-1">
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" /> Top Filters Used
          </h3>
          <div className="space-y-4 mt-2">
            {sortedFilters.map((item) => {
              const percent = Math.round((item.count / maxCount) * 100);
              return (
                <div key={item.filter} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-foreground capitalize">
                      {item.type}: <span className="text-primary font-black">{item.value}</span>
                    </span>
                    <span className="text-muted-foreground">{item.count} times</span>
                  </div>
                  <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
