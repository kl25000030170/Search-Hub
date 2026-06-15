import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, RotateCcw, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useSearchStore } from '../../store/useSearchStore';
import FilterSection from './FilterSection';
import { BASE_FILTER_METADATA } from '../../utils/constants';
import searchApi from '../../api/searchApi';

const PanelContent = ({ clearFilters, filters, metadata, handleCheckbox, handlePrice, updateFilters }) => (
  <div className="flex flex-col h-full bg-card">
    {/* Sticky Header Actions */}
    <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur-md z-10">
      <div className="flex items-center gap-2 font-black text-base text-foreground">
        <Filter className="w-5 h-5 text-primary" />
        <span>Advanced Filters</span>
      </div>
      <button
        onClick={clearFilters}
        className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors duration-200"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Clear All
      </button>
    </div>

    {/* Accordion Filter Containers */}
    <div className="flex-1 overflow-y-auto px-5 py-2 space-y-1">
      
      {/* Categories */}
      <FilterSection title="Category" defaultOpen={true}>
        <div className="space-y-2.5">
          {metadata.categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.category.includes(cat)}
                onChange={() => handleCheckbox('category', cat)}
                className="w-4.5 h-4.5 rounded border-border text-primary focus:ring-primary/20 bg-background cursor-pointer"
              />
              <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Slider */}
      <FilterSection title="Price Limit" defaultOpen={true}>
        <div className="space-y-4 pt-1 px-1">
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={filters.price.max}
            onChange={(e) => handlePrice('max', e.target.value)}
            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
          />
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <span className="text-[10px] text-muted-foreground font-black tracking-wider uppercase">Min</span>
              <div className="flex items-center border border-border bg-secondary/10 px-2 py-1.5 rounded-xl mt-1">
                <span className="text-xs text-muted-foreground mr-1">$</span>
                <input
                  type="number"
                  value={filters.price.min}
                  onChange={(e) => handlePrice('min', e.target.value)}
                  className="w-full bg-transparent text-sm font-bold focus:outline-none"
                />
              </div>
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-muted-foreground font-black tracking-wider uppercase">Max</span>
              <div className="flex items-center border border-border bg-secondary/10 px-2 py-1.5 rounded-xl mt-1">
                <span className="text-xs text-muted-foreground mr-1">$</span>
                <input
                  type="number"
                  value={filters.price.max}
                  onChange={(e) => handlePrice('max', e.target.value)}
                  className="w-full bg-transparent text-sm font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Brand Checkboxes */}
      <FilterSection title="Brand" defaultOpen={true}>
        <div className="space-y-2.5">
          {metadata.brands.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleCheckbox('brands', brand)}
                className="w-4.5 h-4.5 rounded border-border text-primary focus:ring-primary/20 bg-background cursor-pointer"
              />
              <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Ratings Star Selector */}
      <FilterSection title="Ratings" defaultOpen={false}>
        <div className="space-y-2">
          {[4, 3, 2].map((star) => (
            <button
              key={star}
              onClick={() => updateFilters({ rating: filters.rating === star ? 0 : star })}
              className={clsx(
                "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left border transition-all duration-200",
                filters.rating === star
                  ? "bg-primary/10 border-primary/20 text-primary font-bold"
                  : "hover:bg-secondary/40 border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={clsx(
                      "w-4.5 h-4.5",
                      i < star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs font-bold ml-1.5">& Up</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Tags Capsules */}
      <FilterSection title="Popular Tags" defaultOpen={false}>
        <div className="flex flex-wrap gap-2 pt-1">
          {metadata.tags.map((tag) => {
            const isSelected = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleCheckbox('tags', tag)}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/15"
                    : "bg-secondary/40 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Stock Toggle */}
      <FilterSection title="Availability" defaultOpen={true}>
        <label className="flex items-center justify-between cursor-pointer group py-1">
          <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">Show only in stock</span>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={filters.availability}
              onChange={() => updateFilters({ availability: !filters.availability })}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-secondary rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-primary" />
          </div>
        </label>
      </FilterSection>

      {/* Difficulty Level Checkboxes */}
      <FilterSection title="Difficulty Level" defaultOpen={true}>
        <div className="space-y-2.5">
          {metadata.difficulties.map((level) => (
            <label key={level} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.difficulty.includes(level)}
                onChange={() => handleCheckbox('difficulty', level)}
                className="w-4.5 h-4.5 rounded border-border text-primary focus:ring-primary/20 bg-background cursor-pointer"
              />
              <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{level}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  </div>
);

export const FilterPanel = ({ isOpen, onClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, updateFilters, clearFilters } = useSearchStore();

  const [metadata, setMetadata] = useState(BASE_FILTER_METADATA);

  // Dynamic filter rendering from API data
  useEffect(() => {
    const fetchFilterMetadata = async () => {
      try {
        const data = await searchApi.fetchFilters();
        if (data) {
          setMetadata(data);
        } else {
          setMetadata(BASE_FILTER_METADATA);
        }
      } catch (err) {
        console.warn('Axios fetchFilters failed, using default constants:', err);
        setMetadata(BASE_FILTER_METADATA);
      }
    };
    fetchFilterMetadata();
  }, []);

  // Parse URL search parameters on mount
  useEffect(() => {
    const urlFilters = {};

    const category = searchParams.get('category');
    if (category) urlFilters.category = category.split(',');

    const brands = searchParams.get('brands');
    if (brands) urlFilters.brands = brands.split(',');

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      urlFilters.price = {
        min: parseInt(minPrice) || 0,
        max: parseInt(maxPrice) || 2000
      };
    }

    const rating = searchParams.get('rating');
    if (rating) urlFilters.rating = parseInt(rating);

    const tags = searchParams.get('tags');
    if (tags) urlFilters.tags = tags.split(',');

    const availability = searchParams.get('availability');
    if (availability) urlFilters.availability = availability === 'true';

    const difficulty = searchParams.get('difficulty');
    if (difficulty) urlFilters.difficulty = difficulty.split(',');

    if (Object.keys(urlFilters).length > 0) {
      updateFilters(urlFilters);
    }
  }, []);

  // Sync state to URL search parameters
  useEffect(() => {
    const params = {};

    if (filters.category.length > 0) params.category = filters.category.join(',');
    if (filters.brands.length > 0) params.brands = filters.brands.join(',');
    if (filters.price.min > 0) params.minPrice = filters.price.min.toString();
    if (filters.price.max < 2000) params.maxPrice = filters.price.max.toString();
    if (filters.rating > 0) params.rating = filters.rating.toString();
    if (filters.tags.length > 0) params.tags = filters.tags.join(',');
    if (filters.availability) params.availability = 'true';
    if (filters.difficulty.length > 0) params.difficulty = filters.difficulty.join(',');

    setSearchParams(params, { replace: true });
  }, [filters]);

  const handleCheckbox = (key, val) => {
    const currentList = filters[key] || [];
    const updated = currentList.includes(val)
      ? currentList.filter((x) => x !== val)
      : [...currentList, val];
    updateFilters({ [key]: updated });
  };

  const handlePrice = (bound, val) => {
    const parsedVal = parseInt(val) || 0;
    updateFilters({
      price: { ...filters.price, [bound]: parsedVal }
    });
  };

  return (
    <>
      {/* Desktop Permanent Sidebar Container */}
      <aside className="hidden lg:block w-72 bg-card border border-border rounded-2xl sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-hidden shadow-sm">
        <PanelContent 
          clearFilters={clearFilters}
          filters={filters}
          metadata={metadata}
          handleCheckbox={handleCheckbox}
          handlePrice={handlePrice}
          updateFilters={updateFilters}
        />
      </aside>

      {/* Mobile Drawer Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />
            {/* Content box slider */}
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-50 h-full w-[300px] bg-card ml-auto shadow-2xl border-l border-border"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground z-20"
              >
                <X className="w-5 h-5" />
              </button>
              <PanelContent 
                clearFilters={clearFilters}
                filters={filters}
                metadata={metadata}
                handleCheckbox={handleCheckbox}
                handlePrice={handlePrice}
                updateFilters={updateFilters}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterPanel;
