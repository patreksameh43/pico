/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CartDrawer } from './components/cart/CartDrawer';
import { CatalogBrowser } from './components/catalog/CatalogBrowser';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { ProductCompareModal } from './components/compare/ProductCompareModal';
import { FeaturedCollections } from './components/home/FeaturedCollections';
import { Hero } from './components/home/Hero';
import {
  BestSellers,
  NewArrivals,
  RecentlyViewedShelf,
  SpecialOffers,
  WhyChooseUs,
} from './components/home/HomeSections';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { LensSelectionModal } from './components/lens/LensSelectionModal';
import {
  AboutUsModal,
  ContactModal,
  FAQModal,
  PolicyModal,
} from './components/pages/InformationalModals';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { SearchModal } from './components/search/SearchModal';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { ShopProvider, useShop } from './context/ShopContext';

function AppContent() {
  const { setActiveCategory } = useShop();

  const [currentSection, setCurrentSection] = useState<
    'home' | 'shop' | 'categories' | 'about' | 'contact' | 'admin'
  >('home');

  // Checkout Modal State
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Informational Modals State
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | null>(null);

  const handleNavigate = (
    section: 'home' | 'shop' | 'categories' | 'about' | 'contact' | 'admin'
  ) => {
    if (section === 'about') {
      setAboutModalOpen(true);
      return;
    }
    if (section === 'contact') {
      setContactModalOpen(true);
      return;
    }
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromHome = (catId: string) => {
    setActiveCategory(catId);
    setCurrentSection('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in admin portal mode
  if (currentSection === 'admin') {
    return <AdminDashboard onBackToStore={() => setCurrentSection('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#222222]">
      {/* Top Navbar */}
      <Navbar onNavigate={handleNavigate} activeNav={currentSection} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentSection === 'home' && (
          <>
            <Hero
              onShopClick={() => {
                setActiveCategory('all');
                setCurrentSection('shop');
              }}
              onExploreOptical={() => {
                setActiveCategory('cat-optical');
                setCurrentSection('shop');
              }}
            />

            <FeaturedCollections onSelectCategory={handleSelectCategoryFromHome} />

            <BestSellers
              onExploreAll={() => {
                setActiveCategory('all');
                setCurrentSection('shop');
              }}
            />

            <WhyChooseUs />

            <NewArrivals
              onExploreAll={() => {
                setActiveCategory('all');
                setCurrentSection('shop');
              }}
            />

            <SpecialOffers
              onExploreOffers={() => {
                setActiveCategory('all');
                setCurrentSection('shop');
              }}
            />

            <RecentlyViewedShelf />
          </>
        )}

        {currentSection === 'shop' && (
          <CatalogBrowser onSelectCategory={handleSelectCategoryFromHome} />
        )}

        {currentSection === 'categories' && (
          <div className="space-y-12 pb-12">
            <FeaturedCollections onSelectCategory={handleSelectCategoryFromHome} />
            <div className="border-t border-[#E7E5E0] pt-6">
              <CatalogBrowser onSelectCategory={handleSelectCategoryFromHome} />
            </div>
          </div>
        )}
      </main>

      {/* Luxury Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPolicy={(type) => setPolicyType(type)}
        onOpenFAQ={() => setFaqModalOpen(true)}
      />

      {/* Global Interactive Modals & Drawers */}
      <LensSelectionModal />
      <ProductDetailModal />
      <CartDrawer onProceedCheckout={() => setCheckoutOpen(true)} />
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <SearchModal />
      <WishlistDrawer />
      <ProductCompareModal />

      {/* Informational Modals */}
      <AboutUsModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
      <FAQModal isOpen={faqModalOpen} onClose={() => setFaqModalOpen(false)} />
      <PolicyModal
        isOpen={policyType !== null}
        type={policyType || 'privacy'}
        onClose={() => setPolicyType(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
