import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Search, ArrowRight } from 'lucide-react';
import { useCatalogStore } from '../store/useCatalogStore';
import { useSearchStore } from '../store/useSearchStore';
import { formatCurrency } from '../utils/formatters';

const Categories = () => {
  const navigate = useNavigate();
  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const updateFilters = useSearchStore((s) => s.updateFilters);

  const itemsByCategory = useMemo(() => {
    const acc = {};
    categories.forEach((cat) => {
      acc[cat.name] = products.filter((i) => i.category === cat.name);
    });
    return acc;
  }, [products, categories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Browse Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore items grouped by resource type
          </p>
        </div>
        <button
          onClick={() => navigate('/search')}
          className="btn-outline text-sm flex items-center gap-2"
        >
          Open Search Platform <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {categories.map((cat) => {
        const items = itemsByCategory[cat.name] || [];
        if (items.length === 0) return null;
        return (
          <section key={cat.id}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold border-l-4 border-primary pl-3 flex items-center gap-2">
                <span>{cat.icon}</span> {cat.name}
              </h2>
              <button
                onClick={() => {
                  updateFilters({ category: [cat.name] });
                  navigate('/search');
                }}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Filter in search
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(`/items/${item.id}`)}
                  className="card p-4 text-left hover:border-primary/30 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-xl mb-3 bg-muted"
                  />
                  <h3 className="text-sm font-bold line-clamp-2">{item.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-black">{formatCurrency(item.price)}</span>
                    <span className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {item.rating}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        );
      })}

      {products.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No items available. Try the search platform.</p>
        </div>
      )}
    </div>
  );
};

export default Categories;
