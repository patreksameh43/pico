import React from 'react';
import { ArrowRight, Award, Compass, Eye, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { EyewearArtwork } from '../common/EyewearArtwork';

interface HeroProps {
  onShopClick: () => void;
  onExploreOptical: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onExploreOptical }) => {
  const { settings, products, setQuickViewProduct } = useShop();

  const heroFeaturedProduct = products[0]; // Aurelius Round Titanium

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F3EC] via-[#FAF9F5] to-[#FAF8F5] pt-12 pb-16 sm:py-20 lg:py-24 border-b border-[#EBE7DF]">
      {/* Decorative ambient gold radial light */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E7E5E0] shadow-xs text-xs text-stone-700">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B]" />
              <span className="font-medium tracking-wide uppercase text-[11px] text-[#8C6D2E]">
                Spring 2026 Titanium Editions
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#222222] leading-[1.1] [text-wrap:balance]">
              {settings.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {settings.heroSubtitle} Handcrafted in Sabae from cold-forged Japanese titanium and fitted with custom digital diopter lenses.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={onShopClick}
                className="w-full sm:w-auto py-3.5 px-8 text-xs sm:text-sm font-semibold text-white bg-[#C6A15B] hover:bg-[#B38F48] rounded-xl shadow-lg shadow-[#C6A15B]/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreOptical}
                className="w-full sm:w-auto py-3.5 px-6 text-xs sm:text-sm font-medium text-stone-800 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors shadow-xs"
              >
                Configure Prescription Lenses
              </button>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#E8E4DA] text-left">
              <div>
                <p className="text-sm font-serif font-bold text-stone-900">Japanese Titanium</p>
                <p className="text-[11px] text-stone-500">Cold-forged Beta alloy</p>
              </div>
              <div>
                <p className="text-sm font-serif font-bold text-stone-900">German Optics</p>
                <p className="text-[11px] text-stone-500">Freeform digital diopter</p>
              </div>
              <div>
                <p className="text-sm font-serif font-bold text-stone-900">2-Year Warranty</p>
                <p className="text-[11px] text-stone-500">Unconditional frame cover</p>
              </div>
              <div>
                <p className="text-sm font-serif font-bold text-stone-900">Express Delivery</p>
                <p className="text-[11px] text-stone-500">Complimentary over $150</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Eyewear Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Luxury Frame Box */}
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E7E5E0] overflow-hidden group">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="uppercase tracking-widest font-semibold text-[#C6A15B]">
                    Signature Piece
                  </span>
                  <span className="text-stone-400">Model 01 · Sabae, JP</span>
                </div>

                <div className="my-6 aspect-[4/3] w-full flex items-center justify-center">
                  <EyewearArtwork
                    shape="Round"
                    color={{ name: 'Champagne Gold', hex: '#C6A15B' }}
                    isOptical={true}
                    isDetailedView={true}
                    className="w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#222222]">
                      Aurelius Round Titanium
                    </h3>
                    <p className="text-xs text-stone-500">18K Champagne Gold · 16 Grams</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-serif font-bold text-[#222222]">$245</span>
                    <button
                      onClick={() => setQuickViewProduct(heroFeaturedProduct)}
                      className="block text-xs font-semibold text-[#C6A15B] hover:underline mt-0.5"
                    >
                      Quick View →
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Accreditations */}
              <div className="absolute -bottom-4 -left-4 bg-[#FAF9F5]/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#E7E5E0] shadow-lg flex items-center gap-2.5 text-xs">
                <Award className="w-4 h-4 text-[#C6A15B]" />
                <span className="font-semibold text-stone-800">Silmo d'Or Design Nominee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
