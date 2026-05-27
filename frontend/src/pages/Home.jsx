import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  Search,
  Filter,
  Clock,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { useSearchStore } from '../store/useSearchStore';
import SearchBar from '../components/search/SearchBar';
import { useCatalogStore } from '../store/useCatalogStore';
import { formatCurrency } from '../utils/formatters';

const POPULAR_CATEGORIES = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
  { name: 'Education', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80' },
  { name: 'Books', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80' },
  { name: 'Courses', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80' },
  { name: 'Learning Resources', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80' },
  { name: 'Technology Tools', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15,
    },
  },
};

const ItemCard = ({ item, onClick }) => (
  <motion.button
    type="button"
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="product-card text-left w-full h-full flex flex-col bg-card border border-border/80 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
  >
    <div className="relative overflow-hidden bg-muted aspect-[4/3] w-full flex-shrink-0">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        onError={(e) => {
          e.target.src =
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400';
        }}
      />
      <span className="absolute top-3 left-3 badge-orange text-[9px] font-bold py-1 px-2.5 rounded-lg bg-orange-500 text-white shadow-sm">{item.category}</span>
    </div>
    <div className="p-4 flex flex-col flex-grow justify-between">
      <div>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">{item.brand || 'Generic'}</p>
        <h3 className="text-sm font-bold text-foreground mt-1 line-clamp-2 leading-snug">
          {item.title}
        </h3>
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-black">{item.rating}</span>
          <span className="text-[10px] text-muted-foreground font-semibold">({item.reviews || 0})</span>
        </div>
        <p className="text-base font-black text-foreground mt-2">{formatCurrency(item.price)}</p>
      </div>
    </div>
  </motion.button>
);

const Home = () => {
  const navigate = useNavigate();
  const catalogProducts = useCatalogStore((s) => s.products);
  const catalogCategories = useCatalogStore((s) => s.categories);
  const {
    query,
    filters,
    results,
    loading,
    recentSearches,
    updateFilters,
    fetchResults,
    updateQuery,
  } = useSearchStore();

  useEffect(() => {
    fetchResults();
  }, [fetchResults, catalogProducts]);

  const previewResults = useMemo(
    () => (query || filters.category.length ? results : catalogProducts).slice(0, 12),
    [results, catalogProducts, query, filters.category.length]
  );

  const categoryNames = catalogCategories.map((c) => c.name);

  const handleCategoryClick = (cat) => {
    updateFilters({ category: [cat] });
    navigate('/search');
  };

  const handlePriceMax = (max) => {
    updateFilters({ price: { ...filters.price, max: Number(max) } });
  };

  const handleRating = (rating) => {
    updateFilters({ rating: filters.rating === rating ? 0 : rating });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero + Global Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-violet-50 to-white dark:from-indigo-950/20 dark:via-violet-950/15 dark:to-background border-b border-border/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto space-y-4"
          >
            <span className="badge-orange inline-flex items-center gap-1">
              <Search className="w-3 h-3" /> Multi-Category Search Platform
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Discover resources across{' '}
              <span className="gradient-text">every category</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              Search electronics, courses, books, education modules, and technology tools with
              smart filters.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <SearchBar
              onSearch={(term) => {
                updateQuery(term);
                fetchResults();
              }}
            />
          </motion.div>

          {/* Inline filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4"
          >
            <div className="card p-4 space-y-2">
              <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Category
              </p>
              <select
                className="input-field text-sm"
                value={filters.category[0] || ''}
                onChange={(e) =>
                  updateFilters({ category: e.target.value ? [e.target.value] : [] })
                }
              >
                <option value="">All categories</option>
                {categoryNames.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="card p-4 space-y-2">
              <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Max Price
              </p>
              <input
                type="range"
                min={0}
                max={500}
                step={10}
                value={filters.price.max}
                onChange={(e) => handlePriceMax(e.target.value)}
                className="w-full accent-primary"
              />
              <p className="text-xs font-semibold">Up to {formatCurrency(filters.price.max)}</p>
            </div>
            <div className="card p-4 space-y-2">
              <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Star className="w-3.5 h-3.5" /> Min Rating
              </p>
              <div className="flex gap-2">
                {[4, 3, 2].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRating(r)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors flex-1 ${
                      filters.rating === r
                        ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {r}★+
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <button
              onClick={() => navigate('/search')}
              className="btn-primary text-sm px-6 inline-flex items-center gap-2 shadow-lg"
            >
              View all results <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Dynamic search preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-heading flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              {query ? `Results for "${query}"` : 'Featured Items'}
            </h2>
            <p className="section-subheading">
              {loading ? 'Searching...' : `${previewResults.length} items shown`}
            </p>
          </div>
          <Link
            to="/search"
            className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
          >
            Full results <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5"
        >
          {previewResults.map((item) => (
            <motion.div key={item.id} variants={itemVariants} className="h-full">
              <ItemCard
                item={item}
                onClick={() => navigate(`/items/${item.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Popular categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="section-heading mb-8">Popular Categories</h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5"
        >
          {POPULAR_CATEGORIES.map((cat) => (
            <motion.button
              key={cat.name}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(cat.name)}
              className="relative group h-32 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-border/80 transition-all duration-300 w-full"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-4 text-left" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-left z-10">
                <span className="text-sm font-bold text-white tracking-wide group-hover:text-primary transition-colors duration-200">
                  {cat.name}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="section-heading flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-primary" /> Recent Searches
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  updateQuery(term);
                  fetchResults();
                  navigate('/search');
                }}
                className="px-5 py-2.5 rounded-full bg-secondary/80 text-sm font-bold hover:bg-primary hover:text-white hover:shadow-md transition-all duration-200"
              >
                {term}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Quick stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Total Items', value: catalogProducts.length },
            { label: 'Categories', value: catalogCategories.length },
            { label: 'Avg. Rating', value: '4.7★' },
            { label: 'Platforms', value: '6+' },
          ].map((s) => (
            <div key={s.label} className="card p-6 text-center hover:border-primary/20 transition-all duration-200">
              <p className="text-3xl font-black text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
