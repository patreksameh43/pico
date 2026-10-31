import React, { useMemo, useState } from 'react';
import {
  ChevronRight,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { FrameMaterial, FrameShape, Gender, Product } from '../../types';
import { ProductCard } from '../product/ProductCard';

interface CatalogBrowserProps {
  onSelectCategory?: (id: string) => void;
}

export const CatalogBrowser: React.FC<CatalogBrowserProps> = ({ onSelectCategory }) => {
  const {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    filterState,
    setFilterState,
  } = useShop();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available options derived from dataset
  const allShapes: FrameShape[] = [
    'Round',
    'Square',
    'Rectangle',
    'Aviator',
    'Cat Eye',
    'Oval',
    'Geometric',
  ];

  const allMaterials: FrameMaterial[] = [
    'Japanese Titanium',
    'Italian Acetate',
    'Stainless Steel',
    'Carbon Fiber',
    'TR90 Ultem',
  ];

  const allGenders: Gender[] = ['Men', 'Women', 'Unisex', 'Kids'];

  const allBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand)));
  }, [products]);

  // Current Category details
  const currentCategory = categories.find((c) => c.id === activeCategory);

  // Filter handlers
  const toggleShape = (shape: FrameShape) => {
    setFilterState((prev) => {
      const exists = prev.shapes.includes(shape);
      return {
        ...prev,
        shapes: exists ? prev.shapes.filter((s) => s !== shape) : [...prev.shapes, shape],
      };
    });
  };

  const toggleMaterial = (material: FrameMaterial) => {
    setFilterState((prev) => {
      const exists = prev.materials.includes(material);
      return {
        ...prev,
        materials: exists
          ? prev.materials.filter((m) => m !== material)
          : [...prev.materials, material],
      };
    });
  };

  const toggleGender = (g: Gender) => {
    setFilterState((prev) => {
      const exists = prev.genders.includes(g);
      return {
        ...prev,
        genders: exists ? prev.genders.filter((x) => x !== g) : [...prev.genders, g],
      };
    });
  };

  const toggleBrand = (b: string) => {
    setFilterState((prev) => {
      const exists = prev.brands.includes(b);
      return {
        ...prev,
        brands: exists ? prev.brands.filter((x) => x !== b) : [...prev.brands, b],
      };
    });
  };

  const resetAllFilters = () => {
    setActiveCategory('all');
    setFilterState({
      searchQuery: '',
      brands: [],
      priceRange: [100, 600],
      shapes: [],
      materials: [],
      genders: [],
      colors: [],
      inStockOnly: false,
      sortBy: 'featured',
    });
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Category
      if (activeCategory !== 'all') {
        const matchesCategory =
          p.categoryId === activeCategory ||
          (activeCategory === 'cat-luxury' && p.isLuxury) ||
          (activeCategory === 'cat-optical' && p.isOptical) ||
          (activeCategory === 'cat-sunglasses' && !p.isOptical);
        if (!matchesCategory) return false;
      }

      // 2. Search query
      if (filterState.searchQuery) {
        const q = filterState.searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.frameShape.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 3. Brands
      if (filterState.brands.length > 0 && !filterState.brands.includes(p.brand)) {
        return false;
      }

      // 4. Shape
      if (filterState.shapes.length > 0 && !filterState.shapes.includes(p.frameShape)) {
        return false;
      }

      // 5. Material
      if (filterState.materials.length > 0 && !filterState.materials.includes(p.frameMaterial)) {
        return false;
      }

      // 6. Gender
      if (
        filterState.genders.length > 0 &&
        !filterState.genders.includes(p.gender) &&
        p.gender !== 'Unisex'
      ) {
        return false;
      }

      // 7. Price
      if (p.price < filterState.priceRange[0] || p.price > filterState.priceRange[1]) {
        return false;
      }

      // 8. In Stock
      if (filterState.inStockOnly && (!p.inStock || p.stockQuantity <= 0)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'price-asc') return a.price - b.price;
      if (filterState.sortBy === 'price-desc') return b.price - a.price;
      if (filterState.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (filterState.sortBy === 'best-selling') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      if (filterState.sortBy === 'rating') return b.rating - a.rating;
      return 0; // 'featured'
    });
  }, [products, activeCategory, filterState]);

  const activeFilterCount =
    filterState.shapes.length +
    filterState.materials.length +
    filterState.genders.length +
    filterState.brands.length +
    (filterState.inStockOnly ? 1 : 0) +
    (activeCategory !== 'all' ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
        <button
          onClick={() => {
            setActiveCategory('all');
          }}
          className="hover:text-stone-900 transition-colors"
        >
          RAMA Boutique
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <button
          onClick={() => setActiveCategory('all')}
          className={`hover:text-stone-900 ${activeCategory === 'all' ? 'text-stone-900 font-semibold' : ''}`}
        >
          Catalog
        </button>
        {activeCategory !== 'all' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-[#C6A15B] font-semibold">{currentCategory?.name}</span>
          </>
        )}
      </nav>

      {/* Title & Sorting Control Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E7E5E0]">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#222222]">
            {activeCategory === 'all' ? 'Complete Optical Collection' : currentCategory?.name}
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            {currentCategory?.description ||
              'Explore handcrafted frames designed with architectural restraint, premium titanium, and custom diopter lenses.'}
          </p>
        </div>

        {/* Right Sort Controls & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden py-2 px-3.5 text-xs font-semibold bg-white border border-stone-200 rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Filters ({activeFilterCount})</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 hidden sm:inline whitespace-nowrap">Sort by:</span>
            <select
              value={filterState.sortBy}
              onChange={(e) =>
                setFilterState({ ...filterState, sortBy: e.target.value as any })
              }
              className="py-2 px-3 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#C6A15B] text-stone-800"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">New Arrivals</option>
              <option value="best-selling">Best Sellers</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="py-4 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`py-2 px-4 rounded-xl font-medium whitespace-nowrap transition-colors ${
            activeCategory === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          All Frames ({products.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`py-2 px-4 rounded-xl font-medium whitespace-nowrap transition-colors ${
              activeCategory === c.id
                ? 'bg-[#C6A15B] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Main Grid & Filter Sidebar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
        {/* Left Filter Sidebar (Desktop) */}
        <aside
          className={`md:col-span-3 space-y-6 bg-white p-5 rounded-2xl border border-[#E7E5E0] self-start ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#C6A15B]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Filters
              </h3>
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] text-[#C6A15B] hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <span>Price Range</span>
              <span className="text-[#C6A15B]">
                ${filterState.priceRange[0]} – ${filterState.priceRange[1]}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={500}
              step={10}
              value={filterState.priceRange[1]}
              onChange={(e) =>
                setFilterState({
                  ...filterState,
                  priceRange: [filterState.priceRange[0], Number(e.target.value)],
                })
              }
              className="w-full accent-[#C6A15B] cursor-pointer"
            />
          </div>

          {/* Frame Shape */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Frame Shape
            </h4>
            <div className="space-y-1 text-xs">
              {allShapes.map((shape) => {
                const checked = filterState.shapes.includes(shape);
                return (
                  <label
                    key={shape}
                    className="flex items-center gap-2 text-stone-600 hover:text-stone-900 cursor-pointer py-1"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleShape(shape)}
                      className="rounded text-[#C6A15B] focus:ring-[#C6A15B]"
                    />
                    <span>{shape}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Frame Material */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Frame Material
            </h4>
            <div className="space-y-1 text-xs">
              {allMaterials.map((mat) => {
                const checked = filterState.materials.includes(mat);
                return (
                  <label
                    key={mat}
                    className="flex items-center gap-2 text-stone-600 hover:text-stone-900 cursor-pointer py-1"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleMaterial(mat)}
                      className="rounded text-[#C6A15B] focus:ring-[#C6A15B]"
                    />
                    <span>{mat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Gender
            </h4>
            <div className="space-y-1 text-xs">
              {allGenders.map((g) => {
                const checked = filterState.genders.includes(g);
                return (
                  <label
                    key={g}
                    className="flex items-center gap-2 text-stone-600 hover:text-stone-900 cursor-pointer py-1"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleGender(g)}
                      className="rounded text-[#C6A15B] focus:ring-[#C6A15B]"
                    />
                    <span>{g}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Brand */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Maison Brand
            </h4>
            <div className="space-y-1 text-xs">
              {allBrands.map((b) => {
                const checked = filterState.brands.includes(b);
                return (
                  <label
                    key={b}
                    className="flex items-center gap-2 text-stone-600 hover:text-stone-900 cursor-pointer py-1"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleBrand(b)}
                      className="rounded text-[#C6A15B] focus:ring-[#C6A15B]"
                    />
                    <span>{b}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-2 border-t border-stone-100">
            <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filterState.inStockOnly}
                onChange={(e) =>
                  setFilterState({ ...filterState, inStockOnly: e.target.checked })
                }
                className="rounded text-[#C6A15B] focus:ring-[#C6A15B]"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Right Products Grid */}
        <div className="md:col-span-9 space-y-6">
          {/* Active Filters bar */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-xl border border-stone-200 text-xs">
              <span className="text-stone-400">Active filters:</span>
              {filterState.shapes.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleShape(s)}
                  className="px-2.5 py-1 rounded bg-[#FAF9F5] border border-stone-200 text-stone-700 flex items-center gap-1 hover:border-stone-400"
                >
                  <span>{s}</span>
                  <X className="w-3 h-3 text-stone-400" />
                </button>
              ))}
              {filterState.materials.map((m) => (
                <button
                  key={m}
                  onClick={() => toggleMaterial(m)}
                  className="px-2.5 py-1 rounded bg-[#FAF9F5] border border-stone-200 text-stone-700 flex items-center gap-1 hover:border-stone-400"
                >
                  <span>{m}</span>
                  <X className="w-3 h-3 text-stone-400" />
                </button>
              ))}
              {filterState.brands.map((b) => (
                <button
                  key={b}
                  onClick={() => toggleBrand(b)}
                  className="px-2.5 py-1 rounded bg-[#FAF9F5] border border-stone-200 text-stone-700 flex items-center gap-1 hover:border-stone-400"
                >
                  <span>{b}</span>
                  <X className="w-3 h-3 text-stone-400" />
                </button>
              ))}
              <button
                onClick={resetAllFilters}
                className="text-[11px] text-[#C6A15B] font-semibold hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-2xl border border-[#E7E5E0] space-y-3">
              <h3 className="font-serif text-lg font-bold text-stone-800">
                No Eyewear Frames Match Your Criteria
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try widening your price range or clearing shape and material filter selections.
              </p>
              <button
                onClick={resetAllFilters}
                className="py-2.5 px-5 text-xs font-semibold bg-[#C6A15B] text-white rounded-lg hover:bg-[#B38F48] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
