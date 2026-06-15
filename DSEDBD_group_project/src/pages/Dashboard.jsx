import { useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { GraduationCap, Search, Star, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCatalogStore } from '../store/useCatalogStore';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const courses = useCatalogStore((s) => s.courses);
  const products = useCatalogStore((s) => s.products);

  useEffect(() => {
    if (user?.role === 'ADMIN') return;
  }, [user]);

  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-black">My Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {user?.name} — explore courses and recommended products
        </p>
      </div>

      {/* Courses from admin catalog */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Available Courses
          </h2>
          <Link to="/search" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
            Search all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div key={course.id} className="card overflow-hidden hover:border-primary/30 transition-colors">
              <img src={course.image} alt={course.title} className="w-full h-40 object-cover bg-muted" />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase text-primary">{course.category}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600">
                    {course.level}
                  </span>
                </div>
                <h3 className="font-bold">{course.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                <p className="text-xs font-semibold text-muted-foreground mt-3">Instructor: {course.instructor}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold">{course.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {courses.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">No courses available yet.</p>
        )}
      </section>

      {/* Quick product preview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Featured Products
          </h2>
          <Link to="/products" className="text-sm text-primary font-semibold hover:underline">
            View all products →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <Link key={p.id} to={`/items/${p.id}`} className="card p-3 hover:border-primary/30 transition-colors">
              <img src={p.image} alt="" className="w-full h-24 object-cover rounded-lg mb-2 bg-muted" />
              <p className="text-xs font-bold line-clamp-2">{p.title}</p>
              <p className="text-sm font-black mt-1">{formatCurrency(p.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
