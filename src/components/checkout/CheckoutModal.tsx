import React, { useState } from 'react';
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Lock,
  Printer,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CustomerInfo, Order } from '../../types';
import { EyewearArtwork } from '../common/EyewearArtwork';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    subtotal,
    discountAmount,
    shippingFee,
    finalTotal,
    appliedPromo,
    placeOrder,
  } = useShop();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Card Online (Pending)'>(
    'Cash on Delivery'
  );

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full recipient name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMsg('Please provide a valid contact phone number.');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Please specify your delivery city.');
      return;
    }
    if (!deliveryAddress.trim()) {
      setErrorMsg('Please enter complete street & building address.');
      return;
    }

    setLoading(true);

    const customer: CustomerInfo = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim() || undefined,
      city: city.trim(),
      deliveryAddress: deliveryAddress.trim(),
      additionalNotes: additionalNotes.trim() || undefined,
    };

    const res = await placeOrder(customer, paymentMethod);
    setLoading(false);

    if (res.success && res.order) {
      setConfirmedOrder(res.order);
    } else {
      setErrorMsg(res.message || 'An error occurred while placing your order. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E7E5E0] my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E0] bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">
              RAMA OPTICS
            </span>
            <span className="text-stone-300">·</span>
            <h2 className="text-base sm:text-lg font-serif font-semibold text-[#222222]">
              {confirmedOrder ? 'Order Confirmation' : 'Secure Luxury Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {confirmedOrder ? (
          <div className="p-6 sm:p-10 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
                Order Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#222222] mt-1">
                Thank You for Your Order
              </h1>
              <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto">
                We have received your optical order. Our master opticians are reviewing your frame and lens specifications.
              </p>
            </div>

            {/* Order Identity Card */}
            <div className="max-w-xl mx-auto p-6 bg-[#FAF9F6] rounded-xl border border-[#EBE7DF] text-left space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">Order Reference</p>
                  <p className="text-lg font-bold font-mono text-[#222222]">{confirmedOrder.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-500 uppercase tracking-wider">Status</p>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {confirmedOrder.status}
                  </span>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-2 gap-4 text-xs text-stone-600">
                <div>
                  <p className="font-semibold text-stone-800">Delivery Recipient</p>
                  <p>{confirmedOrder.customer.fullName}</p>
                  <p>{confirmedOrder.customer.phoneNumber}</p>
                  {confirmedOrder.customer.email && <p>{confirmedOrder.customer.email}</p>}
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Destination</p>
                  <p>{confirmedOrder.customer.deliveryAddress}</p>
                  <p>{confirmedOrder.customer.city}</p>
                  <p className="mt-1 font-medium text-stone-800">Payment: {confirmedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Items Summary */}
              <div className="border-t border-stone-200 pt-3 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Itemized Selection
                </p>
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs">
                    <div>
                      <p className="font-medium text-stone-800">
                        {item.quantity}x {item.product.name} ({item.selectedColor.name})
                      </p>
                      <p className="text-[11px] text-stone-500">Lens: {item.selectedLens.name}</p>
                    </div>
                    <span className="font-semibold text-stone-800">
                      ${item.itemUnitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline font-bold">
                <span className="text-sm text-stone-800">Amount Due Upon Delivery</span>
                <span className="text-xl font-serif text-[#222222]">${confirmedOrder.total}</span>
              </div>
            </div>

            {/* Print & Return Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-4 text-xs font-medium border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4 text-stone-500" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-6 text-xs font-semibold bg-[#C6A15B] text-white rounded-lg hover:bg-[#B38F48] transition-colors"
              >
                Return to Store
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Input Form & Order Summary Split */
          <div className="flex flex-col lg:flex-row">
            {/* Left: Input Form */}
            <form onSubmit={handleSubmit} className="lg:w-3/5 p-6 sm:p-8 space-y-5">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#222222]">
                  1. Shipping & Recipient Details
                </h3>
                <p className="text-xs text-stone-500">
                  Please provide accurate information for priority courier delivery.
                </p>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Johnathan Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 019-2834"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="For tracking updates"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New York, London, Dubai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Full Delivery Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Street name, building number, apartment/suite"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Delivery Instructions / Optician Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any specific instructions for building access, concierge, or optical preferences..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 border-t border-stone-100">
                <h3 className="font-serif text-lg font-semibold text-[#222222] mb-1">
                  2. Payment Method
                </h3>
                <p className="text-xs text-stone-500 mb-3">
                  All shipments are insured with luxury tamper-proof packaging.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-[#C6A15B] bg-[#FFFDF9] ring-1 ring-[#C6A15B]'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#C6A15B] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Pay with cash or card upon package inspection
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card Online (Pending)')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      paymentMethod === 'Card Online (Pending)'
                        ? 'border-[#C6A15B] bg-[#FFFDF9] ring-1 ring-[#C6A15B]'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-stone-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900">Credit / Debit Card</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Secure instant checkout (Visa, Mastercard, Amex)
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full py-4 px-6 text-sm font-semibold text-white bg-[#C6A15B] hover:bg-[#B38F48] rounded-xl shadow-lg shadow-[#C6A15B]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Place Order · ${finalTotal}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:w-2/5 bg-[#FAF9F6] p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-[#E7E5E0] flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h3 className="font-serif font-semibold text-[#222222]">Order Summary</h3>
                  <span className="text-xs text-stone-500">{cart.length} items</span>
                </div>

                {/* Items preview list */}
                <div className="max-h-64 overflow-y-auto space-y-3 py-4 divide-y divide-stone-100">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex gap-3 text-xs">
                      <div className="w-14 h-11 rounded border border-stone-200 bg-white overflow-hidden shrink-0">
                        <EyewearArtwork
                          shape={item.product.frameShape}
                          color={item.selectedColor}
                          isOptical={item.product.isOptical}
                          customImageUrl={item.product.customImageUrl}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-800 truncate">{item.product.name}</p>
                        <p className="text-[11px] text-stone-500">
                          Qty: {item.quantity} · {item.selectedColor.name}
                        </p>
                        <p className="text-[10px] text-[#C6A15B] truncate">
                          {item.selectedLens.name}
                        </p>
                      </div>
                      <div className="font-semibold text-stone-800">
                        ${item.itemUnitPrice * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="space-y-2 border-t border-stone-200 pt-4 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-800">${subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promo Discount ({appliedPromo?.code})</span>
                      <span>-${discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Express Worldwide Delivery</span>
                    <span>{shippingFee === 0 ? 'Complimentary' : `$${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-serif font-bold text-[#222222] border-t border-stone-200 pt-3">
                    <span>Final Total</span>
                    <span className="text-xl">${finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C6A15B] shrink-0" />
                  <span>2-Year Manufacturer Warranty on all frames</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C6A15B] shrink-0" />
                  <span>30-Day Hassle-Free Optical Exchange</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
