export interface ProductVariant {
  id: string;
  name: string;
  colorName?: string;
  colorHex?: string;
  size?: string;
  sku: string;
  inStock: boolean;
  stockCount: number;
  price?: number;
  originalPrice?: number;
  image?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  bikeModel?: string;
  helpfulCount: number;
}

export type CertificationType = 'ECE 22.06' | 'ECE 22.05' | 'DOT' | 'ISI' | 'CE Level 2' | 'CE Level 1' | 'SNELL';
export type RidingStyle = 'City' | 'Touring' | 'Adventure' | 'Performance' | 'All-Weather';

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sku?: string;
  // Loosened from a fixed 4-value union to a plain string: real VEYONN
  // categories are admin-managed, open-ended data, not a hardcoded taxonomy
  // — see src/lib/product-adapter.ts for how this is derived (a slugified
  // real category name) from real API data.
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  // Optional: VEYONN has no product review/rating capability today (see
  // src/lib/product-adapter.ts) — undefined for any real, API-sourced
  // product. Still required for this repo's own static demo data
  // (src/data/products.ts), which continues to supply real numbers.
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  inStock: boolean;
  stockCount: number;
  images: string[];
  thumbnail: string;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: ProductSpecification[];
  certifications: CertificationType[];
  ridingStyles: RidingStyle[];
  availableColors: { name: string; hex: string; image?: string }[];
  availableSizes: string[];
  variants: ProductVariant[];
  material?: string;
  weight?: string;
  warranty?: string;
  includedInBox?: string[];
  frequentlyBoughtWith?: string[]; // product IDs
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  bannerImage: string;
  itemCount: number;
  subcategories: {
    name: string;
    slug: string;
    description: string;
    itemCount: number;
    image?: string;
  }[];
  featuredProductId?: string;
  guidePreview?: {
    title: string;
    excerpt: string;
    guideSlug: string;
  };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  bannerImage: string;
  origin: string;
  founded?: string;
  description: string;
  popularCategories: string[];
  categories?: string[];
  productCount: number;
  featuredProductIds?: string[];
}

// Cart line — matches the real VEYONN cart contract exactly: productId +
// quantity only. VEYONN's Product model has no color/size/variant
// dimension (see ../lib/product-adapter.ts's own notes), so there is no
// selectedColor/selectedSize/selectedVariant here — a cart line is always
// just one product at one quantity.
export interface CartItem {
  productId: string;
  variantId: string | null;
  variantName: string | null;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// A one-time checkout delivery address snapshot — matches CheckoutDto on
// the backend exactly. VEYONN has no customer-facing address-book API
// (Contacts' address CRUD is admin-only, under /api/v1/contacts), so this
// is entered fresh at checkout each time, never a saved/reusable address.
export interface DeliveryAddress {
  line1: string;
  line2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string;
}

// A customer's own WEBSITE order — field-for-field the real
// CustomerOrderDetailDto shape (customer-order.dto.ts on the backend).
// Deliberately has no trackingNumber/courierName/timeline/
// estimatedDelivery — VEYONN's customer-safe order DTO carries none of
// that, so none of it is fabricated here.
export interface OrderLine {
  productId: string;
  productName: string;
  variantId?: string | null;
  variantName?: string | null;
  orderedQuantity: string;
  unitPrice: string;
  lineTotal: string;
  lineDeliveryStatus: string;
}

export interface OrderPayment {
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
  amountPaid: string;
  amountDue: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  documentStatus: string;
  salesChannel: string;
  createdAt: string;
  total: string;
  lines: OrderLine[];
  deliveryAddress: (DeliveryAddress & { line1: string }) | null;
  payment: OrderPayment;
}

export interface OrderListItem {
  id: string;
  orderNumber: string;
  documentStatus: string;
  salesChannel: string;
  createdAt: string;
}

// Real VEYONN customer profile (CustomerProfileResponseDto) — deliberately
// has no phone/bikeModel/avatar/riderPoints/memberSince: none of that
// exists on the backend's customer-auth capability, so none of it is
// fabricated here. See the API Gap Report for what a "rider profile" would
// need from VEYONN to become real.
export interface UserProfile {
  id: string;
  contactId: string;
  email: string;
  displayName: string;
  lastLoginAt: string | null;
  createdAt: string;
}

export type User = UserProfile;

export interface RidingGuide {
  id: string;
  slug: string;
  title: string;
  category: 'Helmet Guides' | 'Riding Gear' | 'Touring' | 'Maintenance' | 'Safety';
  readTime: string;
  publishDate: string;
  publishedDate?: string;
  author: string;
  authorRole: string;
  coverImage: string;
  excerpt: string;
  summary?: string;
  content: {
    heading?: string;
    paragraphs: string[];
    callout?: {
      type: 'tip' | 'warning' | 'spec';
      text: string;
    };
    image?: string;
  }[];
  relatedProductIds: string[];
  tags: string[];
}

export interface FilterState {
  category?: string;
  subcategory?: string;
  /** Brand ids. The catalog API filters on one brand at a time. */
  brand: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  certifications: CertificationType[];
  ridingStyles: RidingStyle[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
}
