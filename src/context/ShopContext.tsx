import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  CartItem, 
  UserAddress, 
  Order, 
  UserProfile, 
  ProductVariant, 
  FilterState 
} from '../types';
import { PRODUCTS } from '../data/products';
import { DISTRICT_38_STORE } from '../data/storeInfo';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface ShopContextType {
  // Navigation & Routing
  currentRoute: string;
  routeParams: Record<string, string>;
  navigate: (route: string, params?: Record<string, string>) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  appliedCoupon: string | null;
  couponDiscountPercent: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addToCart: (product: Product, quantity?: number, selectedVariant?: ProductVariant, selectedColor?: string, selectedSize?: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  moveToCartFromWishlist: (product: Product, size?: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;

  // Mobile Nav Drawer
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;

  // Quick Add Modal & Size Guide Modal
  quickAddProduct: Product | null;
  openQuickAdd: (product: Product) => void;
  closeQuickAdd: () => void;
  isSizeGuideOpen: boolean;
  sizeGuideCategory: string;
  openSizeGuide: (category: string) => void;
  closeSizeGuide: () => void;

  // User & Auth
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;

  // Addresses
  savedAddresses: UserAddress[];
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'timeline' | 'trackingNumber' | 'courierName'>) => Order;
  getOrderById: (orderId: string) => Order | undefined;

  // Recently Viewed
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;

  // Filters & Shop State
  shopFilters: FilterState;
  updateShopFilters: (filters: Partial<FilterState>) => void;
  resetShopFilters: () => void;

  // UI Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  category: undefined,
  subcategory: undefined,
  brand: [],
  priceRange: [0, 50000],
  sizes: [],
  colors: [],
  certifications: [],
  ridingStyles: [],
  inStockOnly: false,
  onSaleOnly: false,
  searchQuery: '',
  sortBy: 'featured'
};

const DEFAULT_USER: UserProfile = {
  id: 'usr-1',
  name: 'Vasanth Kumar',
  email: 'vasanth.rider@gmail.com',
  phone: '+91 98421 55678',
  bikeModel: 'Royal Enfield Himalayan 450 (Kamet White)',
  ridingExperienceYears: 6,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  memberSince: 'March 2024',
  riderPoints: 1450
};

const DEFAULT_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-1',
    name: 'Vasanth Kumar',
    phone: '+91 98421 55678',
    addressLine1: 'No. 14, 5th Cross, Thillai Nagar West',
    addressLine2: 'Near Rockfort View School',
    city: 'Tiruchirappalli (Trichy)',
    state: 'Tamil Nadu',
    pincode: '620018',
    country: 'India',
    type: 'Home',
    isDefault: true
  },
  {
    id: 'addr-2',
    name: 'Vasanth Kumar',
    phone: '+91 98421 55678',
    addressLine1: 'District 38 Flagship Store Counter, 75/c Alsa Complex',
    addressLine2: 'Salai Road, Next to Reliance Digital',
    city: 'Tiruchirappalli (Trichy)',
    state: 'Tamil Nadu',
    pincode: '620018',
    country: 'India',
    type: 'Store Pickup',
    isDefault: false
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'D38-92841',
    date: '2026-08-14T10:30:00Z',
    items: [
      {
        productId: 'prod-mt-thunder-4-sv',
        productName: 'MT Thunder 4 SV Solid Full Face Helmet',
        productImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
        brand: 'MT Helmets',
        color: 'Matt Black',
        size: 'L',
        quantity: 1,
        unitPrice: 6750,
        totalPrice: 6750
      },
      {
        productId: 'prod-motul-c1-c2-combo',
        productName: 'Motul C1 Chain Clean + C2 Chain Lube Road Combo',
        productImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
        brand: 'Motul',
        size: '400ml Combo',
        quantity: 1,
        unitPrice: 1049,
        totalPrice: 1049
      }
    ],
    subtotal: 7799,
    discount: 500,
    shipping: 0,
    tax: 0,
    total: 7299,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    shippingAddress: DEFAULT_ADDRESSES[0],
    estimatedDelivery: '17 August 2026',
    trackingNumber: 'DTDC-TRZ-8849201',
    courierName: 'DTDC Express Air',
    timeline: [
      { status: 'Order Confirmed', date: '14 Aug 2026, 10:32 AM', description: 'Order verified & payment received via UPI', completed: true },
      { status: 'Packed at Trichy Hub', date: '14 Aug 2026, 02:15 PM', description: 'Inspected with laser precision, double boxed with bubble wrap', location: 'District 38 Trichy Fulfillment Hub', completed: true },
      { status: 'Dispatched', date: '14 Aug 2026, 06:40 PM', description: 'Handed over to DTDC Express courier team', location: 'Trichy Central Dispatch', completed: true },
      { status: 'Out for Delivery', date: '16 Aug 2026, 09:10 AM', description: 'Courier partner is on the way to delivery address', location: 'Thillai Nagar Delivery Hub', completed: true },
      { status: 'Delivered', date: '16 Aug 2026, 01:45 PM', description: 'Delivered successfully to Vasanth Kumar with signature', completed: true, current: true }
    ]
  }
];

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      return hash || '/';
    }
    return '/';
  });
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setCurrentRoute(hash || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string, params: Record<string, string> = {}) => {
    setRouteParams(params);
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('d38_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem('d38_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('d38_wishlist');
      return saved ? JSON.parse(saved) : ['prod-mt-thunder-4-sv', 'prod-rynox-stealth-air-pro'];
    } catch {
      return ['prod-mt-thunder-4-sv'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('d38_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('d38_recent_searches');
      return saved ? JSON.parse(saved) : ['ECE 22.06 Helmets', 'Rynox Stealth Air', 'Motul Chain Lube', 'Tail bag'];
    } catch {
      return ['ECE 22.06 Helmets', 'Rynox Stealth Air'];
    }
  });

  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches(prev => [term.trim(), ...prev.filter(t => t.toLowerCase() !== term.trim().toLowerCase())].slice(0, 8));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('d38_recent_searches');
  };

  // Modals
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState('helmets');

  const openQuickAdd = (product: Product) => setQuickAddProduct(product);
  const closeQuickAdd = () => setQuickAddProduct(null);

  const openSizeGuide = (category: string) => {
    setSizeGuideCategory(category);
    setIsSizeGuideOpen(true);
  };
  const closeSizeGuide = () => setIsSizeGuideOpen(false);

  // User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('d38_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>(() => {
    try {
      const saved = localStorage.getItem('d38_addresses');
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
    } catch {
      return DEFAULT_ADDRESSES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('d38_addresses', JSON.stringify(savedAddresses));
    } catch (e) {
      console.error(e);
    }
  }, [savedAddresses]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('d38_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('d38_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('d38_recent_products');
      return saved ? JSON.parse(saved) : ['prod-mt-thunder-4-sv', 'prod-rynox-stealth-air-pro'];
    } catch {
      return [];
    }
  });

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => [productId, ...prev.filter(id => id !== productId)].slice(0, 10));
  };

  // Filters State
  const [shopFilters, setShopFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const updateShopFilters = (partial: Partial<FilterState>) => {
    setShopFilters(prev => ({ ...prev, ...partial }));
  };

  const resetShopFilters = () => {
    setShopFilters(DEFAULT_FILTERS);
  };

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart Helpers
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedVariant?: ProductVariant,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    const color = selectedColor || selectedVariant?.colorName || (product.availableColors.length > 0 ? product.availableColors[0].name : undefined);
    const size = selectedSize || selectedVariant?.size || (product.availableSizes.length > 0 ? product.availableSizes[0] : undefined);
    const itemId = `${product.id}-${color || 'def'}-${size || 'def'}`;
    const unitPrice = selectedVariant?.price || product.price;

    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * unitPrice }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: itemId,
            productId: product.id,
            product,
            selectedColor: color,
            selectedSize: size,
            selectedVariant,
            quantity,
            unitPrice,
            totalPrice: unitPrice * quantity
          }
        ];
      }
    });

    showToast(`Added "${product.name}" to cart`, 'success');
    setIsCartOpen(true);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Coupon Logic
  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'DISTRICT10' || clean === 'FIRSTGEAR') {
      setAppliedCoupon(clean);
      setCouponDiscountPercent(10);
      showToast(`Coupon ${clean} applied: 10% OFF your entire order!`, 'success');
      return { success: true, message: '10% discount applied successfully!' };
    } else if (clean === 'RIDER100') {
      setAppliedCoupon(clean);
      setCouponDiscountPercent(15);
      showToast(`Rider VIP code applied: 15% OFF!`, 'success');
      return { success: true, message: 'VIP 15% discount applied!' };
    } else {
      showToast('Invalid coupon code. Try "DISTRICT10" or "FIRSTGEAR"', 'warning');
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
    showToast('Coupon removed', 'info');
  };

  // Cart Totals
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const cartDiscount = Math.round((cartSubtotal * couponDiscountPercent) / 100);
  const cartShipping = cartSubtotal >= 2999 || cartSubtotal === 0 ? 0 : 199;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);

  // Wishlist Helpers
  const wishlistCount = wishlist.length;
  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const toggleWishlist = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    const name = product ? product.name : 'Product';

    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
      showToast(`Removed "${name}" from your wishlist`, 'info');
    } else {
      setWishlist(prev => [...prev, productId]);
      showToast(`Saved "${name}" to your wishlist`, 'success');
    }
  };

  const moveToCartFromWishlist = (product: Product, size?: string) => {
    addToCart(product, 1, undefined, undefined, size || (product.availableSizes[0] || undefined));
    toggleWishlist(product.id);
  };

  // Auth Helpers
  const login = (email: string, name?: string) => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0] || 'Rider',
      email,
      phone: '+91 98421 55678',
      bikeModel: 'KTM 390 Adventure',
      ridingExperienceYears: 4,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      memberSince: 'August 2026',
      riderPoints: 500
    };
    setCurrentUser(user);
    try {
      localStorage.setItem('d38_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    showToast(`Welcome back, ${user.name}!`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('d38_user');
    showToast('You have been logged out safely.', 'info');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem('d38_user', JSON.stringify(updated));
    showToast('Profile updated successfully!', 'success');
  };

  // Address Helpers
  const addAddress = (address: Omit<UserAddress, 'id'>) => {
    const newAddr: UserAddress = {
      ...address,
      id: `addr-${Date.now()}`
    };
    if (newAddr.isDefault) {
      setSavedAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(newAddr));
    } else {
      setSavedAddresses(prev => [...prev, newAddr]);
    }
    showToast('New shipping address saved', 'success');
  };

  const updateAddress = (id: string, updated: Partial<UserAddress>) => {
    setSavedAddresses(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updated } : updated.isDefault ? { ...a, isDefault: false } : a))
    );
    showToast('Address updated', 'success');
  };

  const deleteAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
    showToast('Address removed', 'info');
  };

  const setDefaultAddress = (id: string) => {
    setSavedAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    showToast('Default delivery address updated', 'success');
  };

  // Order Creation
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'timeline' | 'trackingNumber' | 'courierName'>): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `D38-${randomNum}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      date: new Date().toISOString(),
      trackingNumber: `DTDC-TRZ-${randomNum}`,
      courierName: 'DTDC Air Express / Trichy Direct',
      timeline: [
        {
          status: 'Order Confirmed',
          date: 'Just now',
          description: `Payment received via ${orderData.paymentMethod}. Order sent to Trichy warehouse packing desk.`,
          completed: true,
          current: true
        },
        {
          status: 'Packed at Trichy Hub',
          date: 'Expected today',
          description: 'Quality inspection and shock-proof packaging at Salai Road store hub',
          location: 'District 38 Trichy Central Hub',
          completed: false
        },
        {
          status: 'Dispatched',
          date: 'Expected tomorrow morning',
          description: 'Package dispatched for highway courier route',
          completed: false
        },
        {
          status: 'Delivered',
          date: orderData.estimatedDelivery,
          description: 'Scheduled doorstep delivery',
          completed: false
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId || o.orderNumber === orderId);
  };

  return (
    <ShopContext.Provider
      value={{
        currentRoute,
        routeParams,
        navigate,
        cart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        appliedCoupon,
        couponDiscountPercent,
        applyCoupon,
        removeCoupon,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        moveToCartFromWishlist,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        isMobileNavOpen,
        setIsMobileNavOpen,
        quickAddProduct,
        openQuickAdd,
        closeQuickAdd,
        isSizeGuideOpen,
        sizeGuideCategory,
        openSizeGuide,
        closeSizeGuide,
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        updateProfile,
        savedAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        createOrder,
        getOrderById,
        recentlyViewed,
        addRecentlyViewed,
        shopFilters,
        updateShopFilters,
        resetShopFilters,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
