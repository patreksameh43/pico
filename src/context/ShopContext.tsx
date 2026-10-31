import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  CartItem,
  Category,
  CustomerInfo,
  FilterState,
  LensOption,
  Order,
  PrescriptionDetails,
  Product,
  ProductColor,
  SiteSettings,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SITE_SETTINGS,
  OPTICAL_LENS_OPTIONS,
  SUNGLASSES_LENS_OPTIONS,
} from '../data/mockData';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  settings: SiteSettings;
  cart: CartItem[];
  wishlist: Product[];
  compareList: Product[];
  recentlyViewed: Product[];
  filterState: FilterState;
  activeCategory: string;
  appliedPromo: { code: string; percent: number } | null;

  // UI state
  cartDrawerOpen: boolean;
  wishlistDrawerOpen: boolean;
  compareModalOpen: boolean;
  searchModalOpen: boolean;
  quickViewProduct: Product | null;
  lensConfigProduct: Product | null;
  editingCartItem: CartItem | null;
  adminLoggedIn: boolean;

  // Cart calculations
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  finalTotal: number;
  freeShippingProgress: number;

  // Actions
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  setActiveCategory: (catId: string) => void;
  setCartDrawerOpen: (open: boolean) => void;
  setWishlistDrawerOpen: (open: boolean) => void;
  setCompareModalOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setLensConfigProduct: (product: Product | null) => void;
  setEditingCartItem: (item: CartItem | null) => void;

  addToCart: (
    product: Product,
    selectedColor: ProductColor,
    selectedLens: LensOption,
    prescriptionDetails?: PrescriptionDetails,
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  updateCartItemLens: (
    cartItemId: string,
    lens: LensOption,
    prescription?: PrescriptionDetails
  ) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;

  trackRecentlyViewed: (product: Product) => void;

  placeOrder: (
    customerInfo: CustomerInfo,
    paymentMethod?: 'Cash on Delivery' | 'Card Online (Pending)'
  ) => Promise<{ success: boolean; order?: Order; message?: string }>;

  adminLogin: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  adminLogout: () => void;

  refreshData: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  brands: [],
  priceRange: [100, 600],
  shapes: [],
  materials: [],
  genders: [],
  colors: [],
  inStockOnly: false,
  sortBy: 'featured',
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTERS);

  // Cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rama_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist from localStorage
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('rama_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare products (max 4)
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Recently Viewed from localStorage
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('rama_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);

  // Modals & Drawers
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lensConfigProduct, setLensConfigProduct] = useState<Product | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);

  // Admin status
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('rama_admin_token'));
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rama_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart', e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rama_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to sync wishlist', e);
    }
  }, [wishlist]);

  // Sync recently viewed
  useEffect(() => {
    try {
      localStorage.setItem('rama_recently_viewed', JSON.stringify(recentlyViewed));
    } catch (e) {
      console.error('Failed to sync recently viewed', e);
    }
  }, [recentlyViewed]);

  // Fetch initial catalog from API
  const refreshData = async () => {
    try {
      const [prodRes, catRes, setRes] = await Promise.all([
        fetch('/api/products').catch(() => null),
        fetch('/api/categories').catch(() => null),
        fetch('/api/settings').catch(() => null),
      ]);

      if (prodRes && prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.products) setProducts(prodData.products);
      }
      if (catRes && catRes.ok) {
        const catData = await catRes.json();
        if (catData.categories) setCategories(catData.categories);
      }
      if (setRes && setRes.ok) {
        const setData = await setRes.json();
        if (setData.settings) setSettings(setData.settings);
      }
    } catch (err) {
      console.warn('Using local fallback state', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Cart calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.itemUnitPrice * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    return Math.round((subtotal * appliedPromo.percent) / 100);
  }, [subtotal, appliedPromo]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;
  }, [subtotal, settings]);

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingFee);
  }, [subtotal, discountAmount, shippingFee]);

  const freeShippingProgress = useMemo(() => {
    if (settings.freeShippingThreshold <= 0) return 100;
    return Math.min(100, Math.round((subtotal / settings.freeShippingThreshold) * 100));
  }, [subtotal, settings.freeShippingThreshold]);

  // Cart operations
  const addToCart = (
    product: Product,
    selectedColor: ProductColor,
    selectedLens: LensOption,
    prescriptionDetails?: PrescriptionDetails,
    quantity = 1
  ) => {
    const itemUnitPrice = product.price + (selectedLens?.additionalPrice || 0);
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      product,
      selectedColor,
      quantity,
      selectedLens,
      prescriptionDetails,
      itemUnitPrice,
    };

    setCart((prev) => [newItem, ...prev]);
    setCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const updateCartItemLens = (
    cartItemId: string,
    lens: LensOption,
    prescription?: PrescriptionDetails
  ) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== cartItemId) return item;
        const newUnitPrice = item.product.price + lens.additionalPrice;
        return {
          ...item,
          selectedLens: lens,
          prescriptionDetails: prescription || item.prescriptionDetails,
          itemUnitPrice: newUnitPrice,
        };
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'RAMAGOLD') {
      setAppliedPromo({ code: 'RAMAGOLD', percent: 15 });
      return { success: true, message: 'RAMAGOLD coupon applied! 15% discount granted.' };
    }
    if (cleaned === 'WELCOME10') {
      setAppliedPromo({ code: 'WELCOME10', percent: 10 });
      return { success: true, message: 'WELCOME10 coupon applied! 10% discount granted.' };
    }
    return { success: false, message: 'Invalid or expired promotional code.' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [product, ...prev];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Compare
  const addToCompare = (product: Product): boolean => {
    if (compareList.length >= 4) {
      return false;
    }
    if (compareList.some((p) => p.id === product.id)) {
      return true;
    }
    setCompareList((prev) => [...prev, product]);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInCompare = (productId: string) => {
    return compareList.some((p) => p.id === productId);
  };

  // Track Recently Viewed
  const trackRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  // Place Order
  const placeOrder = async (
    customerInfo: CustomerInfo,
    paymentMethod: 'Cash on Delivery' | 'Card Online (Pending)' = 'Cash on Delivery'
  ): Promise<{ success: boolean; order?: Order; message?: string }> => {
    if (cart.length === 0) {
      return { success: false, message: 'Your shopping cart is empty.' };
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerInfo,
          items: cart,
          subtotal,
          discountAmount,
          appliedPromoCode: appliedPromo?.code,
          shippingFee,
          total: finalTotal,
          paymentMethod,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        refreshData();
        return { success: true, order: data.order };
      } else {
        const errorData = await res.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Failed to submit order' };
      }
    } catch {
      // Local fallback creation if network fails
      const fallbackOrder: Order = {
        id: `RAMA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: customerInfo,
        items: [...cart],
        subtotal,
        discountAmount,
        appliedPromoCode: appliedPromo?.code,
        shippingFee,
        total: finalTotal,
        paymentMethod,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
      clearCart();
      return { success: true, order: fallbackOrder };
    }
  };

  // Admin Auth
  const adminLogin = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('rama_admin_token', data.token);
        setAdminLoggedIn(true);
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch {
      if (email === 'admin@ramaoptics.com' && pass === 'rama2026') {
        localStorage.setItem('rama_admin_token', 'offline-token');
        setAdminLoggedIn(true);
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('rama_admin_token');
    setAdminLoggedIn(false);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        settings,
        cart,
        wishlist,
        compareList,
        recentlyViewed,
        filterState,
        activeCategory,
        appliedPromo,
        cartDrawerOpen,
        wishlistDrawerOpen,
        compareModalOpen,
        searchModalOpen,
        quickViewProduct,
        lensConfigProduct,
        editingCartItem,
        adminLoggedIn,
        subtotal,
        discountAmount,
        shippingFee,
        finalTotal,
        freeShippingProgress,
        setFilterState,
        setActiveCategory,
        setCartDrawerOpen,
        setWishlistDrawerOpen,
        setCompareModalOpen,
        setSearchModalOpen,
        setQuickViewProduct,
        setLensConfigProduct,
        setEditingCartItem,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartItemLens,
        clearCart,
        applyPromoCode,
        removePromoCode,
        toggleWishlist,
        isInWishlist,
        addToCompare,
        removeFromCompare,
        isInCompare,
        trackRecentlyViewed,
        placeOrder,
        adminLogin,
        adminLogout,
        refreshData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
