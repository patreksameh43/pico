import React, { useState } from 'react';
import { Eye, Heart, Layers, ShoppingBag, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, ProductColor } from '../../types';
import { EyewearArtwork } from '../common/EyewearArtwork';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const {
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    removeFromCompare,
    setLensConfigProduct,
    setQuickViewProduct,
    addToCart,
  } = useShop();

  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Champagne Gold', hex: '#C6A15B' }
  );

  const isFavorited = isInWishlist(product.id);
  const isComparing = isInCompare(product.id);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.isOptical) {
      setLensConfigProduct(product);
    } else {
      // For sunglasses without required optical lens, prompt lens config for options like Polarized/Rx
      setLensConfigProduct(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <div
      onClick={() => onOpenDetail?.(product) || setQuickViewProduct(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-[#EBE7DF] overflow-hidden hover:border-[#C6A15B]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#C6A15B]/5 cursor-pointer"
    >
      {/* Visual Header / Badges */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5">
          {product.isNew && (
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-stone-900 text-white">
              New
            </span>
          )}
          {product.discountPercent && (
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-[#C6A15B] text-white">
              -{product.discountPercent}%
            </span>
          )}
          {product.isBestSeller && !product.discountPercent && (
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-[#C6A15B]/20 text-[#8B6E32]">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist and Compare Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={handleCompare}
            title={isComparing ? 'Remove from comparison' : 'Compare specifications'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isComparing
                ? 'bg-[#C6A15B] text-white'
                : 'bg-white/80 backdrop-blur-sm text-stone-600 hover:text-stone-900 hover:bg-white shadow-sm'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleWishlist}
            title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isFavorited
                ? 'bg-rose-50 text-rose-500'
                : 'bg-white/80 backdrop-blur-sm text-stone-600 hover:text-rose-500 hover:bg-white shadow-sm'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Product Canvas / Artwork */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-[#FAF9F5] to-[#F3EFE7] p-4 flex items-center justify-center">
        <EyewearArtwork
          shape={product.frameShape}
          color={selectedColor}
          isOptical={product.isOptical}
          customImageUrl={product.customImageUrl}
          className="w-full h-full transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-4 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickView}
            className="flex-1 py-2 px-3 text-xs font-medium bg-white/95 backdrop-blur-sm text-stone-800 rounded-lg shadow hover:bg-white flex items-center justify-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="uppercase tracking-widest text-[11px] font-medium text-[#C6A15B]">
              {product.brand}
            </span>
            <span className="text-[11px]">
              {product.inStock ? (
                <span className="text-emerald-700">In Stock ({product.stockQuantity})</span>
              ) : (
                <span className="text-amber-700">Pre-order</span>
              )}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-base font-serif font-semibold text-[#222222] group-hover:text-[#C6A15B] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Metadata Specs (Zero-Pill discipline: unboxed text with middle dot) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
            <span>{product.frameShape}</span>
            <span aria-hidden="true">·</span>
            <span>{product.frameMaterial}</span>
            <span aria-hidden="true">·</span>
            <span>{product.dimensions.lensWidth}-{product.dimensions.bridgeWidth}-{product.dimensions.templeLength}mm</span>
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-100">
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((color) => {
              const active = selectedColor.name === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    active ? 'border-[#C6A15B] ring-2 ring-[#C6A15B]/30 scale-110' : 'border-stone-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
            <span className="text-[11px] text-stone-400 ml-1">
              {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
            </span>
          </div>
        </div>

        {/* Pricing & Add/Configure CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-serif font-bold text-[#222222]">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleActionClick}
            className="py-2 px-3.5 text-xs font-semibold text-white bg-[#C6A15B] hover:bg-[#B38F48] rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.isOptical ? 'Select Lenses' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
