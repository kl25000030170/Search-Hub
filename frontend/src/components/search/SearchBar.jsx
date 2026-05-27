import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, HelpCircle, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '../../store/useSearchStore';
import { MOCK_AUTO_SUGGESTIONS } from '../../utils/constants';

export const SearchBar = ({ onSearch }) => {
  const { 
    query, 
    updateQuery, 
    recentSearches, 
    addRecentSearch, 
    removeRecentSearch,
    fetchResults 
  } = useSearchStore();

  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  
  const containerRef = useRef(null);

  // Click outside to collapse suggestions dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter suggestions dynamically while typing
  useEffect(() => {
    if (!query || query.trim() === '') {
      const timer = setTimeout(() => {
        setSuggestions([]);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }
    
    const loadTimer = setTimeout(() => {
      setLoading(true);
    }, 0);

    const delayDebounce = setTimeout(() => {
      const filtered = MOCK_AUTO_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setLoading(false);
    }, 300); // 300ms input debounce

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(delayDebounce);
    };
  }, [query]);

  const handleSubmit = (searchVal) => {
    const targetVal = searchVal || query;
    if (targetVal.trim() === '') return;

    updateQuery(targetVal);
    addRecentSearch(targetVal);
    setShowDropdown(false);
    setActiveIdx(-1);
    
    // Trigger parent search if provided, or fetch results from store
    if (onSearch) {
      onSearch(targetVal);
    } else {
      fetchResults();
    }
  };

  const handleKeyDown = (e) => {
    const totalSuggestions = suggestions.length + recentSearches.slice(0, 4).length;
    if (totalSuggestions === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((prev) => (prev + 1 >= totalSuggestions ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((prev) => (prev - 1 < 0 ? totalSuggestions - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0) {
        // Select active option
        const suggestionItems = [...recentSearches.slice(0, 4), ...suggestions];
        const selected = suggestionItems[activeIdx];
        handleSubmit(selected);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const getCombinedItems = useCallback(() => {
    const recent = recentSearches.slice(0, 4); // show top 4 recents
    return {
      recent,
      autosuggest: suggestions
    };
  }, [recentSearches, suggestions]);

  const { recent, autosuggest } = getCombinedItems();

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl" onKeyDown={handleKeyDown}>
      <div className="relative flex items-center">
        {/* Search Input Container */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              updateQuery(e.target.value);
              setShowDropdown(true);
              setActiveIdx(-1);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search items, categories, resources..."
            className="w-full pl-12 pr-10 py-3.5 bg-card border border-border/80 rounded-2xl text-sm font-semibold shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
          {query && (
            <button 
              onClick={() => {
                updateQuery('');
                setSuggestions([]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Suggestions Panel */}
      <AnimatePresence>
        {showDropdown && (query || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 p-2"
          >
            {loading && suggestions.length === 0 && (
              <div className="flex items-center gap-2 p-4 text-xs font-semibold text-muted-foreground">
                <div className="w-4.5 h-4.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Searching recommendations...</span>
              </div>
            )}

            {/* Recent Searches */}
            {recent.length > 0 && !query && (
              <div className="mb-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  Recent Searches
                </span>
                <div className="space-y-0.5">
                  {recent.map((item, idx) => {
                    const isHovered = activeIdx === idx;
                    return (
                      <div
                        key={item}
                        onClick={() => handleSubmit(item)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer group transition-colors ${
                          isHovered ? 'bg-secondary text-primary' : 'hover:bg-secondary/40 text-foreground'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <History className="w-4 h-4 text-muted-foreground/60" />
                          {item}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecentSearch(item);
                          }}
                          className="p-1 rounded-lg hover:bg-card opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {autosuggest.length > 0 && (
              <div>
                <span className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Suggestions
                </span>
                <div className="space-y-0.5">
                  {autosuggest.map((item, idx) => {
                    const absoluteIdx = recent.length + idx;
                    const isHovered = activeIdx === absoluteIdx;
                    return (
                      <div
                        key={item}
                        onClick={() => handleSubmit(item)}
                        className={`flex items-center px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${
                          isHovered ? 'bg-secondary text-primary' : 'hover:bg-secondary/40 text-foreground'
                        }`}
                      >
                        <Search className="mr-2 w-4 h-4 text-muted-foreground/60" />
                        {item}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty States */}
            {suggestions.length === 0 && query && !loading && (
              <div className="p-4 text-center text-xs font-semibold text-muted-foreground">
                No active suggestions found. Press Enter to search "{query}".
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
