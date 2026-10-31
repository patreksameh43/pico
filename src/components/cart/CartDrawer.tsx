import React, { useState } from 'react';
import {
  ArrowRight,
  Edit2,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CartItem } from '../../types';
import { EyewearArtwork } from '../common/EyewearArtwork';

interface CartDrawerProps {
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedCheckout }) => {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    removeFromCart,
    updateCartQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    finalTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    freeShippingProgress,
    settings,
    setEditingCartItem,
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!cartDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMsg({ text: res.message, success: res.success });
    if (res.success) setPromoInput('');
  };

  const handleEditItemLens = (item: CartItem) => {
    setCartDrawerOpen(false);
    setEditingCartItem(item);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E7E5E0]">
          {/* Top Bar */}
          <div className="p-5 border-b border-[#E7E5E0] bg-[#FAF9F6] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C6A15B]" />
              <h2 className="text-base font-serif font-bold text-[#222222]">Shopping Bag</h2>
              <span className="text-xs text-stone-500 font-medium">({cart.length} items)</span>
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-5 py-3 bg-[#FAF8F5] border-b border-[#EBE7DF]">
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
              <span>
                {subtotal >= settings.freeShippingThreshold ? (
                  <span className="text-emerald-700 font-semibold">
                    ✓ You unlocked Free Worldwide Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-stone-900">${settings.freeShippingThreshold - subtotal}</strong> more for Free Delivery
                  </span>
                )}
              </span>
              <span className="font-semibold text-stone-700">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C6A15B] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className="w-16 h-16 rounded-full bg-[#FAF9F5] border border-[#E7E5E0] flex items-center justify-center mb-4 text-[#C6A15B]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#222222]">
                  Your shopping bag is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mt-1 mb-6">
                  Explore our luxury optical glasses and handcrafted sunglasses collections.
                </p>
                <button
                  type="button"
                  onClick={() => setCartDrawerOpen(false)}
                  className="py-2.5 px-6 text-xs font-semibold text-white bg-[#C6A15B] hover:bg-[#B38F48] rounded-lg transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[#E7E5E0] bg-[#FFFDF9]/60 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex gap-3.5">
                    {/* Eyewear Thumbnail */}
                    <div className="w-20 h-16 rounded-lg overflow-hidden border border-[#E5DFD5] bg-[#FAF9F5] shrink-0">
                      <EyewearArtwork
                        shape={item.product.frameShape}
                        color={item.selectedColor}
                        isOptical={item.product.isOptical}
                        customImageUrl={item.product.customImageUrl}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#C6A15B] font-semibold">
                            {item.product.brand}
                          </p>
                          <h4 className="text-sm font-semibold text-[#222222] truncate">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Color */}
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span>{item.selectedColor.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Selected Lens Specification Strip */}
                  <div className="p-2.5 rounded-lg bg-[#FAF8F4] border border-[#EBE6DC] text-xs flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-800">
                        {item.selectedLens.name}
                        {item.selectedLens.additionalPrice > 0 && (
                          <span className="text-[#C6A15B] ml-1">
                            (+${item.selectedLens.additionalPrice})
                          </span>
                        )}
                      </p>
                      {item.prescriptionDetails?.prescriptionType && (
                        <p className="text-[10px] text-stone-500">
                          {item.prescriptionDetails.prescriptionType} ·{' '}
                          {item.prescriptionDetails.lensIndex}
                          {item.prescriptionDetails.uploadedFileName && ' · Rx Attached'}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEditItemLens(item)}
                      className="text-xs text-[#C6A15B] hover:underline flex items-center gap-1 font-medium ml-2"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 px-2.5 text-stone-500 hover:bg-stone-100"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 px-2.5 text-stone-500 hover:bg-stone-100"
                        title="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-serif font-bold text-[#222222]">
                        ${item.itemUnitPrice * item.quantity}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[10px] text-stone-400">
                          ${item.itemUnitPrice} each
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E7E5E0] bg-[#FAF9F6] space-y-4">
              {/* Promo Code Entry */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Promo Code (try RAMAGOLD)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-stone-200 rounded-lg uppercase tracking-wider focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                    <span>Coupon '{appliedPromo.code}' active (-{appliedPromo.percent}%)</span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {promoMsg && !appliedPromo && (
                  <p className="text-[11px] text-amber-600">{promoMsg.text}</p>
                )}
              </form>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">${subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery (Worldwide Courier)</span>
                  <span>{shippingFee === 0 ? 'Complimentary' : `$${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#222222] border-t border-stone-200 pt-2">
                  <span>Estimated Total</span>
                  <span className="text-xl text-[#222222]">${finalTotal}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  onProceedCheckout();
                }}
                className="w-full py-3.5 px-4 text-xs sm:text-sm font-semibold text-white bg-[#C6A15B] hover:bg-[#B38F48] rounded-xl shadow-lg shadow-[#C6A15B]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
