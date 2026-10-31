import React from 'react';
import { ArrowRight, Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { EyewearArtwork } from '../common/EyewearArtwork';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    wishlistDrawerOpen,
    setWishlistDrawerOpen,
    toggleWishlist,
    setLensConfigProduct,
    setQuickViewProduct,
  } = useShop();

  if (!wishlistDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      <div
        onClick={() => setWishlistDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E7E5E0]">
          {/* Header */}
          <div className="p-5 border-b border-[#E7E5E0] bg-[#FAF9F6] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-base font-serif font-bold text-[#222222]">Saved Wishlist</h2>
              <span className="text-xs text-stone-500 font-medium">({wishlist.length})</span>
            </div>
            <button
              onClick={() => setWishlistDrawerOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <Heart className="w-12 h-12 stroke-1 text-stone-300 mb-3" />
                <h3 className="font-serif text-lg font-semibold text-[#222222]">Your wishlist is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mt-1">
                  Save frames you love to compare styles, finishes, and lens configurations anytime.
                </p>
              </div>
            ) : (
              wishlist.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-xl border border-[#E7E5E0] bg-[#FAF9F6]/50 flex items-center justify-between gap-3"
                >
                  <div
                    onClick={() => {
                      setWishlistDrawerOpen(false);
                      setQuickViewProduct(product);
                    }}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-16 h-12 rounded border border-stone-200 overflow-hidden bg-white shrink-0">
                      <EyewearArtwork
                        shape={product.frameShape}
                        color={product.colors[0]}
                        isOptical={product.isOptical}
                        customImageUrl={product.customImageUrl}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#C6A15B] font-semibold uppercase">{product.brand}</p>
                      <h4 className="text-xs font-semibold text-stone-900 truncate">{product.name}</h4>
                      <p className="text-xs font-serif font-bold text-stone-800 mt-0.5">${product.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setWishlistDrawerOpen(false);
                        setLensConfigProduct(product);
                      }}
                      className="p-2 text-xs font-medium text-white bg-[#C6A15B] hover:bg-[#B38F48] rounded-lg transition-colors"
                      title="Select lenses & buy"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="p-2 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
