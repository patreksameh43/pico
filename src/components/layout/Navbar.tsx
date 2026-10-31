import React, { useState } from 'react';
import {
  Compass,
  Heart,
  Layers,
  Menu,
  Search,
  Shield,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface NavbarProps {
  onNavigate: (section: 'home' | 'shop' | 'categories' | 'about' | 'contact' | 'admin') => void;
  activeNav: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeNav }) => {
  const {
    cart,
    wishlist,
    compareList,
    settings,
    setCartDrawerOpen,
    setWishlistDrawerOpen,
    setCompareModalOpen,
    setSearchModalOpen,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7E5E0] transition-all">
      {/* Top Thin Announcement Banner */}
      <div className="bg-[#1C1A17] text-[#FAF8F5] text-[10px] sm:text-[11px] font-medium py-1.5 px-4 text-center tracking-wider uppercase border-b border-stone-800">
        <span>{settings.announcementBanner}</span>
      </div>

      {/* Main Top Navigation (Strict 3-zone contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="text-xl sm:text-2xl font-serif font-bold tracking-widest text-[#222222] hover:text-[#C6A15B] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <span>RAMA OPTICS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] inline-block mb-1" />
        </button>

        {/* Zone 2: Navigation Links (4-5 single-line items) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium uppercase tracking-wider text-stone-600">
          <button
            onClick={() => onNavigate('home')}
            className={`hover:text-[#C6A15B] transition-colors whitespace-nowrap shrink-0 ${
              activeNav === 'home' ? 'text-[#C6A15B] font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className={`hover:text-[#C6A15B] transition-colors whitespace-nowrap shrink-0 ${
              activeNav === 'shop' ? 'text-[#C6A15B] font-semibold' : ''
            }`}
          >
            Shop All
          </button>
          <button
            onClick={() => onNavigate('categories')}
            className={`hover:text-[#C6A15B] transition-colors whitespace-nowrap shrink-0 ${
              activeNav === 'categories' ? 'text-[#C6A15B] font-semibold' : ''
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`hover:text-[#C6A15B] transition-colors whitespace-nowrap shrink-0 ${
              activeNav === 'about' ? 'text-[#C6A15B] font-semibold' : ''
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`hover:text-[#C6A15B] transition-colors whitespace-nowrap shrink-0 ${
              activeNav === 'contact' ? 'text-[#C6A15B] font-semibold' : ''
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`text-[10px] px-2 py-0.5 rounded border border-[#C6A15B]/50 text-[#8B6E32] hover:bg-[#C6A15B]/10 transition-colors whitespace-nowrap shrink-0 ${
              activeNav === 'admin' ? 'bg-[#C6A15B] text-white border-transparent' : ''
            }`}
          >
            Director Portal
          </button>
        </nav>

        {/* Zone 3: Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="Search eyewear catalog"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Comparison Modal Trigger */}
          <button
            type="button"
            onClick={() => setCompareModalOpen(true)}
            className="relative p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="Compare eyewear specifications"
            aria-label="Compare specifications"
          >
            <Layers className="w-4 h-4" />
            {compareList.length > 0 && (
              <span className="absolute 1 top-1 right-1 w-4 h-4 rounded-full bg-[#C6A15B] text-white text-[10px] font-bold flex items-center justify-center">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Wishlist Trigger */}
          <button
            type="button"
            onClick={() => setWishlistDrawerOpen(true)}
            className="relative p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="Saved Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Trigger with Live Counter */}
          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            className="flex items-center gap-2 py-2 px-3 sm:px-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white transition-all shadow-sm"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#C6A15B]" />
            <span className="text-xs font-semibold tabular-nums">{cartCount}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-stone-900"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E7E5E0] px-6 py-4 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2 text-xs font-medium uppercase tracking-wider text-stone-700">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#C6A15B]"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('shop');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#C6A15B]"
            >
              Shop All Eyewear
            </button>
            <button
              onClick={() => {
                onNavigate('categories');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#C6A15B]"
            >
              Product Categories
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#C6A15B]"
            >
              About The Maison
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#C6A15B]"
            >
              Contact & WhatsApp
            </button>
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-[#C6A15B] font-semibold"
            >
              Director Admin Portal →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
