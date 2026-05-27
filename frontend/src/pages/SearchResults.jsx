import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, ArrowUpDown, Star, Eye, Info, LayoutGrid, Layers, RefreshCw, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useSearchStore } from '../store/useSearchStore';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import FilterPanel from '../components/filters/FilterPanel';
import SearchBar from '../components/search/SearchBar';
import { formatCurrency } from '../utils/formatters';

export const SearchResults = () => {
  const navigate = useNavigate();
  const {
    query,
    filters,
    results,
    loading,
    hasMore,
    updateFilters,
    fetchResults,
    loadMoreResults,
    clearFilters
  } = useSearchStore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('All');
  const [sortBy, setSortBy] = useState('relevance'); // relevance, price-asc, price-desc, rating
  const [isGroupedView, setIsGroupedView] = useState(false);

  // Trigger search on query/filter updates
  useEffect(() => {
    fetchResults();
  }, [query, filters, fetchResults]);

  // Infinite Scroll Trigger
  const scrollRef = useInfiniteScroll(loadMoreResults, loading, hasMore);

  // Client side tab category aggregation
  const categoriesList = useMemo(() => {
    const list = new Set();
    results.forEach((p) => list.add(p.category));
    return ['All', ...Array.from(list)];
  }, [results]);

  // Derived filtered & sorted items
  const finalResults = useMemo(() => {
    let items = [...results];

    // Category Tab filter
    if (selectedCategoryTab !== 'All') {
      items = items.filter((p) => p.category === selectedCategoryTab);
    }

    // Sort Items
    if (sortBy === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'relevance') {
      // Sort by semantic match score if present
      items.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    return items;
  }, [results, selectedCategoryTab, sortBy]);

  // Grouped category view grouping calculation
  const groupedResults = useMemo(() => {
    if (!isGroupedView) return null;
    const groups = {};
    finalResults.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [finalResults, isGroupedView]);

  const activePills = useMemo(() => {
    const pills = [];
    if (filters.category.length > 0) filters.category.forEach(c => pills.push({ key: 'category', val: c }));
    if (filters.brands.length > 0) filters.brands.forEach(b => pills.push({ key: 'brands', val: b }));
    if (filters.tags.length > 0) filters.tags.forEach(t => pills.push({ key: 'tags', val: t }));
    if (filters.difficulty.length > 0) filters.difficulty.forEach(d => pills.push({ key: 'difficulty', val: d }));
    return pills;
  }, [filters]);

  const removePill = (key, val) => {
    const currentList = filters[key];
    updateFilters({
      [key]: currentList.filter(x => x !== val)
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Dynamic Filter Side Panel */}
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          
          {/* Header Action Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                Search Results
              </h1>
              <p className="text-sm font-semibold text-muted-foreground">
                Showing <span className="text-foreground font-black">{finalResults.length}</span> matching items
                {query && <span> for "{query}"</span>}
              </p>
            </div>
            <SearchBar />
          </div>

            {/* View Layout Toggles and Filter buttons */}
            <div className="flex items-center gap-2.5">
              {/* Mobile filter drawer button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-primary text-primary-foreground px-4.5 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-primary/10 transition-transform active:scale-95"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              {/* Grouped category toggle */}
              <button
                onClick={() => setIsGroupedView(!isGroupedView)}
                className={clsx(
                  "p-3 rounded-2xl border transition-all duration-200",
                  isGroupedView 
                    ? "bg-primary/10 text-primary border-primary/20" 
                    : "bg-card border-border hover:bg-secondary/40 text-muted-foreground"
                )}
                title="Toggle Grouped Category view"
              >
                {isGroupedView ? <Layers className="w-4.5 h-4.5" /> : <LayoutGrid className="w-4.5 h-4.5" />}
              </button>

              {/* Dynamic Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-card border border-border/80 px-4.5 py-3 rounded-2xl text-xs font-bold outline-none cursor-pointer pr-10 hover:border-primary/50 transition-colors shadow-sm text-foreground"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating: Highest</option>
                </select>
                <ArrowUpDown className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Pills List */}
          {activePills.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs font-bold text-muted-foreground">Active filters:</span>
              {activePills.map((pill) => (
                <div
                  key={`${pill.key}-${pill.val}`}
                  className="flex items-center gap-1 bg-primary/5 border border-primary/15 text-primary text-xs font-bold px-3 py-1 rounded-full animate-in zoom-in-95 duration-200"
                >
                  <span>{pill.val}</span>
                  <button onClick={() => removePill(pill.key, pill.val)} className="p-0.5 hover:bg-primary/10 rounded-full transition-colors ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Category Navigation Tabs */}
          {categoriesList.length > 1 && (
            <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-6 overflow-x-auto scrollbar-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryTab(cat)}
                  className={clsx(
                    "px-4.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0",
                    selectedCategoryTab === cat
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                      : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Skeletons or Result Renderings */}
          {loading && finalResults.length === 0 ? (
            <SkeletonGrid />
          ) : finalResults.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {isGroupedView ? (
                // Grouped by Category View
                <div className="space-y-10">
                  {Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category} className="space-y-4">
                      <h2 className="text-lg font-black tracking-tight text-foreground border-l-4 border-primary pl-3">
                        {category} ({items.length})
                      </h2>
                      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {items.map((item) => (
                          <ItemResultCard key={item.id} item={item} onView={() => navigate(`/items/${item.id}`)} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Classic Grid View
                <motion.div
                  layout
                  className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {finalResults.map((item) => (
                    <ItemResultCard
                      key={item.id}
                      item={item}
                      onView={() => navigate(`/items/${item.id}`)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            // Empty search state
            <div className="flex flex-col items-center justify-center text-center py-20 bg-card border border-dashed border-border rounded-3xl p-6">
              <div className="w-16 h-16 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground mb-4">
                <Info className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-foreground">No matches found</h3>
              <p className="text-sm font-medium text-muted-foreground max-w-xs mx-auto mt-2">
                Try clearing active query terms, adjusting sliders, or disabling filters to discover more items.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/15 hover:scale-105 transition-transform"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Infinite Scroll trigger target */}
          {hasMore && finalResults.length > 0 && (
            <div ref={scrollRef} className="flex justify-center pt-8 pb-4">
              <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground">
                <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                <span>Loading more universal index entries...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Skeleton loading grid blocks
const SkeletonGrid = () => (
  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="bg-card border border-border rounded-2xl h-[410px] p-5 space-y-4 animate-pulse">
        <div className="w-full h-44 bg-muted rounded-xl" />
        <div className="w-1/3 h-4 bg-muted rounded-md" />
        <div className="w-3/4 h-5 bg-muted rounded-md" />
        <div className="w-full h-8 bg-muted rounded-md" />
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="w-20 h-8 bg-muted rounded-md" />
          <div className="w-10 h-10 bg-muted rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

const ItemResultCard = ({ item, onView }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Thumbnail layout */}
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Out of Stock banner */}
        {!item.inStock && (
          <div className="absolute top-3 right-3 bg-red-500/90 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
            Unavailable
          </div>
        )}

        {/* Tag badges */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1 max-w-[90%]">
          {item.tags.map((t) => (
            <span key={t} className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Details Box */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.brand}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-black text-foreground">{item.rating}</span>
            <span className="text-[10px] text-muted-foreground">({item.reviews})</span>
          </div>
        </div>

        <h3 className="font-extrabold text-base text-foreground leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-200">
          {item.title}
        </h3>

        <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">{item.category}</p>

        <p className="text-xs font-semibold text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {item.description}
        </p>

        {(item.attributes || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.attributes.slice(0, 3).map((attr) => (
              <span
                key={attr.name}
                className="text-[9px] font-bold px-2 py-1 rounded-md bg-secondary/60 text-muted-foreground"
              >
                {attr.name}: {attr.value}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-muted-foreground uppercase leading-none mb-1">Price</span>
            <span className="text-2xl font-black tracking-tight text-foreground">{formatCurrency(item.price)}</span>
          </div>

          <button
            onClick={onView}
            className="p-3 rounded-xl shadow-md bg-primary hover:bg-primary/95 text-primary-foreground shadow-primary/10 hover:scale-105 transition-all active:scale-95"
          >
            <Eye className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchResults;
