export type FrameShape =
  | 'Round'
  | 'Square'
  | 'Rectangle'
  | 'Aviator'
  | 'Cat Eye'
  | 'Oval'
  | 'Geometric';

export type FrameMaterial =
  | 'Japanese Titanium'
  | 'Italian Acetate'
  | 'Stainless Steel'
  | 'Carbon Fiber'
  | 'TR90 Ultem';

export type Gender = 'Men' | 'Women' | 'Unisex' | 'Kids';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface FrameDimensions {
  lensWidth: number; // in mm, e.g. 52
  bridgeWidth: number; // in mm, e.g. 19
  templeLength: number; // in mm, e.g. 145
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  categoryId: string; // matches Category.id
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  reviews?: CustomerReview[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isLuxury?: boolean;
  isSpecialOffer?: boolean;
  frameShape: FrameShape;
  frameMaterial: FrameMaterial;
  gender: Gender;
  colors: ProductColor[];
  dimensions: FrameDimensions;
  weight: string; // e.g. "18g"
  inStock: boolean;
  stockQuantity: number;
  isOptical: boolean; // if true, offers full optical prescription lens customization
  customImageUrl?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  itemCount: number;
  badge?: string;
  visible?: boolean;
}

export interface LensOption {
  id: string;
  name: string;
  type: 'optical' | 'sunglasses';
  description: string;
  additionalPrice: number;
  badge?: string;
  features: string[];
}

export interface PrescriptionDetails {
  prescriptionType: 'non-prescription' | 'single-vision' | 'bifocal' | 'progressive';
  lensIndex: '1.56 Standard' | '1.61 Thin' | '1.67 Ultra Thin' | '1.74 High Index';
  odSphere?: string;
  odCyl?: string;
  odAxis?: string;
  osSphere?: string;
  osCyl?: string;
  osAxis?: string;
  pd?: string; // Pupillary Distance
  addPower?: string;
  notes?: string;
  uploadedFileName?: string;
  uploadedFileDataUrl?: string;
}

export interface CartItem {
  id: string; // unique item uuid in cart
  product: Product;
  selectedColor: ProductColor;
  quantity: number;
  selectedLens: LensOption;
  prescriptionDetails?: PrescriptionDetails;
  itemUnitPrice: number; // product.price + lens.additionalPrice
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface CustomerInfo {
  fullName: string;
  phoneNumber: string;
  email?: string;
  city: string;
  deliveryAddress: string;
  additionalNotes?: string;
}

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  appliedPromoCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'Card Online (Pending)';
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface SiteSettings {
  brandName: string;
  heroHeadline: string;
  heroSubtitle: string;
  announcementBanner: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  contactPhone: string;
  contactEmail: string;
  contactWhatsApp: string;
  storeAddress: string;
  socialInstagram: string;
  socialFacebook: string;
  socialTwitter: string;
}

export interface FilterState {
  categoryId?: string;
  searchQuery: string;
  brands: string[];
  priceRange: [number, number];
  shapes: FrameShape[];
  materials: FrameMaterial[];
  genders: Gender[];
  colors: string[];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'best-selling';
}
