import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

// 1. ABOUT US MODAL
export const AboutUsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 border border-[#E7E5E0] shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">
              The Maison
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#222222]">RAMA OPTICS</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p className="text-base font-serif italic text-stone-800">
            "See Better. Look Better." — At RAMA OPTICS, we operate at the intersection of architectural precision, Japanese metallurgy, and Italian aesthetic restraint.
          </p>

          <p>
            Founded with a singular mission: to eliminate the compromise between medical-grade optical performance and couture eyewear design. We believe that your glasses are the single most prominent element of personal expression, worn daily on your face.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
            <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#EBE7DF]">
              <h4 className="font-serif font-bold text-stone-900 mb-1">01. Pure Beta-Titanium</h4>
              <p className="text-xs text-stone-500">
                Cold-forged in Sabae, Fukui Prefecture, Japan. Ultra-light, hypoallergenic, and indestructible.
              </p>
            </div>
            <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#EBE7DF]">
              <h4 className="font-serif font-bold text-stone-900 mb-1">02. Italian Bio-Acetate</h4>
              <p className="text-xs text-stone-500">
                Block-cured Mazzucchelli acetate derived from natural cotton lint and renewable wood pulp.
              </p>
            </div>
            <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#EBE7DF]">
              <h4 className="font-serif font-bold text-stone-900 mb-1">03. Cleanroom Optics</h4>
              <p className="text-xs text-stone-500">
                Digitally surfaced freeform corrective lenses with multi-layer blue light and hydrophobic coatings.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-semibold bg-[#C6A15B] text-white rounded-lg hover:bg-[#B38F48] transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. CONTACT & WHATSAPP MODAL
export const ContactModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { settings } = useShop();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  const whatsappUrl = `https://wa.me/${settings.contactWhatsApp.replace(/[^0-9]/g, '')}?text=Hello%20RAMA%20OPTICS%20Concierge,%20I%20have%20an%20inquiry%20regarding%20eyewear%20prescription%20and%20frames.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-[#E7E5E0] shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">
              Concierge
            </span>
            <h2 className="text-xl font-serif font-bold text-[#222222]">Contact Our Opticians</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Fast Connect Banner */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950">Chat Live on WhatsApp</p>
              <p className="text-[11px] text-emerald-700">Immediate response from our optical technicians</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-800 group-hover:translate-x-1 transition-transform">
            Open Chat →
          </span>
        </a>

        {/* Contact info list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-2 p-3 bg-[#FAF9F6] rounded-lg">
            <Phone className="w-4 h-4 text-[#C6A15B]" />
            <span>{settings.contactPhone}</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-[#FAF9F6] rounded-lg">
            <Mail className="w-4 h-4 text-[#C6A15B]" />
            <span>{settings.contactEmail}</span>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-center font-medium">
              ✓ Message delivered to our opticians. We will respond within 2 business hours.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Inquiry or Prescription Question</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about custom prism lenses, high-index recommendations, or frame measurements..."
                  className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#C6A15B] text-white font-semibold rounded-lg hover:bg-[#B38F48] transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Concierge Message</span>
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

// 3. FAQ MODAL
export const FAQModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How do I submit my prescription to RAMA OPTICS?',
      a: 'When configuring any optical frame, you can either enter your Sphere (SPH), Cylinder (CYL), Axis, and PD values manually, or simply upload a photo/PDF of your optometrist prescription slip. Our licensed opticians verify every order before crafting.',
    },
    {
      q: 'What is the difference between Blue Cut and Standard Clear Lenses?',
      a: 'Blue Cut lenses incorporate a specialized monomer filter that blocks up to 45% of harmful 400nm-455nm high-energy blue-violet light emitted by monitors, smartphones, and LEDs, drastically mitigating eye fatigue and sleep cycle disruption.',
    },
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'With Cash on Delivery, you pay upon courier arrival. You may inspect the package seal and security tag before finalizing payment with cash or mobile courier card terminal.',
    },
    {
      q: 'What is the RAMA OPTICS 2-Year Manufacturer Warranty?',
      a: 'All our Japanese Titanium and Mazzucchelli acetate frames are backed by an unconditional 24-month warranty against hinge defects, solder breaks, and coating delamination.',
    },
    {
      q: 'Can progressive lenses be fitted into any RAMA frame?',
      a: 'Yes. All RAMA optical frames have a B-measurement (lens height) of 32mm or greater, which allows a generous digital corridor for progressive distance, intermediate computer, and near reading zones.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 border border-[#E7E5E0] shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">
              Assistance
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#222222]">
              Frequently Asked Questions
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-stone-100 text-xs sm:text-sm">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-serif font-semibold text-stone-900 hover:text-[#C6A15B] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#C6A15B] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed font-sans pr-4">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-semibold bg-[#C6A15B] text-white rounded-lg hover:bg-[#B38F48] transition-colors"
          >
            Close FAQ
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. POLICIES MODAL (Privacy & Terms)
export const PolicyModal: React.FC<{
  isOpen: boolean;
  type: 'privacy' | 'terms';
  onClose: () => void;
}> = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 border border-[#E7E5E0] shadow-2xl space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-serif font-bold text-[#222222]">
            {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions of Sale'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {type === 'privacy' ? (
          <div className="space-y-3">
            <p>
              At RAMA OPTICS, we respect the sensitivity of optical health and biometric prescription data. All prescription slips and optical calibration coordinates are encrypted in transit and at rest.
            </p>
            <h4 className="font-bold text-stone-900 pt-2">Data We Collect</h4>
            <p>
              We only retain contact and shipping information required for priority courier fulfillment, and optical metrics necessary to grind and coat your prescription lenses. We never sell or distribute client details to third-party ad networks.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p>
              All RAMA OPTICS eyewear orders are subject to optical verification by our dispensing opticians. Custom-surfaced prescription lenses are crafted precisely to client specifications.
            </p>
            <h4 className="font-bold text-stone-900 pt-2">30-Day Optical Satisfaction</h4>
            <p>
              If your new prescription requires diopter adjustment within 30 days of receiving your order, our concierge provides complimentary re-lens service.
            </p>
          </div>
        )}

        <div className="pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-semibold bg-[#C6A15B] text-white rounded-lg hover:bg-[#B38F48] transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
