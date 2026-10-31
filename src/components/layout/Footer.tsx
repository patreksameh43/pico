import React, { useState } from 'react';
import {
  Check,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Twitter,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface FooterProps {
  onNavigate: (section: 'home' | 'shop' | 'categories' | 'about' | 'contact' | 'admin') => void;
  onOpenPolicy: (type: 'privacy' | 'terms') => void;
  onOpenFAQ: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPolicy, onOpenFAQ }) => {
  const { settings, categories, setActiveCategory } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const whatsappUrl = `https://wa.me/${settings.contactWhatsApp.replace(/[^0-9]/g, '')}?text=Hello%20RAMA%20OPTICS%20Concierge`;

  return (
    <footer className="bg-[#181614] text-[#FAF8F5] border-t border-stone-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Newsletter & Club Section */}
        <div className="bg-[#211E1B] rounded-2xl p-8 sm:p-10 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">
              The RAMA Atelier Journal
            </span>
            <h3 className="text-2xl font-serif font-bold text-white mt-1">
              Receive Curated Private Releases
            </h3>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Early previews of titanium limited editions, seasonal sun collections, and complimentary optical styling appointments.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md">
            {subscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-300 rounded-xl text-xs flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>You are enrolled in RAMA Private Previews.</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-[#181614] border border-stone-700 text-xs rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#C6A15B]"
                />
                <button
                  type="submit"
                  className="py-3 px-5 bg-[#C6A15B] text-stone-950 font-semibold text-xs rounded-xl hover:bg-[#D4AF37] transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </form>
        </div>

        {/* 4 Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-xs">
          {/* Col 1: Brand & Craftsmanship */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-widest text-white">
                RAMA OPTICS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
            </div>
            <p className="text-stone-400 leading-relaxed">
              Handcrafted optical eyewear engineered from Japanese Beta-Titanium and Italian Mazzucchelli acetate with bespoke digital prescription optics.
            </p>
            <div className="pt-2 text-stone-500 text-[11px] space-y-1">
              <p>Slogan: See Better. Look Better.</p>
              <p>Hand-Finished in Sabae & Milan</p>
            </div>
          </div>

          {/* Col 2: Optical Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C6A15B]">
              Collections
            </h4>
            <ul className="space-y-2 text-stone-400">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setActiveCategory(c.id);
                      onNavigate('shop');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Services */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C6A15B]">
              Client Services
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white">
                  Prescription Lens Guide
                </button>
              </li>
              <li>
                <button onClick={onOpenFAQ} className="hover:text-white">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-white">
                  2-Year Warranty & Returns
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-white">
                  Optical Data Privacy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-stone-500 hover:text-[#C6A15B]">
                  Director Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Boutique & Direct WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C6A15B]">
              Flagship Boutique
            </h4>
            <div className="space-y-2.5 text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <span>{settings.storeAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <span>{settings.contactPhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <span>{settings.contactEmail}</span>
              </p>
            </div>

            {/* Direct WhatsApp Pill */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 rounded-xl transition-colors text-[11px]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Live WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} RAMA OPTICS Inc. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <a
              href={settings.socialInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-[#C6A15B] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={settings.socialFacebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-[#C6A15B] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={settings.socialTwitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-[#C6A15B] transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
