import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  Heart,
  Layers,
  Ruler,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, ProductColor } from '../../types';
import { EyewearArtwork } from '../common/EyewearArtwork';

export const ProductDetailModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    setLensConfigProduct,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    removeFromCompare,
  } = useShop();

  const product = quickViewProduct;

  const [selectedColor, setSelectedColor] = useState<ProductColor>(() => {
    return product?.colors[0] || { name: 'Champagne Gold', hex: '#C6A15B' };
  });

  const [quantity, setQuantity] = useState(1);
  const [activeView, setActiveView] = useState<'front' | 'angle' | 'dimensions'>('front');

  // Customer Review submission state
  const [reviewsList, setReviewsList] = useState(product?.reviews || []);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const isComparing = isInCompare(product.id);

  const handleProceedToLenses = () => {
    setQuickViewProduct(null);
    setLensConfigProduct(product);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment.trim(),
      verifiedPurchase: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewAuthor('');
    setReviewComment('');
    setShowReviewForm(false);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E7E5E0]">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm text-stone-500 hover:text-stone-900 shadow-sm transition-colors"
          aria-label="Close detail modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Gallery Section */}
        <div className="md:w-1/2 bg-gradient-to-b from-[#FAF9F5] to-[#F1EDE5] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E7E5E0]">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-widest text-[#C6A15B]">
              {product.brand}
            </span>
            <span className="text-stone-400">Model {product.id.toUpperCase()}</span>
          </div>

          {/* Main Visual Display */}
          <div className="relative aspect-[4/3] w-full flex items-center justify-center my-auto">
            {activeView === 'dimensions' ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#E5DFD5]">
                <Ruler className="w-8 h-8 text-[#C6A15B] mb-2" />
                <h4 className="font-serif text-lg font-semibold text-[#222222]">Frame Geometry</h4>
                <div className="grid grid-cols-3 gap-4 text-center mt-4 w-full">
                  <div className="p-3 bg-[#FAF9F6] rounded-lg">
                    <p className="text-2xl font-serif font-bold text-[#222222]">
                      {product.dimensions.lensWidth}
                      <span className="text-xs font-normal text-stone-500">mm</span>
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1 uppercase tracking-wider">Lens Width</p>
                  </div>
                  <div className="p-3 bg-[#FAF9F6] rounded-lg">
                    <p className="text-2xl font-serif font-bold text-[#222222]">
                      {product.dimensions.bridgeWidth}
                      <span className="text-xs font-normal text-stone-500">mm</span>
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1 uppercase tracking-wider">Bridge</p>
                  </div>
                  <div className="p-3 bg-[#FAF9F6] rounded-lg">
                    <p className="text-2xl font-serif font-bold text-[#222222]">
                      {product.dimensions.templeLength}
                      <span className="text-xs font-normal text-stone-500">mm</span>
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1 uppercase tracking-wider">Temple Length</p>
                  </div>
                </div>
                <p className="text-xs text-stone-500 mt-4 text-center">
                  Total Weight: <strong className="text-stone-800">{product.weight}</strong> · Standard Universal Asian/Western Fit
                </p>
              </div>
            ) : (
              <EyewearArtwork
                shape={product.frameShape}
                color={selectedColor}
                isOptical={product.isOptical}
                isDetailedView={true}
                customImageUrl={product.customImageUrl}
                className="w-full h-full"
              />
            )}
          </div>

          {/* View switcher tabs */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveView('front')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeView === 'front'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              Front Angle
            </button>
            <button
              onClick={() => setActiveView('dimensions')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                activeView === 'dimensions'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Specs & Fit</span>
            </button>
          </div>
        </div>

        {/* Right Product Details & Buy Area */}
        <div className="md:w-1/2 flex flex-col justify-between overflow-y-auto max-h-[75vh] md:max-h-none p-6 sm:p-8 space-y-6">
          <div>
            {/* Title & Reviews */}
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>{product.gender}</span>
              <span aria-hidden="true">·</span>
              <span>{product.frameShape} Silhouette</span>
              <span aria-hidden="true">·</span>
              <span>{product.frameMaterial}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#222222]">
              {product.name}
            </h1>

            {/* Price & Rating */}
            <div className="flex items-center justify-between mt-3 pb-4 border-b border-stone-100">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#222222]">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#C6A15B]/15 text-[#8F6F30]">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex items-center text-[#C6A15B]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-current'
                          : 'text-stone-200 fill-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-stone-800">{product.rating}</span>
                <span className="text-stone-400">({reviewsList.length} reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-4">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-stone-700">Frame Color Finish</span>
                <span className="text-[#C6A15B] font-semibold">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`group relative p-1 rounded-full border-2 transition-all ${
                      selectedColor.name === c.name
                        ? 'border-[#C6A15B] scale-105 shadow-sm'
                        : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    <span
                      className="block w-6 h-6 rounded-full border border-black/10 shadow-inner"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications Snapshot */}
            <div className="grid grid-cols-2 gap-2 mt-5 p-3 rounded-xl bg-[#FAF9F6] border border-[#EBE7DF] text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Material</span>
                <span className="font-semibold text-stone-800">{product.frameMaterial}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Availability</span>
                <span className="font-semibold text-emerald-700">
                  {product.inStock ? `In Stock (${product.stockQuantity} pairs left)` : 'Pre-order'}
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 text-xs text-stone-500 mt-4 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#C6A15B]" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
                <span>2-Year Warranty</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <div className="flex items-center gap-3">
              {/* Wishlist & Compare buttons */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  isFavorited
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-stone-200 hover:border-stone-400 text-stone-700'
                }`}
                title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => (isComparing ? removeFromCompare(product.id) : addToCompare(product))}
                className={`p-3 rounded-xl border transition-colors ${
                  isComparing
                    ? 'border-[#C6A15B] bg-[#FFFDF9] text-[#C6A15B]'
                    : 'border-stone-200 hover:border-stone-400 text-stone-700'
                }`}
                title="Compare frame specifications"
              >
                <Layers className="w-5 h-5" />
              </button>

              {/* Configure Lenses / Add To Cart Primary */}
              <button
                type="button"
                onClick={handleProceedToLenses}
                className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#C6A15B] hover:bg-[#B38F48] shadow-lg shadow-[#C6A15B]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{product.isOptical ? 'Configure Prescription Lenses' : 'Add to Shopping Bag'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Reviews Accordion & Add Review */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 py-2 border-t border-stone-100">
                <span>Verified Client Reviews ({reviewsList.length})</span>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-[#C6A15B] hover:underline"
                >
                  {showReviewForm ? 'Cancel' : '+ Write a Review'}
                </button>
              </div>

              {reviewSubmitted && (
                <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded mb-2">
                  ✓ Thank you! Your review has been published.
                </p>
              )}

              {showReviewForm && (
                <form onSubmit={handleAddReview} className="p-3 bg-stone-50 rounded-xl space-y-2 mb-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      required
                      className="px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded focus:outline-none focus:border-[#C6A15B]"
                    />
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value={5}>5 Stars - Exceptional</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Satisfactory</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Share your thoughts on the craftsmanship, fit, and optics..."
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded focus:outline-none focus:border-[#C6A15B]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold bg-[#C6A15B] text-white rounded hover:bg-[#B38F48] transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Sample Reviews */}
              <div className="max-h-36 overflow-y-auto space-y-2.5 pr-1">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="text-xs p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                    <div className="flex items-center justify-between text-stone-500 mb-1">
                      <span className="font-semibold text-stone-800">{rev.author}</span>
                      <span>{rev.date}</span>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
