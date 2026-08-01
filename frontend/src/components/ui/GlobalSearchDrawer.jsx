import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchService, userService, brandService } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

export const GlobalSearchDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [popularBrands, setPopularBrands] = useState([]);
  const { user } = useAuth();
  
  // Debounce helper for search
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Load brands on mount
  useEffect(() => {
    if (isOpen && popularBrands.length === 0) {
      brandService.getAll().then(res => {
        const brands = res.data.data || [];
        setPopularBrands(brands.slice(0, 5));
      }).catch(err => console.error(err));
    }
  }, [isOpen, popularBrands.length]);

  // Load search history from API
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await userService.getSearchHistory();
        setRecentSearches(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (isOpen) {
      if (user) fetchHistory();
      else setRecentSearches([]);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, user]);

  // Fetch live search results
  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchService.searchProducts({ q: debouncedQuery.trim(), limit: 5 })
        .then(res => setSearchResults(res.data?.data || []))
        .catch(err => console.error(err));
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  if (!isOpen) return null;

  const saveSearchQuery = async (term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    
    // Optimistic update
    const updated = [clean, ...recentSearches.filter((s) => s !== clean)].slice(0, 5);
    setRecentSearches(updated);

    if (user) {
      try {
        await userService.addSearchHistory(clean);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const clearHistory = async () => {
    setRecentSearches([]);
    if (user) {
      try {
        await userService.clearSearchHistory();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSelectProduct = (product) => {
    saveSearchQuery(product.name);
    onClose();
    navigate(`/product/${product._id || product.id}`);
  };

  const handleSelectSearchTerm = (term) => {
    saveSearchQuery(term);
    onClose();
    navigate(`/store?search=${encodeURIComponent(term)}`);
  };

  const handleBrandSelect = (brandId) => {
    onClose();
    navigate(`/store?brand=${encodeURIComponent(brandId)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#FAF9F6] h-full shadow-2xl flex flex-col z-10 animate-slide-left select-none overflow-hidden">
        <div className="p-4 sm:p-6 bg-white border-b border-gray-200/60 flex items-center gap-3">
          <div className="flex-1 relative flex items-center">
            <Search size={18} className="absolute left-3.5 text-neutral-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  handleSelectSearchTerm(query.trim());
                }
              }}
              placeholder="Search products, brands, models..."
              className="w-full bg-[#FAF9F6] border border-gray-250 focus:border-gold-accent rounded-full py-2.5 pl-10 pr-9 text-xs sm:text-sm font-semibold text-neutral-900 placeholder-gray-400 focus:outline-none transition-colors"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="absolute right-3 p-1 text-gray-400 hover:text-neutral-900 rounded-full">
                <X size={14} />
              </button>
            )}
          </div>
          <button type="button" onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 bg-[#FAF9F6] border border-gray-200 rounded-full transition-all cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {query.trim() ? (
            <div>
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
                Search Results ({searchResults.length})
              </h4>
              {searchResults.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs font-bold text-gray-500 mb-2">No matching products found</p>
                  <p className="text-[11px] text-gray-400 mb-4">Try searching for "iPhone", "Samsung", or "Pixel"</p>
                  <button type="button" onClick={() => setQuery('')} className="px-4 py-2 bg-neutral-950 text-white rounded-full text-xs font-bold">
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {searchResults.map((product) => {
                    const formatPrice = (price) => typeof price === 'number' ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price) : price;
                    const pImage = product.images?.[0]?.url || product.image;
                    const pBrand = product.brandName || product.brand?.name || product.brand;
                    return (
                      <div key={product._id || product.id} onClick={() => handleSelectProduct(product)} className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-150/60 hover:border-gold-accent/40 shadow-xs hover:shadow-soft-ui transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-[#ECEFF2]/50 rounded-xl p-1 flex items-center justify-center shrink-0">
                          <img src={pImage} alt={product.name} className="h-full w-auto object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h5 className="text-xs font-extrabold text-neutral-900 truncate">{product.name}</h5>
                          <p className="text-[10px] text-gray-400 font-bold">{pBrand} · {product.conditionType || product.condition}</p>
                          <span className="text-xs font-black text-neutral-950 block mt-0.5">{formatPrice(product.price)}</span>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Recent Searches</h4>
                    <button type="button" onClick={clearHistory} className="text-[10px] font-bold text-neutral-400 hover:text-red-500 transition-colors cursor-pointer">Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, idx) => (
                      <button key={idx} type="button" onClick={() => handleSelectSearchTerm(term)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200/70 rounded-full text-xs font-bold text-neutral-800 hover:border-gold-accent transition-colors cursor-pointer">
                        <Clock size={12} className="text-gray-400" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {popularBrands.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2.5">Popular Brands</h4>
                  <div className="flex flex-wrap gap-2">
                    {popularBrands.map((brand) => (
                      <button key={brand._id} type="button" onClick={() => handleBrandSelect(brand._id)} className="px-3.5 py-1.5 bg-white border border-gray-200/70 rounded-full text-xs font-extrabold text-neutral-900 hover:bg-neutral-950 hover:text-white transition-all cursor-pointer shadow-xs">
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2.5">Explore Collections</h4>
                <div className="space-y-2">
                  <div onClick={() => { onClose(); navigate('/store?category=apple'); }} className="flex items-center justify-between p-3 bg-white border border-gray-150/60 rounded-2xl cursor-pointer hover:border-gold-accent transition-all">
                    <span className="text-xs font-extrabold text-neutral-900">Apple iPhones Catalog</span>
                    <ArrowRight size={14} className="text-gray-400" />
                  </div>
                  <div onClick={() => { onClose(); navigate('/store?category=samsung'); }} className="flex items-center justify-between p-3 bg-white border border-gray-150/60 rounded-2xl cursor-pointer hover:border-gold-accent transition-all">
                    <span className="text-xs font-extrabold text-neutral-900">Samsung Galaxy Flagships</span>
                    <ArrowRight size={14} className="text-gray-400" />
                  </div>
                  <div onClick={() => { onClose(); navigate('/store?conditionType=Used'); }} className="flex items-center justify-between p-3 bg-white border border-gray-150/60 rounded-2xl cursor-pointer hover:border-gold-accent transition-all">
                    <span className="text-xs font-extrabold text-neutral-900">Certified Pre-Owned</span>
                    <ShieldCheck size={16} className="text-amber-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchDrawer;
