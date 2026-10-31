import React, { useMemo, useState } from 'react';
import { ArrowRight, Search, Sparkles, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { EyewearArtwork } from '../common/EyewearArtwork';

export const SearchModal: React.FC = () => {
  const {
    products,
    categories,
    searchModalOpen,
    setSearchModalOpen,
    setQuickViewProduct,
    setLensConfigProduct,
  } = useShop();

  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return products.filter((p) => {
      const catName = categories.find((c) => c.id === p.categoryId)?.name || '';
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.frameShape.toLowerCase().includes(q) ||
        p.frameMaterial.toLowerCase().includes(q) ||
        p.gender.toLowerCase().includes(q) ||
        catName.toLowerCase().includes(q)
      );
    });
  }, [products, categories, query]);

  if (!searchModalOpen) return null;

  const handleSelectProduct = (product: Product) => {
    setSearchModalOpen(false);
    setQuickViewProduct(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E7E5E0] overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-[#E7E5E0] flex items-center gap-3 bg-[#FAF9F6]">
          <Search className="w-5 h-5 text-[#C6A15B]" />
          <input
            type="text"
            autoFocus
            placeholder="Search eyewear by model, brand, shape (e.g. Aviator, Titanium, Cat Eye)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-[#222222] placeholder-stone-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-700 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="p-1 rounded-full text-stone-400 hover:text-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        {!query && (
          <div className="p-4 bg-white border-b border-stone-100 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-stone-400 shrink-0">Popular:</span>
            {['Titanium', 'Aviator', 'Cat Eye', 'Blue Cut', 'Geometric', 'Round'].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-2.5 py-1 rounded bg-stone-100 hover:bg-[#C6A15B]/15 hover:text-[#8F6F30] text-stone-700 transition-colors whitespace-nowrap"
              >
                {term}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {query.trim() && filteredResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">
              No matching eyewear frames found for "{query}". Try searching "Aviator", "Titanium", or "Gold".
            </div>
          ) : (
            filteredResults.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#E7E5E0] cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-11 rounded-lg border border-stone-200 overflow-hidden bg-white shrink-0">
                    <EyewearArtwork
                      shape={product.frameShape}
                      color={product.colors[0]}
                      isOptical={product.isOptical}
                      customImageUrl={product.customImageUrl}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#C6A15B] font-semibold">
                      {product.brand}
                    </p>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#222222] group-hover:text-[#C6A15B] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      {product.frameShape} · {product.frameMaterial} · {product.gender}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-serif font-bold text-stone-900">
                    ${product.price}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#C6A15B] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
