import React from 'react';
import {
  ArrowRight,
  Crown,
  Glasses,
  Sparkles,
  Smile,
  Sun,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Category } from '../../types';

interface FeaturedCollectionsProps {
  onSelectCategory: (categoryId: string) => void;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({ onSelectCategory }) => {
  const { categories } = useShop();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5 text-[#C6A15B]" />;
      case 'Glasses':
        return <Glasses className="w-5 h-5 text-[#C6A15B]" />;
      case 'User':
        return <User className="w-5 h-5 text-[#C6A15B]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#C6A15B]" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-[#C6A15B]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#C6A15B]" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-[#C6A15B]" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#C6A15B]" />;
      default:
        return <Glasses className="w-5 h-5 text-[#C6A15B]" />;
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">
              Curated Eyewear
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#222222] mt-1">
              Explore Product Categories
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg">
              Eight distinct universes of optical engineering, from featherlight Japanese titanium to polarized sports optics.
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-[#C6A15B] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Grid (8 categories) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group relative p-6 bg-white rounded-2xl border border-[#EBE7DF] hover:border-[#C6A15B]/70 shadow-xs hover:shadow-xl hover:shadow-[#C6A15B]/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {category.badge && (
                <span className="absolute top-4 right-4 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C6A15B]/15 text-[#8C6D2E]">
                  {category.badge}
                </span>
              )}

              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF9F5] border border-[#EAE6DD] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#C6A15B]/10 transition-transform">
                  {getCategoryIcon(category.iconName)}
                </div>

                <h3 className="font-serif font-bold text-base sm:text-lg text-[#222222] group-hover:text-[#C6A15B] transition-colors">
                  {category.name}
                </h3>

                <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-medium">
                  {category.itemCount} {category.itemCount === 1 ? 'Design' : 'Designs'}
                </span>
                <span className="text-[#C6A15B] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Browse →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
