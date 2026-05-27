import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, SlidersHorizontal } from 'lucide-react';
import { useCatalogStore } from '../store/useCatalogStore';
import { formatCurrency } from '../utils/formatters';

const Products = () => {
  const navigate = useNavigate();
  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const incrementViews = useCatalogStore((s) => s.incrementViews);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const name = (p.title || p.name || '').toLowerCase();
      const matchSearch = !search || name.includes(search.toLowerCase());
      const matchCat = category === 'all' || p.category === category;
      return matchSearch && matchCat;
    });
  }, [products, search, category]);

  const handleOpen = (id) => {
    incrementViews();
    navigate(`/items/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black">Products</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse {products.length} items across all categories
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 w-full text-sm"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field pl-10 pr-8 text-sm min-w-[180px]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            whileHover={{ y: -4 }}
            onClick={() => handleOpen(item.id)}
            className="product-card text-left w-full"
          >
            <div className="aspect-[4/3] bg-muted overflow-hidden">
              <img
                src={item.image || item.images?.[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <span className="text-[10px] font-bold text-primary uppercase">{item.category}</span>
              <h3 className="text-sm font-bold mt-1 line-clamp-2">{item.title || item.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="font-black">{formatCurrency(item.price)}</span>
                <span className="flex items-center gap-0.5 text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {item.rating}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-16 text-muted-foreground">No products found.</p>
      )}
    </div>
  );
};

export default Products;
