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

export interface CartItem {
  id: string; // unique item cart ID (product.id + variant)
  productId: string;
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  selectedVariant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface UserAddress {
  id: string;
  name: string;
  phone: string;
  addressLine1?: string;
  addressLine2?: string;
  street?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  type?: 'Home' | 'Work' | 'Store Pickup';
  isDefault: boolean;
}

export type Address = UserAddress;

export interface OrderItem {
  id?: string;
  productId: string;
  productName?: string;
  productImage?: string;
  product?: any;
  brand?: string;
  selectedColor?: string;
  selectedSize?: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'Order Confirmed' | 'Processing at Trichy Hub' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'confirmed';

export interface OrderTimelineEvent {
  status: string;
  date: string;
  description: string;
  location?: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  orderNumber?: string;
  date?: string;
  createdAt?: string;
  items: any[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax?: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus?: OrderStatus;
  status?: string;
  shippingAddress: UserAddress;
  estimatedDelivery?: string;
  trackingNumber?: string;
  courierName?: string;
  courierPartner?: string;
  timeline?: OrderTimelineEvent[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bikeModel?: string;
  ridingExperienceYears?: number;
  avatar?: string;
  memberSince?: string;
  riderPoints: number;
  addresses?: UserAddress[];
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
