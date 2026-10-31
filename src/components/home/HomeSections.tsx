import React from 'react';
import {
  ArrowRight,
  Award,
  Check,
  Eye,
  Microscope,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';

// 1. BEST SELLERS SECTION
export const BestSellers: React.FC<{ onExploreAll: () => void }> = ({ onExploreAll }) => {
  const { products } = useShop();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-white border-y border-[#EBE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">
              Client Favorites
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#222222] mt-1">
              Best-Selling Eyewear
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg">
              Our most celebrated silhouettes, crafted from Japanese titanium and Italian acetate.
            </p>
          </div>
          <button
            onClick={onExploreAll}
            className="text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-[#C6A15B] transition-colors flex items-center gap-1.5"
          >
            <span>View All Frames</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

// 2. NEW ARRIVALS SECTION
export const NewArrivals: React.FC<{ onExploreAll: () => void }> = ({ onExploreAll }) => {
  const { products } = useShop();
  const newArrivals = products.filter((p) => p.isNew).slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">
              Latest Additions
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#222222] mt-1">
              New Season Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg">
              Fresh hexagonal bevels, cat-eye chamfers, and featherlight rimless bridges.
            </p>
          </div>
          <button
            onClick={onExploreAll}
            className="text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-[#C6A15B] transition-colors flex items-center gap-1.5"
          >
            <span>View All New</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

// 3. SPECIAL OFFERS SECTION
export const SpecialOffers: React.FC<{ onExploreOffers: () => void }> = ({ onExploreOffers }) => {
  const { products, setLensConfigProduct } = useShop();
  const discounted = products.filter((p) => p.discountPercent && p.discountPercent > 0).slice(0, 2);

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#FAF8F5] to-[#F3EFE7] border-y border-[#EBE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1A17] text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-2xl overflow-hidden relative">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C6A15B]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">
                Curated Boutique Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
                Complimentary Blue Cut Upgrade on All Optical Titanium
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg">
                For a limited time, purchase any RAMA Atelier or RAMA Titanium frame and receive our premium Blue Cut anti-strain lens package included at no extra cost using code <strong className="text-[#C6A15B]">RAMAGOLD</strong>.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#C6A15B]" />
                  <span>Free Screen Shield</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#C6A15B]" />
                  <span>Anti-Reflective Coat</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#C6A15B]" />
                  <span>2-Year Warranty</span>
                </span>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onExploreOffers}
                  className="py-3 px-6 text-xs font-semibold text-stone-950 bg-[#C6A15B] hover:bg-[#D4AF37] rounded-xl transition-all shadow-md inline-flex items-center gap-2"
                >
                  <span>Explore Special Offers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Featured offer cards preview */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {discounted.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setLensConfigProduct(prod)}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 cursor-pointer hover:bg-white/15 transition-all text-xs group"
                >
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C6A15B]">
                    Save {prod.discountPercent}%
                  </span>
                  <h4 className="font-serif font-bold text-sm text-white mt-1 group-hover:text-[#C6A15B] transition-colors">
                    {prod.name}
                  </h4>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-base font-serif font-bold text-white">${prod.price}</span>
                    <span className="text-[11px] text-stone-400 line-through">
                      ${prod.originalPrice}
                    </span>
                  </div>
                  <span className="mt-3 block text-[11px] font-semibold text-[#C6A15B]">
                    Configure Now →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 4. WHY CHOOSE RAMA OPTICS SECTION
export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: Microscope,
      title: 'Digital Cleanroom Lenses',
      desc: 'Freeform surfacing calibrated to your exact optical pupillary distance and diopters with German precision.',
    },
    {
      icon: ShieldCheck,
      title: 'Aerospace Japanese Titanium',
      desc: 'Weighed in grams, never ounces. Hypoallergenic, nickel-free, and resistant to corrosion or perspiration.',
    },
    {
      icon: Wrench,
      title: 'Precision Micro-Hinges',
      desc: 'Tested to over 30,000 hinge cycles. Hand-torqued screws with Teflon locking rings for perpetual stability.',
    },
    {
      icon: Truck,
      title: 'Insured White-Glove Shipping',
      desc: 'Packaged in genuine leather folding cases with micro-fiber cloths and complimentary global delivery.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">
            Uncompromising Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#222222] mt-1">
            Why Choose RAMA OPTICS
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Every frame and lens is a medical device engineered with haute couture jewelry sensitivity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-[#FAF9F6] rounded-2xl border border-[#E7E5E0] hover:border-[#C6A15B]/60 transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DFD5] flex items-center justify-center text-[#C6A15B]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#222222]">{pillar.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// 5. RECENTLY VIEWED SHELF
export const RecentlyViewedShelf: React.FC = () => {
  const { recentlyViewed } = useShop();

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="py-12 bg-[#FAFAF8] border-t border-[#EBE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">
            History
          </span>
          <h3 className="text-xl font-serif font-bold text-[#222222] mt-0.5">
            Recently Viewed Eyewear
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recentlyViewed.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};
